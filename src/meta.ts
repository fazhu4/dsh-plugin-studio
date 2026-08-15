/**
 * Package metadata extraction from package.json text and README summaries.
 * Pure functions; all IO happens in the host plugin.
 */

export interface PackageMeta {
  readonly name: string | null
  readonly version: string | null
  readonly description: string | null
  readonly homepage: string | null
  readonly repository: string | null
  readonly license: string | null
}

const EMPTY: PackageMeta = {
  name: null, version: null, description: null, homepage: null, repository: null, license: null,
}

/** Parse package.json text into the metadata the manager displays. */
export function extractMeta(raw: string): PackageMeta {
  let pkg: Record<string, unknown>
  try {
    pkg = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return EMPTY
  }
  const repoValue = pkg.repository
  const repository = typeof repoValue === 'string'
    ? repoValue
    : typeof repoValue === 'object' && repoValue !== null && typeof (repoValue as { url?: unknown }).url === 'string'
      ? (repoValue as { url: string }).url
      : null
  return {
    name: typeof pkg.name === 'string' ? pkg.name : null,
    version: typeof pkg.version === 'string' ? pkg.version : null,
    description: typeof pkg.description === 'string' ? pkg.description : null,
    homepage: typeof pkg.homepage === 'string' ? pkg.homepage : null,
    repository,
    license: typeof pkg.license === 'string' ? pkg.license : null,
  }
}

/**
 * First non-empty paragraph of a README, headings stripped and whitespace
 * collapsed, capped at maxChars with an ellipsis.
 * @param readme - the raw README text.
 * @param maxChars - summary cap (default 600).
 */
export function readmeSummary(readme: string, maxChars = 600): string | null {
  for (const raw of readme.split(/\n\s*\n/)) {
    const text = raw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '' && !/^#{1,6}\s/.test(line))
      .join(' ')
      .trim()
    if (text === '') continue
    return text.length <= maxChars ? text : `${text.slice(0, maxChars)}…`
  }
  return null
}
