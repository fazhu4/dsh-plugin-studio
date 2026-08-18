/**
 * Market data parsing — pure functions over GitHub REST payloads and repo
 * package.json text. Network calls live in the host plugin (index.ts).
 */
export interface GitHubRepo {
    readonly fullName: string;
    readonly description: string | null;
    readonly stars: number;
    readonly htmlUrl: string;
    readonly defaultBranch: string | null;
}
/** Map a GitHub /search/repositories response to the market model. */
export declare function parseSearchResponse(json: unknown): GitHubRepo[];
export interface RepoManifest {
    readonly name: string | null;
    readonly private: boolean;
    readonly dshBundle: boolean;
}
export interface MarketSource {
    readonly npmName: string | null;
    readonly source: 'npm' | 'github';
}
/**
 * Decide the install source for a market repo. The npm name survives only
 * when the registry actually hosts the package: a repo that was never
 * published must install via `github:owner/repo`, so its npm name is dropped
 * and callers fall back to the repo full name (`owner/repo`).
 */
export declare function resolveMarketSource(npmName: string | null, published: boolean): MarketSource;
/** Parse a repo root package.json text. */
export declare function parseRepoManifest(raw: string): RepoManifest;
