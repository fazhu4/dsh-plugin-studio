import { describe, expect, it } from 'vitest'
import { describe as describePlugin } from '../src/descriptions.ts'

describe('describe', () => {
  it('returns the zh entry for zh', () => {
    expect(describePlugin('dsh-ding', 'zh')).toContain('提示音')
  })
  it('returns the en entry for en', () => {
    expect(describePlugin('dsh-ding', 'en')).toContain('chime')
  })
  it('returns summaries for the internal include entry', () => {
    expect(describePlugin('cordis:include', 'zh')).toContain('配置加载器')
    expect(describePlugin('cordis:include', 'en')).toContain('config loader')
  })
  it('returns null for unknown packages', () => {
    expect(describePlugin('no-such-package', 'zh')).toBeNull()
  })
  it('covers the documented starter set', () => {
    for (const name of ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', 'dsh-ding', '@deepseek-ai/dsh-plugin-console']) {
      expect(describePlugin(name, 'zh')).not.toBeNull()
      expect(describePlugin(name, 'en')).not.toBeNull()
    }
  })
})
