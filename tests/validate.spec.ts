import { describe, expect, it } from 'vitest'
import { isValidEntryId, isValidInstallSpec, isValidPackageName } from '../src/validate.ts'

describe('isValidInstallSpec', () => {
  it('accepts npm package names', () => {
    expect(isValidInstallSpec('dsh-ding')).toBe(true)
    expect(isValidInstallSpec('@deepseek-ai/dsh-plugin-console')).toBe(true)
    expect(isValidInstallSpec('dsh-plugin-hub')).toBe(true)
  })
  it('accepts github owner/repo specs', () => {
    expect(isValidInstallSpec('Noob-stupid/dsh-plugin-hub')).toBe(true)
    expect(isValidInstallSpec('deepseek-ai/deepseek-harness')).toBe(true)
  })
  it('rejects shell metacharacters (execFile shell:true injection)', () => {
    expect(isValidInstallSpec('dsh-ding & calc.exe')).toBe(false)
    expect(isValidInstallSpec('a|b')).toBe(false)
    expect(isValidInstallSpec('a;b')).toBe(false)
    expect(isValidInstallSpec('$(cmd)')).toBe(false)
    expect(isValidInstallSpec('a`b')).toBe(false)
    expect(isValidInstallSpec('a"b')).toBe(false)
    expect(isValidInstallSpec("a'b")).toBe(false)
  })
  it('rejects whitespace, newlines, and overlong specs', () => {
    expect(isValidInstallSpec('dsh ding')).toBe(false)
    expect(isValidInstallSpec('a\nb')).toBe(false)
    expect(isValidInstallSpec('a'.repeat(101))).toBe(false)
    expect(isValidInstallSpec('')).toBe(false)
  })
})

describe('isValidPackageName', () => {
  it('accepts plain and scoped names', () => {
    expect(isValidPackageName('dsh-ding')).toBe(true)
    expect(isValidPackageName('@deepseek-ai/dsh-plugin-console')).toBe(true)
  })
  it('rejects shell metacharacters', () => {
    expect(isValidPackageName('x & y')).toBe(false)
    expect(isValidPackageName('x;y')).toBe(false)
  })
})

describe('isValidEntryId', () => {
  it('accepts loader tree ids', () => {
    expect(isValidEntryId('include:llm')).toBe(true)
    expect(isValidEntryId('include:dsh-ding')).toBe(true)
    expect(isValidEntryId('web/ui-theme')).toBe(true)
    expect(isValidEntryId('tool-subagent-control/list-agents')).toBe(true)
  })
  it('rejects quotes, newlines, and spaces', () => {
    expect(isValidEntryId('include:"x"')).toBe(false)
    expect(isValidEntryId('a\nb')).toBe(false)
    expect(isValidEntryId('a b')).toBe(false)
  })
})
