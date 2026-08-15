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

/** Run pnpm in a directory, capturing combined output. */
export function runPnpm(cwd: string, args: string[], timeoutMs = 300_000): Promise<PnpmResult> {
  return new Promise((resolve) => {
    execFile('pnpm', args, {
      cwd,
      shell: process.platform === 'win32',
      timeout: timeoutMs,
      maxBuffer: 8 * 1024 * 1024,
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
