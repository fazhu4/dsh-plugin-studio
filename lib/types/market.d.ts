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
/** Parse a repo root package.json text. */
export declare function parseRepoManifest(raw: string): RepoManifest;
