/**
 * dsh-plugin-manager build: esbuild bundles for host (Node) and client (browser).
 * Produces lib/index.js (host plugin) and lib/client.js (client bundle), plus
 * .d.ts declarations for the public entry points.
 */
import { build } from 'esbuild'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

// Host: Node ESM, externalizes DSH packages (resolved at runtime by the loader).
await build({
  entryPoints: [join(root, 'src/index.ts')],
  outfile: join(root, 'lib/index.js'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  sourcemap: true,
  external: ['@deepseek-ai/cordis'],
  logLevel: 'info',
})

// Client: browser bundle, single file (the module table loads it via <script>).
// The dsh client-module contract: the file must register itself through
// window.__ModuleLoader__.load with a CJS factory whose `require` is answered
// by the loader module table (react and other platform modules stay external).
await build({
  entryPoints: [join(root, 'src/client/index.ts')],
  outfile: join(root, 'lib/client.js'),
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: 'es2020',
  sourcemap: true,
  jsx: 'automatic',
  jsxDev: false,
  external: [
    'react',
    'react-dom',
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-settings',
    '@deepseek-ai/dsh-client-locale',
  ],
  banner: {
    js: 'window.__ModuleLoader__.load({ id: "dsh-plugin-manager", factory: (require) => {\n'
      + 'var module = { exports: {} }; var exports = module.exports;',
  },
  footer: {
    js: 'return module.exports; } });',
  },
  logLevel: 'info',
})

// Type declarations: emit with tsc. tsconfig.build.json overrides the
// typecheck-mode noEmit and pins rootDir=src so declarations land at
// lib/types/index.d.ts / lib/types/client/index.d.ts — exactly where
// package.json exports.types points. Emission stays best-effort: a failure
// warns instead of aborting the bundles.
try {
  rmSync(join(root, 'lib/types'), { recursive: true, force: true })
  mkdirSync(join(root, 'lib/types'), { recursive: true })
  execSync('npx tsc -p tsconfig.build.json --emitDeclarationOnly --declaration', {
    cwd: root,
    stdio: 'ignore',
  })
} catch {
  console.warn('[dsh-plugin-manager] warning: type declaration emission failed (exports.types will be missing)')
}

// Manifest marker so the profile loader can sanity-check the bundle.
writeFileSync(
  join(root, 'lib/manifest.json'),
  JSON.stringify({ name: 'dsh-plugin-manager', host: 'lib/index.js', client: 'lib/client.js' }, null, 2),
)

console.log('[dsh-plugin-manager] build complete')
