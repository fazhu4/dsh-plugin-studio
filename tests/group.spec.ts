import { describe, expect, it } from 'vitest'
import { classify } from '../src/group.ts'

const PROFILE_NM = 'C:/Users/u/.dsh/profiles/web/node_modules'
const CLOSURE_NM = 'C:/Users/u/.dsh/profiles/node_modules'

/** Fake resolver: returns paths under a root, or throws for unknown specs. */
function resolverUnder(root: string, known: readonly string[] = []) {
  return (spec: string): string => {
    const name = spec.replace(/\/package\.json$/, '')
    if (known.includes(name) || name.startsWith('known-')) return `${root}/${name}/package.json`
    throw new Error(`cannot resolve ${spec}`)
  }
}

describe('classify', () => {
  it('classifies profile-installed packages as community', () => {
    const resolve = resolverUnder(PROFILE_NM, ['dsh-ding', '@deepseek-ai/dsh-plugin-console'])
    expect(classify('dsh-ding', resolve, PROFILE_NM, CLOSURE_NM)).toBe('community')
    expect(classify('@deepseek-ai/dsh-plugin-console', resolve, PROFILE_NM, CLOSURE_NM)).toBe('community')
  })

  it('classifies closure packages as official', () => {
    const resolve = resolverUnder(CLOSURE_NM, ['@deepseek-ai/dsh-llm'])
    expect(classify('@deepseek-ai/dsh-llm', resolve, PROFILE_NM, CLOSURE_NM)).toBe('official')
  })

  it('falls back to scope for unresolved specs', () => {
    const resolve = () => { throw new Error('nope') }
    expect(classify('@deepseek-ai/dsh-agent', resolve, PROFILE_NM, CLOSURE_NM)).toBe('official')
    expect(classify('dsh-ding', resolve, PROFILE_NM, CLOSURE_NM)).toBe('community')
  })

  it('treats a user-installed name outside both roots by scope', () => {
    const resolve = () => 'C:/elsewhere/@deepseek-ai/x/package.json'
    expect(classify('@deepseek-ai/x', resolve, PROFILE_NM, CLOSURE_NM)).toBe('official')
  })

  it('does not false-positive on a prefix sibling directory', () => {
    const resolve = () => `${PROFILE_NM}x/foo/package.json`
    expect(classify('foo', resolve, PROFILE_NM, CLOSURE_NM)).toBe('community')
  })
})
