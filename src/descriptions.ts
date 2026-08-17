/**
 * Curated bilingual plugin descriptions, keyed by package name.
 * The client looks up this table first (by UI language) and falls back to the
 * raw package.json description. New official packages without an entry
 * degrade gracefully to English.
 */

export interface LocalizedDescription {
  readonly zh: string
  readonly en: string
}

export const DESCRIPTIONS: Readonly<Record<string, LocalizedDescription>> = {
  '@deepseek-ai/dsh-base': {
    zh: 'DSH 共享核心：每个 profile 的第一个补丁层，向空 profile 根插入基础插件行。',
    en: 'The shared dsh core as a profile bundle: every profile\'s first patch layer, inserting the base plugin rows over the empty profile root.',
  },
  '@deepseek-ai/dsh-web-app': {
    zh: 'DSH 浏览器端 bundle：web 补丁层 + 运行时胶水插件（前端静态服务、web 提示词、bash 运行时变量、URL 行）。',
    en: 'The dsh browser-surface bundle: the web patch layer over dsh-base plus the runtime glue plugin (frontend dist serving, web-surface prompt, bash runtime variables, URL line).',
  },
  '@deepseek-ai/dsh-plugin-console': {
    zh: '插件控制台（第三方）：一键启用/停用插件，浏览并安装 GitHub dsh-plugin 插件。',
    en: 'Plugin console (third-party): one-click enable/disable of plugins, browse and install GitHub dsh-plugins.',
  },
  'dsh-ding': {
    zh: '对话完成时播放提示音并发送 Windows 通知；WebUI 铃铛按钮可调开关/音量/音效。',
    en: 'Plays a chime and sends Windows notifications when a conversation finishes; the WebUI bell button toggles sound, volume, and effects.',
  },
  '@deepseek-ai/dsh-llm': {
    zh: 'LLM 调用抽象：provider 路由、请求/响应词汇、用量与错误分类的统一层。',
    en: 'LLM abstraction: provider routing, request/result vocabulary, usage, and the error taxonomy.',
  },
  '@deepseek-ai/dsh-session': {
    zh: '会话核心：会话生命周期、事件流与持久化接口。',
    en: 'Session core: session lifecycle, event stream, and persistence interfaces.',
  },
  '@deepseek-ai/dsh-agent': {
    zh: 'Agent 运行时：轮次、工具循环、恢复与重试语义。',
    en: 'Agent runtime: turns, tool loop, recovery, and retry semantics.',
  },
  '@deepseek-ai/dsh-tools': {
    zh: '工具注册表：模型可见工具的名称、描述与参数 schema 汇总。',
    en: 'The tool registry: names, descriptions, and JSON-Schema parameters of model-facing tools.',
  },
  '@deepseek-ai/dsh-skill': {
    zh: '技能系统：技能目录、加载与模型可调用性管理。',
    en: 'Skill system: skill catalog, loading, and model-invocability management.',
  },
  '@deepseek-ai/dsh-subagent': {
    zh: '子代理：独立上下文的后台委托（spawn / fork / workflow）。',
    en: 'Subagents: background delegation with isolated contexts (spawn / fork / workflow).',
  },
  '@deepseek-ai/dsh-goal': {
    zh: '长期目标：会话内持久化的完成目标及其轮次驱动。',
    en: 'Long-running goals: persisted same-session completion objectives and their round driver.',
  },
  '@deepseek-ai/dsh-plan-mode': {
    zh: '计划模式：约束 agent 先探索、后提交计划、获批后才实施。',
    en: 'Plan mode: constrains the agent to explore first, submit a plan, and implement only after approval.',
  },
  '@deepseek-ai/dsh-credentials-local': {
    zh: '凭据存储：环境变量引用的托管密钥文档（.credentials.yaml），按请求解析。',
    en: 'Credential store: managed secret document referenced by environment variables, resolved per request.',
  },
  '@deepseek-ai/dsh-settings-file': {
    zh: '用户设置：$DSH_HOME/settings.yaml 分层文档，热重载。',
    en: 'User settings: the layered $DSH_HOME/settings.yaml document, hot-reloaded.',
  },
  '@deepseek-ai/dsh-sandbox-local': {
    zh: '文件沙箱：进程内文件系统访问边界（读/写/全权限）。',
    en: 'File sandbox: in-process filesystem access boundary (read-only / workspace-write / full).',
  },
  '@deepseek-ai/dsh-permission-presets': {
    zh: '权限预设：sandbox 模式与审批策略的组合预设（read-only / workspace-write / danger-full-access）。',
    en: 'Permission presets: sandbox-mode and approval-policy combinations (read-only / workspace-write / danger-full-access).',
  },
  '@deepseek-ai/dsh-tool-bash': {
    zh: 'Bash 工具：模型可调用的 shell 执行（类 Unix 平台）。',
    en: 'Bash tool: model-callable shell execution (Unix-like platforms).',
  },
  '@deepseek-ai/dsh-tool-pwsh': {
    zh: 'PowerShell 工具：模型可调用的 PowerShell 执行（Windows 平台）。',
    en: 'PowerShell tool: model-callable PowerShell execution (Windows platform).',
  },
  '@deepseek-ai/dsh-tool-fs': {
    zh: '文件系统工具：读写/编辑/列目录等模型可见文件操作。',
    en: 'Filesystem tools: model-visible file operations — read, write, edit, and directory listing.',
  },
  '@deepseek-ai/dsh-tool-web': {
    zh: 'Web 工具：模型可调用的 web_search（DeepSeek 检索）。',
    en: 'Web tool: model-callable web search over the DeepSeek retrieval route.',
  },
  '@deepseek-ai/dsh-host-webserver': {
    zh: 'Web 服务：node:http 服务器与环回 HTTP 路由注册表。',
    en: 'Web server: the node:http server and loopback HTTP route registry.',
  },
  '@deepseek-ai/dsh-host-plugin-inventory': {
    zh: '插件清单：向受信客户端暴露当前 Loader 条目的只读投影。',
    en: 'Plugin inventory: the read-only projection of current Loader entries exposed to trusted clients.',
  },
  '@deepseek-ai/dsh-client-ui-settings': {
    zh: '设置域基础：设置命名空间作用域服务与设置插槽类型契约。',
    en: 'Settings domain base: the settings-namespace scope service and the canonical settings slot-type contract.',
  },
  '@deepseek-ai/dsh-client-ui-conversation': {
    zh: '对话域：骨架、有序聊天流、与宿主联动 busy-Enter 偏好的输入栏。',
    en: 'Conversation domain: skeleton, ordered chat flow, and the composer with the Host-backed busy-Enter preference.',
  },
  '@deepseek-ai/dsh-client-ui-sidebar': {
    zh: '侧边栏：会话/工作区导航与设置入口。',
    en: 'Sidebar: session and workspace navigation plus the settings entry.',
  },
  '@deepseek-ai/dsh-client-locale': {
    zh: '国际化：语言快照、字典注册与绑定。',
    en: 'Localization: language snapshot, dictionary registration, and binding.',
  },
  '@deepseek-ai/dsh-agent-default-model': {
    zh: '默认模型选择：Agent 入口共享的默认 provider/model。',
    en: 'Default model selection shared by Agent entry points',
  },
  '@deepseek-ai/dsh-agent-instructions': {
    zh: '工作区上下文加载器：读取 AGENTS.md/CLAUDE.md 指令文件。',
    en: 'Workspace context loader for AGENTS.md/CLAUDE.md instruction files',
  },
  '@deepseek-ai/dsh-agent-loop': {
    zh: '具体 agent 循环插件：驱动对话轮次。',
    en: 'The concrete agent loop plugin for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-agent-presets': {
    zh: '预设组合：按 preset cordis.yml 组合每个会话的 agent 构成。',
    en: 'Per-session agent composition from preset cordis.yml files for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-api-gateway': {
    zh: 'API 网关：Typert Remote 宿主分发与客户端 API 端点。',
    en: 'Typert Remote Host dispatcher and Client API endpoint',
  },
  '@deepseek-ai/dsh-api-remotes': {
    zh: '远程 BFF 组装与宿主 Agent/会话查询策略。',
    en: 'Remote BFF assembly and Host Agent/Session lookup policy',
  },
  '@deepseek-ai/dsh-attachment-local': {
    zh: '私有内容寻址附件存储（$DSH_HOME 内）。',
    en: 'Private content-addressed DSH_HOME attachment storage',
  },
  '@deepseek-ai/dsh-bash-sandbox': {
    zh: 'bash 执行器沙箱实现：每条命令经 ctx.sandbox 约束并回报结果。',
    en: 'Sandbox-consuming implementation of the DeepSeek Harness bash executor seam (confines every command via ctx.sandbox, reports denial/enforcement result facts)',
  },
  '@deepseek-ai/dsh-client-connection': {
    zh: '连接层：HTTP 上行/WebSocket 下行客户端，双流重连控制器。',
    en: 'Wire consumer layer: HTTP-up/WebSocket-down client, ConnectionController dual streams with reconnect, and fixture api',
  },
  '@deepseek-ai/dsh-client-hmr': {
    zh: '开发期热重载：SSE 重建帧 → 失效/预取 → fiber 交换。',
    en: 'Dev-only hot-reload driver for script-loaded client entries: SSE rebuilt frames → invalidate/prefetch → fiber swap through the vendored Loader entry',
  },
  '@deepseek-ai/dsh-client-modules': {
    zh: '客户端模块系统：node 侧组装 __DSH_BOOT__ 入口图；浏览器侧为懒加载 CJS 模块表。',
    en: 'Client module system, dual-face: node half composes the __DSH_BOOT__ entry graph (incremental dsh.client scan, bundle route, index tap, webPlugins service); browser half is the lazy-CJS module table the vendored cordis Loader consumes as its internal seam',
  },
  '@deepseek-ai/dsh-client-ui-agent-preset': {
    zh: 'Agent 预设界面：后续会话默认、当前会话座位与组合编辑器。',
    en: 'Agent-preset surfaces: the default for later sessions, this session\'s seat, and the composition editor',
  },
  '@deepseek-ai/dsh-client-ui-commands': {
    zh: '客户端命令面：全局目录缓存、"/"来源、三类命令 UI。',
    en: 'Client command surface: global directory cache, \'/\' source, three command UI kinds, popupSelect registry',
  },
  '@deepseek-ai/dsh-client-ui-cordis': {
    zh: 'Cordis 动态插件定义卡片：cordis_define 工具行及其运行/停止开关。',
    en: 'Cordis dynamic-plugin definition card: the keyed cordis_define tool row with its run/stop switch',
  },
  '@deepseek-ai/dsh-client-ui-deliverables': {
    zh: '产物文件展示：轮次尾部产物与可点击的最终响应文件引用。',
    en: 'Produced-files turn tail and clickable final-response file references for Web',
  },
  '@deepseek-ai/dsh-client-ui-goal': {
    zh: '会话目标条：停靠在输入栏上方的 GoalBar，读自目标投影。',
    en: 'Session goal surface: GoalBar docked above the composer, read from the goal session projection',
  },
  '@deepseek-ai/dsh-client-ui-input-trigger': {
    zh: '输入触发管线："/"与"@"检测、候选菜单与来源路由。',
    en: 'Input trigger pipeline: \'/\' and \'@\' detection, candidate menu, pick routing to registered sources',
  },
  '@deepseek-ai/dsh-client-ui-jobs': {
    zh: '会话头后台任务列表：从 session/jobs 帧镜像实时状态。',
    en: 'Session-header background-job list: live registry state mirrored from session/jobs frames',
  },
  '@deepseek-ai/dsh-client-ui-layout': {
    zh: '外壳插件：三栏 AppFrame 拖拽手柄与布局视图状态服务。',
    en: 'Shell plugin: three-column AppFrame with drag handles, ctx.layout viewing-state service (navigation + panels)',
  },
  '@deepseek-ai/dsh-client-ui-message-feedback': {
    zh: '消息反馈：助手消息操作条上的评分控件。',
    en: 'Per-message feedback controls contributed to the assistant-message action strip, backed by the messageFeedback Host Remote',
  },
  '@deepseek-ai/dsh-client-ui-model-selection': {
    zh: '模型选择：/model 弹出选择。',
    en: 'Model selection: the /model popupSelect over session.models / session.selectModel',
  },
  '@deepseek-ai/dsh-client-ui-permission-presets': {
    zh: '权限界面：新会话默认（General 设置）与当前会话 /permission 弹窗。',
    en: 'Permission surfaces: a new-session default in General settings and a current-session /permission popup over the permissions projection',
  },
  '@deepseek-ai/dsh-client-ui-plan': {
    zh: '计划模式输入控件：conversation.input.plan 座位与 /plan 命令通道。',
    en: 'Plan-mode composer control: the conversation.input.plan seat over the plan projection and the /plan command channel',
  },
  '@deepseek-ai/dsh-client-ui-settings-general': {
    zh: '设置外壳与引导：General 分区、触发/标题 chrome、字典与版本化欢迎提示。',
    en: 'Settings ownerless-copy and product onboarding plugin: the General section, shell trigger/header chrome content, settings dictionaries, and the versioned welcome notice',
  },
  '@deepseek-ai/dsh-client-ui-settings-models': {
    zh: '模型设置与共享引导对话框（设置与凭据关联）。',
    en: 'Models settings and shared product-onboarding dialogs over existing settings and credential joins',
  },
  '@deepseek-ai/dsh-client-ui-settings-plugin-inventory': {
    zh: '出厂"插件列表"Tab：Web 插件设置中的只读 Loader 清单。',
    en: 'Read-only Cordis Loader inventory tab in Web Plugins settings',
  },
  '@deepseek-ai/dsh-client-ui-settings-plugins': {
    zh: '插件设置分区：功能自有 Tab 与可配置宿主插件卡片。',
    en: 'Plugins settings section with feature-owned tabs and configurable host-plane plugin cards',
  },
  '@deepseek-ai/dsh-client-ui-skill': {
    zh: 'Web 技能引用与专属技能工具行。',
    en: 'Web skill references and the dedicated skill tool row',
  },
  '@deepseek-ai/dsh-client-ui-subagent': {
    zh: '子代理会话目录、续跑路由 UI 与"@"引用来源。',
    en: 'Subagent conversation catalog, continuation routing UI, and \'@\' reference source',
  },
  '@deepseek-ai/dsh-client-ui-theme': {
    zh: '主题：预插件调色板宿主引导、无 DOM ThemeRuntime、--dsw-* token 与外观设置行。',
    en: 'Theme plugin: Host bootstrap for the pre-plugin palette; DOM-free ThemeRuntime for light/dark/system state; --dsw-* token styles and Appearance settings row',
  },
  '@deepseek-ai/dsh-client-ui-tool': {
    zh: '客户端工具调用树渲染器与按工具呈现插槽。',
    en: 'Client Tool call-tree renderer and keyed per-tool presentation slot',
  },
  '@deepseek-ai/dsh-client-ui-trajectory': {
    zh: '轨迹事件台账与交互式时序概览（纯消费插件）。',
    en: 'Trajectory event ledger with an interactive timing overview: pure-consumer plugin registering into the conversation ViewMap (no service)',
  },
  '@deepseek-ai/dsh-client-ui-user-questions': {
    zh: 'Web ask_user_question：宿主工具挂载 + 接管输入框的提问 UI。',
    en: 'Web ask_user_question feature: host tool mount plus composer-takeover question UI',
  },
  '@deepseek-ai/dsh-client-ui-workflow-run': {
    zh: '持久化 workflow-run 会话节点与嵌套成员展示。',
    en: 'Durable workflow-run Conversation Node and nested member disclosure for dsh web',
  },
  '@deepseek-ai/dsh-client-ui-workspace': {
    zh: '工作区选择器：注册进侧边栏与空状态插槽。',
    en: 'Workspace picker plugin: one WorkspacePicker registered into the sidebar and empty-state workspace slots',
  },
  '@deepseek-ai/dsh-code-runtime-worker-thread': {
    zh: '代码执行接缝的 worker 线程实现。',
    en: 'Worker-thread implementation of the DeepSeek Harness code-execution seam',
  },
  '@deepseek-ai/dsh-command-compact': {
    zh: '面向人的 /compact 斜杠命令（显式压缩会话）。',
    en: 'Human-facing slash command for explicit session compaction',
  },
  '@deepseek-ai/dsh-command-feedback': {
    zh: '只记录会话反馈的生成器与面向人的斜杠命令。',
    en: 'Log-only session feedback producer and human-facing slash command',
  },
  '@deepseek-ai/dsh-command-goal': {
    zh: '面向人的 /goal 斜杠命令（持久化同会话目标）。',
    en: 'Human-facing slash command for persisted same-session goals',
  },
  '@deepseek-ai/dsh-commands': {
    zh: '插件拥有的面向人命令注册表（DSH UI 使用）。',
    en: 'Plugin-owned human command registry for DeepSeek Harness UIs',
  },
  '@deepseek-ai/dsh-compaction-basic': {
    zh: '基于 token 计量的压缩策略与 LLM 摘要后端。',
    en: 'Token-meter-driven compaction policy and LLM summarization backend for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-compaction-tool-result-pruner': {
    zh: '工具结果修剪：可重放的免模型头/中/尾裁剪。',
    en: 'Replay-safe model-free head/middle/tail pruning for tool-result surface nodes',
  },
  '@deepseek-ai/dsh-cordis-client-runner': {
    zh: '双半插件包的浏览器半：事件订阅、闭包求值、守卫门面与 loader 条目。',
    en: 'Browser half of dynamic dual-half plugin packages: event subscription, closure evaluation, guard facade, and loader entries',
  },
  '@deepseek-ai/dsh-cordis-host-runner': {
    zh: '双半插件包宿主：动态包定义注册、宿主半沙箱生命周期与 invoke 表。',
    en: 'Dynamic package definition registry, host-half sandbox lifecycle, and invoke handler table for model-mounted dual-half packages',
  },
  '@deepseek-ai/dsh-fs-observation-policy': {
    zh: '文件上下文策略：观察态、编辑前先读、版本守卫的写/改。',
    en: 'File-context policy plugin for the DeepSeek Harness — observed-state, read-before-edit, and version-guarded write/edit added over the ctx.fs provider seam through the fs/* event gate (no service API)',
  },
  '@deepseek-ai/dsh-fs-sandbox': {
    zh: '沙箱强制文件系统后端：按调用沙箱模式围栏写/改，读放行。',
    en: 'Sandbox-enforcing implementation of the DeepSeek Harness filesystem seam: fences write/edit by the per-call sandbox mode (read-only denies mutation, workspace-write contains it to the workspace + temp roots) while reads pass through',
  },
  '@deepseek-ai/dsh-goal-round-driver': {
    zh: '竞态防护的同会话目标轮次驱动。',
    en: 'Race-fenced same-session goal-round driver',
  },
  '@deepseek-ai/dsh-host-apiproxy': {
    zh: 'API 网关：ApiProxy 契约（api/）、fetch 载体对（fetch/）与 ctx.apiProxy 宿主插件。',
    en: 'API gateway: the ApiProxy contract (api/), the fetch carrier pair (fetch/), and the host-side gateway plugin providing ctx.apiProxy',
  },
  '@deepseek-ai/dsh-host-directory-picker-auto': {
    zh: '目录选择器自适应选择：启动时解析宿主环境并挂载原生或浏览后端。',
    en: 'Adaptive chooser of the directory-picker seam: resolves the host situation at boot and mounts the native or browse backend for the DeepSeek Harness web GUI host',
  },
  '@deepseek-ai/dsh-jobs-local': {
    zh: '后台任务注册表接缝的进程内实现。',
    en: 'Process-local implementation of the DeepSeek Harness background job registry seam',
  },
  '@deepseek-ai/dsh-llm-deepseek': {
    zh: 'DeepSeek chat-completions 适配器。',
    en: 'DeepSeek chat-completions adapter for the DeepSeek Harness LLM seam',
  },
  '@deepseek-ai/dsh-llm-pi-ai': {
    zh: 'pi-ai 支撑的 DeepSeek 适配器（设计验证孪生）。',
    en: 'pi-ai-backed DeepSeek adapter for the DeepSeek Harness LLM seam (design-verification twin of dsh-llm-deepseek)',
  },
  '@deepseek-ai/dsh-llm-retry': {
    zh: '按 provider 路由的 LLM 请求重试策略。',
    en: 'Provider-routed LLM request retry policy for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-message-feedback': {
    zh: '生命周期绑定的逐消息评分与备注侧车。',
    en: 'Lifecycle-bound per-message rating and note sidecar for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-repeat-tool-reminder': {
    zh: '重复工具调用守卫：agent 循环调用相同工具时的提醒。',
    en: 'Repeat-tool-call guard plugin: advisory reminders when an agent loops on identical tool calls',
  },
  '@deepseek-ai/dsh-sandbox-policy': {
    zh: '按调用沙箱策略解析器与当前模型上下文（模式/工作区根）。',
    en: 'Per-call sandbox policy resolver and current model context: deployment fallbacks plus each session\'s mode and workspace root, shared by every enforcing capability family',
  },
  '@deepseek-ai/dsh-session-checkpoint-policy': {
    zh: '语义化会话持久性检查点（模型请求与工具副作用之前）。',
    en: 'Semantic session durability checkpoints before model requests and tool side effects',
  },
  '@deepseek-ai/dsh-session-log-export': {
    zh: 'Web 会话日志导出命令与共享下载对话框。',
    en: 'Web Session-log export command and shared download dialog',
  },
  '@deepseek-ai/dsh-session-persistence-jsonl': {
    zh: 'JSONL 会话持久化后端（追加式日志）。',
    en: 'JSONL durable session persistence backend for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-session-projection': {
    zh: '会话投影接缝：可合并投影类型表、提供方契约与注册表。',
    en: 'Session-projection seam: the merge-extensible projection type table, the provider contract, and the ctx.sessionProjections registry serving whole current values of log-derived per-session state',
  },
  '@deepseek-ai/dsh-session-projection-cache': {
    zh: '持久化投影缓存：逐会话检查点、节流写回与冷读阶梯。',
    en: 'Persisted projection cache (ctx.sessionProjectionCache): durable per-session projection checkpoints over the domain data form, throttled write-behind, and the cold-read ladder (cache row + persistence tail replay)',
  },
  '@deepseek-ai/dsh-session-query-sqlite': {
    zh: 'ctx.sessionQuery 具体后端（SQLite FTS5 全文搜索）。',
    en: 'Concrete ctx.sessionQuery backend with SQLite FTS5 search',
  },
  '@deepseek-ai/dsh-session-stats': {
    zh: '全日志会话计数与墙钟耗时投影（sessionStats）。',
    en: 'Whole-log conversation counts and wall times projection (sessionStats) for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-session-telemetry-otel': {
    zh: 'OpenTelemetry 遥测后端：会话记录交给 OTel JS SDK 日志管线。',
    en: 'OpenTelemetry backend for the DeepSeek Harness telemetry seam: hands captured session records to the OTel JS SDK\'s log pipeline',
  },
  '@deepseek-ai/dsh-session-title': {
    zh: '日志支撑的会话标题服务与提供方注册表。',
    en: 'Log-backed session title service and provider registry for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-session-title-first-prompt-llm': {
    zh: '会话标题的首条消息 LLM 提供方。',
    en: 'First-message LLM provider plugin for DeepSeek Harness session titles',
  },
  '@deepseek-ai/dsh-shell-env': {
    zh: '与工具无关的受管 DSH_* 环境变量注册表。',
    en: 'Tool-independent managed DSH_* shell environment registry',
  },
  '@deepseek-ai/dsh-skill-badge': {
    zh: '内置 dsh badge 技能提供方。',
    en: 'Bundled dsh badge skill provider for DeepSeek Harness',
  },
  '@deepseek-ai/dsh-skill-filesystem': {
    zh: '本地文件系统技能提供方。',
    en: 'Local filesystem skill provider for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-spill-local': {
    zh: 'spill 存储接缝的本地文件系统实现（会话私有文件）。',
    en: 'Local-filesystem implementation of the DeepSeek Harness spill storage seam (private session-scoped files)',
  },
  '@deepseek-ai/dsh-spill-policy': {
    zh: '工具结果 spill 策略：超大纯文本结果替换为保留预览 + spill 文件路径。',
    en: 'Tool-result spill policy for the DeepSeek Harness — replaces oversized plain-text tool results with a retained preview plus a spill-file path (no service API)',
  },
  '@deepseek-ai/dsh-storage': {
    zh: '存储枢纽（ctx.storage）：命名后端注册表与挂载的数据形式设施。',
    en: 'Storage hub (ctx.storage): named backend registry plus mounted data-form facilities for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-storage-domain': {
    zh: '域数据形式（ctx.storage.domain）：schema 校验、事件发射的 KV 域。',
    en: 'Domain data form (ctx.storage.domain): schema-validated, event-emitting KV domains over storage backends for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-storage-json': {
    zh: '存储枢纽的 JSON 文件 KV 后端。',
    en: 'JSON file KV storage backend for the DeepSeek Harness storage hub',
  },
  '@deepseek-ai/dsh-subagent-fork-in-process': {
    zh: '进程内 fork 子代理后端：以父日志前缀种子运行子 agent。',
    en: 'In-process fork subagent backend: runs a child agent seeded with a prefix of the parent\'s log',
  },
  '@deepseek-ai/dsh-subagent-spawn-in-process': {
    zh: '进程内 spawn 子代理后端：在 ctx.agents 上运行全新子 agent。',
    en: 'In-process spawn subagent backend: runs a fresh child agent on ctx.agents',
  },
  '@deepseek-ai/dsh-subprocess-local': {
    zh: '子进程接缝的本地实现。',
    en: 'Local-subprocess implementation of the DeepSeek Harness subprocess seam',
  },
  '@deepseek-ai/dsh-system-prompt': {
    zh: '系统提示词组装注册表。',
    en: 'System prompt assembly registry for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-token-meter': {
    zh: '可重放的 token 计量服务（ctx.tokenMeter）。',
    en: 'Replay-aware token measurement service (ctx.tokenMeter) for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-tool-call-timeout-policy': {
    zh: '工具调用超时策略：tools/execute 包装器按 exec.signal 武装每工具时限。',
    en: 'Tool-call timeout policy: a tools/execute wrapper that arms a per-tool deadline on exec.signal and returns TOOL_TIMEOUT when it wins',
  },
  '@deepseek-ai/dsh-tool-fs-search': {
    zh: '模型可见的文件发现工具（glob/grep，内置 ripgrep）。',
    en: 'Model-facing filesystem discovery tools (glob, grep) backed by the packaged ripgrep binary (@vscode/ripgrep)',
  },
  '@deepseek-ai/dsh-tool-goal': {
    zh: '模型可见的同会话目标工具（执行时权限校验）。',
    en: 'Model-facing same-session goal tools with execution-time authority checks',
  },
  '@deepseek-ai/dsh-tool-jobs': {
    zh: '模型可见的后台任务控制工具（job_output/job_list/job_kill）。',
    en: 'Model-facing background job control tools (job_output, job_list, job_kill) over the ctx.jobs registry',
  },
  '@deepseek-ai/dsh-tool-ralph': {
    zh: '模型可见的全新 agent Ralph 循环（workflow 与 subagent 接缝之上）。',
    en: 'Model-facing fresh-agent Ralph loop over the workflow and subagent seams',
  },
  '@deepseek-ai/dsh-tool-skill': {
    zh: '模型可见的技能加载工具。',
    en: 'Model-facing skill loading tool for the DeepSeek Harness',
  },
  '@deepseek-ai/dsh-tool-str-replace-editor': {
    zh: '模型可见的查看/创建/字面替换/行插入工具。',
    en: 'Model-facing view, create, literal replace, and line insert tool over the Harness filesystem service',
  },
  '@deepseek-ai/dsh-tool-subagent': {
    zh: '模型可见的子代理委派工具（ctx.subagents）。',
    en: 'Model-facing subagent delegation tool over the ctx.subagents seam',
  },
  '@deepseek-ai/dsh-tool-subagent-control': {
    zh: '全局命名工具：send_message / interrupt_agent / list_agents。',
    en: 'Globally named send_message, interrupt_agent, and list_agents tools over ctx.subagents continuations',
  },
  '@deepseek-ai/dsh-tool-subagent-report': {
    zh: '子代理作用域的 report 工具。',
    en: 'Child-scoped report tool over ctx.subagents continuations',
  },
  '@deepseek-ai/dsh-tool-todo': {
    zh: '模型可见的 todo_write 工具（事件源会话日志之上）。',
    en: 'Model-facing todo_write tool over the DeepSeek Harness event-sourced session log',
  },
  '@deepseek-ai/dsh-tool-workflow': {
    zh: '模型可见的 workflow 工具：运行 JavaScript 编排脚本。',
    en: 'Model-facing workflow tool: run a JavaScript orchestration script over ctx.workflowEngine',
  },
  '@deepseek-ai/dsh-typert-loader': {
    zh: '生成型 Typert 包贡献的 loader 集成。',
    en: 'Loader integration for generated Typert package contributions',
  },
  '@deepseek-ai/dsh-typert-registry': {
    zh: '生成型包反射与 Zod schema 的运行时注册表。',
    en: 'Runtime registry for generated package reflection and Zod schemas',
  },
  '@deepseek-ai/dsh-user-approval': {
    zh: '用户审批接缝（ctx.approval）：一次性权限决策，默认 fail-closed。',
    en: 'User-approval seam (ctx.approval) for the DeepSeek Harness: one-shot permission decisions dispatched to composed answerers over the approval/request waterfall, fail-closed by default',
  },
  '@deepseek-ai/dsh-user-questions': {
    zh: '抽象用户提问接缝（ctx.userQuestions）：agent 运行中向人提问。',
    en: 'Abstract user-questions seam (ctx.userQuestions) for asking the human during agent runs',
  },
  '@deepseek-ai/dsh-web': {
    zh: '抽象 web 能力接缝（ctx.web）：搜索/抓取提供方注册表与错误分类。',
    en: 'Abstract web access capability seam (ctx.web) for the DeepSeek Harness — search/fetch provider registry, registration-order-independent selection, request/result vocabulary, and the WebError taxonomy',
  },
  '@deepseek-ai/dsh-web-search-deepseek': {
    zh: 'DeepSeek 支撑的搜索提供方（原生 web_search）。',
    en: 'DeepSeek-backed search provider (native web_search via the Anthropic-compatible API) for the DeepSeek Harness web capability seam (ctx.web)',
  },
  '@deepseek-ai/dsh-workflow-worker-thread': {
    zh: 'worker 线程 workflow 引擎：离线执行编排脚本，agent() 桥接回 ctx.subagents。',
    en: 'worker-thread workflow engine: executes model-written orchestration scripts off the host event loop, bridging agent() calls back to ctx.subagents',
  },
  '@deepseek-ai/dsh-workspace': {
    zh: '工作区实体注册表（ctx.workspaceRegistry）：持久化工作区记录与会话挂载校验。',
    en: 'Workspace entity registry (ctx.workspaceRegistry): durable workspace records with validated session attachment over the domain data form for the DeepSeek Harness',
  },
  '@deepseek-ai/cordis-plugin-timer': {
    zh: '定时器服务（Cordis 基础，热重载链依赖）。',
    en: 'Cordis timer service (part of the hot-reload chain).',
  },
  '@deepseek-ai/cordis-plugin-hmr': {
    zh: '配置热重载：补丁文件变更自动重组组合树。',
    en: 'Config hot-reload: recomposes the composition tree on patch-file changes.',
  },
  'cordis:include': {
    zh: 'dsh 内置配置加载器：读取 YAML/JSON 配置，组合插件与 patch，并支持热重载。',
    en: 'Built-in dsh config loader: reads YAML/JSON, composes plugins and patches, and supports hot reload.',
  },
  '@deepseek-ai/dsh-pwsh-sandbox': {
    zh: 'PowerShell 执行器沙箱实现：每条命令经 ctx.sandbox 约束并回报结果。',
    en: 'Sandbox-consuming implementation of the DeepSeek Harness PowerShell executor seam (confines every command via ctx.sandbox, reports denial/enforcement result facts)',
  },
  '@deepseek-ai/dsh-client-runtime': {
    zh: '客户端核心服务：SlotRegistry 与 SessionRuntime（作用域树 + 对象层）。',
    en: 'Client core services: SlotRegistry and SessionRuntime (scope tree + object layer).',
  },
}

/** Look up the curated description for one package. */
export function describe(packageName: string, lang: 'zh' | 'en'): string | null {
  const entry = DESCRIPTIONS[packageName]
  return entry === undefined ? null : entry[lang]
}
