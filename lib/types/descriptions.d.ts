/**
 * Curated bilingual plugin descriptions, keyed by package name.
 * The client looks up this table first (by UI language) and falls back to the
 * raw package.json description. New official packages without an entry
 * degrade gracefully to English.
 */
export interface LocalizedDescription {
    readonly zh: string;
    readonly en: string;
}
export declare const DESCRIPTIONS: Readonly<Record<string, LocalizedDescription>>;
/** Look up the curated description for one package. */
export declare function describe(packageName: string, lang: 'zh' | 'en'): string | null;
