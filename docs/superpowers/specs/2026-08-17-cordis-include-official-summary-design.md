# `cordis:include` 官方分类与摘要

## 目标

将 dsh 内置的 `cordis:include` 条目从“社区插件”移动到“官方插件”，并在插件管理器中显示中英文摘要。

## 现状与原因

`cordis:include` 是 Loader 的内部条目名，不是可直接解析的 npm 包名。管理器当前按条目名解析 `package.json`，解析失败后将它回退到社区分组，并且没有可显示的描述。

实际实现包是 `@deepseek-ai/cordis-plugin-include`，负责读取 YAML/JSON 配置、组合插件与 patch 层，并支持配置热更新。

## 设计

- 在分组判定中为 `cordis:include` 增加明确的官方内部条目映射。
- 在双语描述表中增加 `cordis:include` 的中英文摘要。
- 管理器展示摘要时，在真实包名不存在时使用内部条目名查询描述表。
- 只映射已确认的 `cordis:include`，不把所有未知的 `cordis:*` 条目自动归为官方，避免误分类。

## 验证

- 分组测试确认 `cordis:include` 判定为 `official`。
- 描述测试确认内部条目能得到中英文摘要。
- 运行插件管理器的 typecheck、测试与构建。
