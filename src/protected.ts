/**
 * Protected loader rows: the hot-reload and web-serving chain plus this
 * plugin itself. Toggling or uninstalling these would break the very surface
 * the manager runs on. The set is configurable via the plugin config
 * (`config.protectedModules`), appended to these defaults.
 */

export const DEFAULT_PROTECTED_MODULES: readonly string[] = [
  // Hot-reload chain (config-only HMR watches these).
  '@deepseek-ai/cordis-plugin-timer',
  '@deepseek-ai/cordis-plugin-hmr',
  // Web serving chain.
  '@deepseek-ai/dsh-host-webserver',
  '@deepseek-ai/dsh-web-app',
  '@deepseek-ai/dsh-web-app/startup',
  '@deepseek-ai/dsh-client-modules',
  '@deepseek-ai/dsh-client-connection',
  '@deepseek-ai/dsh-client-runtime',
  '@deepseek-ai/dsh-api-remotes',
  // Settings shell (the surface hosting this plugin's tabs).
  '@deepseek-ai/dsh-client-ui-settings',
  '@deepseek-ai/dsh-client-ui-settings-plugins',
  // This plugin itself.
  'dsh-plugin-studio',
]

/** Merge configuration-provided modules with the defaults (dedup, order kept). */
export function mergeProtectedModules(extra: readonly string[] | undefined): readonly string[] {
  if (extra === undefined || extra.length === 0) return DEFAULT_PROTECTED_MODULES
  const seen = new Set(DEFAULT_PROTECTED_MODULES)
  const out = [...DEFAULT_PROTECTED_MODULES]
  for (const name of extra) {
    if (!seen.has(name)) {
      seen.add(name)
      out.push(name)
    }
  }
  return out
}
