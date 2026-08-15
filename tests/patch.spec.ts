import { describe, expect, it } from 'vitest'
import { patchStateOf, upsertDisabled } from '../src/patch.ts'

const TEMPLATE = `# dsh profile root — an empty entry list.
[]
`

const SAMPLE = `# user patch layer
- id: llm
  config:
    provider: deepseek-official

# keep me
- id: tool-bash
  disabled: !!js process.platform === 'win32'
`

describe('upsertDisabled', () => {
  it('appends a block to the empty template', () => {
    const out = upsertDisabled(TEMPLATE, 'dsh-ding', true)
    expect(out).toContain('- id: dsh-ding')
    expect(out).toContain('  disabled: true')
    expect(out).not.toContain('[]')
  })

  it('appends a block to an empty file', () => {
    const out = upsertDisabled('', 'x', false)
    expect(out).toBe('- id: x\n  disabled: false\n')
  })

  it('inserts disabled into an existing block without one', () => {
    const out = upsertDisabled('- id: llm\n  config:\n    a: 1\n', 'llm', true)
    expect(out).toContain('- id: llm\n  disabled: true\n  config:')
  })

  it('replaces an existing disabled value', () => {
    const out = upsertDisabled('- id: llm\n  disabled: true\n  config:\n    a: 1\n', 'llm', false)
    expect(out).toContain('  disabled: false')
    expect(out).toContain('    a: 1')
  })

  it('preserves comments and unrelated rows', () => {
    const out = upsertDisabled(SAMPLE, 'llm', false)
    expect(out).toContain('# user patch layer')
    expect(out).toContain('# keep me')
    expect(out).toContain('disabled: !!js process.platform')
    expect(out).toContain('- id: llm\n  disabled: false')
  })

  it('is idempotent', () => {
    const once = upsertDisabled('- id: a\n  disabled: true\n', 'a', true)
    expect(upsertDisabled(once, 'a', true)).toBe(once)
  })

  it('handles quoted ids', () => {
    const out = upsertDisabled("- id: 'my-plugin'\n", 'my-plugin', true)
    expect(out).toContain("- id: 'my-plugin'\n  disabled: true")
  })

  it('handles CRLF input', () => {
    const out = upsertDisabled('- id: a\r\n  disabled: true\r\n', 'a', false)
    expect(out).toBe('- id: a\n  disabled: false\n')
  })

  it('appends after comments when the file has no [] marker', () => {
    const out = upsertDisabled('# only a comment\n', 'x', true)
    expect(out).toContain('# only a comment')
    expect(out).toContain('- id: x\n  disabled: true')
  })
})

describe('patchStateOf', () => {
  it('returns none when absent', () => {
    expect(patchStateOf(SAMPLE, 'llm')).toBe('none')
  })
  it('returns disabled for true', () => {
    expect(patchStateOf('- id: a\n  disabled: true\n', 'a')).toBe('disabled')
  })
  it('returns forced for false', () => {
    expect(patchStateOf('- id: a\n  disabled: false\n', 'a')).toBe('forced')
  })
  it('returns none for a !!js expression', () => {
    expect(patchStateOf('- id: a\n  disabled: !!js x\n', 'a')).toBe('none')
  })
})
