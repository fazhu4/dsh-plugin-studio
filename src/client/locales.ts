/** Locale dictionaries for the plugin manager tabs. */

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'pluginManager': PluginManagerLocaleKey
  }
}

export const NS = 'pluginManager'

export interface PluginManagerLocaleKeyMap {
  tabManager: string
  tabMarket: string
  search: string
  searchPlaceholder: string
  groupOfficial: string
  groupCommunity: string
  protected: string
  patchDisabled: string
  patchForced: string
  enable: string
  disable: string
  enabledTag: string
  disabledTag: string
  uninstall: string
  uninstallConfirm: string
  uninstalling: string
  details: string
  collapse: string
  noDescription: string
  loadError: string
  retry: string
  restartNotice: string
  marketDefaultQuery: string
  marketSearching: string
  marketEmpty: string
  marketError: string
  boardTop: string
  boardRising: string
  boardRisingTitle: string
  backToBoard: string
  npmDirect: string
  githubInstall: string
  dshBundleHint: string
  install: string
  installing: string
  installDone: string
  installWarning: string
  version: string
  homepage: string
  repository: string
  license: string
  readme: string
  entryId: string
  operationFailed: string
  uninstallDone: string
  groupButton: string
  moveToGroup: string
  newGroup: string
  newGroupPlaceholder: string
  restoreDefault: string
  deleteGroup: string
  deleteGroupConfirm: string
  groupUpdated: string
  cancel: string
  confirm: string
}

/** Simplified Chinese dictionary and key source of truth. */
export const zh = {
  tabManager: '插件管理',
  tabMarket: '插件市场',
  search: '搜索',
  searchPlaceholder: '搜索插件（名称或 id）',
  groupOfficial: '官方插件',
  groupCommunity: '社区插件',
  protected: '受保护',
  patchDisabled: '补丁停用',
  patchForced: '补丁强制启用',
  enable: '启用',
  disable: '停用',
  enabledTag: '已启用',
  disabledTag: '已停用',
  uninstall: '卸载',
  uninstallConfirm: '确定卸载该插件？重启服务后彻底移除。',
  uninstalling: '卸载中…',
  details: '详情',
  collapse: '收起',
  noDescription: '（无描述）',
  loadError: '加载失败，请重试。',
  retry: '重试',
  restartNotice: '安装/卸载需重启 dsh 服务后完全生效；启停经 HMR 约 1-3 秒生效。',
  marketDefaultQuery: 'dsh-plugin',
  marketSearching: '搜索中…',
  marketEmpty: '没有匹配的仓库。',
  marketError: '搜索失败，请稍后重试。',
  boardTop: '高收藏',
  boardRising: '增长最快',
  boardRisingTitle: '近 90 天新建仓库按收藏数排序（GitHub 无增速接口，此为近似）',
  backToBoard: '回到榜单',
  npmDirect: 'npm 直装',
  githubInstall: 'GitHub 安装',
  dshBundleHint: '看起来是 DSH 插件',
  install: '添加并启用',
  installing: '安装中…',
  installDone: '安装完成，重启 dsh 服务后生效。',
  installWarning: '注意：',
  version: '版本',
  homepage: '主页',
  repository: '仓库',
  license: '许可',
  readme: '说明摘要',
  entryId: '条目 id',
  operationFailed: '操作失败：',
  uninstallDone: '已卸载，重启 dsh 服务后彻底移除。',
  groupButton: '分组',
  moveToGroup: '移动到分组',
  newGroup: '新建分组',
  newGroupPlaceholder: '输入分组名',
  restoreDefault: '恢复默认分组',
  deleteGroup: '删除分组',
  deleteGroupConfirm: '删除该分组？其中插件将回到默认分组（官方/社区）。',
  groupUpdated: '分组已更新',
  cancel: '取消',
  confirm: '确定',
} satisfies Record<string, string>

/** Plugin manager locale key union. */
export type PluginManagerLocaleKey = keyof typeof zh

/** English dictionary checked against the Chinese key set. */
export const en: Record<PluginManagerLocaleKey, string> = {
  tabManager: 'Plugin manager',
  tabMarket: 'Plugin market',
  search: 'Search',
  searchPlaceholder: 'Search plugins (name or id)',
  groupOfficial: 'Official plugins',
  groupCommunity: 'Community plugins',
  protected: 'Protected',
  patchDisabled: 'Disabled by patch',
  patchForced: 'Forced on by patch',
  enable: 'Enable',
  disable: 'Disable',
  enabledTag: 'Enabled',
  disabledTag: 'Disabled',
  uninstall: 'Uninstall',
  uninstallConfirm: 'Uninstall this plugin? It is fully removed after a service restart.',
  uninstalling: 'Uninstalling…',
  details: 'Details',
  collapse: 'Collapse',
  noDescription: '(no description)',
  loadError: 'Failed to load. Retry.',
  retry: 'Retry',
  restartNotice: 'Install/uninstall takes full effect after restarting the dsh service; enable/disable applies via HMR within 1-3 seconds.',
  marketDefaultQuery: 'dsh-plugin',
  marketSearching: 'Searching…',
  marketEmpty: 'No matching repositories.',
  marketError: 'Search failed. Retry later.',
  boardTop: 'Top starred',
  boardRising: 'Fastest growing',
  boardRisingTitle: 'Recently created repos (90d) sorted by stars — a growth proxy, as GitHub has no growth API',
  backToBoard: 'Back to board',
  npmDirect: 'Install via npm',
  githubInstall: 'Install via GitHub',
  dshBundleHint: 'Looks like a DSH plugin',
  install: 'Add & enable',
  installing: 'Installing…',
  installDone: 'Installed. Restart the dsh service to activate.',
  installWarning: 'Note: ',
  version: 'Version',
  homepage: 'Homepage',
  repository: 'Repository',
  license: 'License',
  readme: 'Readme summary',
  entryId: 'Entry id',
  operationFailed: 'Operation failed: ',
  uninstallDone: 'Uninstalled. Fully removed after restarting the dsh service.',
  groupButton: 'Group',
  moveToGroup: 'Move to group',
  newGroup: 'New group',
  newGroupPlaceholder: 'Group name',
  restoreDefault: 'Restore default group',
  deleteGroup: 'Delete group',
  deleteGroupConfirm: 'Delete this group? Its plugins return to their default group (official/community).',
  groupUpdated: 'Group updated',
  cancel: 'Cancel',
  confirm: 'OK',
}
