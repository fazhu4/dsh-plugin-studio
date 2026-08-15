// src/index.ts
import { readFile as readFile2 } from "node:fs/promises";
import { join as join2 } from "node:path";
import { createRequire } from "node:module";

// src/group.ts
function under(root, path) {
  const r = root.toLowerCase();
  const p = path.toLowerCase();
  if (!p.startsWith(r)) return false;
  return p.length === r.length || p[r.length] === "\\" || p[r.length] === "/";
}
function classify(moduleName, resolve, profileNodeModules, closureNodeModules) {
  let resolved;
  try {
    resolved = resolve(`${moduleName}/package.json`);
  } catch {
    return moduleName.startsWith("@deepseek-ai/") ? "official" : "community";
  }
  if (under(profileNodeModules, resolved)) return "community";
  if (under(closureNodeModules, resolved)) return "official";
  return moduleName.startsWith("@deepseek-ai/") ? "official" : "community";
}

// src/meta.ts
var EMPTY = {
  name: null,
  version: null,
  description: null,
  homepage: null,
  repository: null,
  license: null
};
function extractMeta(raw) {
  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch {
    return EMPTY;
  }
  const repoValue = pkg.repository;
  const repository = typeof repoValue === "string" ? repoValue : typeof repoValue === "object" && repoValue !== null && typeof repoValue.url === "string" ? repoValue.url : null;
  return {
    name: typeof pkg.name === "string" ? pkg.name : null,
    version: typeof pkg.version === "string" ? pkg.version : null,
    description: typeof pkg.description === "string" ? pkg.description : null,
    homepage: typeof pkg.homepage === "string" ? pkg.homepage : null,
    repository,
    license: typeof pkg.license === "string" ? pkg.license : null
  };
}
function readmeSummary(readme, maxChars = 600) {
  for (const raw of readme.split(/\n\s*\n/)) {
    const text = raw.split("\n").map((line) => line.trim()).filter((line) => line !== "" && !/^#{1,6}\s/.test(line)).join(" ").trim();
    if (text === "") continue;
    return text.length <= maxChars ? text : `${text.slice(0, maxChars)}\u2026`;
  }
  return null;
}

// src/patch.ts
var ROW_START = /^([ \t]*)- id:[ \t]*['"]?([^'"]+?)['"]?[ \t]*$/;
var DISABLED_LINE = /^([ \t]*)disabled:[ \t]*(\S.*)?$/;
function findBlock(lines, entryId) {
  for (let i = 0; i < lines.length; i++) {
    const m = ROW_START.exec(lines[i]);
    if (m === null || m[2] !== entryId) continue;
    let end = i + 1;
    while (end < lines.length && /^[ \t]/.test(lines[end]) && lines[end].trim() !== "") end++;
    let disabledValue = null;
    for (let j = i + 1; j < end; j++) {
      const d = DISABLED_LINE.exec(lines[j]);
      if (d !== null) disabledValue = d[2]?.trim() ?? "";
    }
    return { start: i, end, indent: m[1], disabledValue };
  }
  return null;
}
function upsertDisabled(text, entryId, disabled) {
  const value = disabled ? "true" : "false";
  const lines = text.split(/\r?\n/);
  const block = findBlock(lines, entryId);
  if (block !== null) {
    for (let i = block.start + 1; i < block.end; i++) {
      const d = DISABLED_LINE.exec(lines[i]);
      if (d !== null) {
        lines[i] = `${d[1]}disabled: ${value}`;
        return lines.join("\n");
      }
    }
    lines.splice(block.start + 1, 0, `${block.indent}  disabled: ${value}`);
    return lines.join("\n");
  }
  const trimmed = text.trim();
  if (trimmed === "") {
    return `- id: ${entryId}
  disabled: ${value}
`;
  }
  const hasContent = lines.some((l) => {
    const t = l.trim();
    return t !== "" && !t.startsWith("#") && t !== "[]";
  });
  if (!hasContent) {
    const out = [];
    let replaced = false;
    for (const l of lines) {
      if (l.trim() === "[]" && !replaced) {
        out.push(`- id: ${entryId}`, `  disabled: ${value}`);
        replaced = true;
      } else {
        out.push(l);
      }
    }
    let result = out.join("\n");
    if (!replaced) {
      const sep2 = result === "" || result.endsWith("\n") ? "" : "\n";
      result += `${sep2}- id: ${entryId}
  disabled: ${value}`;
    } else if (!result.endsWith("\n")) {
      result += "\n";
    }
    return result;
  }
  const sep = text.endsWith("\n") ? "" : "\n";
  return text + sep + `- id: ${entryId}
  disabled: ${value}
`;
}
function patchStateOf(text, entryId) {
  const block = findBlock(text.split(/\r?\n/), entryId);
  if (block === null || block.disabledValue === null) return "none";
  if (block.disabledValue === "true") return "disabled";
  if (block.disabledValue === "false") return "forced";
  return "none";
}

// src/market.ts
function parseSearchResponse(json2) {
  if (typeof json2 !== "object" || json2 === null) return [];
  const items = json2.items;
  if (!Array.isArray(items)) return [];
  const out = [];
  for (const it of items) {
    if (typeof it !== "object" || it === null) continue;
    const o = it;
    if (typeof o.full_name !== "string") continue;
    out.push({
      fullName: o.full_name,
      description: typeof o.description === "string" ? o.description : null,
      stars: typeof o.stargazers_count === "number" ? o.stargazers_count : 0,
      htmlUrl: typeof o.html_url === "string" ? o.html_url : "",
      defaultBranch: typeof o.default_branch === "string" ? o.default_branch : null
    });
  }
  return out;
}
function parseRepoManifest(raw) {
  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch {
    return { name: null, private: false, dshBundle: false };
  }
  const dsh = typeof pkg.dsh === "object" && pkg.dsh !== null ? pkg.dsh : void 0;
  return {
    name: typeof pkg.name === "string" ? pkg.name : null,
    private: pkg.private === true,
    dshBundle: dsh !== void 0 && typeof dsh.bundle === "object" && dsh.bundle !== null
  };
}

// src/protected.ts
var DEFAULT_PROTECTED_MODULES = [
  // Hot-reload chain (config-only HMR watches these).
  "@deepseek-ai/cordis-plugin-timer",
  "@deepseek-ai/cordis-plugin-hmr",
  // Web serving chain.
  "@deepseek-ai/dsh-host-webserver",
  "@deepseek-ai/dsh-web-app",
  "@deepseek-ai/dsh-web-app/startup",
  "@deepseek-ai/dsh-client-modules",
  "@deepseek-ai/dsh-client-connection",
  "@deepseek-ai/dsh-client-runtime",
  "@deepseek-ai/dsh-api-remotes",
  // Settings shell (the surface hosting this plugin's tabs).
  "@deepseek-ai/dsh-client-ui-settings",
  "@deepseek-ai/dsh-client-ui-settings-plugins",
  // This plugin itself.
  "dsh-plugin-manager"
];
function mergeProtectedModules(extra) {
  if (extra === void 0 || extra.length === 0) return DEFAULT_PROTECTED_MODULES;
  const seen = new Set(DEFAULT_PROTECTED_MODULES);
  const out = [...DEFAULT_PROTECTED_MODULES];
  for (const name2 of extra) {
    if (!seen.has(name2)) {
      seen.add(name2);
      out.push(name2);
    }
  }
  return out;
}

// src/profile.ts
import { execFile } from "node:child_process";
import { readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
function profilePathsFromBaseUrl(baseUrl) {
  const dir = fileURLToPath(baseUrl);
  return {
    dir,
    patchFile: join(dir, "cordis.patch.yml"),
    nodeModules: join(dir, "node_modules"),
    closureNodeModules: join(dirname(dir), "node_modules")
  };
}
async function writeAtomic(file, content) {
  const tmp = `${file}.dshpm.tmp`;
  await writeFile(tmp, content, "utf8");
  await rename(tmp, file);
}
function runPnpm(cwd, args, timeoutMs = 3e5) {
  return new Promise((resolve) => {
    execFile("pnpm", args, {
      cwd,
      shell: process.platform === "win32",
      timeout: timeoutMs,
      maxBuffer: 8 * 1024 * 1024
    }, (error, stdout, stderr) => {
      const output = `${stdout}
${stderr}`.trim();
      if (error === null) {
        resolve({ code: 0, output });
        return;
      }
      const code = typeof error.code === "number" ? error.code : 1;
      resolve({ code, output });
    });
  });
}
async function readManifest(profileDir) {
  try {
    return JSON.parse(await readFile(join(profileDir, "package.json"), "utf8"));
  } catch {
    return {};
  }
}
async function writeManifest(profileDir, manifest) {
  await writeAtomic(join(profileDir, "package.json"), `${JSON.stringify(manifest, null, 2)}
`);
}
async function packageIsBundle(packageName, profileDir) {
  try {
    const pkg = JSON.parse(
      await readFile(join(profileDir, "node_modules", packageName, "package.json"), "utf8")
    );
    return typeof pkg.dsh?.bundle === "object" && pkg.dsh.bundle !== null;
  } catch {
    return false;
  }
}
async function reconcileBundles(profileDir) {
  const manifest = await readManifest(profileDir);
  const deps = Object.keys(manifest.dependencies ?? {});
  const bundles = [...manifest.dsh?.profile?.bundles ?? []];
  let changed = false;
  for (const name2 of deps) {
    if (!bundles.includes(name2) && await packageIsBundle(name2, profileDir)) {
      bundles.push(name2);
      changed = true;
    }
  }
  for (const name2 of [...bundles]) {
    if (deps.includes(name2) && !await packageIsBundle(name2, profileDir)) {
      const at = bundles.indexOf(name2);
      bundles.splice(at, 1);
      changed = true;
    }
  }
  if (!changed) return false;
  const next = {
    ...manifest,
    dsh: { ...manifest.dsh, profile: { ...manifest.dsh?.profile, bundles } }
  };
  await writeManifest(profileDir, next);
  return true;
}

// src/index.ts
var name = "dsh-plugin-manager";
var inject = ["webServer", "loader"];
var FIBER_STATE = {
  PENDING: 0,
  LOADING: 1,
  ACTIVE: 2,
  FAILED: 3,
  DISPOSED: 4,
  UNLOADING: 5
};
var FIBER_PHASE = {
  [FIBER_STATE.PENDING]: "pending",
  [FIBER_STATE.LOADING]: "loading",
  [FIBER_STATE.ACTIVE]: "active",
  [FIBER_STATE.FAILED]: "failed",
  [FIBER_STATE.DISPOSED]: null,
  [FIBER_STATE.UNLOADING]: "unloading"
};
var require2 = createRequire(import.meta.url);
var searchCache = /* @__PURE__ */ new Map();
var pendingRestart = false;
function isLoopback(req) {
  const addr = req.socket.remoteAddress ?? "";
  return addr === "127.0.0.1" || addr === "::1" || addr === "::ffff:127.0.0.1";
}
function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(chunks.length === 0 ? {} : JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}
function fail(res, message) {
  json(res, 400, { ok: false, message });
}
async function buildList(ctx, paths) {
  let patchText = "";
  try {
    patchText = await readFile2(paths.patchFile, "utf8");
  } catch {
  }
  const entries = [];
  for (const entry of ctx.loader.entries()) {
    if (entry.options.group) continue;
    const moduleName = entry.options.name;
    const group = classify(moduleName, (spec) => require2.resolve(spec), paths.nodeModules, paths.closureNodeModules);
    let meta = {
      name: null,
      version: null,
      description: null,
      homepage: null,
      repository: null,
      license: null
    };
    let readme = null;
    try {
      const pkgPath = require2.resolve(`${moduleName}/package.json`);
      meta = extractMeta(await readFile2(pkgPath, "utf8"));
      try {
        readme = await readFile2(join2(pkgPath, "..", "README.md"), "utf8");
      } catch {
      }
    } catch {
    }
    entries.push({
      entryId: entry.id,
      moduleName,
      packageName: meta.name,
      enabled: !entry.disabled,
      fiberPhase: entry.fiber === void 0 ? null : FIBER_PHASE[entry.fiber.state] ?? null,
      group,
      // The user patch layer addresses rows by their bare id (EntryOptions.id),
      // NOT the loader-tree path (e.g. `include:llm`): a path-prefixed row is
      // silently skipped by the include plugin's id lookup.
      patchState: patchStateOf(patchText, entry.options.id),
      description: meta.description,
      version: meta.version,
      homepage: meta.homepage,
      repository: meta.repository,
      license: meta.license,
      readmeSummary: readme === null ? null : readmeSummary(readme)
    });
  }
  return {
    official: entries.filter((entry) => entry.group === "official"),
    community: entries.filter((entry) => entry.group === "community"),
    protectedModules: [...protectedSet],
    restartRequired: pendingRestart
  };
}
var GITHUB_SEARCH = "https://api.github.com/search/repositories";
var GITHUB_RAW = "https://raw.githubusercontent.com";
var NPM_REGISTRIES = ["https://registry.npmjs.org", "https://registry.npmmirror.com"];
async function searchMarket(query, ttlMs, perPage = 15) {
  const cacheKey = `${perPage}:${query}`;
  const cached = searchCache.get(cacheKey);
  if (cached !== void 0 && Date.now() - cached.at < ttlMs) return cached.repos;
  const url = `${GITHUB_SEARCH}?${new URLSearchParams({
    q: `topic:dsh-plugin ${query}`,
    sort: "stars",
    per_page: String(perPage)
  })}`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "dsh-plugin-manager" }
  });
  if (!res.ok) throw new Error(`GitHub search failed: HTTP ${res.status}`);
  const repos = parseSearchResponse(await res.json());
  searchCache.set(cacheKey, { at: Date.now(), repos });
  return repos;
}
async function npmProbe(name2) {
  for (const registry of NPM_REGISTRIES) {
    try {
      const res = await fetch(`${registry}/${encodeURIComponent(name2)}`, { method: "HEAD" });
      if (res.ok) return true;
    } catch {
    }
  }
  return false;
}
async function enrichRepo(repo) {
  let npmName = null;
  let dshBundle = false;
  if (repo.defaultBranch !== null) {
    try {
      const res = await fetch(`${GITHUB_RAW}/${repo.fullName}/${repo.defaultBranch}/package.json`);
      if (res.ok) {
        const manifest = parseRepoManifest(await res.text());
        if (manifest.name !== null && !manifest.private) {
          npmName = manifest.name;
          dshBundle = manifest.dshBundle;
        }
      }
    } catch {
    }
  }
  const source = npmName !== null && await npmProbe(npmName) ? "npm" : "github";
  return {
    fullName: repo.fullName,
    description: repo.description,
    stars: repo.stars,
    htmlUrl: repo.htmlUrl,
    npmName,
    source,
    dshBundle
  };
}
var ALLOW_BUILDS_HINT = "git \u4F9D\u8D56\u7684\u6784\u5EFA\u811A\u672C\u53EF\u80FD\u88AB pnpm \u62E6\u622A\uFF08allowBuilds\uFF09\u3002\u82E5\u5B89\u88C5\u5931\u8D25\uFF0C\u8BF7\u6309 pnpm \u63D0\u793A\u628A\u5BF9\u5E94 key \u52A0\u5165 profile \u7684 pnpm-workspace.yaml \u540E\u91CD\u8BD5\u3002";
async function installPackage(paths, spec) {
  const pnpmSpec = spec.includes("/") && !spec.startsWith("@") ? `github:${spec}` : spec;
  const result = await runPnpm(paths.dir, ["add", pnpmSpec]);
  if (result.code !== 0) {
    const hint = /allowBuilds|Ignored build scripts/i.test(result.output) ? ` ${ALLOW_BUILDS_HINT}` : "";
    return { ok: false, message: `pnpm add \u5931\u8D25\uFF08\u9000\u51FA\u7801 ${result.code}\uFF09${hint}
${result.output.slice(-800)}` };
  }
  await reconcileBundles(paths.dir);
  const bundleName = pnpmSpec.startsWith("github:") ? pnpmSpec.slice("github:".length).split("#")[0].split("/")[1] : pnpmSpec;
  const manifest = await readManifest(paths.dir);
  const depNames = Object.keys(manifest.dependencies ?? {});
  const installed = depNames.find((name2) => name2.endsWith(`/${bundleName}`) || name2 === bundleName);
  const warning = installed !== void 0 && !await packageIsBundle(installed, paths.dir) ? "\u5DF2\u5B89\u88C5\u4E3A\u666E\u901A\u4F9D\u8D56\uFF1A\u8BE5\u5305\u672A\u58F0\u660E dsh.bundle\uFF0C\u91CD\u542F\u540E\u4E0D\u4F1A\u4F5C\u4E3A\u63D2\u4EF6\u5C42\u6FC0\u6D3B\u3002" : void 0;
  pendingRestart = true;
  return { ok: true, restartRequired: true, ...warning === void 0 ? {} : { warning } };
}
async function uninstallPackage(paths, packageName) {
  let resolved;
  try {
    resolved = require2.resolve(`${packageName}/package.json`);
  } catch {
    return { ok: false, message: `\u65E0\u6CD5\u89E3\u6790 ${packageName}\uFF0C\u53EF\u80FD\u672A\u5B89\u88C5\u3002` };
  }
  const under2 = (root, path) => {
    const r = root.toLowerCase();
    const p = path.toLowerCase();
    return p.startsWith(r) && (p.length === r.length || p[r.length] === "\\" || p[r.length] === "/");
  };
  if (!under2(paths.nodeModules, resolved)) {
    return { ok: false, message: "\u4EC5\u53EF\u5378\u8F7D\u793E\u533A\u63D2\u4EF6\uFF08\u5B89\u88C5\u5728 profile \u4E2D\u7684\u5305\uFF09\u3002" };
  }
  if (protectedSet.has(packageName)) {
    return { ok: false, message: "\u8BE5\u63D2\u4EF6\u53D7\u4FDD\u62A4\uFF0C\u4E0D\u53EF\u5378\u8F7D\u3002" };
  }
  const result = await runPnpm(paths.dir, ["remove", packageName]);
  if (result.code !== 0) {
    return { ok: false, message: `pnpm remove \u5931\u8D25\uFF08\u9000\u51FA\u7801 ${result.code}\uFF09
${result.output.slice(-800)}` };
  }
  await reconcileBundles(paths.dir);
  pendingRestart = true;
  return { ok: true, restartRequired: true };
}
var protectedSet = /* @__PURE__ */ new Set();
function apply(ctx, config = {}) {
  protectedSet = new Set(mergeProtectedModules(config.protectedModules));
  const ttlMs = config.searchCacheTtlMs ?? 6e4;
  let paths;
  try {
    paths = profilePathsFromBaseUrl(ctx.baseUrl);
  } catch (error) {
    throw new Error(`dsh-plugin-manager: cannot resolve the profile directory from ctx.baseUrl (${String(ctx.baseUrl)}): ${String(error)}`);
  }
  ctx.webServer.register({
    kind: "exact",
    path: "/dsh-plugin-manager/list",
    handler: async (req, res) => {
      if (!isLoopback(req)) {
        fail(res, "loopback only");
        return;
      }
      try {
        json(res, 200, await buildList(ctx, paths));
      } catch (error) {
        fail(res, `list failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  });
  ctx.webServer.register({
    kind: "exact",
    path: "/dsh-plugin-manager/toggle",
    handler: async (req, res) => {
      if (!isLoopback(req)) {
        fail(res, "loopback only");
        return;
      }
      try {
        const body = await readJsonBody(req);
        if (typeof body.entryId !== "string" || typeof body.enabled !== "boolean") {
          fail(res, "invalid body: { entryId: string, enabled: boolean }");
          return;
        }
        const entry = [...ctx.loader.entries()].find((item) => item.id === body.entryId);
        if (entry === void 0) {
          fail(res, `no loader entry with id ${body.entryId}`);
          return;
        }
        if (protectedSet.has(entry.options.name)) {
          fail(res, "\u8BE5\u63D2\u4EF6\u53D7\u4FDD\u62A4\uFF0C\u7981\u6B62\u5207\u6362\u3002");
          return;
        }
        let patchText = "";
        try {
          patchText = await readFile2(paths.patchFile, "utf8");
        } catch {
        }
        await writeAtomic(paths.patchFile, upsertDisabled(patchText, entry.options.id, body.enabled));
        json(res, 200, { ok: true });
      } catch (error) {
        fail(res, `toggle failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  });
  ctx.webServer.register({
    kind: "exact",
    path: "/dsh-plugin-manager/search",
    handler: async (req, res) => {
      if (!isLoopback(req)) {
        fail(res, "loopback only");
        return;
      }
      try {
        const url = new URL(req.url ?? "/", "http://localhost");
        const mode = url.searchParams.get("mode") ?? "search";
        const board = mode === "top" ? { query: "", perPage: 20 } : mode === "rising" ? { query: `created:>${new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10)}`, perPage: 20 } : null;
        if (board !== null) {
          const repos2 = await searchMarket(board.query, ttlMs, board.perPage);
          const items2 = await Promise.all(repos2.slice(0, 10).map(enrichRepo));
          json(res, 200, items2);
          return;
        }
        const rawQuery = (url.searchParams.get("q") ?? "dsh-plugin").trim().slice(0, 64);
        const repos = await searchMarket(rawQuery === "" ? "dsh-plugin" : rawQuery, ttlMs);
        const items = await Promise.all(repos.slice(0, 10).map(enrichRepo));
        json(res, 200, items);
      } catch (error) {
        fail(res, `search failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  });
  ctx.webServer.register({
    kind: "exact",
    path: "/dsh-plugin-manager/install",
    handler: async (req, res) => {
      if (!isLoopback(req)) {
        fail(res, "loopback only");
        return;
      }
      try {
        const body = await readJsonBody(req);
        if (typeof body.spec !== "string" || body.spec.trim() === "") {
          fail(res, "invalid body: { spec: string }");
          return;
        }
        json(res, 200, await installPackage(paths, body.spec.trim()));
      } catch (error) {
        fail(res, `install failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  });
  ctx.webServer.register({
    kind: "exact",
    path: "/dsh-plugin-manager/uninstall",
    handler: async (req, res) => {
      if (!isLoopback(req)) {
        fail(res, "loopback only");
        return;
      }
      try {
        const body = await readJsonBody(req);
        if (typeof body.packageName !== "string" || body.packageName.trim() === "") {
          fail(res, "invalid body: { packageName: string }");
          return;
        }
        json(res, 200, await uninstallPackage(paths, body.packageName.trim()));
      } catch (error) {
        fail(res, `uninstall failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  });
}
export {
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
