/**
 * Protected loader rows: the hot-reload and web-serving chain plus this
 * plugin itself. Toggling or uninstalling these would break the very surface
 * the manager runs on. The set is configurable via the plugin config
 * (`config.protectedModules`), appended to these defaults.
 */
export declare const DEFAULT_PROTECTED_MODULES: readonly string[];
/** Merge configuration-provided modules with the defaults (dedup, order kept). */
export declare function mergeProtectedModules(extra: readonly string[] | undefined): readonly string[];
