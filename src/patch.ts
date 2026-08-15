/**
 * Line-based cordis.patch.yml editing. Only the target row's `disabled:` line
 * is ever touched, so comments, !!js expressions, and unrelated rows survive
 * byte-for-byte. Block shape handled:
 *
 *   - id: <entryId>          <- block start (column 0, optional indent)
 *     disabled: true|false   <- indented body lines until the next top-level item
 *     config: ...
 */

import type { PatchState } from './contract.ts'

/** `- id: <value>` line: captures the leading indent and the id. */
const ROW_START = /^([ \t]*)- id:[ \t]*['"]?([^'"]+?)['"]?[ \t]*$/

/** An indented `disabled:` line inside a block body. */
const DISABLED_LINE = /^([ \t]*)disabled:[ \t]*(\S.*)?$/

interface Block {
  /** Line index of the `- id:` line. */
  readonly start: number
  /** Line index (exclusive) of the block. */
  readonly end: number
  readonly indent: string
  /** Raw value after `disabled:`, or null when the block has none. */
  readonly disabledValue: string | null
}

function findBlock(lines: string[], entryId: string): Block | null {
  for (let i = 0; i < lines.length; i++) {
    const m = ROW_START.exec(lines[i])
    if (m === null || m[2] !== entryId) continue
    let end = i + 1
    while (end < lines.length && /^[ \t]/.test(lines[end]) && lines[end].trim() !== '') end++
    let disabledValue: string | null = null
    for (let j = i + 1; j < end; j++) {
      const d = DISABLED_LINE.exec(lines[j])
      if (d !== null) disabledValue = d[2]?.trim() ?? ''
    }
    return { start: i, end, indent: m[1] as string, disabledValue }
  }
  return null
}

/**
 * Set or clear the `disabled:` field of one patch row.
 * @param text - current patch file content.
 * @param entryId - the loader row id to target.
 * @param disabled - the desired enablement.
 * @returns the patched content.
 */
export function upsertDisabled(text: string, entryId: string, disabled: boolean): string {
  const value = disabled ? 'true' : 'false'
  const lines = text.split(/\r?\n/)
  const block = findBlock(lines, entryId)
  if (block !== null) {
    for (let i = block.start + 1; i < block.end; i++) {
      const d = DISABLED_LINE.exec(lines[i])
      if (d !== null) {
        lines[i] = `${d[1] as string}disabled: ${value}`
        return lines.join('\n')
      }
    }
    lines.splice(block.start + 1, 0, `${block.indent}  disabled: ${value}`)
    return lines.join('\n')
  }
  const trimmed = text.trim()
  if (trimmed === '') {
    return `- id: ${entryId}\n  disabled: ${value}\n`
  }

  // An empty-list template is a mix of comments, blank lines and an optional
  // literal `[]` marker. When the file is only that, splice the new row in
  // place of `[]` so comments survive and the marker disappears.
  const hasContent = lines.some((l) => {
    const t = l.trim()
    return t !== '' && !t.startsWith('#') && t !== '[]'
  })
  if (!hasContent) {
    const out: string[] = []
    let replaced = false
    for (const l of lines) {
      if (l.trim() === '[]' && !replaced) {
        out.push(`- id: ${entryId}`, `  disabled: ${value}`)
        replaced = true
      } else {
        out.push(l)
      }
    }
    let result = out.join('\n')
    if (!replaced) {
      const sep = result === '' || result.endsWith('\n') ? '' : '\n'
      result += `${sep}- id: ${entryId}\n  disabled: ${value}`
    } else if (!result.endsWith('\n')) {
      result += '\n'
    }
    return result
  }

  const sep = text.endsWith('\n') ? '' : '\n'
  return text + sep + `- id: ${entryId}\n  disabled: ${value}\n`
}

/** Read the user-patch state of one row. */
export function patchStateOf(text: string, entryId: string): PatchState {
  const block = findBlock(text.split(/\r?\n/), entryId)
  if (block === null || block.disabledValue === null) return 'none'
  if (block.disabledValue === 'true') return 'disabled'
  if (block.disabledValue === 'false') return 'forced'
  return 'none'
}
