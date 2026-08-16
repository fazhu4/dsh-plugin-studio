/**
 * Input validation for the loopback HTTP boundaries. These endpoints reach
 * pnpm through execFile with `shell: true` on Windows — unsanitized input
 * containing shell metacharacters could be interpreted by cmd.exe, so every
 * spec/name/id crossing the boundary is whitelist-checked here.
 */
/** npm package name / github owner/repo / scoped spec. */
export declare const SPEC_RE: RegExp;
/** Loader entry ids: word chars plus `: . / -` (e.g. include:llm). */
export declare const ENTRY_ID_RE: RegExp;
/** Whether an install spec (npm name or owner/repo) is safe to hand to pnpm. */
export declare function isValidInstallSpec(spec: string): boolean;
/** Whether a package name is safe to hand to pnpm remove. */
export declare function isValidPackageName(name: string): boolean;
/** Whether a loader entry id is safe to write into the patch file. */
export declare function isValidEntryId(id: string): boolean;
/**
 * Whether a custom group name is safe: non-empty, ≤ 50 chars, no control/newline
 * characters (the rest is user freedom — CJK, spaces, emoji allowed).
 */
export declare function isValidGroupName(name: string): boolean;
