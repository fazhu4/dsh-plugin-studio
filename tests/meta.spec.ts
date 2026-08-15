import { describe, expect, it } from 'vitest'
import { extractMeta, readmeSummary } from '../src/meta.ts'

describe('extractMeta', () => {
  it('parses a full package.json', () => {
    const meta = extractMeta(JSON.stringify({
      name: '@deepseek-ai/dsh-web-app',
      version: '0.1.0',
      description: 'The web bundle.',
      homepage: 'https://example.com',
      repository: { type: 'git', url: 'https://github.com/deepseek-ai/deepseek-harness.git' },
      license: 'MIT',
    }))
    expect(meta).toEqual({
      name: '@deepseek-ai/dsh-web-app',
      version: '0.1.0',
      description: 'The web bundle.',
      homepage: 'https://example.com',
      repository: 'https://github.com/deepseek-ai/deepseek-harness.git',
      license: 'MIT',
    })
  })

  it('accepts a string repository', () => {
    const meta = extractMeta('{"repository": "https://github.com/a/b.git"}')
    expect(meta.repository).toBe('https://github.com/a/b.git')
  })

  it('returns nulls for invalid JSON', () => {
    expect(extractMeta('not json')).toEqual({
      name: null, version: null, description: null, homepage: null, repository: null, license: null,
    })
  })
})

describe('readmeSummary', () => {
  it('takes the first non-empty paragraph, stripped of heading markers', () => {
    const readme = '# Title\n\nThis is the **first** paragraph.\n\nSecond paragraph.\n'
    expect(readmeSummary(readme)).toBe('This is the **first** paragraph.')
  })

  it('caps long paragraphs', () => {
    const long = 'word '.repeat(200)
    const out = readmeSummary(long, 20)
    expect(out).not.toBeNull()
    expect(out!.length).toBe(21) // 20 chars + ellipsis
    expect(out!.endsWith('…')).toBe(true)
  })

  it('returns null for empty input', () => {
    expect(readmeSummary('')).toBeNull()
    expect(readmeSummary('# only a heading\n')).toBeNull()
  })
})
