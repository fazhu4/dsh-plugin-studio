/**
 * Decide whether a loader row is stale after a successful profile uninstall.
 *
 * The loader keeps the old row until the DSH service restarts, while the
 * profile dependency has already been removed. The host records removed
 * package names in memory so the list route can hide that stale row during
 * the restart window.
 *
 * @param moduleName - Loader entry module name.
 * @param packageName - Resolved package name, or null when resolution failed.
 * @param removedPackages - Package names removed during this process.
 * @returns Whether the row should be omitted from the current list.
 */
export declare function shouldHideUninstalledEntry(moduleName: string, packageName: string | null, removedPackages: ReadonlySet<string>): boolean;
