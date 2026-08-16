/**
 * Profile-side host utilities: profile discovery from ctx.baseUrl, atomic
 * file writes, pnpm subprocess execution, and bundle reconciliation (mirror
 * of the CLI's reconcilePlugins semantics).
 */

import { execFile } from 'node:child_process'
import { readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface ProfilePaths {
  /** Absolute profile directory (e.g. .../profiles/web). */
  readonly dir: string
  /** The user patch layer path. */
  readonly patchFile: string
  /** User-defined group overrides (plugin-private, not a cordis file). */
  readonly groupsFile: string
  /** Profile node_modules (user-installed plugins). */
  readonly nodeModules: string
  /** Installation closure node_modules (sibling of profiles/). */
  readonly closureNodeModules: string
}

/** Derive the profile paths from the loader's baseUrl (a file: URL string). */
export function profilePathsFromBaseUrl(baseUrl: string): ProfilePaths {
  const dir = fileURLToPath(baseUrl)
  return {
    dir,
    patchFile: join(dir, 'cordis.patch.yml'),
    groupsFile: join(dir, 'dsh-plugin-manager-groups.json'),
    nodeModules: join(dir, 'node_modules'),
    closureNodeModules: join(dirname(dir), 'node_modules'),
  }
}

/** Atomic write: tmp file + rename (the HMR watcher sees one complete file). */
export async function writeAtomic(file: string, content: string): Promise<void> {
  const tmp = `${file}.dshpm.tmp`
  await writeFile(tmp, content, 'utf8')
  await rename(tmp, file)
}

export interface PnpmResult {
  readonly code: number
  readonly output: string
}

/**
 * Run pnpm in a directory, capturing combined output. On Windows a `.cmd`
 * shim is not directly spawnable, but `shell: true` would make Node
 * concatenate args into a cmd string (DEP0190 security warning). Instead we
 * invoke cmd.exe explicitly with /d /s /c and windowsVerbatimArguments — no
 * shell option, no concatenation — and every arg reaching this point is
 * whitelist-validated (see validate.ts) so the verbatim cmd line stays
 * metacharacter-free.
 */
export function runPnpm(cwd: string, args: string[], timeoutMs = 300_000): Promise<PnpmResult> {
  const isWin = process.platform === 'win32'
  const file = isWin ? (process.env.ComSpec ?? 'cmd.exe') : 'pnpm'
  const cmdArgs = isWin ? ['/d', '/s', '/c', 'pnpm', ...args] : args
  return new Promise((resolve) => {
    execFile(file, cmdArgs, {
      cwd,
      timeout: timeoutMs,
      maxBuffer: 8 * 1024 * 1024,
      windowsVerbatimArguments: isWin,
    }, (error, stdout, stderr) => {
      const output = `${stdout}\n${stderr}`.trim()
      if (error === null) {
        resolve({ code: 0, output })
        return
      }
      const code = typeof (error as { code?: unknown }).code === 'number'
        ? (error as { code: number }).code
        : 1
      resolve({ code, output })
    })
  })
}

export interface ProfileManifest {
  readonly dependencies?: Record<string, string>
  readonly dsh?: { readonly profile?: { readonly bundles?: string[] } }
}

/** Read the profile manifest; any failure yields an empty object. */
export async function readManifest(profileDir: string): Promise<ProfileManifest> {
  try {
    return JSON.parse(await readFile(join(profileDir, 'package.json'), 'utf8')) as ProfileManifest
  } catch {
    return {}
  }
}

/** Write the profile manifest atomically. */
export async function writeManifest(profileDir: string, manifest: ProfileManifest): Promise<void> {
  await writeAtomic(join(profileDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`)
}

/** Whether an installed package declares a dsh.bundle patch layer. */
export async function packageIsBundle(packageName: string, profileDir: string): Promise<boolean> {
  try {
    const pkg = JSON.parse(
      await readFile(join(profileDir, 'node_modules', packageName, 'package.json'), 'utf8'),
    ) as { dsh?: { bundle?: unknown } }
    return typeof pkg.dsh?.bundle === 'object' && pkg.dsh.bundle !== null
  } catch {
    return false
  }
}

/**
 * Reconcile `dsh.profile.bundles` against installed dependencies: a
 * dependency declaring `dsh.bundle` joins the layer stack; a listed name that
 * no longer is a bundle (or dependency) leaves it. Persists when changed.
 * @returns whether the manifest changed.
 */
export async function reconcileBundles(profileDir: string): Promise<boolean> {
  const manifest = await readManifest(profileDir)
  const deps = Object.keys(manifest.dependencies ?? {})
  const bundles = [...(manifest.dsh?.profile?.bundles ?? [])]
  let changed = false
  for (const name of deps) {
    if (!bundles.includes(name) && await packageIsBundle(name, profileDir)) {
      bundles.push(name)
      changed = true
    }
  }
  for (const name of [...bundles]) {
    if (deps.includes(name) && !await packageIsBundle(name, profileDir)) {
      const at = bundles.indexOf(name)
      bundles.splice(at, 1)
      changed = true
    }
  }
  if (!changed) return false
  const next: ProfileManifest = {
    ...manifest,
    dsh: { ...manifest.dsh, profile: { ...manifest.dsh?.profile, bundles } },
  }
  await writeManifest(profileDir, next)
  return true
}

/** Shape of the plugin-private group-override file. */
export interface GroupStore {
  readonly version: 1
  /** moduleName → custom group name (membership overrides). */
  readonly entries: Record<string, string>
  /** Custom groups explicitly created but not yet holding any plugin. */
  readonly declared: string[]
}

/** The full parsed group state. */
export interface GroupState {
  readonly overrides: Map<string, string>
  readonly declared: Set<string>
}

const EMPTY_STATE = (): GroupState => ({ overrides: new Map(), declared: new Set() })

/** Read the group state; a missing/corrupt file yields empty. */
export async function readGroups(file: string): Promise<GroupState> {
  const state = EMPTY_STATE()
  let raw: string
  try {
    raw = await readFile(file, 'utf8')
  } catch {
    return state
  }
  try {
    const parsed = JSON.parse(raw) as Partial<GroupStore>
    if (parsed === null || typeof parsed !== 'object' || parsed.version !== 1) return state
    if (typeof parsed.entries === 'object' && parsed.entries !== null) {
      for (const [moduleName, groupName] of Object.entries(parsed.entries)) {
        if (typeof groupName === 'string' && groupName !== '') state.overrides.set(moduleName, groupName)
      }
    }
    if (Array.isArray(parsed.declared)) {
      for (const name of parsed.declared) {
        if (typeof name === 'string' && name !== '') state.declared.add(name)
      }
    }
  } catch {
    // Corrupt JSON: start fresh rather than fail the listing.
  }
  return state
}

/** Persist the group state atomically. */
export async function writeGroups(file: string, state: GroupState): Promise<void> {
  const store: GroupStore = {
    version: 1,
    entries: Object.fromEntries(state.overrides),
    declared: [...state.declared],
  }
  await writeAtomic(file, `${JSON.stringify(store, null, 2)}\n`)
}
