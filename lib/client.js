window.__ModuleLoader__.load({ id: "dsh-plugin-manager", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/ManagerTab.tsx
var import_react = require("react");

// src/descriptions.ts
var DESCRIPTIONS = {
  "@deepseek-ai/dsh-base": {
    zh: "DSH \u5171\u4EAB\u6838\u5FC3\uFF1A\u6BCF\u4E2A profile \u7684\u7B2C\u4E00\u4E2A\u8865\u4E01\u5C42\uFF0C\u5411\u7A7A profile \u6839\u63D2\u5165\u57FA\u7840\u63D2\u4EF6\u884C\u3002",
    en: "The shared dsh core as a profile bundle: every profile's first patch layer, inserting the base plugin rows over the empty profile root."
  },
  "@deepseek-ai/dsh-web-app": {
    zh: "DSH \u6D4F\u89C8\u5668\u7AEF bundle\uFF1Aweb \u8865\u4E01\u5C42 + \u8FD0\u884C\u65F6\u80F6\u6C34\u63D2\u4EF6\uFF08\u524D\u7AEF\u9759\u6001\u670D\u52A1\u3001web \u63D0\u793A\u8BCD\u3001bash \u8FD0\u884C\u65F6\u53D8\u91CF\u3001URL \u884C\uFF09\u3002",
    en: "The dsh browser-surface bundle: the web patch layer over dsh-base plus the runtime glue plugin (frontend dist serving, web-surface prompt, bash runtime variables, URL line)."
  },
  "@deepseek-ai/dsh-plugin-console": {
    zh: "\u63D2\u4EF6\u63A7\u5236\u53F0\uFF08\u7B2C\u4E09\u65B9\uFF09\uFF1A\u4E00\u952E\u542F\u7528/\u505C\u7528\u63D2\u4EF6\uFF0C\u6D4F\u89C8\u5E76\u5B89\u88C5 GitHub dsh-plugin \u63D2\u4EF6\u3002",
    en: "Plugin console (third-party): one-click enable/disable of plugins, browse and install GitHub dsh-plugins."
  },
  "dsh-ding": {
    zh: "\u5BF9\u8BDD\u5B8C\u6210\u65F6\u64AD\u653E\u63D0\u793A\u97F3\u5E76\u53D1\u9001 Windows \u901A\u77E5\uFF1BWebUI \u94C3\u94DB\u6309\u94AE\u53EF\u8C03\u5F00\u5173/\u97F3\u91CF/\u97F3\u6548\u3002",
    en: "Plays a chime and sends Windows notifications when a conversation finishes; the WebUI bell button toggles sound, volume, and effects."
  },
  "@deepseek-ai/dsh-llm": {
    zh: "LLM \u8C03\u7528\u62BD\u8C61\uFF1Aprovider \u8DEF\u7531\u3001\u8BF7\u6C42/\u54CD\u5E94\u8BCD\u6C47\u3001\u7528\u91CF\u4E0E\u9519\u8BEF\u5206\u7C7B\u7684\u7EDF\u4E00\u5C42\u3002",
    en: "LLM abstraction: provider routing, request/result vocabulary, usage, and the error taxonomy."
  },
  "@deepseek-ai/dsh-session": {
    zh: "\u4F1A\u8BDD\u6838\u5FC3\uFF1A\u4F1A\u8BDD\u751F\u547D\u5468\u671F\u3001\u4E8B\u4EF6\u6D41\u4E0E\u6301\u4E45\u5316\u63A5\u53E3\u3002",
    en: "Session core: session lifecycle, event stream, and persistence interfaces."
  },
  "@deepseek-ai/dsh-agent": {
    zh: "Agent \u8FD0\u884C\u65F6\uFF1A\u8F6E\u6B21\u3001\u5DE5\u5177\u5FAA\u73AF\u3001\u6062\u590D\u4E0E\u91CD\u8BD5\u8BED\u4E49\u3002",
    en: "Agent runtime: turns, tool loop, recovery, and retry semantics."
  },
  "@deepseek-ai/dsh-tools": {
    zh: "\u5DE5\u5177\u6CE8\u518C\u8868\uFF1A\u6A21\u578B\u53EF\u89C1\u5DE5\u5177\u7684\u540D\u79F0\u3001\u63CF\u8FF0\u4E0E\u53C2\u6570 schema \u6C47\u603B\u3002",
    en: "The tool registry: names, descriptions, and JSON-Schema parameters of model-facing tools."
  },
  "@deepseek-ai/dsh-skill": {
    zh: "\u6280\u80FD\u7CFB\u7EDF\uFF1A\u6280\u80FD\u76EE\u5F55\u3001\u52A0\u8F7D\u4E0E\u6A21\u578B\u53EF\u8C03\u7528\u6027\u7BA1\u7406\u3002",
    en: "Skill system: skill catalog, loading, and model-invocability management."
  },
  "@deepseek-ai/dsh-subagent": {
    zh: "\u5B50\u4EE3\u7406\uFF1A\u72EC\u7ACB\u4E0A\u4E0B\u6587\u7684\u540E\u53F0\u59D4\u6258\uFF08spawn / fork / workflow\uFF09\u3002",
    en: "Subagents: background delegation with isolated contexts (spawn / fork / workflow)."
  },
  "@deepseek-ai/dsh-goal": {
    zh: "\u957F\u671F\u76EE\u6807\uFF1A\u4F1A\u8BDD\u5185\u6301\u4E45\u5316\u7684\u5B8C\u6210\u76EE\u6807\u53CA\u5176\u8F6E\u6B21\u9A71\u52A8\u3002",
    en: "Long-running goals: persisted same-session completion objectives and their round driver."
  },
  "@deepseek-ai/dsh-plan-mode": {
    zh: "\u8BA1\u5212\u6A21\u5F0F\uFF1A\u7EA6\u675F agent \u5148\u63A2\u7D22\u3001\u540E\u63D0\u4EA4\u8BA1\u5212\u3001\u83B7\u6279\u540E\u624D\u5B9E\u65BD\u3002",
    en: "Plan mode: constrains the agent to explore first, submit a plan, and implement only after approval."
  },
  "@deepseek-ai/dsh-credentials-local": {
    zh: "\u51ED\u636E\u5B58\u50A8\uFF1A\u73AF\u5883\u53D8\u91CF\u5F15\u7528\u7684\u6258\u7BA1\u5BC6\u94A5\u6587\u6863\uFF08.credentials.yaml\uFF09\uFF0C\u6309\u8BF7\u6C42\u89E3\u6790\u3002",
    en: "Credential store: managed secret document referenced by environment variables, resolved per request."
  },
  "@deepseek-ai/dsh-settings-file": {
    zh: "\u7528\u6237\u8BBE\u7F6E\uFF1A$DSH_HOME/settings.yaml \u5206\u5C42\u6587\u6863\uFF0C\u70ED\u91CD\u8F7D\u3002",
    en: "User settings: the layered $DSH_HOME/settings.yaml document, hot-reloaded."
  },
  "@deepseek-ai/dsh-sandbox-local": {
    zh: "\u6587\u4EF6\u6C99\u7BB1\uFF1A\u8FDB\u7A0B\u5185\u6587\u4EF6\u7CFB\u7EDF\u8BBF\u95EE\u8FB9\u754C\uFF08\u8BFB/\u5199/\u5168\u6743\u9650\uFF09\u3002",
    en: "File sandbox: in-process filesystem access boundary (read-only / workspace-write / full)."
  },
  "@deepseek-ai/dsh-permission-presets": {
    zh: "\u6743\u9650\u9884\u8BBE\uFF1Asandbox \u6A21\u5F0F\u4E0E\u5BA1\u6279\u7B56\u7565\u7684\u7EC4\u5408\u9884\u8BBE\uFF08read-only / workspace-write / danger-full-access\uFF09\u3002",
    en: "Permission presets: sandbox-mode and approval-policy combinations (read-only / workspace-write / danger-full-access)."
  },
  "@deepseek-ai/dsh-tool-bash": {
    zh: "Bash \u5DE5\u5177\uFF1A\u6A21\u578B\u53EF\u8C03\u7528\u7684 shell \u6267\u884C\uFF08\u7C7B Unix \u5E73\u53F0\uFF09\u3002",
    en: "Bash tool: model-callable shell execution (Unix-like platforms)."
  },
  "@deepseek-ai/dsh-tool-pwsh": {
    zh: "PowerShell \u5DE5\u5177\uFF1A\u6A21\u578B\u53EF\u8C03\u7528\u7684 PowerShell \u6267\u884C\uFF08Windows \u5E73\u53F0\uFF09\u3002",
    en: "PowerShell tool: model-callable PowerShell execution (Windows platform)."
  },
  "@deepseek-ai/dsh-tool-fs": {
    zh: "\u6587\u4EF6\u7CFB\u7EDF\u5DE5\u5177\uFF1A\u8BFB\u5199/\u7F16\u8F91/\u5217\u76EE\u5F55\u7B49\u6A21\u578B\u53EF\u89C1\u6587\u4EF6\u64CD\u4F5C\u3002",
    en: "Filesystem tools: model-visible file operations \u2014 read, write, edit, and directory listing."
  },
  "@deepseek-ai/dsh-tool-web": {
    zh: "Web \u5DE5\u5177\uFF1A\u6A21\u578B\u53EF\u8C03\u7528\u7684 web_search\uFF08DeepSeek \u68C0\u7D22\uFF09\u3002",
    en: "Web tool: model-callable web search over the DeepSeek retrieval route."
  },
  "@deepseek-ai/dsh-host-webserver": {
    zh: "Web \u670D\u52A1\uFF1Anode:http \u670D\u52A1\u5668\u4E0E\u73AF\u56DE HTTP \u8DEF\u7531\u6CE8\u518C\u8868\u3002",
    en: "Web server: the node:http server and loopback HTTP route registry."
  },
  "@deepseek-ai/dsh-host-plugin-inventory": {
    zh: "\u63D2\u4EF6\u6E05\u5355\uFF1A\u5411\u53D7\u4FE1\u5BA2\u6237\u7AEF\u66B4\u9732\u5F53\u524D Loader \u6761\u76EE\u7684\u53EA\u8BFB\u6295\u5F71\u3002",
    en: "Plugin inventory: the read-only projection of current Loader entries exposed to trusted clients."
  },
  "@deepseek-ai/dsh-client-ui-settings": {
    zh: "\u8BBE\u7F6E\u57DF\u57FA\u7840\uFF1A\u8BBE\u7F6E\u547D\u540D\u7A7A\u95F4\u4F5C\u7528\u57DF\u670D\u52A1\u4E0E\u8BBE\u7F6E\u63D2\u69FD\u7C7B\u578B\u5951\u7EA6\u3002",
    en: "Settings domain base: the settings-namespace scope service and the canonical settings slot-type contract."
  },
  "@deepseek-ai/dsh-client-ui-conversation": {
    zh: "\u5BF9\u8BDD\u57DF\uFF1A\u9AA8\u67B6\u3001\u6709\u5E8F\u804A\u5929\u6D41\u3001\u4E0E\u5BBF\u4E3B\u8054\u52A8 busy-Enter \u504F\u597D\u7684\u8F93\u5165\u680F\u3002",
    en: "Conversation domain: skeleton, ordered chat flow, and the composer with the Host-backed busy-Enter preference."
  },
  "@deepseek-ai/dsh-client-ui-sidebar": {
    zh: "\u4FA7\u8FB9\u680F\uFF1A\u4F1A\u8BDD/\u5DE5\u4F5C\u533A\u5BFC\u822A\u4E0E\u8BBE\u7F6E\u5165\u53E3\u3002",
    en: "Sidebar: session and workspace navigation plus the settings entry."
  },
  "@deepseek-ai/dsh-client-locale": {
    zh: "\u56FD\u9645\u5316\uFF1A\u8BED\u8A00\u5FEB\u7167\u3001\u5B57\u5178\u6CE8\u518C\u4E0E\u7ED1\u5B9A\u3002",
    en: "Localization: language snapshot, dictionary registration, and binding."
  },
  "@deepseek-ai/dsh-agent-default-model": {
    zh: "\u9ED8\u8BA4\u6A21\u578B\u9009\u62E9\uFF1AAgent \u5165\u53E3\u5171\u4EAB\u7684\u9ED8\u8BA4 provider/model\u3002",
    en: "Default model selection shared by Agent entry points"
  },
  "@deepseek-ai/dsh-agent-instructions": {
    zh: "\u5DE5\u4F5C\u533A\u4E0A\u4E0B\u6587\u52A0\u8F7D\u5668\uFF1A\u8BFB\u53D6 AGENTS.md/CLAUDE.md \u6307\u4EE4\u6587\u4EF6\u3002",
    en: "Workspace context loader for AGENTS.md/CLAUDE.md instruction files"
  },
  "@deepseek-ai/dsh-agent-loop": {
    zh: "\u5177\u4F53 agent \u5FAA\u73AF\u63D2\u4EF6\uFF1A\u9A71\u52A8\u5BF9\u8BDD\u8F6E\u6B21\u3002",
    en: "The concrete agent loop plugin for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-agent-presets": {
    zh: "\u9884\u8BBE\u7EC4\u5408\uFF1A\u6309 preset cordis.yml \u7EC4\u5408\u6BCF\u4E2A\u4F1A\u8BDD\u7684 agent \u6784\u6210\u3002",
    en: "Per-session agent composition from preset cordis.yml files for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-api-gateway": {
    zh: "API \u7F51\u5173\uFF1ATypert Remote \u5BBF\u4E3B\u5206\u53D1\u4E0E\u5BA2\u6237\u7AEF API \u7AEF\u70B9\u3002",
    en: "Typert Remote Host dispatcher and Client API endpoint"
  },
  "@deepseek-ai/dsh-api-remotes": {
    zh: "\u8FDC\u7A0B BFF \u7EC4\u88C5\u4E0E\u5BBF\u4E3B Agent/\u4F1A\u8BDD\u67E5\u8BE2\u7B56\u7565\u3002",
    en: "Remote BFF assembly and Host Agent/Session lookup policy"
  },
  "@deepseek-ai/dsh-attachment-local": {
    zh: "\u79C1\u6709\u5185\u5BB9\u5BFB\u5740\u9644\u4EF6\u5B58\u50A8\uFF08$DSH_HOME \u5185\uFF09\u3002",
    en: "Private content-addressed DSH_HOME attachment storage"
  },
  "@deepseek-ai/dsh-bash-sandbox": {
    zh: "bash \u6267\u884C\u5668\u6C99\u7BB1\u5B9E\u73B0\uFF1A\u6BCF\u6761\u547D\u4EE4\u7ECF ctx.sandbox \u7EA6\u675F\u5E76\u56DE\u62A5\u7ED3\u679C\u3002",
    en: "Sandbox-consuming implementation of the DeepSeek Harness bash executor seam (confines every command via ctx.sandbox, reports denial/enforcement result facts)"
  },
  "@deepseek-ai/dsh-client-connection": {
    zh: "\u8FDE\u63A5\u5C42\uFF1AHTTP \u4E0A\u884C/WebSocket \u4E0B\u884C\u5BA2\u6237\u7AEF\uFF0C\u53CC\u6D41\u91CD\u8FDE\u63A7\u5236\u5668\u3002",
    en: "Wire consumer layer: HTTP-up/WebSocket-down client, ConnectionController dual streams with reconnect, and fixture api"
  },
  "@deepseek-ai/dsh-client-hmr": {
    zh: "\u5F00\u53D1\u671F\u70ED\u91CD\u8F7D\uFF1ASSE \u91CD\u5EFA\u5E27 \u2192 \u5931\u6548/\u9884\u53D6 \u2192 fiber \u4EA4\u6362\u3002",
    en: "Dev-only hot-reload driver for script-loaded client entries: SSE rebuilt frames \u2192 invalidate/prefetch \u2192 fiber swap through the vendored Loader entry"
  },
  "@deepseek-ai/dsh-client-modules": {
    zh: "\u5BA2\u6237\u7AEF\u6A21\u5757\u7CFB\u7EDF\uFF1Anode \u4FA7\u7EC4\u88C5 __DSH_BOOT__ \u5165\u53E3\u56FE\uFF1B\u6D4F\u89C8\u5668\u4FA7\u4E3A\u61D2\u52A0\u8F7D CJS \u6A21\u5757\u8868\u3002",
    en: "Client module system, dual-face: node half composes the __DSH_BOOT__ entry graph (incremental dsh.client scan, bundle route, index tap, webPlugins service); browser half is the lazy-CJS module table the vendored cordis Loader consumes as its internal seam"
  },
  "@deepseek-ai/dsh-client-ui-agent-preset": {
    zh: "Agent \u9884\u8BBE\u754C\u9762\uFF1A\u540E\u7EED\u4F1A\u8BDD\u9ED8\u8BA4\u3001\u5F53\u524D\u4F1A\u8BDD\u5EA7\u4F4D\u4E0E\u7EC4\u5408\u7F16\u8F91\u5668\u3002",
    en: "Agent-preset surfaces: the default for later sessions, this session's seat, and the composition editor"
  },
  "@deepseek-ai/dsh-client-ui-commands": {
    zh: '\u5BA2\u6237\u7AEF\u547D\u4EE4\u9762\uFF1A\u5168\u5C40\u76EE\u5F55\u7F13\u5B58\u3001"/"\u6765\u6E90\u3001\u4E09\u7C7B\u547D\u4EE4 UI\u3002',
    en: "Client command surface: global directory cache, '/' source, three command UI kinds, popupSelect registry"
  },
  "@deepseek-ai/dsh-client-ui-cordis": {
    zh: "Cordis \u52A8\u6001\u63D2\u4EF6\u5B9A\u4E49\u5361\u7247\uFF1Acordis_define \u5DE5\u5177\u884C\u53CA\u5176\u8FD0\u884C/\u505C\u6B62\u5F00\u5173\u3002",
    en: "Cordis dynamic-plugin definition card: the keyed cordis_define tool row with its run/stop switch"
  },
  "@deepseek-ai/dsh-client-ui-deliverables": {
    zh: "\u4EA7\u7269\u6587\u4EF6\u5C55\u793A\uFF1A\u8F6E\u6B21\u5C3E\u90E8\u4EA7\u7269\u4E0E\u53EF\u70B9\u51FB\u7684\u6700\u7EC8\u54CD\u5E94\u6587\u4EF6\u5F15\u7528\u3002",
    en: "Produced-files turn tail and clickable final-response file references for Web"
  },
  "@deepseek-ai/dsh-client-ui-goal": {
    zh: "\u4F1A\u8BDD\u76EE\u6807\u6761\uFF1A\u505C\u9760\u5728\u8F93\u5165\u680F\u4E0A\u65B9\u7684 GoalBar\uFF0C\u8BFB\u81EA\u76EE\u6807\u6295\u5F71\u3002",
    en: "Session goal surface: GoalBar docked above the composer, read from the goal session projection"
  },
  "@deepseek-ai/dsh-client-ui-input-trigger": {
    zh: '\u8F93\u5165\u89E6\u53D1\u7BA1\u7EBF\uFF1A"/"\u4E0E"@"\u68C0\u6D4B\u3001\u5019\u9009\u83DC\u5355\u4E0E\u6765\u6E90\u8DEF\u7531\u3002',
    en: "Input trigger pipeline: '/' and '@' detection, candidate menu, pick routing to registered sources"
  },
  "@deepseek-ai/dsh-client-ui-jobs": {
    zh: "\u4F1A\u8BDD\u5934\u540E\u53F0\u4EFB\u52A1\u5217\u8868\uFF1A\u4ECE session/jobs \u5E27\u955C\u50CF\u5B9E\u65F6\u72B6\u6001\u3002",
    en: "Session-header background-job list: live registry state mirrored from session/jobs frames"
  },
  "@deepseek-ai/dsh-client-ui-layout": {
    zh: "\u5916\u58F3\u63D2\u4EF6\uFF1A\u4E09\u680F AppFrame \u62D6\u62FD\u624B\u67C4\u4E0E\u5E03\u5C40\u89C6\u56FE\u72B6\u6001\u670D\u52A1\u3002",
    en: "Shell plugin: three-column AppFrame with drag handles, ctx.layout viewing-state service (navigation + panels)"
  },
  "@deepseek-ai/dsh-client-ui-message-feedback": {
    zh: "\u6D88\u606F\u53CD\u9988\uFF1A\u52A9\u624B\u6D88\u606F\u64CD\u4F5C\u6761\u4E0A\u7684\u8BC4\u5206\u63A7\u4EF6\u3002",
    en: "Per-message feedback controls contributed to the assistant-message action strip, backed by the messageFeedback Host Remote"
  },
  "@deepseek-ai/dsh-client-ui-model-selection": {
    zh: "\u6A21\u578B\u9009\u62E9\uFF1A/model \u5F39\u51FA\u9009\u62E9\u3002",
    en: "Model selection: the /model popupSelect over session.models / session.selectModel"
  },
  "@deepseek-ai/dsh-client-ui-permission-presets": {
    zh: "\u6743\u9650\u754C\u9762\uFF1A\u65B0\u4F1A\u8BDD\u9ED8\u8BA4\uFF08General \u8BBE\u7F6E\uFF09\u4E0E\u5F53\u524D\u4F1A\u8BDD /permission \u5F39\u7A97\u3002",
    en: "Permission surfaces: a new-session default in General settings and a current-session /permission popup over the permissions projection"
  },
  "@deepseek-ai/dsh-client-ui-plan": {
    zh: "\u8BA1\u5212\u6A21\u5F0F\u8F93\u5165\u63A7\u4EF6\uFF1Aconversation.input.plan \u5EA7\u4F4D\u4E0E /plan \u547D\u4EE4\u901A\u9053\u3002",
    en: "Plan-mode composer control: the conversation.input.plan seat over the plan projection and the /plan command channel"
  },
  "@deepseek-ai/dsh-client-ui-settings-general": {
    zh: "\u8BBE\u7F6E\u5916\u58F3\u4E0E\u5F15\u5BFC\uFF1AGeneral \u5206\u533A\u3001\u89E6\u53D1/\u6807\u9898 chrome\u3001\u5B57\u5178\u4E0E\u7248\u672C\u5316\u6B22\u8FCE\u63D0\u793A\u3002",
    en: "Settings ownerless-copy and product onboarding plugin: the General section, shell trigger/header chrome content, settings dictionaries, and the versioned welcome notice"
  },
  "@deepseek-ai/dsh-client-ui-settings-models": {
    zh: "\u6A21\u578B\u8BBE\u7F6E\u4E0E\u5171\u4EAB\u5F15\u5BFC\u5BF9\u8BDD\u6846\uFF08\u8BBE\u7F6E\u4E0E\u51ED\u636E\u5173\u8054\uFF09\u3002",
    en: "Models settings and shared product-onboarding dialogs over existing settings and credential joins"
  },
  "@deepseek-ai/dsh-client-ui-settings-plugin-inventory": {
    zh: '\u51FA\u5382"\u63D2\u4EF6\u5217\u8868"Tab\uFF1AWeb \u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u7684\u53EA\u8BFB Loader \u6E05\u5355\u3002',
    en: "Read-only Cordis Loader inventory tab in Web Plugins settings"
  },
  "@deepseek-ai/dsh-client-ui-settings-plugins": {
    zh: "\u63D2\u4EF6\u8BBE\u7F6E\u5206\u533A\uFF1A\u529F\u80FD\u81EA\u6709 Tab \u4E0E\u53EF\u914D\u7F6E\u5BBF\u4E3B\u63D2\u4EF6\u5361\u7247\u3002",
    en: "Plugins settings section with feature-owned tabs and configurable host-plane plugin cards"
  },
  "@deepseek-ai/dsh-client-ui-skill": {
    zh: "Web \u6280\u80FD\u5F15\u7528\u4E0E\u4E13\u5C5E\u6280\u80FD\u5DE5\u5177\u884C\u3002",
    en: "Web skill references and the dedicated skill tool row"
  },
  "@deepseek-ai/dsh-client-ui-subagent": {
    zh: '\u5B50\u4EE3\u7406\u4F1A\u8BDD\u76EE\u5F55\u3001\u7EED\u8DD1\u8DEF\u7531 UI \u4E0E"@"\u5F15\u7528\u6765\u6E90\u3002',
    en: "Subagent conversation catalog, continuation routing UI, and '@' reference source"
  },
  "@deepseek-ai/dsh-client-ui-theme": {
    zh: "\u4E3B\u9898\uFF1A\u9884\u63D2\u4EF6\u8C03\u8272\u677F\u5BBF\u4E3B\u5F15\u5BFC\u3001\u65E0 DOM ThemeRuntime\u3001--dsw-* token \u4E0E\u5916\u89C2\u8BBE\u7F6E\u884C\u3002",
    en: "Theme plugin: Host bootstrap for the pre-plugin palette; DOM-free ThemeRuntime for light/dark/system state; --dsw-* token styles and Appearance settings row"
  },
  "@deepseek-ai/dsh-client-ui-tool": {
    zh: "\u5BA2\u6237\u7AEF\u5DE5\u5177\u8C03\u7528\u6811\u6E32\u67D3\u5668\u4E0E\u6309\u5DE5\u5177\u5448\u73B0\u63D2\u69FD\u3002",
    en: "Client Tool call-tree renderer and keyed per-tool presentation slot"
  },
  "@deepseek-ai/dsh-client-ui-trajectory": {
    zh: "\u8F68\u8FF9\u4E8B\u4EF6\u53F0\u8D26\u4E0E\u4EA4\u4E92\u5F0F\u65F6\u5E8F\u6982\u89C8\uFF08\u7EAF\u6D88\u8D39\u63D2\u4EF6\uFF09\u3002",
    en: "Trajectory event ledger with an interactive timing overview: pure-consumer plugin registering into the conversation ViewMap (no service)"
  },
  "@deepseek-ai/dsh-client-ui-user-questions": {
    zh: "Web ask_user_question\uFF1A\u5BBF\u4E3B\u5DE5\u5177\u6302\u8F7D + \u63A5\u7BA1\u8F93\u5165\u6846\u7684\u63D0\u95EE UI\u3002",
    en: "Web ask_user_question feature: host tool mount plus composer-takeover question UI"
  },
  "@deepseek-ai/dsh-client-ui-workflow-run": {
    zh: "\u6301\u4E45\u5316 workflow-run \u4F1A\u8BDD\u8282\u70B9\u4E0E\u5D4C\u5957\u6210\u5458\u5C55\u793A\u3002",
    en: "Durable workflow-run Conversation Node and nested member disclosure for dsh web"
  },
  "@deepseek-ai/dsh-client-ui-workspace": {
    zh: "\u5DE5\u4F5C\u533A\u9009\u62E9\u5668\uFF1A\u6CE8\u518C\u8FDB\u4FA7\u8FB9\u680F\u4E0E\u7A7A\u72B6\u6001\u63D2\u69FD\u3002",
    en: "Workspace picker plugin: one WorkspacePicker registered into the sidebar and empty-state workspace slots"
  },
  "@deepseek-ai/dsh-code-runtime-worker-thread": {
    zh: "\u4EE3\u7801\u6267\u884C\u63A5\u7F1D\u7684 worker \u7EBF\u7A0B\u5B9E\u73B0\u3002",
    en: "Worker-thread implementation of the DeepSeek Harness code-execution seam"
  },
  "@deepseek-ai/dsh-command-compact": {
    zh: "\u9762\u5411\u4EBA\u7684 /compact \u659C\u6760\u547D\u4EE4\uFF08\u663E\u5F0F\u538B\u7F29\u4F1A\u8BDD\uFF09\u3002",
    en: "Human-facing slash command for explicit session compaction"
  },
  "@deepseek-ai/dsh-command-feedback": {
    zh: "\u53EA\u8BB0\u5F55\u4F1A\u8BDD\u53CD\u9988\u7684\u751F\u6210\u5668\u4E0E\u9762\u5411\u4EBA\u7684\u659C\u6760\u547D\u4EE4\u3002",
    en: "Log-only session feedback producer and human-facing slash command"
  },
  "@deepseek-ai/dsh-command-goal": {
    zh: "\u9762\u5411\u4EBA\u7684 /goal \u659C\u6760\u547D\u4EE4\uFF08\u6301\u4E45\u5316\u540C\u4F1A\u8BDD\u76EE\u6807\uFF09\u3002",
    en: "Human-facing slash command for persisted same-session goals"
  },
  "@deepseek-ai/dsh-commands": {
    zh: "\u63D2\u4EF6\u62E5\u6709\u7684\u9762\u5411\u4EBA\u547D\u4EE4\u6CE8\u518C\u8868\uFF08DSH UI \u4F7F\u7528\uFF09\u3002",
    en: "Plugin-owned human command registry for DeepSeek Harness UIs"
  },
  "@deepseek-ai/dsh-compaction-basic": {
    zh: "\u57FA\u4E8E token \u8BA1\u91CF\u7684\u538B\u7F29\u7B56\u7565\u4E0E LLM \u6458\u8981\u540E\u7AEF\u3002",
    en: "Token-meter-driven compaction policy and LLM summarization backend for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-compaction-tool-result-pruner": {
    zh: "\u5DE5\u5177\u7ED3\u679C\u4FEE\u526A\uFF1A\u53EF\u91CD\u653E\u7684\u514D\u6A21\u578B\u5934/\u4E2D/\u5C3E\u88C1\u526A\u3002",
    en: "Replay-safe model-free head/middle/tail pruning for tool-result surface nodes"
  },
  "@deepseek-ai/dsh-cordis-client-runner": {
    zh: "\u53CC\u534A\u63D2\u4EF6\u5305\u7684\u6D4F\u89C8\u5668\u534A\uFF1A\u4E8B\u4EF6\u8BA2\u9605\u3001\u95ED\u5305\u6C42\u503C\u3001\u5B88\u536B\u95E8\u9762\u4E0E loader \u6761\u76EE\u3002",
    en: "Browser half of dynamic dual-half plugin packages: event subscription, closure evaluation, guard facade, and loader entries"
  },
  "@deepseek-ai/dsh-cordis-host-runner": {
    zh: "\u53CC\u534A\u63D2\u4EF6\u5305\u5BBF\u4E3B\uFF1A\u52A8\u6001\u5305\u5B9A\u4E49\u6CE8\u518C\u3001\u5BBF\u4E3B\u534A\u6C99\u7BB1\u751F\u547D\u5468\u671F\u4E0E invoke \u8868\u3002",
    en: "Dynamic package definition registry, host-half sandbox lifecycle, and invoke handler table for model-mounted dual-half packages"
  },
  "@deepseek-ai/dsh-fs-observation-policy": {
    zh: "\u6587\u4EF6\u4E0A\u4E0B\u6587\u7B56\u7565\uFF1A\u89C2\u5BDF\u6001\u3001\u7F16\u8F91\u524D\u5148\u8BFB\u3001\u7248\u672C\u5B88\u536B\u7684\u5199/\u6539\u3002",
    en: "File-context policy plugin for the DeepSeek Harness \u2014 observed-state, read-before-edit, and version-guarded write/edit added over the ctx.fs provider seam through the fs/* event gate (no service API)"
  },
  "@deepseek-ai/dsh-fs-sandbox": {
    zh: "\u6C99\u7BB1\u5F3A\u5236\u6587\u4EF6\u7CFB\u7EDF\u540E\u7AEF\uFF1A\u6309\u8C03\u7528\u6C99\u7BB1\u6A21\u5F0F\u56F4\u680F\u5199/\u6539\uFF0C\u8BFB\u653E\u884C\u3002",
    en: "Sandbox-enforcing implementation of the DeepSeek Harness filesystem seam: fences write/edit by the per-call sandbox mode (read-only denies mutation, workspace-write contains it to the workspace + temp roots) while reads pass through"
  },
  "@deepseek-ai/dsh-goal-round-driver": {
    zh: "\u7ADE\u6001\u9632\u62A4\u7684\u540C\u4F1A\u8BDD\u76EE\u6807\u8F6E\u6B21\u9A71\u52A8\u3002",
    en: "Race-fenced same-session goal-round driver"
  },
  "@deepseek-ai/dsh-host-apiproxy": {
    zh: "API \u7F51\u5173\uFF1AApiProxy \u5951\u7EA6\uFF08api/\uFF09\u3001fetch \u8F7D\u4F53\u5BF9\uFF08fetch/\uFF09\u4E0E ctx.apiProxy \u5BBF\u4E3B\u63D2\u4EF6\u3002",
    en: "API gateway: the ApiProxy contract (api/), the fetch carrier pair (fetch/), and the host-side gateway plugin providing ctx.apiProxy"
  },
  "@deepseek-ai/dsh-host-directory-picker-auto": {
    zh: "\u76EE\u5F55\u9009\u62E9\u5668\u81EA\u9002\u5E94\u9009\u62E9\uFF1A\u542F\u52A8\u65F6\u89E3\u6790\u5BBF\u4E3B\u73AF\u5883\u5E76\u6302\u8F7D\u539F\u751F\u6216\u6D4F\u89C8\u540E\u7AEF\u3002",
    en: "Adaptive chooser of the directory-picker seam: resolves the host situation at boot and mounts the native or browse backend for the DeepSeek Harness web GUI host"
  },
  "@deepseek-ai/dsh-jobs-local": {
    zh: "\u540E\u53F0\u4EFB\u52A1\u6CE8\u518C\u8868\u63A5\u7F1D\u7684\u8FDB\u7A0B\u5185\u5B9E\u73B0\u3002",
    en: "Process-local implementation of the DeepSeek Harness background job registry seam"
  },
  "@deepseek-ai/dsh-llm-deepseek": {
    zh: "DeepSeek chat-completions \u9002\u914D\u5668\u3002",
    en: "DeepSeek chat-completions adapter for the DeepSeek Harness LLM seam"
  },
  "@deepseek-ai/dsh-llm-pi-ai": {
    zh: "pi-ai \u652F\u6491\u7684 DeepSeek \u9002\u914D\u5668\uFF08\u8BBE\u8BA1\u9A8C\u8BC1\u5B6A\u751F\uFF09\u3002",
    en: "pi-ai-backed DeepSeek adapter for the DeepSeek Harness LLM seam (design-verification twin of dsh-llm-deepseek)"
  },
  "@deepseek-ai/dsh-llm-retry": {
    zh: "\u6309 provider \u8DEF\u7531\u7684 LLM \u8BF7\u6C42\u91CD\u8BD5\u7B56\u7565\u3002",
    en: "Provider-routed LLM request retry policy for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-message-feedback": {
    zh: "\u751F\u547D\u5468\u671F\u7ED1\u5B9A\u7684\u9010\u6D88\u606F\u8BC4\u5206\u4E0E\u5907\u6CE8\u4FA7\u8F66\u3002",
    en: "Lifecycle-bound per-message rating and note sidecar for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-repeat-tool-reminder": {
    zh: "\u91CD\u590D\u5DE5\u5177\u8C03\u7528\u5B88\u536B\uFF1Aagent \u5FAA\u73AF\u8C03\u7528\u76F8\u540C\u5DE5\u5177\u65F6\u7684\u63D0\u9192\u3002",
    en: "Repeat-tool-call guard plugin: advisory reminders when an agent loops on identical tool calls"
  },
  "@deepseek-ai/dsh-sandbox-policy": {
    zh: "\u6309\u8C03\u7528\u6C99\u7BB1\u7B56\u7565\u89E3\u6790\u5668\u4E0E\u5F53\u524D\u6A21\u578B\u4E0A\u4E0B\u6587\uFF08\u6A21\u5F0F/\u5DE5\u4F5C\u533A\u6839\uFF09\u3002",
    en: "Per-call sandbox policy resolver and current model context: deployment fallbacks plus each session's mode and workspace root, shared by every enforcing capability family"
  },
  "@deepseek-ai/dsh-session-checkpoint-policy": {
    zh: "\u8BED\u4E49\u5316\u4F1A\u8BDD\u6301\u4E45\u6027\u68C0\u67E5\u70B9\uFF08\u6A21\u578B\u8BF7\u6C42\u4E0E\u5DE5\u5177\u526F\u4F5C\u7528\u4E4B\u524D\uFF09\u3002",
    en: "Semantic session durability checkpoints before model requests and tool side effects"
  },
  "@deepseek-ai/dsh-session-log-export": {
    zh: "Web \u4F1A\u8BDD\u65E5\u5FD7\u5BFC\u51FA\u547D\u4EE4\u4E0E\u5171\u4EAB\u4E0B\u8F7D\u5BF9\u8BDD\u6846\u3002",
    en: "Web Session-log export command and shared download dialog"
  },
  "@deepseek-ai/dsh-session-persistence-jsonl": {
    zh: "JSONL \u4F1A\u8BDD\u6301\u4E45\u5316\u540E\u7AEF\uFF08\u8FFD\u52A0\u5F0F\u65E5\u5FD7\uFF09\u3002",
    en: "JSONL durable session persistence backend for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-session-projection": {
    zh: "\u4F1A\u8BDD\u6295\u5F71\u63A5\u7F1D\uFF1A\u53EF\u5408\u5E76\u6295\u5F71\u7C7B\u578B\u8868\u3001\u63D0\u4F9B\u65B9\u5951\u7EA6\u4E0E\u6CE8\u518C\u8868\u3002",
    en: "Session-projection seam: the merge-extensible projection type table, the provider contract, and the ctx.sessionProjections registry serving whole current values of log-derived per-session state"
  },
  "@deepseek-ai/dsh-session-projection-cache": {
    zh: "\u6301\u4E45\u5316\u6295\u5F71\u7F13\u5B58\uFF1A\u9010\u4F1A\u8BDD\u68C0\u67E5\u70B9\u3001\u8282\u6D41\u5199\u56DE\u4E0E\u51B7\u8BFB\u9636\u68AF\u3002",
    en: "Persisted projection cache (ctx.sessionProjectionCache): durable per-session projection checkpoints over the domain data form, throttled write-behind, and the cold-read ladder (cache row + persistence tail replay)"
  },
  "@deepseek-ai/dsh-session-query-sqlite": {
    zh: "ctx.sessionQuery \u5177\u4F53\u540E\u7AEF\uFF08SQLite FTS5 \u5168\u6587\u641C\u7D22\uFF09\u3002",
    en: "Concrete ctx.sessionQuery backend with SQLite FTS5 search"
  },
  "@deepseek-ai/dsh-session-stats": {
    zh: "\u5168\u65E5\u5FD7\u4F1A\u8BDD\u8BA1\u6570\u4E0E\u5899\u949F\u8017\u65F6\u6295\u5F71\uFF08sessionStats\uFF09\u3002",
    en: "Whole-log conversation counts and wall times projection (sessionStats) for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-session-telemetry-otel": {
    zh: "OpenTelemetry \u9065\u6D4B\u540E\u7AEF\uFF1A\u4F1A\u8BDD\u8BB0\u5F55\u4EA4\u7ED9 OTel JS SDK \u65E5\u5FD7\u7BA1\u7EBF\u3002",
    en: "OpenTelemetry backend for the DeepSeek Harness telemetry seam: hands captured session records to the OTel JS SDK's log pipeline"
  },
  "@deepseek-ai/dsh-session-title": {
    zh: "\u65E5\u5FD7\u652F\u6491\u7684\u4F1A\u8BDD\u6807\u9898\u670D\u52A1\u4E0E\u63D0\u4F9B\u65B9\u6CE8\u518C\u8868\u3002",
    en: "Log-backed session title service and provider registry for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-session-title-first-prompt-llm": {
    zh: "\u4F1A\u8BDD\u6807\u9898\u7684\u9996\u6761\u6D88\u606F LLM \u63D0\u4F9B\u65B9\u3002",
    en: "First-message LLM provider plugin for DeepSeek Harness session titles"
  },
  "@deepseek-ai/dsh-shell-env": {
    zh: "\u4E0E\u5DE5\u5177\u65E0\u5173\u7684\u53D7\u7BA1 DSH_* \u73AF\u5883\u53D8\u91CF\u6CE8\u518C\u8868\u3002",
    en: "Tool-independent managed DSH_* shell environment registry"
  },
  "@deepseek-ai/dsh-skill-badge": {
    zh: "\u5185\u7F6E dsh badge \u6280\u80FD\u63D0\u4F9B\u65B9\u3002",
    en: "Bundled dsh badge skill provider for DeepSeek Harness"
  },
  "@deepseek-ai/dsh-skill-filesystem": {
    zh: "\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\u6280\u80FD\u63D0\u4F9B\u65B9\u3002",
    en: "Local filesystem skill provider for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-spill-local": {
    zh: "spill \u5B58\u50A8\u63A5\u7F1D\u7684\u672C\u5730\u6587\u4EF6\u7CFB\u7EDF\u5B9E\u73B0\uFF08\u4F1A\u8BDD\u79C1\u6709\u6587\u4EF6\uFF09\u3002",
    en: "Local-filesystem implementation of the DeepSeek Harness spill storage seam (private session-scoped files)"
  },
  "@deepseek-ai/dsh-spill-policy": {
    zh: "\u5DE5\u5177\u7ED3\u679C spill \u7B56\u7565\uFF1A\u8D85\u5927\u7EAF\u6587\u672C\u7ED3\u679C\u66FF\u6362\u4E3A\u4FDD\u7559\u9884\u89C8 + spill \u6587\u4EF6\u8DEF\u5F84\u3002",
    en: "Tool-result spill policy for the DeepSeek Harness \u2014 replaces oversized plain-text tool results with a retained preview plus a spill-file path (no service API)"
  },
  "@deepseek-ai/dsh-storage": {
    zh: "\u5B58\u50A8\u67A2\u7EBD\uFF08ctx.storage\uFF09\uFF1A\u547D\u540D\u540E\u7AEF\u6CE8\u518C\u8868\u4E0E\u6302\u8F7D\u7684\u6570\u636E\u5F62\u5F0F\u8BBE\u65BD\u3002",
    en: "Storage hub (ctx.storage): named backend registry plus mounted data-form facilities for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-storage-domain": {
    zh: "\u57DF\u6570\u636E\u5F62\u5F0F\uFF08ctx.storage.domain\uFF09\uFF1Aschema \u6821\u9A8C\u3001\u4E8B\u4EF6\u53D1\u5C04\u7684 KV \u57DF\u3002",
    en: "Domain data form (ctx.storage.domain): schema-validated, event-emitting KV domains over storage backends for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-storage-json": {
    zh: "\u5B58\u50A8\u67A2\u7EBD\u7684 JSON \u6587\u4EF6 KV \u540E\u7AEF\u3002",
    en: "JSON file KV storage backend for the DeepSeek Harness storage hub"
  },
  "@deepseek-ai/dsh-subagent-fork-in-process": {
    zh: "\u8FDB\u7A0B\u5185 fork \u5B50\u4EE3\u7406\u540E\u7AEF\uFF1A\u4EE5\u7236\u65E5\u5FD7\u524D\u7F00\u79CD\u5B50\u8FD0\u884C\u5B50 agent\u3002",
    en: "In-process fork subagent backend: runs a child agent seeded with a prefix of the parent's log"
  },
  "@deepseek-ai/dsh-subagent-spawn-in-process": {
    zh: "\u8FDB\u7A0B\u5185 spawn \u5B50\u4EE3\u7406\u540E\u7AEF\uFF1A\u5728 ctx.agents \u4E0A\u8FD0\u884C\u5168\u65B0\u5B50 agent\u3002",
    en: "In-process spawn subagent backend: runs a fresh child agent on ctx.agents"
  },
  "@deepseek-ai/dsh-subprocess-local": {
    zh: "\u5B50\u8FDB\u7A0B\u63A5\u7F1D\u7684\u672C\u5730\u5B9E\u73B0\u3002",
    en: "Local-subprocess implementation of the DeepSeek Harness subprocess seam"
  },
  "@deepseek-ai/dsh-system-prompt": {
    zh: "\u7CFB\u7EDF\u63D0\u793A\u8BCD\u7EC4\u88C5\u6CE8\u518C\u8868\u3002",
    en: "System prompt assembly registry for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-token-meter": {
    zh: "\u53EF\u91CD\u653E\u7684 token \u8BA1\u91CF\u670D\u52A1\uFF08ctx.tokenMeter\uFF09\u3002",
    en: "Replay-aware token measurement service (ctx.tokenMeter) for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-tool-call-timeout-policy": {
    zh: "\u5DE5\u5177\u8C03\u7528\u8D85\u65F6\u7B56\u7565\uFF1Atools/execute \u5305\u88C5\u5668\u6309 exec.signal \u6B66\u88C5\u6BCF\u5DE5\u5177\u65F6\u9650\u3002",
    en: "Tool-call timeout policy: a tools/execute wrapper that arms a per-tool deadline on exec.signal and returns TOOL_TIMEOUT when it wins"
  },
  "@deepseek-ai/dsh-tool-fs-search": {
    zh: "\u6A21\u578B\u53EF\u89C1\u7684\u6587\u4EF6\u53D1\u73B0\u5DE5\u5177\uFF08glob/grep\uFF0C\u5185\u7F6E ripgrep\uFF09\u3002",
    en: "Model-facing filesystem discovery tools (glob, grep) backed by the packaged ripgrep binary (@vscode/ripgrep)"
  },
  "@deepseek-ai/dsh-tool-goal": {
    zh: "\u6A21\u578B\u53EF\u89C1\u7684\u540C\u4F1A\u8BDD\u76EE\u6807\u5DE5\u5177\uFF08\u6267\u884C\u65F6\u6743\u9650\u6821\u9A8C\uFF09\u3002",
    en: "Model-facing same-session goal tools with execution-time authority checks"
  },
  "@deepseek-ai/dsh-tool-jobs": {
    zh: "\u6A21\u578B\u53EF\u89C1\u7684\u540E\u53F0\u4EFB\u52A1\u63A7\u5236\u5DE5\u5177\uFF08job_output/job_list/job_kill\uFF09\u3002",
    en: "Model-facing background job control tools (job_output, job_list, job_kill) over the ctx.jobs registry"
  },
  "@deepseek-ai/dsh-tool-ralph": {
    zh: "\u6A21\u578B\u53EF\u89C1\u7684\u5168\u65B0 agent Ralph \u5FAA\u73AF\uFF08workflow \u4E0E subagent \u63A5\u7F1D\u4E4B\u4E0A\uFF09\u3002",
    en: "Model-facing fresh-agent Ralph loop over the workflow and subagent seams"
  },
  "@deepseek-ai/dsh-tool-skill": {
    zh: "\u6A21\u578B\u53EF\u89C1\u7684\u6280\u80FD\u52A0\u8F7D\u5DE5\u5177\u3002",
    en: "Model-facing skill loading tool for the DeepSeek Harness"
  },
  "@deepseek-ai/dsh-tool-str-replace-editor": {
    zh: "\u6A21\u578B\u53EF\u89C1\u7684\u67E5\u770B/\u521B\u5EFA/\u5B57\u9762\u66FF\u6362/\u884C\u63D2\u5165\u5DE5\u5177\u3002",
    en: "Model-facing view, create, literal replace, and line insert tool over the Harness filesystem service"
  },
  "@deepseek-ai/dsh-tool-subagent": {
    zh: "\u6A21\u578B\u53EF\u89C1\u7684\u5B50\u4EE3\u7406\u59D4\u6D3E\u5DE5\u5177\uFF08ctx.subagents\uFF09\u3002",
    en: "Model-facing subagent delegation tool over the ctx.subagents seam"
  },
  "@deepseek-ai/dsh-tool-subagent-control": {
    zh: "\u5168\u5C40\u547D\u540D\u5DE5\u5177\uFF1Asend_message / interrupt_agent / list_agents\u3002",
    en: "Globally named send_message, interrupt_agent, and list_agents tools over ctx.subagents continuations"
  },
  "@deepseek-ai/dsh-tool-subagent-report": {
    zh: "\u5B50\u4EE3\u7406\u4F5C\u7528\u57DF\u7684 report \u5DE5\u5177\u3002",
    en: "Child-scoped report tool over ctx.subagents continuations"
  },
  "@deepseek-ai/dsh-tool-todo": {
    zh: "\u6A21\u578B\u53EF\u89C1\u7684 todo_write \u5DE5\u5177\uFF08\u4E8B\u4EF6\u6E90\u4F1A\u8BDD\u65E5\u5FD7\u4E4B\u4E0A\uFF09\u3002",
    en: "Model-facing todo_write tool over the DeepSeek Harness event-sourced session log"
  },
  "@deepseek-ai/dsh-tool-workflow": {
    zh: "\u6A21\u578B\u53EF\u89C1\u7684 workflow \u5DE5\u5177\uFF1A\u8FD0\u884C JavaScript \u7F16\u6392\u811A\u672C\u3002",
    en: "Model-facing workflow tool: run a JavaScript orchestration script over ctx.workflowEngine"
  },
  "@deepseek-ai/dsh-typert-loader": {
    zh: "\u751F\u6210\u578B Typert \u5305\u8D21\u732E\u7684 loader \u96C6\u6210\u3002",
    en: "Loader integration for generated Typert package contributions"
  },
  "@deepseek-ai/dsh-typert-registry": {
    zh: "\u751F\u6210\u578B\u5305\u53CD\u5C04\u4E0E Zod schema \u7684\u8FD0\u884C\u65F6\u6CE8\u518C\u8868\u3002",
    en: "Runtime registry for generated package reflection and Zod schemas"
  },
  "@deepseek-ai/dsh-user-approval": {
    zh: "\u7528\u6237\u5BA1\u6279\u63A5\u7F1D\uFF08ctx.approval\uFF09\uFF1A\u4E00\u6B21\u6027\u6743\u9650\u51B3\u7B56\uFF0C\u9ED8\u8BA4 fail-closed\u3002",
    en: "User-approval seam (ctx.approval) for the DeepSeek Harness: one-shot permission decisions dispatched to composed answerers over the approval/request waterfall, fail-closed by default"
  },
  "@deepseek-ai/dsh-user-questions": {
    zh: "\u62BD\u8C61\u7528\u6237\u63D0\u95EE\u63A5\u7F1D\uFF08ctx.userQuestions\uFF09\uFF1Aagent \u8FD0\u884C\u4E2D\u5411\u4EBA\u63D0\u95EE\u3002",
    en: "Abstract user-questions seam (ctx.userQuestions) for asking the human during agent runs"
  },
  "@deepseek-ai/dsh-web": {
    zh: "\u62BD\u8C61 web \u80FD\u529B\u63A5\u7F1D\uFF08ctx.web\uFF09\uFF1A\u641C\u7D22/\u6293\u53D6\u63D0\u4F9B\u65B9\u6CE8\u518C\u8868\u4E0E\u9519\u8BEF\u5206\u7C7B\u3002",
    en: "Abstract web access capability seam (ctx.web) for the DeepSeek Harness \u2014 search/fetch provider registry, registration-order-independent selection, request/result vocabulary, and the WebError taxonomy"
  },
  "@deepseek-ai/dsh-web-search-deepseek": {
    zh: "DeepSeek \u652F\u6491\u7684\u641C\u7D22\u63D0\u4F9B\u65B9\uFF08\u539F\u751F web_search\uFF09\u3002",
    en: "DeepSeek-backed search provider (native web_search via the Anthropic-compatible API) for the DeepSeek Harness web capability seam (ctx.web)"
  },
  "@deepseek-ai/dsh-workflow-worker-thread": {
    zh: "worker \u7EBF\u7A0B workflow \u5F15\u64CE\uFF1A\u79BB\u7EBF\u6267\u884C\u7F16\u6392\u811A\u672C\uFF0Cagent() \u6865\u63A5\u56DE ctx.subagents\u3002",
    en: "worker-thread workflow engine: executes model-written orchestration scripts off the host event loop, bridging agent() calls back to ctx.subagents"
  },
  "@deepseek-ai/dsh-workspace": {
    zh: "\u5DE5\u4F5C\u533A\u5B9E\u4F53\u6CE8\u518C\u8868\uFF08ctx.workspaceRegistry\uFF09\uFF1A\u6301\u4E45\u5316\u5DE5\u4F5C\u533A\u8BB0\u5F55\u4E0E\u4F1A\u8BDD\u6302\u8F7D\u6821\u9A8C\u3002",
    en: "Workspace entity registry (ctx.workspaceRegistry): durable workspace records with validated session attachment over the domain data form for the DeepSeek Harness"
  },
  "@deepseek-ai/cordis-plugin-timer": {
    zh: "\u5B9A\u65F6\u5668\u670D\u52A1\uFF08Cordis \u57FA\u7840\uFF0C\u70ED\u91CD\u8F7D\u94FE\u4F9D\u8D56\uFF09\u3002",
    en: "Cordis timer service (part of the hot-reload chain)."
  },
  "@deepseek-ai/cordis-plugin-hmr": {
    zh: "\u914D\u7F6E\u70ED\u91CD\u8F7D\uFF1A\u8865\u4E01\u6587\u4EF6\u53D8\u66F4\u81EA\u52A8\u91CD\u7EC4\u7EC4\u5408\u6811\u3002",
    en: "Config hot-reload: recomposes the composition tree on patch-file changes."
  },
  "@deepseek-ai/dsh-pwsh-sandbox": {
    zh: "PowerShell \u6267\u884C\u5668\u6C99\u7BB1\u5B9E\u73B0\uFF1A\u6BCF\u6761\u547D\u4EE4\u7ECF ctx.sandbox \u7EA6\u675F\u5E76\u56DE\u62A5\u7ED3\u679C\u3002",
    en: "Sandbox-consuming implementation of the DeepSeek Harness PowerShell executor seam (confines every command via ctx.sandbox, reports denial/enforcement result facts)"
  },
  "@deepseek-ai/dsh-client-runtime": {
    zh: "\u5BA2\u6237\u7AEF\u6838\u5FC3\u670D\u52A1\uFF1ASlotRegistry \u4E0E SessionRuntime\uFF08\u4F5C\u7528\u57DF\u6811 + \u5BF9\u8C61\u5C42\uFF09\u3002",
    en: "Client core services: SlotRegistry and SessionRuntime (scope tree + object layer)."
  }
};
function describe(packageName, lang) {
  const entry = DESCRIPTIONS[packageName];
  return entry === void 0 ? null : entry[lang];
}

// src/client/Card.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function CardShell(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_pm_card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_pm_cardRow", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_pm_title", title: props.title, children: props.title }),
      props.badges?.map((badge, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_pm_badge", children: badge }, index))
    ] }),
    props.description !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh_pm_desc", children: props.description }) : null,
    props.actions !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh_pm_actions", children: props.actions }) : null,
    props.details
  ] });
}

// src/client/ManagerTab.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function moduleShortName(moduleName) {
  const unscoped = moduleName.startsWith("@") ? moduleName.slice(moduleName.indexOf("/") + 1) : moduleName;
  return unscoped.replace(/^cordis:/, "").replace(/^cordis-plugin-/, "").replace(/^dsh-(?:host-|client-)?/, "");
}
function matches(entry, query) {
  if (query === "") return true;
  return [entry.moduleName, entry.entryId, entry.packageName ?? ""].some((value) => value.toLocaleLowerCase().includes(query));
}
function ManagerTab(props) {
  const { list, toggle, uninstall, getLang, subscribeLang, t } = props;
  const [request, setRequest] = (0, import_react.useState)(0);
  const [query, setQuery] = (0, import_react.useState)("");
  const [state, setState] = (0, import_react.useState)({ status: "loading" });
  const [lang, setLang] = (0, import_react.useState)(getLang());
  const [collapsed, setCollapsed] = (0, import_react.useState)({ official: true, community: false });
  const [expandedId, setExpandedId] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)({});
  const [notice, setNotice] = (0, import_react.useState)(null);
  const [, force] = (0, import_react.useReducer)((x) => x + 1, 0);
  (0, import_react.useEffect)(() => subscribeLang(() => {
    setLang(getLang());
    force();
  }), [subscribeLang, getLang]);
  (0, import_react.useEffect)(() => {
    let current = true;
    setState({ status: "loading" });
    void Promise.resolve().then(list).then(
      (data) => {
        if (current) setState({ status: "ready", data });
      },
      () => {
        if (current) setState({ status: "error" });
      }
    );
    return () => {
      current = false;
    };
  }, [list, request]);
  const normalized = query.trim().toLocaleLowerCase();
  const groups = (0, import_react.useMemo)(() => {
    if (state.status !== "ready") return { official: [], community: [] };
    const pick = (group) => state.data[group].filter((entry) => matches(entry, normalized));
    return { official: pick("official"), community: pick("community") };
  }, [normalized, state]);
  const displayName = (entry) => entry.packageName !== null ? describe(entry.packageName, lang) ?? entry.description ?? t("noDescription") : entry.description ?? t("noDescription");
  const retry = () => {
    setRequest((value) => value + 1);
  };
  const onToggle = async (entry) => {
    const target = !entry.enabled;
    setBusy((current) => ({ ...current, [entry.entryId]: true }));
    setNotice(null);
    setState((current) => current.status === "ready" ? {
      status: "ready",
      data: {
        ...current.data,
        official: current.data.official.map((e) => e.entryId === entry.entryId ? { ...e, enabled: target } : e),
        community: current.data.community.map((e) => e.entryId === entry.entryId ? { ...e, enabled: target } : e)
      }
    } : current);
    const result = await toggle({ entryId: entry.entryId, enabled: target });
    setBusy((current) => ({ ...current, [entry.entryId]: false }));
    if (!result.ok) {
      setState((current) => current.status === "ready" ? {
        status: "ready",
        data: {
          ...current.data,
          official: current.data.official.map((e) => e.entryId === entry.entryId ? { ...e, enabled: !target } : e),
          community: current.data.community.map((e) => e.entryId === entry.entryId ? { ...e, enabled: !target } : e)
        }
      } : current);
      setNotice({ text: `${t("operationFailed")}${result.message}`, error: true });
    }
  };
  const onUninstall = async (entry) => {
    if (entry.packageName === null) return;
    if (!globalThis.confirm(t("uninstallConfirm"))) return;
    setBusy((current) => ({ ...current, [entry.entryId]: true }));
    setNotice(null);
    const result = await uninstall(entry.packageName);
    setBusy((current) => ({ ...current, [entry.entryId]: false }));
    if (!result.ok) {
      setNotice({ text: `${t("operationFailed")}${result.message}`, error: true });
      return;
    }
    setState((current) => current.status === "ready" ? {
      status: "ready",
      data: {
        ...current.data,
        official: current.data.official.filter((e) => e.entryId !== entry.entryId),
        community: current.data.community.filter((e) => e.entryId !== entry.entryId)
      }
    } : current);
    setNotice({ text: t("uninstallDone"), error: false });
  };
  const renderCard = (entry) => {
    const protectedModule = state.status === "ready" && state.data.protectedModules.includes(entry.moduleName);
    const open = expandedId === entry.entryId;
    const badges = [];
    if (protectedModule) badges.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { "data-kind": "protected", children: t("protected") }, "p"));
    if (entry.patchState === "disabled") badges.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { "data-kind": "patch", children: t("patchDisabled") }, "d"));
    if (entry.patchState === "forced") badges.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { "data-kind": "patch", children: t("patchForced") }, "f"));
    const phase = entry.fiberPhase ?? "unobserved";
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      CardShell,
      {
        title: moduleShortName(entry.moduleName),
        badges,
        description: displayName(entry),
        actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_pm_statusDot", "data-phase": phase, role: "img", "aria-label": phase, title: phase }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_pm_btn dsh_pm_btnPrimary",
              disabled: protectedModule || busy[entry.entryId] === true,
              onClick: () => {
                void onToggle(entry);
              },
              children: entry.enabled ? t("disable") : t("enable")
            }
          ),
          entry.group === "community" && entry.packageName !== null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_pm_btn dsh_pm_btnDanger",
              disabled: protectedModule || busy[entry.entryId] === true,
              onClick: () => {
                void onUninstall(entry);
              },
              children: t("uninstall")
            }
          ) : null,
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_pm_btn",
              onClick: () => {
                setExpandedId(open ? null : entry.entryId);
              },
              children: open ? t("collapse") : t("details")
            }
          )
        ] }),
        details: open ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_pm_details", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            t("entryId"),
            ": ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("code", { children: entry.entryId })
          ] }),
          entry.version !== null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            t("version"),
            ": ",
            entry.version
          ] }) : null,
          entry.license !== null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            t("license"),
            ": ",
            entry.license
          ] }) : null,
          entry.homepage !== null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            t("homepage"),
            ": ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: entry.homepage, target: "_blank", rel: "noreferrer", children: entry.homepage })
          ] }) : null,
          entry.repository !== null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            t("repository"),
            ": ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: entry.repository, target: "_blank", rel: "noreferrer", children: entry.repository })
          ] }) : null,
          entry.readmeSummary !== null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            t("readme"),
            ": ",
            entry.readmeSummary
          ] }) : null
        ] }) : void 0
      },
      entry.entryId
    );
  };
  const renderGroup = (title, entries) => {
    const open = !collapsed[title];
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "button",
        {
          type: "button",
          className: "dsh_pm_groupHead",
          "aria-expanded": open,
          onClick: () => {
            setCollapsed((current) => ({ ...current, [title]: !current[title] }));
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: open ? "\u25BE" : "\u25B8" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh_pm_groupCount", children: [
              "(",
              entries.length,
              ")"
            ] })
          ]
        }
      ),
      open ? entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_pm_empty", children: t("search") }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_pm_cards", children: entries.map(renderCard) }) : null
    ] }, title);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_pm_section", "aria-busy": state.status === "loading", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_pm_toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_pm_search", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "input",
        {
          type: "search",
          value: query,
          placeholder: t("searchPlaceholder"),
          "aria-label": t("searchPlaceholder"),
          onChange: (event) => {
            setQuery(event.currentTarget.value);
          }
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "dsh_pm_btn", onClick: retry, children: t("retry") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_pm_notice", "data-error": notice?.error === true ? "true" : void 0, children: notice !== null ? notice.text : t("restartNotice") }),
    state.status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_pm_status", children: t("search") }) : null,
    state.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_pm_status", children: [
      t("loadError"),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "dsh_pm_btn", onClick: retry, children: t("retry") })
    ] }) : null,
    state.status === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      renderGroup(t("groupOfficial"), groups.official),
      renderGroup(t("groupCommunity"), groups.community)
    ] }) : null
  ] });
}

