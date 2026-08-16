/**
 * dsh-plugin-manager host plugin. Loopback-only HTTP routes over webServer:
 *
 *   GET  /dsh-plugin-manager/list      — grouped, enriched plugin inventory
 *   POST /dsh-plugin-manager/toggle    — enable/disable via user patch layer
 *   GET  /dsh-plugin-manager/search    — GitHub dsh-plugin market search
 *   POST /dsh-plugin-manager/install   — pnpm add + bundle reconcile
 *   POST /dsh-plugin-manager/uninstall — pnpm remove + bundle reconcile
 *
 * Services injected: webServer, loader. All DSH APIs are consumed
 * structurally (duck-typed faces) so this package needs no DSH imports.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createRequire } from 'node:module'
import { classify, resolveGroupName } from './group.ts'
import { extractMeta, readmeSummary, type PackageMeta } from './meta.ts'
import { patchStateOf, upsertDisabled } from './patch.ts'
import { parseRepoManifest, parseSearchResponse, type GitHubRepo } from './market.ts'
import { mergeProtectedModules } from './protected.ts'
import { isValidEntryId, isValidGroupName, isValidInstallSpec, isValidPackageName } from './validate.ts'
import {
  packageIsBundle,
  profilePathsFromBaseUrl,
  readGroups,
  readManifest,
  reconcileBundles,
  runPnpm,
  writeAtomic,
  writeGroups,
  type ProfilePaths,
} from './profile.ts'
import type {
  EntryInfo, GroupCreateRequest, GroupDeleteRequest, GroupRequest, GroupResponse, InstallRequest, InstallResponse, ListResponse, MarketItem,
  OpError, ToggleRequest, ToggleResponse, UninstallRequest, UninstallResponse,
} from './contract.ts'

/** Plugin metadata (Cordis). */
export const name = 'dsh-plugin-manager'

/** Declared service injections. */
export const inject = ['webServer', 'loader']

/** Plugin configuration. */
export interface Config {
  /** Extra protected module names (merged with the defaults). */
  protectedModules?: string[]
  /** GitHub search result cache TTL in ms. */
  searchCacheTtlMs?: number
}

// --- structural service faces -------------------------------------------------

interface WebServerFace {
  register(route: {
    kind: 'exact' | 'prefix'
    path: string
    handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
  }): () => void
}

interface LoaderEntryLike {
  id: string
  options: { id: string; name: string; group?: boolean | null }
  disabled: boolean
  fiber?: { state: number }
}

interface LoaderFace {
  entries(): LoaderEntryLike[]
}

interface Ctx {
  baseUrl: string
  webServer: WebServerFace
  loader: LoaderFace
  effect<T>(fn: () => T, label?: string): T
}

// --- runtime mirror of Cordis FiberState --------------------------------------

const FIBER_STATE = {
  PENDING: 0, LOADING: 1, ACTIVE: 2, FAILED: 3, DISPOSED: 4, UNLOADING: 5,
} as const

const FIBER_PHASE: Record<number, EntryInfo['fiberPhase']> = {
  [FIBER_STATE.PENDING]: 'pending',
  [FIBER_STATE.LOADING]: 'loading',
  [FIBER_STATE.ACTIVE]: 'active',
  [FIBER_STATE.FAILED]: 'failed',
  [FIBER_STATE.DISPOSED]: null,
  [FIBER_STATE.UNLOADING]: 'unloading',
}

const require = createRequire(import.meta.url)

// --- module state -------------------------------------------------------------

/** GitHub search cache: query → {at, repos}. */
const searchCache = new Map<string, { at: number; repos: GitHubRepo[] }>()
/** Set after an install/uninstall; cleared only by a process restart. */
let pendingRestart = false

/**
 * Serialize read-modify-write sections (patch-file toggles, manifest
 * reconcile): two concurrent toggles must not interleave their read → write
 * cycles or one update is silently lost.
 */
let mutex: Promise<unknown> = Promise.resolve()
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = mutex.then(fn, fn)
  mutex = run.then(() => {}, () => {})
  return run
}

// --- HTTP helpers ---------------------------------------------------------------

