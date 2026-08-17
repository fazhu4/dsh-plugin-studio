import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { reconcileBundles } from '../src/profile.ts'

const roots: string[] = []

afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function createProfile(
  bundles: string[],
  closureBundles: string[] = [],
): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-studio-profile-'))
  roots.push(root)
  const profileDir = join(root, 'profiles', 'web')
  await mkdir(join(profileDir, 'node_modules'), { recursive: true })
  await writeFile(join(profileDir, 'package.json'), JSON.stringify({
    name: 'dsh-profile-test',
    dependencies: {},
    dsh: { profile: { bundles } },
  }))
  for (const name of closureBundles) {
    const packageDir = join(root, 'profiles', 'node_modules', ...name.split('/'))
    await mkdir(packageDir, { recursive: true })
    await writeFile(join(packageDir, 'package.json'), JSON.stringify({
      name,
      dsh: { bundle: { patch: './cordis.patch.yml' } },
    }))
  }
  return profileDir
}

describe('reconcileBundles', () => {
  it('removes a bundle whose profile dependency was uninstalled', async () => {
    const profileDir = await createProfile(['dsh-ding'])

    expect(await reconcileBundles(profileDir)).toBe(true)
    const manifest = JSON.parse(await readFile(join(profileDir, 'package.json'), 'utf8')) as {
      dsh: { profile: { bundles: string[] } }
    }
    expect(manifest.dsh.profile.bundles).toEqual([])
  })

  it('keeps installation bundles that are not profile dependencies', async () => {
    const profileDir = await createProfile(['@deepseek-ai/dsh-base'], ['@deepseek-ai/dsh-base'])

    expect(await reconcileBundles(profileDir)).toBe(false)
    const manifest = JSON.parse(await readFile(join(profileDir, 'package.json'), 'utf8')) as {
      dsh: { profile: { bundles: string[] } }
    }
    expect(manifest.dsh.profile.bundles).toEqual(['@deepseek-ai/dsh-base'])
  })
})
