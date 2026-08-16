import { describe, expect, it } from 'vitest'
import { shouldHideUninstalledEntry } from '../src/uninstall-state.ts'

describe('shouldHideUninstalledEntry', () => {
  it('hides a stale loader row after its package was uninstalled', () => {
    const removed = new Set(['community-tool'])

    expect(shouldHideUninstalledEntry('community-tool', null, removed)).toBe(true)
  })

  it('keeps rows whose package was not uninstalled', () => {
    const removed = new Set(['other-tool'])

    expect(shouldHideUninstalledEntry('community-tool', 'community-tool', removed)).toBe(false)
  })

  it('matches the resolved package name when the loader module name differs', () => {
    const removed = new Set(['@scope/community-tool'])

    expect(shouldHideUninstalledEntry('community-tool-entry', '@scope/community-tool', removed)).toBe(true)
  })
})
