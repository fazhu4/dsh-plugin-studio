/**
 * Package metadata extraction from package.json text and README summaries.
 * Pure functions; all IO happens in the host plugin.
 */
export interface PackageMeta {
    readonly name: string | null;
    readonly version: string | null;
    readonly description: string | null;
    readonly homepage: string | null;
    readonly repository: string | null;
    readonly license: string | null;
}
/** Parse package.json text into the metadata the manager displays. */
export declare function extractMeta(raw: string): PackageMeta;
/**
 * First non-empty paragraph of a README, headings stripped and whitespace
 * collapsed, capped at maxChars with an ellipsis.
 * @param readme - the raw README text.
 * @param maxChars - summary cap (default 600).
 */
export declare function readmeSummary(readme: string, maxChars?: number): string | null;
