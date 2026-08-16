/**
 * Input validation for the loopback HTTP boundaries. These endpoints reach
 * pnpm through execFile with `shell: true` on Windows — unsanitized input
 * containing shell metacharacters could be interpreted by cmd.exe, so every
 * spec/name/id crossing the boundary is whitelist-checked here.
 */

/** npm package name / github owner/repo / scoped spec. */
export const SPEC_RE = /^[a-zA-Z0-9@._~/-]{1,100}$/

/** Loader entry ids: word chars plus `: . / -` (e.g. include:llm). */
export const ENTRY_ID_RE = /^[\w.:/-]{1,200}$/

/** Whether an install spec (npm name or owner/repo) is safe to hand to pnpm. */
export function isValidInstallSpec(spec: string): boolean {
  return SPEC_RE.test(spec)
}

/** Whether a package name is safe to hand to pnpm remove. */
export function isValidPackageName(name: string): boolean {
  return SPEC_RE.test(name)
}

/** Whether a loader entry id is safe to write into the patch file. */
export function isValidEntryId(id: string): boolean {
  return ENTRY_ID_RE.test(id)
}

/**
 * Whether a custom group name is safe: non-empty, ≤ 50 chars, no control/newline
 * characters (the rest is user freedom — CJK, spaces, emoji allowed).
 */
export function isValidGroupName(name: string): boolean {
  if (name.length === 0 || name.length > 50) return false
  for (const ch of name) {
    const code = ch.codePointAt(0)!
    if (code < 0x20 || code === 0x7f) return false
  }
  return true
}