// src/client/MarketTab.tsx
var import_react2 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function MarketTab(props) {
  const { board, search, install, t } = props;
  const [query, setQuery] = (0, import_react2.useState)("");
  const [boardTab, setBoardTab] = (0, import_react2.useState)("top");
  const [state, setState] = (0, import_react2.useState)({ status: "loading" });
  const [installing, setInstalling] = (0, import_react2.useState)(null);
  const [notice, setNotice] = (0, import_react2.useState)(null);
  const loadBoard = async (mode) => {
    setState({ status: "loading" });
    setNotice(null);
    try {
      const items = await board(mode);
      setState({ status: "done", items, source: "board" });
    } catch {
      setState({ status: "error" });
    }
  };
  (0, import_react2.useEffect)(() => {
    void loadBoard(boardTab);
  }, [boardTab]);
  const runSearch = async () => {
    const q = query.trim() === "" ? t("marketDefaultQuery") : query.trim();
    setState({ status: "loading" });
    setNotice(null);
    try {
      const items = await search(q);
      setState({ status: "done", items, source: "search" });
      if (items.length === 0) setNotice({ text: t("marketEmpty"), error: false });
    } catch {
      setState({ status: "error" });
    }
  };
  const backToBoard = () => {
    setQuery("");
    void loadBoard(boardTab);
  };
  const onInstall = async (item) => {
    setInstalling(item.fullName);
    setNotice(null);
    const spec = item.npmName ?? item.fullName;
    const result = await install(spec);
    setInstalling(null);
    if (!result.ok) {
      setNotice({ text: `${t("operationFailed")}${result.message}`, error: true });
      return;
    }
    const warning = "warning" in result && result.warning !== void 0 ? ` ${t("installWarning")}${result.warning}` : "";
    setNotice({ text: `${t("installDone")}${warning}`, error: false });
  };
  const renderCards = (items) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_pm_cards", children: items.map((item) => {
    const badges = [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: item.source === "npm" ? t("npmDirect") : t("githubInstall") }, "src")
    ];
    if (item.dshBundle) badges.push(/* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { "data-kind": "patch", children: t("dshBundleHint") }, "dsh"));
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      CardShell,
      {
        title: item.fullName,
        badges,
        description: item.description === null ? t("noDescription") : item.description,
        actions: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "dsh_pm_badge", children: [
            "\u2B50 ",
            item.stars
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_pm_btn dsh_pm_btnPrimary",
              disabled: installing === item.fullName,
              onClick: () => {
                void onInstall(item);
              },
              children: installing === item.fullName ? t("installing") : t("install")
            }
          )
        ] })
      },
      item.fullName
    );
  }) });
  const searching = state.status === "done" && state.source === "search";
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_pm_section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_pm_toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { className: "dsh_pm_search", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "input",
        {
          type: "search",
          value: query,
          placeholder: t("marketDefaultQuery"),
          "aria-label": t("search"),
          onKeyDown: (event) => {
            if (event.key === "Enter") void runSearch();
          },
          onChange: (event) => {
            setQuery(event.currentTarget.value);
          }
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "dsh_pm_btn dsh_pm_btnPrimary", onClick: () => {
        void runSearch();
      }, children: t("search") }),
      searching ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "dsh_pm_btn", onClick: backToBoard, children: t("backToBoard") }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_pm_toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          type: "button",
          className: boardTab === "top" ? "dsh_pm_btn dsh_pm_btnPrimary" : "dsh_pm_btn",
          onClick: () => {
            setBoardTab("top");
          },
          children: t("boardTop")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          type: "button",
          title: t("boardRisingTitle"),
          className: boardTab === "rising" ? "dsh_pm_btn dsh_pm_btnPrimary" : "dsh_pm_btn",
          onClick: () => {
            setBoardTab("rising");
          },
          children: t("boardRising")
        }
      )
    ] }),
    notice !== null ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_pm_notice", "data-error": notice.error ? "true" : void 0, children: notice.text }) : null,
    state.status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_pm_status", children: t("marketSearching") }) : null,
    state.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_pm_status", children: [
      t("marketError"),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "dsh_pm_btn", onClick: () => {
        void loadBoard(boardTab);
      }, children: t("retry") })
    ] }) : null,
    state.status === "done" ? state.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_pm_empty", children: t("marketEmpty") }) : renderCards(state.items) : null
  ] });
}

// src/client/locales.ts
var NS = "pluginManager";
var zh = {
  tabManager: "\u63D2\u4EF6\u7BA1\u7406",
  tabMarket: "\u63D2\u4EF6\u5E02\u573A",
  search: "\u641C\u7D22",
  searchPlaceholder: "\u641C\u7D22\u63D2\u4EF6\uFF08\u540D\u79F0\u6216 id\uFF09",
  groupOfficial: "\u5B98\u65B9\u63D2\u4EF6",
  groupCommunity: "\u793E\u533A\u63D2\u4EF6",
  protected: "\u53D7\u4FDD\u62A4",
  patchDisabled: "\u8865\u4E01\u505C\u7528",
  patchForced: "\u8865\u4E01\u5F3A\u5236\u542F\u7528",
  enable: "\u542F\u7528",
  disable: "\u505C\u7528",
  enabledTag: "\u5DF2\u542F\u7528",
  disabledTag: "\u5DF2\u505C\u7528",
  uninstall: "\u5378\u8F7D",
  uninstallConfirm: "\u786E\u5B9A\u5378\u8F7D\u8BE5\u63D2\u4EF6\uFF1F\u91CD\u542F\u670D\u52A1\u540E\u5F7B\u5E95\u79FB\u9664\u3002",
  uninstalling: "\u5378\u8F7D\u4E2D\u2026",
  details: "\u8BE6\u60C5",
  collapse: "\u6536\u8D77",
  noDescription: "\uFF08\u65E0\u63CF\u8FF0\uFF09",
  loadError: "\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  retry: "\u91CD\u8BD5",
  restartNotice: "\u5B89\u88C5/\u5378\u8F7D\u9700\u91CD\u542F dsh \u670D\u52A1\u540E\u5B8C\u5168\u751F\u6548\uFF1B\u542F\u505C\u7ECF HMR \u7EA6 1-3 \u79D2\u751F\u6548\u3002",
  marketDefaultQuery: "dsh-plugin",
  marketSearching: "\u641C\u7D22\u4E2D\u2026",
  marketEmpty: "\u6CA1\u6709\u5339\u914D\u7684\u4ED3\u5E93\u3002",
  marketError: "\u641C\u7D22\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
  boardTop: "\u9AD8\u6536\u85CF",
  boardRising: "\u589E\u957F\u6700\u5FEB",
  boardRisingTitle: "\u8FD1 90 \u5929\u65B0\u5EFA\u4ED3\u5E93\u6309\u6536\u85CF\u6570\u6392\u5E8F\uFF08GitHub \u65E0\u589E\u901F\u63A5\u53E3\uFF0C\u6B64\u4E3A\u8FD1\u4F3C\uFF09",
  backToBoard: "\u56DE\u5230\u699C\u5355",
  npmDirect: "npm \u76F4\u88C5",
  githubInstall: "GitHub \u5B89\u88C5",
  dshBundleHint: "\u770B\u8D77\u6765\u662F DSH \u63D2\u4EF6",
  install: "\u6DFB\u52A0\u5E76\u542F\u7528",
  installing: "\u5B89\u88C5\u4E2D\u2026",
  installDone: "\u5B89\u88C5\u5B8C\u6210\uFF0C\u91CD\u542F dsh \u670D\u52A1\u540E\u751F\u6548\u3002",
  installWarning: "\u6CE8\u610F\uFF1A",
  version: "\u7248\u672C",
  homepage: "\u4E3B\u9875",
  repository: "\u4ED3\u5E93",
  license: "\u8BB8\u53EF",
  readme: "\u8BF4\u660E\u6458\u8981",
  entryId: "\u6761\u76EE id",
  operationFailed: "\u64CD\u4F5C\u5931\u8D25\uFF1A",
  uninstallDone: "\u5DF2\u5378\u8F7D\uFF0C\u91CD\u542F dsh \u670D\u52A1\u540E\u5F7B\u5E95\u79FB\u9664\u3002"
};
var en = {
  tabManager: "Plugin manager",
  tabMarket: "Plugin market",
  search: "Search",
  searchPlaceholder: "Search plugins (name or id)",
  groupOfficial: "Official plugins",
  groupCommunity: "Community plugins",
  protected: "Protected",
  patchDisabled: "Disabled by patch",
  patchForced: "Forced on by patch",
  enable: "Enable",
  disable: "Disable",
  enabledTag: "Enabled",
  disabledTag: "Disabled",
  uninstall: "Uninstall",
  uninstallConfirm: "Uninstall this plugin? It is fully removed after a service restart.",
  uninstalling: "Uninstalling\u2026",
  details: "Details",
  collapse: "Collapse",
  noDescription: "(no description)",
  loadError: "Failed to load. Retry.",
  retry: "Retry",
  restartNotice: "Install/uninstall takes full effect after restarting the dsh service; enable/disable applies via HMR within 1-3 seconds.",
  marketDefaultQuery: "dsh-plugin",
  marketSearching: "Searching\u2026",
  marketEmpty: "No matching repositories.",
  marketError: "Search failed. Retry later.",
  boardTop: "Top starred",
  boardRising: "Fastest growing",
  boardRisingTitle: "Recently created repos (90d) sorted by stars \u2014 a growth proxy, as GitHub has no growth API",
  backToBoard: "Back to board",
  npmDirect: "Install via npm",
  githubInstall: "Install via GitHub",
  dshBundleHint: "Looks like a DSH plugin",
  install: "Add & enable",
  installing: "Installing\u2026",
  installDone: "Installed. Restart the dsh service to activate.",
  installWarning: "Note: ",
  version: "Version",
  homepage: "Homepage",
  repository: "Repository",
  license: "License",
  readme: "Readme summary",
  entryId: "Entry id",
  operationFailed: "Operation failed: ",
  uninstallDone: "Uninstalled. Fully removed after restarting the dsh service."
};

// src/client/styles.ts
var cssText = `
.dsh_pm_section { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.dsh_pm_toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dsh_pm_search { display: inline-flex; align-items: center; gap: 6px; flex: 1 1 220px; max-width: 340px; padding: 5px 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: var(--dsw-alias-bg-layer-1); }
.dsh_pm_search input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; color: var(--dsw-alias-label-primary); font-size: 13px; }
.dsh_pm_search input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh_pm_notice { padding: 8px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; }
.dsh_pm_notice[data-error='true'] { border-color: var(--dsw-alias-state-danger-border, var(--dsw-alias-border-l2)); color: var(--dsw-alias-state-danger-fg, var(--dsw-alias-label-primary)); }
.dsh_pm_groupHead { display: flex; align-items: center; gap: 8px; width: 100%; border: none; background: transparent; padding: 6px 2px; cursor: pointer; color: var(--dsw-alias-label-primary); font-size: 14px; line-height: 22px; font-weight: 600; text-align: left; }
.dsh_pm_groupHead:hover { color: var(--dsw-alias-brand-primary); }
.dsh_pm_groupCount { color: var(--dsw-alias-label-tertiary); font-size: 12px; font-weight: 400; }
.dsh_pm_cards { display: flex; flex-direction: column; gap: 8px; }
.dsh_pm_card { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); min-width: 0; }
.dsh_pm_cardRow { display: flex; align-items: center; gap: 8px; min-width: 0; }
.dsh_pm_title { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 20px; font-weight: 600; }
.dsh_pm_badge { flex: 0 0 auto; padding: 1px 8px; border-radius: 999px; font-size: 11px; line-height: 18px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-2); }
.dsh_pm_badge[data-kind='protected'] { color: var(--dsw-alias-state-danger-fg, var(--dsw-alias-label-secondary)); }
.dsh_pm_badge[data-kind='patch'] { color: var(--dsw-alias-state-business-primary, var(--dsw-alias-label-secondary)); }
.dsh_pm_desc { color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.dsh_pm_actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.dsh_pm_btn { border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; padding: 2px 10px; font-size: 12px; line-height: 20px; cursor: pointer; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
.dsh_pm_btn:hover { border-color: var(--dsw-alias-brand-primary); }
.dsh_pm_btn:disabled { opacity: 0.5; cursor: default; }
.dsh_pm_btnPrimary { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.dsh_pm_btnDanger { color: var(--dsw-alias-state-danger-fg, var(--dsw-alias-label-primary)); }
.dsh_pm_statusDot { width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-bg-layer-3); }
.dsh_pm_statusDot[data-phase='active'] { background: var(--dsw-alias-state-success-fg, #2f9e44); }
.dsh_pm_statusDot[data-phase='failed'] { background: var(--dsw-alias-state-danger-fg, #e03131); }
.dsh_pm_statusDot[data-phase='loading'] { background: var(--dsw-alias-brand-primary); }
.dsh_pm_details { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-top: 1px solid var(--dsw-alias-border-l1); font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); min-width: 0; }
.dsh_pm_details a { color: var(--dsw-alias-brand-primary); text-decoration: none; overflow-wrap: anywhere; }
.dsh_pm_details code { color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }
.dsh_pm_status { padding: 24px 0; text-align: center; color: var(--dsw-alias-label-tertiary); font-size: 13px; }
.dsh_pm_empty { padding: 24px 0; text-align: center; color: var(--dsw-alias-label-tertiary); font-size: 13px; }
`;
function adoptStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("dsh-plugin-manager-styles")) return;
  const style = document.createElement("style");
  style.id = "dsh-plugin-manager-styles";
  style.textContent = cssText;
  document.head.appendChild(style);
}

// src/client/index.ts
var inject = ["slots", "locale"];
async function jsonOrThrow(response) {
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}
function apply(ctx) {
  adoptStyles();
  console.info("[dsh-plugin-manager] bundle loaded");
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-plugin-manager: dictionaries");
  const lang = () => ctx.locale.getSnapshot().active.startsWith("zh") ? "zh" : "en";
  const list = async () => jsonOrThrow(await globalThis.fetch("/dsh-plugin-manager/list"));
  const toggle = async (body) => jsonOrThrow(await globalThis.fetch("/dsh-plugin-manager/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }));
  const uninstall = async (packageName) => jsonOrThrow(await globalThis.fetch("/dsh-plugin-manager/uninstall", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageName })
  }));
  const search = async (query) => jsonOrThrow(await globalThis.fetch(`/dsh-plugin-manager/search?q=${encodeURIComponent(query)}`));
  const board = async (mode) => jsonOrThrow(await globalThis.fetch(`/dsh-plugin-manager/search?mode=${mode}`));
  const install = async (spec) => jsonOrThrow(await globalThis.fetch("/dsh-plugin-manager/install", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spec })
  }));
  ctx.slots.inject("settings.plugins.tab", function* () {
    yield ctx.slots.register({
      name: "settings.plugins.tab",
      id: "manager",
      order: 20,
      label: () => lang() === "zh" ? "\u63D2\u4EF6\u7BA1\u7406" : "Plugin manager",
      locale: NS,
      inject: () => ({
        list,
        toggle,
        uninstall,
        getLang: lang,
        subscribeLang: (listener) => ctx.locale.subscribe(listener)
      })
    }, ManagerTab);
    yield ctx.slots.register({
      name: "settings.plugins.tab",
      id: "market",
      order: 30,
      label: () => lang() === "zh" ? "\u63D2\u4EF6\u5E02\u573A" : "Plugin market",
      locale: NS,
      inject: () => ({ board, search, install })
    }, MarketTab);
  });
}
return module.exports; } });
//# sourceMappingURL=client.js.map
