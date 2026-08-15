# dsh-plugin-manager

DSH（DeepSeek Harness）插件管理器：在 Web 设置页中**按官方/社区分组**管理已安装插件（中文描述、一键启停、详情、卸载），并内置 **GitHub 插件市场**（高收藏/增长最快榜单 + 搜索 + 一键安装）。

## 功能

### 插件管理（设置 → 插件 → 插件管理）

- **官方 / 社区分组**：官方插件（dsh 出厂 bundle，默认折叠）与社区插件（用户安装，默认展开）分开展示，支持搜索
- **中文描述库**：内置 129 个包的 zh/en 双语描述（按 UI 语言渲染），未收录的包回退英文 `package.json` 描述
- **一键启停**：写入用户补丁层 `cordis.patch.yml`，DSH 配置热重载约 1-3 秒生效；显示「补丁停用 / 补丁强制启用」状态标签
- **受保护行**：热加载与 Web 服务链上的核心插件禁止开关与卸载，防止误操作破坏自身
- **详情面板**：版本、主页、仓库、许可、README 摘要
- **卸载**（仅社区插件）：`pnpm remove` + bundle 层同步，重启服务后彻底移除

### 插件市场（设置 → 插件 → 插件市场）

- **默认榜单**：高收藏（话题内按 star 排序）/ 增长最快（近 90 天新建仓库按 star 排序，GitHub 无增速接口的近似）
- **搜索**：GitHub `dsh-plugin` 话题仓库，显示 star、描述、npm 包名探测（npm 直装 / GitHub 安装标签）
- **一键添加并启用**：npm 安装到 profile + bundle 层自动同步，重启服务生效

## 安装

```bash
# 从本仓库安装（推荐先构建）
dsh plugin --profile web add file:/path/to/dsh-plugin-manager

# 或从 GitHub 安装
dsh plugin --profile web add github:<your-name>/dsh-plugin-manager
```

安装后**重启 dsh 服务**，刷新页面 → 设置 → 插件 → 「插件管理」与「插件市场」。

## 要求

- DSH 0.1.0 系列（web profile）
- pnpm（`dsh plugin` 依赖）

## 开发

```bash
pnpm install          # 安装依赖（link: 指向 ../deepseek-harness 源码）
pnpm run check        # typecheck + 单测 + 构建
pnpm run build        # 仅构建（lib/index.js 宿主 + lib/client.js 客户端）
```

- 宿主插件：环回 HTTP 路由 `/dsh-plugin-manager/{list,toggle,search,install,uninstall}`（loopback-only）
- 客户端插件：注册 `settings.plugins.tab` 插槽（`manager` / `market` 两个 Tab）
- 纯函数模块（`patch.ts` / `group.ts` / `meta.ts` / `market.ts` / `descriptions.ts`）均有 vitest 单测

## 工作原理

- **启停**：行级文本补丁改写 `$DSH_HOME/profiles/<profile>/cordis.patch.yml`（保留注释、`!!js` 表达式），DSH 的配置热重载（chokidar）自动重组组合树——与手改配置文件等价
- **官方/社区判定**：解析包真实路径——落在 profile `node_modules` 为社区，落在安装闭包（`$DSH_HOME/profiles/node_modules`）为官方
- **补丁寻址**：用户补丁层按**行自身 id** 寻址（不带 loader 路径前缀如 `include:`）

## 安全

- 全部 HTTP 路由仅允许环回地址访问
- 安装/卸载等价于 CLI `dsh plugin add/remove`，pnpm 走完整 TLS 校验
- 受保护行硬拦截开关与卸载

## License

MIT
