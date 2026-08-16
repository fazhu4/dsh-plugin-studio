/**
 * dsh-usage-insights client plugin: registers the manager and market tabs
 * into the Plugins settings section.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type PluginManagerLocaleKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'pluginManager': PluginManagerLocaleKey;
    }
}
/** Services required by the registration. */
export declare const inject: string[];
/** Contribute the two tabs to the Plugins settings section. */
export declare function apply(ctx: ClientContext): void;
