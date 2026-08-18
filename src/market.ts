/**
 * Market data parsing — pure functions over GitHub REST payloads and repo
 * package.json text. Network calls live in the host plugin (index.ts).
 */

export interface GitHubRepo {
  readonly fullName: string
  readonly description: string | null
  readonly stars: number
  readonly htmlUrl: string
  readonly defaultBranch: string | null
}

/** Map a GitHub /search/repositories response to the market model. */
export function parseSearchResponse(json: unknown): GitHubRepo[] {
  if (typeof json !== 'object' || json === null) return []
  const items = (json as { items?: unknown }).items
  if (!Array.isArray(items)) return []
  const out: GitHubRepo[] = []
  for (const it of items) {
    if (typeof it !== 'object' || it === null) continue
    const o = it as Record<string, unknown>
    if (typeof o.full_name !== 'string') continue
    out.push({
      fullName: o.full_name,
      description: typeof o.description === 'string' ? o.description : null,
      stars: typeof o.stargazers_count === 'number' ? o.stargazers_count : 0,
      htmlUrl: typeof o.html_url === 'string' ? o.html_url : '',
      defaultBranch: typeof o.default_branch === 'string' ? o.default_branch : null,
    })
  }
  return out
}

export interface RepoManifest {
  readonly name: string | null
  readonly private: boolean
  readonly dshBundle: boolean
}

export interface MarketSource {
  readonly npmName: string | null
  readonly source: 'npm' | 'github'
}

/**
 * Decide the install source for a market repo. The npm name survives only
 * when the registry actually hosts the package: a repo that was never
 * published must install via `github:owner/repo`, so its npm name is dropped
 * and callers fall back to the repo full name (`owner/repo`).
 */
export function resolveMarketSource(npmName: string | null, published: boolean): MarketSource {
  return published && npmName !== null
    ? { npmName, source: 'npm' }
    : { npmName: null, source: 'github' }
}

/** Parse a repo root package.json text. */
export function parseRepoManifest(raw: string): RepoManifest {
  let pkg: Record<string, unknown>
  try {
    pkg = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return { name: null, private: false, dshBundle: false }
  }
  const dsh = typeof pkg.dsh === 'object' && pkg.dsh !== null ? pkg.dsh as Record<string, unknown> : undefined
  return {
    name: typeof pkg.name === 'string' ? pkg.name : null,
    private: pkg.private === true,
    dshBundle: dsh !== undefined && typeof dsh.bundle === 'object' && dsh.bundle !== null,
  }
}
