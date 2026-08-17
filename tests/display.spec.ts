import { describe, expect, it } from 'vitest'
import { entryDescription } from '../src/client/entry-display.ts'

describe('entryDescription', () => {
  it('uses an internal entry name when no package name is available', () => {
    expect(entryDescription({
      moduleName: 'cordis:include',
      packageName: null,
      description: null,
    }, 'zh', '（无描述）')).toContain('配置加载器')
  })
})
