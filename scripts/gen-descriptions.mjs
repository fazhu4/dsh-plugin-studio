/**
 * Draft generator for the curated description table. Scans the harness
 * checkout for packages whose README.zh.md / package.json description can
 * seed a zh/en entry, and prints a `DESCRIPTIONS` map fragment for review.
 * Usage: node scripts/gen-descriptions.mjs <harness-root> [<package-name>...]
 * The output is a DRAFT — entries must be human-reviewed before merging into
 * src/descriptions.ts (machine text is often not a clean one-liner).
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2]
if (!root) {
  console.error('usage: node scripts/gen-descriptions.mjs <harness-root> [<package-name>...]')
  process.exit(1)
}

function firstParagraph(text) {
  for (const raw of text.split(/\n\s*\n/)) {
    const line = raw.split('\n').map(l => l.replace(/^\s*#+\s*/, '').trim()).filter(Boolean).join(' ')
    if (line) return line.length > 120 ? line.slice(0, 120) + '…' : line
  }
  return null
}

const names = process.argv.slice(3)
for (const name of names) {
  const pkgPath = join(root, 'packages', name, 'package.json')
  const zhPath = join(root, 'packages', name, 'README.zh.md')
  if (!existsSync(pkgPath)) { console.error(`skip ${name}: no package.json`); continue }
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const en = pkg.description ?? null
  let zh = null
  if (existsSync(zhPath)) zh = firstParagraph(readFileSync(zhPath, 'utf8'))
  const entry = `  '${pkg.name}': {\n    zh: ${JSON.stringify(zh ?? '')},\n    en: ${JSON.stringify(en ?? '')},\n  },`
  console.log(`${zh === null ? '// TODO zh' : ''}\n${entry}`)
}
console.log('// review: replace empty zh with a short manual translation of en.')
