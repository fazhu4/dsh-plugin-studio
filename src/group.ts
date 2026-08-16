/**
 * Official vs community classification. Official = resolvable through the
 * installation closure (`$DSH_HOME/profiles/node_modules`); community =
 * resolvable through the profile's own node_modules (user-installed bundles).
 * Anything else falls back to the `@deepseek-ai/` scope heuristic.
 */

import type { PluginGroup } from './contract.ts'

/** Resolve a module specifier to an absolute path; throws when unresolvable. */
export type PackageResolver = (spec: string) => string

function under(root: string, path: string): boolean {
  const r = root.toLowerCase()
  const p = path.toLowerCase()
  if (!p.startsWith(r)) return false
  return p.length === r.length || p[r.length] === '\\' || p[r.length] === '/'
}

/**
 * @param moduleName - the loader entry's module specifier.
 * @param resolve - package resolver (createRequire in production).
 * @param profileNodeModules - absolute path of the profile's node_modules.
 * @param closureNodeModules - absolute path of the installation closure node_modules.
 */
export function classify(
  moduleName: string,
  resolve: PackageResolver,
  profileNodeModules: string,
  closureNodeModules: string,
): PluginGroup {
  let resolved: string
  try {
    resolved = resolve(`${moduleName}/package.json`)
  } catch {
    return moduleName.startsWith('@deepseek-ai/') ? 'official' : 'community'
  }
  if (under(profileNodeModules, resolved)) return 'community'
  if (under(closureNodeModules, resolved)) return 'official'
  return moduleName.startsWith('@deepseek-ai/') ? 'official' : 'community'
}

export interface GroupOverride {
  readonly name: string
  readonly overridden: boolean
}

/**
 * Resolve one entry's final group name: a user override wins over the
 * auto-detected official/community group.
 * @param moduleName - the entry's module specifier.
 * @param autoGroup - the classified official/community group.
 * @param overrides - moduleName → custom group name map.
 */
export function resolveGroupName(
  moduleName: string,
  autoGroup: PluginGroup,
  overrides: ReadonlyMap<string, string>,
): GroupOverride {
  const name = overrides.get(moduleName)
  return name === undefined || name === ''
    ? { name: autoGroup, overridden: false }
    : { name, overridden: true }
}
