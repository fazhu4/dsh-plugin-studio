/**
 * Official vs community classification. Official = resolvable through the
 * installation closure (`$DSH_HOME/profiles/node_modules`); community =
 * resolvable through the profile's own node_modules (user-installed bundles).
 * Anything else falls back to the `@deepseek-ai/` scope heuristic.
 */
import type { PluginGroup } from './contract.ts';
/** Resolve a module specifier to an absolute path; throws when unresolvable. */
export type PackageResolver = (spec: string) => string;
/**
 * @param moduleName - the loader entry's module specifier.
 * @param resolve - package resolver (createRequire in production).
 * @param profileNodeModules - absolute path of the profile's node_modules.
 * @param closureNodeModules - absolute path of the installation closure node_modules.
 */
export declare function classify(moduleName: string, resolve: PackageResolver, profileNodeModules: string, closureNodeModules: string): PluginGroup;
