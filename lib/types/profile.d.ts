/**
 * Profile-side host utilities: profile discovery from ctx.baseUrl, atomic
 * file writes, pnpm subprocess execution, and bundle reconciliation (mirror
 * of the CLI's reconcilePlugins semantics).
 */
export interface ProfilePaths {
    /** Absolute profile directory (e.g. .../profiles/web). */
    readonly dir: string;
    /** The user patch layer path. */
    readonly patchFile: string;
    /** User-defined group overrides (plugin-private, not a cordis file). */
    readonly groupsFile: string;
    /** Profile node_modules (user-installed plugins). */
    readonly nodeModules: string;
    /** Installation closure node_modules (sibling of profiles/). */
    readonly closureNodeModules: string;
}
/** Derive the profile paths from the loader's baseUrl (a file: URL string). */
export declare function profilePathsFromBaseUrl(baseUrl: string): ProfilePaths;
/** Atomic write: tmp file + rename (the HMR watcher sees one complete file). */
export declare function writeAtomic(file: string, content: string): Promise<void>;
export interface PnpmResult {
    readonly code: number;
    readonly output: string;
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
export declare function runPnpm(cwd: string, args: string[], timeoutMs?: number): Promise<PnpmResult>;
export interface ProfileManifest {
    readonly dependencies?: Record<string, string>;
    readonly dsh?: {
        readonly profile?: {
            readonly bundles?: string[];
        };
    };
}
/** Read the profile manifest; any failure yields an empty object. */
export declare function readManifest(profileDir: string): Promise<ProfileManifest>;
/** Write the profile manifest atomically. */
export declare function writeManifest(profileDir: string, manifest: ProfileManifest): Promise<void>;
/** Whether an installed package declares a dsh.bundle patch layer. */
export declare function packageIsBundle(packageName: string, profileDir: string): Promise<boolean>;
/**
 * Reconcile `dsh.profile.bundles` against installed dependencies: a
 * dependency declaring `dsh.bundle` joins the layer stack; a listed name that
 * no longer is a bundle (or dependency) leaves it. Persists when changed.
 * @returns whether the manifest changed.
 */
export declare function reconcileBundles(profileDir: string): Promise<boolean>;
/** Shape of the plugin-private group-override file. */
export interface GroupStore {
    readonly version: 1;
    /** moduleName → custom group name. */
    readonly entries: Record<string, string>;
}
/** Read moduleName → groupName overrides; a missing/corrupt file yields empty. */
export declare function readGroups(file: string): Promise<Map<string, string>>;
/** Persist moduleName → groupName overrides atomically. */
export declare function writeGroups(file: string, entries: ReadonlyMap<string, string>): Promise<void>;
