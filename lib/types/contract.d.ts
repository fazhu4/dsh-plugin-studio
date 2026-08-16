/**
 * Shared wire types between the host plugin and the browser tab.
 * Language-neutral: descriptions arrive raw; the client applies the curated
 * zh/en table according to the active UI language.
 */
/** Official (installation closure) vs community (profile-installed). */
export type PluginGroup = 'official' | 'community';
/** User-patch state of one loader row. */
export type PatchState = 'none' | 'disabled' | 'forced';
export type PluginFiberPhase = 'pending' | 'loading' | 'active' | 'failed' | 'unloading' | null;
/** One enriched plugin entry as shown in the manager tab. */
export interface EntryInfo {
    readonly entryId: string;
    readonly moduleName: string;
    /** Resolved package.json name, or null when unresolvable. */
    readonly packageName: string | null;
    readonly enabled: boolean;
    readonly fiberPhase: PluginFiberPhase;
    readonly group: PluginGroup;
    readonly patchState: PatchState;
    /** Raw package.json description (English for in-box packages). */
    readonly description: string | null;
    readonly version: string | null;
    readonly homepage: string | null;
    readonly repository: string | null;
    readonly license: string | null;
    /** First paragraph of the package README, capped; null when absent. */
    readonly readmeSummary: string | null;
}
export interface ListResponse {
    readonly official: readonly EntryInfo[];
    readonly community: readonly EntryInfo[];
    readonly protectedModules: readonly string[];
    readonly restartRequired: boolean;
}
export interface ToggleRequest {
    readonly entryId: string;
    readonly enabled: boolean;
}
export interface ToggleResponse {
    readonly ok: true;
}
export interface OpError {
    readonly ok: false;
    readonly message: string;
}
export interface MarketItem {
    readonly fullName: string;
    readonly description: string | null;
    readonly stars: number;
    readonly htmlUrl: string;
    /** npm package name from the repo root package.json, when published. */
    readonly npmName: string | null;
    /** 'npm' when the package is published on the registry, else 'github'. */
    readonly source: 'npm' | 'github';
    readonly dshBundle: boolean;
}
export interface InstallRequest {
    /** npm package name or `owner/repo` GitHub spec. */
    readonly spec: string;
}
export interface InstallResponse {
    readonly ok: true;
    readonly restartRequired: true;
    readonly warning?: string;
}
export interface UninstallRequest {
    readonly packageName: string;
}
export interface UninstallResponse {
    readonly ok: true;
    readonly restartRequired: true;
}
