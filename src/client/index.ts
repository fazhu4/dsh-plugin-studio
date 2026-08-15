/**
 * dsh-plugin-manager client plugin: registers the manager and market tabs
 * into the Plugins settings section.
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: the ctx.locale Context merge.
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: the settings.section SlotMap entry.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {
  InstallResponse, ListResponse, MarketItem, OpError, ToggleResponse, UninstallResponse,
} from '../contract.ts'
import { ManagerTab, type ManagerTabInjected } from './ManagerTab.tsx'
import { MarketTab, type MarketTabInjected } from './MarketTab.tsx'
import { NS, en, zh, type PluginManagerLocaleKey } from './locales.ts'
import { adoptStyles } from './styles.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'pluginManager': PluginManagerLocaleKey
  }
}

/** Services required by the registration. */
export const inject = ['slots', 'locale']

async function jsonOrThrow<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return await response.json() as T
}

/** Contribute the two tabs to the Plugins settings section. */
export function apply(ctx: ClientContext): void {
  adoptStyles()
  console.info('[dsh-plugin-manager] bundle loaded')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-plugin-manager: dictionaries')

  const lang = (): 'zh' | 'en' => ctx.locale.getSnapshot().active.startsWith('zh') ? 'zh' : 'en'

  const list = async (): Promise<ListResponse> =>
    jsonOrThrow(await globalThis.fetch('/dsh-plugin-manager/list'))
  const toggle = async (body: { entryId: string; enabled: boolean }): Promise<ToggleResponse | OpError> =>
    jsonOrThrow(await globalThis.fetch('/dsh-plugin-manager/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }))
  const uninstall = async (packageName: string): Promise<UninstallResponse | OpError> =>
    jsonOrThrow(await globalThis.fetch('/dsh-plugin-manager/uninstall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageName }),
    }))
  const search = async (query: string): Promise<MarketItem[]> =>
    jsonOrThrow(await globalThis.fetch(`/dsh-plugin-manager/search?q=${encodeURIComponent(query)}`))
  const board = async (mode: 'top' | 'rising'): Promise<MarketItem[]> =>
    jsonOrThrow(await globalThis.fetch(`/dsh-plugin-manager/search?mode=${mode}`))
  const install = async (spec: string): Promise<InstallResponse | OpError> =>
    jsonOrThrow(await globalThis.fetch('/dsh-plugin-manager/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spec }),
    }))

  ctx.slots.inject('settings.plugins.tab', function* () {
    yield ctx.slots.register({
      name: 'settings.plugins.tab',
      id: 'manager',
      order: 20,
      label: () => lang() === 'zh' ? '插件管理' : 'Plugin manager',
      locale: NS,
      inject: (): ManagerTabInjected => ({
        list,
        toggle,
        uninstall,
        getLang: lang,
        subscribeLang: (listener) => ctx.locale.subscribe(listener),
      }),
    }, ManagerTab)
    yield ctx.slots.register({
      name: 'settings.plugins.tab',
      id: 'market',
      order: 30,
      label: () => lang() === 'zh' ? '插件市场' : 'Plugin market',
      locale: NS,
      inject: (): MarketTabInjected => ({ board, search, install }),
    }, MarketTab)
  })
}
