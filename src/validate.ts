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

/**
 * Whether an install spec (npm name or owner/repo) is safe to hand to pnpm.
 * Allows npm names (including scoped `@scope/name`) and github `owner/repo`
 * (exactly two non-empty `/` segments).
 */
export function isValidInstallSpec(spec: string): boolean {
  if (!SPEC_RE.test(spec)) return false
  const parts = spec.split('/')
  // Inline segments between the leading scope (if any) and trailing path must
  // all be non-empty: catch `a//b` and `a/b/`.
  return parts.every(seg => seg.length > 0)
}

/** Whether a package name is safe to hand to pnpm remove. */
export function isValidPackageName(name: string): boolean {
  return isValidInstallSpec(name)
}

/** Whether a loader entry id is safe to write into the patch file. */
export function isValidEntryId(id: string): boolean {
  return ENTRY_ID_RE.test(id)
}

/** Reserved group names that must not be used for user custom groups. */
const RESERVED_GROUP_NAMES = new Set(['official', 'community'])

/**
 * Whether a custom group name is safe: non-empty, ≤ 50 chars, no control/newline
 * characters, and not a reserved name (`official`/`community`) — overriding
 * those would collide with the auto-detected buckets and make entries
 * disappear from the custom-group list.
 */
export function isValidGroupName(name: string): boolean {
  if (name.length === 0 || name.length > 50) return false
  if (RESERVED_GROUP_NAMES.has(name)) return false
  for (const ch of name) {
    const code = ch.codePointAt(0)!
    if (code < 0x20 || code === 0x7f) return false
  }
  return true
}