function isLoopback(req: IncomingMessage): boolean {
  const addr = req.socket.remoteAddress ?? ''
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1'
}

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => { chunks.push(chunk) })
    req.on('end', () => {
      try {
        resolve(chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function fail(res: ServerResponse, message: string): void {
  json(res, 400, { ok: false, message } satisfies OpError)
}

// --- list assembly ---------------------------------------------------------------

async function buildList(ctx: Ctx, paths: ProfilePaths): Promise<ListResponse> {
  let patchText = ''
  try {
    patchText = await readFile(paths.patchFile, 'utf8')
  } catch {
    // No patch file yet — everything is in its default state.
  }
  const groupState = await readGroups(paths.groupsFile)
  const entries: EntryInfo[] = []
  for (const entry of ctx.loader.entries()) {
    if (entry.options.group) continue
    const moduleName = entry.options.name
    const autoGroup = classify(moduleName, spec => require.resolve(spec), paths.nodeModules, paths.closureNodeModules)
    const resolved = resolveGroupName(moduleName, autoGroup, groupState.overrides)
    let meta: PackageMeta = {
      name: null, version: null, description: null,
      homepage: null, repository: null, license: null,
    }
    let readme: string | null = null
    try {
      const pkgPath = require.resolve(`${moduleName}/package.json`)
      meta = extractMeta(await readFile(pkgPath, 'utf8'))
      try {
        readme = await readFile(join(pkgPath, '..', 'README.md'), 'utf8')
      } catch {
        // README is optional.
      }
    } catch {
      // Unresolvable entry: metadata stays null.
    }
    entries.push({
      entryId: entry.id,
      moduleName,
      packageName: meta.name,
      enabled: !entry.disabled,
      fiberPhase: entry.fiber === undefined ? null : FIBER_PHASE[entry.fiber.state] ?? null,
      group: resolved.name,
      groupOverridden: resolved.overridden,
      // The user patch layer addresses rows by their bare id (EntryOptions.id),
      // NOT the loader-tree path (e.g. `include:llm`): a path-prefixed row is
      // silently skipped by the include plugin's id lookup.
      patchState: patchStateOf(patchText, entry.options.id),
      description: meta.description,
      version: meta.version,
      homepage: meta.homepage,
      repository: meta.repository,
      license: meta.license,
      readmeSummary: readme === null ? null : readmeSummary(readme),
    })
  }
  // Bucket custom groups by name (name-ordered), entries keep loader order.
  // Declared (possibly empty) groups show even with no members yet.
  const customMembers = new Map<string, EntryInfo[]>()
  for (const entry of entries) {
    if (entry.group === 'official' || entry.group === 'community') continue
    const list = customMembers.get(entry.group) ?? []
    list.push(entry)
    customMembers.set(entry.group, list)
  }
  const allCustomNames = new Set([...groupState.declared, ...customMembers.keys()])
  const customGroups = [...allCustomNames]
    .sort((a, b) => a.localeCompare(b))
    .map(name => ({ name, entries: customMembers.get(name) ?? [] }))
  return {
    official: entries.filter(entry => entry.group === 'official'),
    community: entries.filter(entry => entry.group === 'community'),
    customGroups,
    protectedModules: [...protectedSet],
    restartRequired: pendingRestart,
  }
}

// --- market -----------------------------------------------------------------------

const GITHUB_SEARCH = 'https://api.github.com/search/repositories'
const GITHUB_RAW = 'https://raw.githubusercontent.com'
const NPM_REGISTRIES = ['https://registry.npmjs.org', 'https://registry.npmmirror.com']

async function searchMarket(query: string, ttlMs: number, perPage = 15): Promise<GitHubRepo[]> {
  const cacheKey = `${perPage}:${query}`
  const cached = searchCache.get(cacheKey)
  if (cached !== undefined && Date.now() - cached.at < ttlMs) return cached.repos
  const url = `${GITHUB_SEARCH}?${new URLSearchParams({
    q: `topic:dsh-plugin ${query}`,
    sort: 'stars',
    per_page: String(perPage),
  })}`
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'dsh-plugin-manager' },
  })
  if (!res.ok) throw new Error(`GitHub search failed: HTTP ${res.status}`)
  const repos = parseSearchResponse(await res.json())
  searchCache.set(cacheKey, { at: Date.now(), repos })
  return repos
}

/** npm probe: first registry answering ok wins. */
async function npmProbe(name: string): Promise<boolean> {
  for (const registry of NPM_REGISTRIES) {
    try {
      const res = await fetch(`${registry}/${encodeURIComponent(name)}`, { method: 'HEAD' })
      if (res.ok) return true
    } catch {
      // Try the next registry.
    }
  }
  return false
}

async function enrichRepo(repo: GitHubRepo): Promise<MarketItem> {
  let npmName: string | null = null
  let dshBundle = false
  if (repo.defaultBranch !== null) {
    try {
      const res = await fetch(`${GITHUB_RAW}/${repo.fullName}/${repo.defaultBranch}/package.json`)
      if (res.ok) {
        const manifest = parseRepoManifest(await res.text())
        if (manifest.name !== null && !manifest.private) {
          npmName = manifest.name
          dshBundle = manifest.dshBundle
        }
      }
    } catch {
      // Probe failure degrades to a GitHub-source card.
    }
  }
  const source: MarketItem['source'] = npmName !== null && await npmProbe(npmName) ? 'npm' : 'github'
  return {
    fullName: repo.fullName,
    description: repo.description,
    stars: repo.stars,
    htmlUrl: repo.htmlUrl,
    npmName,
    source,
    dshBundle,
  }
}

// --- install / uninstall --------------------------------------------------------------

const ALLOW_BUILDS_HINT =
  'git 依赖的构建脚本可能被 pnpm 拦截（allowBuilds）。若安装失败，请按 pnpm 提示把对应 key 加入 profile 的 pnpm-workspace.yaml 后重试。'

async function installPackage(paths: ProfilePaths, spec: string): Promise<InstallResponse | OpError> {
  const pnpmSpec = spec.includes('/') && !spec.startsWith('@') ? `github:${spec}` : spec
  const result = await runPnpm(paths.dir, ['add', pnpmSpec])
  if (result.code !== 0) {
    const hint = /allowBuilds|Ignored build scripts/i.test(result.output) ? ` ${ALLOW_BUILDS_HINT}` : ''
    return { ok: false, message: `pnpm add 失败（退出码 ${result.code}）${hint}\n${result.output.slice(-800)}` }
  }
  await withLock(() => reconcileBundles(paths.dir))
  const bundleName = pnpmSpec.startsWith('github:') ? pnpmSpec.slice('github:'.length).split('#')[0]!.split('/')[1]! : pnpmSpec
  const manifest = await readManifest(paths.dir)
  const depNames = Object.keys(manifest.dependencies ?? {})
  const installed = depNames.find(name => name.endsWith(`/${bundleName}`) || name === bundleName)
  const warning = installed !== undefined && !await packageIsBundle(installed, paths.dir)
    ? '已安装为普通依赖：该包未声明 dsh.bundle，重启后不会作为插件层激活。'
    : undefined
  pendingRestart = true
  return { ok: true, restartRequired: true, ...(warning === undefined ? {} : { warning }) }
}

async function uninstallPackage(paths: ProfilePaths, packageName: string): Promise<UninstallResponse | OpError> {
  let resolved: string
  try {
    resolved = require.resolve(`${packageName}/package.json`)
  } catch {
    return { ok: false, message: `无法解析 ${packageName}，可能未安装。` }
  }
  const under = (root: string, path: string): boolean => {
    const r = root.toLowerCase()
    const p = path.toLowerCase()
    return p.startsWith(r) && (p.length === r.length || p[r.length] === '\\' || p[r.length] === '/')
  }
  if (!under(paths.nodeModules, resolved)) {
    return { ok: false, message: '仅可卸载社区插件（安装在 profile 中的包）。' }
  }
  if (protectedSet.has(packageName)) {
    return { ok: false, message: '该插件受保护，不可卸载。' }
  }
  const result = await runPnpm(paths.dir, ['remove', packageName])
  if (result.code !== 0) {
    return { ok: false, message: `pnpm remove 失败（退出码 ${result.code}）\n${result.output.slice(-800)}` }
  }
  await withLock(() => reconcileBundles(paths.dir))
  pendingRestart = true
  return { ok: true, restartRequired: true }
}

// --- plugin body ----------------------------------------------------------------------

let protectedSet: ReadonlySet<string> = new Set()

/**
 * Compose the plugin.
 * @param ctx - Cordis context.
 * @param config - plugin configuration.
 */
export function apply(ctx: Ctx, config: Config = {}): void {
  protectedSet = new Set(mergeProtectedModules(config.protectedModules))
  const ttlMs = config.searchCacheTtlMs ?? 60_000

  let paths: ProfilePaths
  try {
    paths = profilePathsFromBaseUrl(ctx.baseUrl)
  } catch (error) {
    throw new Error(`dsh-plugin-manager: cannot resolve the profile directory from ctx.baseUrl (${String(ctx.baseUrl)}): ${String(error)}`)
  }

  // Route disposers, released when this plugin's fiber unloads.
  const disposers: Array<() => void> = []

  disposers.push(ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-plugin-manager/list',
    handler: async (req, res) => {
      if (!isLoopback(req)) { fail(res, 'loopback only'); return }
      try {
        json(res, 200, await buildList(ctx, paths))
      } catch (error) {
        fail(res, `list failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  }))

  disposers.push(ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-plugin-manager/toggle',
    handler: async (req, res) => {
      if (!isLoopback(req)) { fail(res, 'loopback only'); return }
      try {
        const body = await readJsonBody(req) as Partial<ToggleRequest>
        if (typeof body.entryId !== 'string' || !isValidEntryId(body.entryId) || typeof body.enabled !== 'boolean') {
          fail(res, 'invalid body: { entryId: string, enabled: boolean }')
          return
        }
        const entry = [...ctx.loader.entries()].find(item => item.id === body.entryId)
        if (entry === undefined) {
          fail(res, `no loader entry with id ${body.entryId}`)
          return
        }
        if (protectedSet.has(entry.options.name)) {
          fail(res, '该插件受保护，禁止切换。')
          return
        }
        // upsertDisabled takes the DESIRED DISABLED state — invert the
        // request's enabled flag (enabled:false → disabled:true). The whole
        // read-modify-write runs under the mutex so concurrent toggles cannot
        // clobber each other.
        const toggled = await withLock(async () => {
          let patchText = ''
          try {
            patchText = await readFile(paths.patchFile, 'utf8')
          } catch {
            // Fresh file.
          }
          return upsertDisabled(patchText, entry.options.id, !body.enabled)
        })
        await writeAtomic(paths.patchFile, toggled)
        json(res, 200, { ok: true } satisfies ToggleResponse)
      } catch (error) {
        fail(res, `toggle failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  }))

  disposers.push(ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-plugin-manager/search',
    handler: async (req, res) => {
      if (!isLoopback(req)) { fail(res, 'loopback only'); return }
      try {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const mode = url.searchParams.get('mode') ?? 'search'
        // Board modes: curated default listings. `rising` approximates
        // fastest-star-growth via recently created repos (GitHub's search API
        // has no star-growth sort), sorted by stars within the window. The
        // created qualifier requires an ABSOLUTE date — relative forms like
        // created:>90d are rejected with HTTP 422.
        const board = mode === 'top'
          ? { query: '', perPage: 20 }
          : mode === 'rising'
            ? { query: `created:>${new Date(Date.now() - 90 * 86_400_000).toISOString().slice(0, 10)}`, perPage: 20 }
            : null
        if (board !== null) {
          const repos = await searchMarket(board.query, ttlMs, board.perPage)
          const items = await Promise.all(repos.slice(0, 10).map(enrichRepo))
          json(res, 200, items)
          return
        }
        const rawQuery = (url.searchParams.get('q') ?? 'dsh-plugin').trim().slice(0, 64)
        const repos = await searchMarket(rawQuery === '' ? 'dsh-plugin' : rawQuery, ttlMs)
        const items = await Promise.all(repos.slice(0, 10).map(enrichRepo))
        json(res, 200, items)
      } catch (error) {
        fail(res, `search failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  }))

  disposers.push(ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-plugin-manager/install',
    handler: async (req, res) => {
      if (!isLoopback(req)) { fail(res, 'loopback only'); return }
      try {
        const body = await readJsonBody(req) as Partial<InstallRequest>
        if (typeof body.spec !== 'string' || !isValidInstallSpec(body.spec)) {
          fail(res, 'invalid body: { spec: string } (npm name or owner/repo)')
          return
        }
        json(res, 200, await installPackage(paths, body.spec))
      } catch (error) {
        fail(res, `install failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  }))

  disposers.push(ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-plugin-manager/uninstall',
    handler: async (req, res) => {
      if (!isLoopback(req)) { fail(res, 'loopback only'); return }
      try {
        const body = await readJsonBody(req) as Partial<UninstallRequest>
        if (typeof body.packageName !== 'string' || !isValidPackageName(body.packageName)) {
          fail(res, 'invalid body: { packageName: string }')
          return
        }
        json(res, 200, await uninstallPackage(paths, body.packageName))
      } catch (error) {
        fail(res, `uninstall failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  }))

  disposers.push(ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-plugin-manager/group',
    handler: async (req, res) => {
      if (!isLoopback(req)) { fail(res, 'loopback only'); return }
      try {
        const body = await readJsonBody(req) as Partial<GroupRequest>
        if (typeof body.moduleName !== 'string' || !isValidInstallSpec(body.moduleName)) {
          fail(res, 'invalid body: { moduleName: string, groupName: string | null }')
          return
        }
        const moduleName = body.moduleName
        const groupName = body.groupName
        if (groupName !== null && groupName !== undefined && (typeof groupName !== 'string' || !isValidGroupName(groupName))) {
          fail(res, 'invalid group name')
          return
        }
        await withLock(async () => {
          const state = await readGroups(paths.groupsFile)
          if (groupName === null || groupName === undefined) {
            state.overrides.delete(moduleName)
          } else {
            state.overrides.set(moduleName, groupName)
            state.declared.add(groupName)
          }
          await writeGroups(paths.groupsFile, state)
        })
        json(res, 200, { ok: true } satisfies GroupResponse)
      } catch (error) {
        fail(res, `group failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  }))

  disposers.push(ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-plugin-manager/group-delete',
    handler: async (req, res) => {
      if (!isLoopback(req)) { fail(res, 'loopback only'); return }
      try {
        const body = await readJsonBody(req) as Partial<GroupDeleteRequest>
        if (typeof body.groupName !== 'string' || !isValidGroupName(body.groupName)) {
          fail(res, 'invalid body: { groupName: string }')
          return
        }
        const groupName = body.groupName
        await withLock(async () => {
          const state = await readGroups(paths.groupsFile)
          let changed = state.declared.has(groupName)
          state.declared.delete(groupName)
          for (const [moduleName, name] of [...state.overrides]) {
            if (name === groupName) {
              state.overrides.delete(moduleName)
              changed = true
            }
          }
          if (changed) await writeGroups(paths.groupsFile, state)
        })
        json(res, 200, { ok: true } satisfies GroupResponse)
      } catch (error) {
        fail(res, `group-delete failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  }))

  disposers.push(ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-plugin-manager/group-create',
    handler: async (req, res) => {
      if (!isLoopback(req)) { fail(res, 'loopback only'); return }
      try {
        const body = await readJsonBody(req) as Partial<GroupCreateRequest>
        if (typeof body.groupName !== 'string' || !isValidGroupName(body.groupName)) {
          fail(res, 'invalid body: { groupName: string }')
          return
        }
        const groupName = body.groupName
        await withLock(async () => {
          const state = await readGroups(paths.groupsFile)
          state.declared.add(groupName)
          await writeGroups(paths.groupsFile, state)
        })
        json(res, 200, { ok: true } satisfies GroupResponse)
      } catch (error) {
        fail(res, `group-create failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  }))

  disposers.push(ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-plugin-manager/group-list',
    handler: async (req, res) => {
      if (!isLoopback(req)) { fail(res, 'loopback only'); return }
      try {
        const state = await readGroups(paths.groupsFile)
        const names = new Set([...state.declared, ...state.overrides.values()])
        json(res, 200, [...names].sort((a, b) => a.localeCompare(b)))
      } catch (error) {
        fail(res, `group-list failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  }))

  // Unload lifecycle: drop every route when this fiber goes away, so a
  // disabled/unloaded plugin leaves no stale handlers behind.
  ctx.effect(() => () => {
    for (const dispose of disposers) dispose()
  }, 'dsh-plugin-manager: routes')
}
