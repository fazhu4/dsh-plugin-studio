import { describe, expect, it } from 'vitest'
import { parseRepoManifest, parseSearchResponse, resolveMarketSource } from '../src/market.ts'

describe('parseSearchResponse', () => {
  it('maps GitHub search items', () => {
    const out = parseSearchResponse({
      items: [
        {
          full_name: 'a/b',
          description: 'A plugin',
          stargazers_count: 42,
          html_url: 'https://github.com/a/b',
          default_branch: 'main',
        },
        { full_name: 'c/d' },
      ],
    })
    expect(out).toEqual([
      {
        fullName: 'a/b', description: 'A plugin', stars: 42,
        htmlUrl: 'https://github.com/a/b', defaultBranch: 'main',
      },
      {
        fullName: 'c/d', description: null, stars: 0,
        htmlUrl: '', defaultBranch: null,
      },
    ])
  })

  it('returns [] for malformed payloads', () => {
    expect(parseSearchResponse(null)).toEqual([])
    expect(parseSearchResponse({})).toEqual([])
    expect(parseSearchResponse({ items: 'nope' })).toEqual([])
  })
})

describe('parseRepoManifest', () => {
  it('extracts name, private, and dsh.bundle', () => {
    const m = parseRepoManifest(JSON.stringify({
      name: '@deepseek-ai/dsh-plugin-console',
      private: false,
      dsh: { bundle: { patch: './cordis.patch.yml' } },
    }))
    expect(m).toEqual({ name: '@deepseek-ai/dsh-plugin-console', private: false, dshBundle: true })
  })

  it('tolerates missing fields and bad JSON', () => {
    expect(parseRepoManifest('{}')).toEqual({ name: null, private: false, dshBundle: false })
    expect(parseRepoManifest('x')).toEqual({ name: null, private: false, dshBundle: false })
  })
})

describe('resolveMarketSource', () => {
  it('keeps the npm name when the package is published on the registry', () => {
    expect(resolveMarketSource('dsh-example', true)).toEqual({ npmName: 'dsh-example', source: 'npm' })
  })

  it('drops the npm name and falls back to github when the package is NOT published', () => {
    // Regression: a repo whose root package.json declares a name that was
    // never published to npm must install via `github:owner/repo`. Keeping the
    // npm name made the frontend install through the npm registry and fail.
    expect(resolveMarketSource('dsh-example', false)).toEqual({ npmName: null, source: 'github' })
  })

  it('falls back to github when the repo has no npm name at all', () => {
    expect(resolveMarketSource(null, false)).toEqual({ npmName: null, source: 'github' })
    expect(resolveMarketSource(null, true)).toEqual({ npmName: null, source: 'github' })
  })
})
