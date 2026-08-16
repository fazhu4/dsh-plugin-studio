/**
 * dsh-usage-insights host plugin. Loopback-only HTTP routes over webServer:
 *
 *   GET  /dsh-usage-insights/list      — grouped, enriched plugin inventory
 *   POST /dsh-usage-insights/toggle    — enable/disable via user patch layer
 *   GET  /dsh-usage-insights/search    — GitHub dsh-plugin market search
 *   POST /dsh-usage-insights/install   — pnpm add + bundle reconcile
 *   POST /dsh-usage-insights/uninstall — pnpm remove + bundle reconcile
 *
 * Services injected: webServer, loader. All DSH APIs are consumed
 * structurally (duck-typed faces) so this package needs no DSH imports.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
/** Plugin metadata (Cordis). */
export declare const name = "dsh-usage-insights";
/** Declared service injections. */
export declare const inject: string[];
/** Plugin configuration. */
export interface Config {
    /** Extra protected module names (merged with the defaults). */
    protectedModules?: string[];
    /** GitHub search result cache TTL in ms. */
    searchCacheTtlMs?: number;
}
interface WebServerFace {
    register(route: {
        kind: 'exact' | 'prefix';
        path: string;
        handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
    }): () => void;
}
interface LoaderEntryLike {
    id: string;
    options: {
        id: string;
        name: string;
        group?: boolean | null;
    };
    disabled: boolean;
    fiber?: {
        state: number;
    };
}
interface LoaderFace {
    entries(): LoaderEntryLike[];
}
interface Ctx {
    baseUrl: string;
    webServer: WebServerFace;
    loader: LoaderFace;
    effect<T>(fn: () => T, label?: string): T;
}
/**
 * Compose the plugin.
 * @param ctx - Cordis context.
 * @param config - plugin configuration.
 */
export declare function apply(ctx: Ctx, config?: Config): void;
export {};
