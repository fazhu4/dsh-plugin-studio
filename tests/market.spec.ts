import { describe, expect, it } from 'vitest'
import { parseRepoManifest, parseSearchResponse } from '../src/market.ts'

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
