import type { EntryInfo } from '../contract.ts';
type EntryDescriptionSource = Pick<EntryInfo, 'moduleName' | 'packageName' | 'description'>;
/** Resolve the localized summary shown for one plugin-manager entry. */
export declare function entryDescription(entry: EntryDescriptionSource, lang: 'zh' | 'en', fallback: string): string;
export {};
