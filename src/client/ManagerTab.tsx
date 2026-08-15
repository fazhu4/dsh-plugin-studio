/**
 * Plugin manager tab: official/community grouped inventory with localized
 * descriptions, enable/disable toggles (user patch layer + HMR), details,
 * and community-only uninstall.
 */

import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { describe } from '../descriptions.ts'
import type {
  EntryInfo, ListResponse, OpError, ToggleResponse, UninstallResponse,
} from '../contract.ts'
import type { PluginManagerLocaleKey } from './locales.ts'
import { CardShell } from './Card.tsx'

/** Registration-side business face for the manager tab. */
export interface ManagerTabInjected {
  list: () => Promise<ListResponse>
  toggle: (body: { entryId: string; enabled: boolean }) => Promise<ToggleResponse | OpError>
  uninstall: (packageName: string) => Promise<UninstallResponse | OpError>
  getLang: () => 'zh' | 'en'
  subscribeLang: (listener: () => void) => () => void
}

export type ManagerTabProps =
  PropsRuntime<'settings.plugins.tab'>
  & PropsLocale<'pluginManager'>
  & InjectFace<ManagerTabInjected>

type ViewState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'ready'; readonly data: ListResponse }

/** Compact a module specifier (same rule as the shipped inventory tab). */
function moduleShortName(moduleName: string): string {
  const unscoped = moduleName.startsWith('@') ? moduleName.slice(moduleName.indexOf('/') + 1) : moduleName
  return unscoped
    .replace(/^cordis:/, '')
    .replace(/^cordis-plugin-/, '')
    .replace(/^dsh-(?:host-|client-)?/, '')
}

function matches(entry: EntryInfo, query: string): boolean {
  if (query === '') return true
  return [entry.moduleName, entry.entryId, entry.packageName ?? '']
    .some(value => value.toLocaleLowerCase().includes(query))
}

export function ManagerTab(props: ManagerTabProps): ReactNode {
  const { list, toggle, uninstall, getLang, subscribeLang, t } = props
  const [request, setRequest] = useState(0)
  const [query, setQuery] = useState('')
  const [state, setState] = useState<ViewState>({ status: 'loading' })
  const [lang, setLang] = useState(getLang())
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ official: true, community: false })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [busy, setBusy] = useState<Record<string, boolean>>({})
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null)
  const [, force] = useReducer((x: number) => x + 1, 0)

  useEffect(() => subscribeLang(() => { setLang(getLang()); force() }), [subscribeLang, getLang])

  useEffect(() => {
    let current = true
    setState({ status: 'loading' })
    void Promise.resolve().then(list).then(
      (data) => { if (current) setState({ status: 'ready', data }) },
      () => { if (current) setState({ status: 'error' }) },
    )
    return () => { current = false }
  }, [list, request])

  const normalized = query.trim().toLocaleLowerCase()
  const groups = useMemo(() => {
    if (state.status !== 'ready') return { official: [] as EntryInfo[], community: [] as EntryInfo[] }
    const pick = (group: 'official' | 'community'): EntryInfo[] =>
      state.data[group].filter(entry => matches(entry, normalized))
    return { official: pick('official'), community: pick('community') }
  }, [normalized, state])

  const displayName = (entry: EntryInfo): string =>
    entry.packageName !== null ? describe(entry.packageName, lang) ?? entry.description ?? t('noDescription') : entry.description ?? t('noDescription')

  const retry = (): void => { setRequest(value => value + 1) }

  const onToggle = async (entry: EntryInfo): Promise<void> => {
    const target = !entry.enabled
    setBusy(current => ({ ...current, [entry.entryId]: true }))
    setNotice(null)
    // Optimistic flip, reverted on failure.
    setState(current => current.status === 'ready'
      ? {
          status: 'ready',
          data: {
            ...current.data,
            official: current.data.official.map(e => e.entryId === entry.entryId ? { ...e, enabled: target } : e),
            community: current.data.community.map(e => e.entryId === entry.entryId ? { ...e, enabled: target } : e),
          },
        }
      : current)
    const result = await toggle({ entryId: entry.entryId, enabled: target })
    setBusy(current => ({ ...current, [entry.entryId]: false }))
    if (!result.ok) {
      setState(current => current.status === 'ready'
        ? {
            status: 'ready',
            data: {
              ...current.data,
              official: current.data.official.map(e => e.entryId === entry.entryId ? { ...e, enabled: !target } : e),
              community: current.data.community.map(e => e.entryId === entry.entryId ? { ...e, enabled: !target } : e),
            },
          }
        : current)
      setNotice({ text: `${t('operationFailed')}${result.message}`, error: true })
    }
  }

  const onUninstall = async (entry: EntryInfo): Promise<void> => {
    if (entry.packageName === null) return
    if (!globalThis.confirm(t('uninstallConfirm'))) return
    setBusy(current => ({ ...current, [entry.entryId]: true }))
    setNotice(null)
    const result = await uninstall(entry.packageName)
    setBusy(current => ({ ...current, [entry.entryId]: false }))
    if (!result.ok) {
      setNotice({ text: `${t('operationFailed')}${result.message}`, error: true })
      return
    }
    setState(current => current.status === 'ready'
      ? {
          status: 'ready',
          data: {
            ...current.data,
            official: current.data.official.filter(e => e.entryId !== entry.entryId),
            community: current.data.community.filter(e => e.entryId !== entry.entryId),
          },
        }
      : current)
    setNotice({ text: t('uninstallDone'), error: false })
  }

  const renderCard = (entry: EntryInfo): ReactNode => {
    const protectedModule = state.status === 'ready' && state.data.protectedModules.includes(entry.moduleName)
    const open = expandedId === entry.entryId
    const badges: ReactNode[] = []
    if (protectedModule) badges.push(<span key="p" data-kind="protected">{t('protected')}</span>)
    if (entry.patchState === 'disabled') badges.push(<span key="d" data-kind="patch">{t('patchDisabled')}</span>)
    if (entry.patchState === 'forced') badges.push(<span key="f" data-kind="patch">{t('patchForced')}</span>)
    const phase = entry.fiberPhase ?? 'unobserved'
    return (
      <CardShell
        key={entry.entryId}
        title={moduleShortName(entry.moduleName)}
        badges={badges}
        description={displayName(entry)}
        actions={(
          <>
            <span className="dsh_pm_statusDot" data-phase={phase} title={phase} />
            <button
              type="button"
              className="dsh_pm_btn dsh_pm_btnPrimary"
              disabled={protectedModule || busy[entry.entryId] === true}
              onClick={() => { void onToggle(entry) }}
            >
              {entry.enabled ? t('disable') : t('enable')}
            </button>
            {entry.group === 'community' && entry.packageName !== null ? (
              <button
                type="button"
                className="dsh_pm_btn dsh_pm_btnDanger"
                disabled={protectedModule || busy[entry.entryId] === true}
                onClick={() => { void onUninstall(entry) }}
              >
                {t('uninstall')}
              </button>
            ) : null}
            <button
              type="button"
              className="dsh_pm_btn"
              onClick={() => { setExpandedId(open ? null : entry.entryId) }}
            >
              {open ? t('collapse') : t('details')}
            </button>
          </>
        )}
        details={open ? (
          <div className="dsh_pm_details">
            <div>{t('entryId')}: <code>{entry.entryId}</code></div>
            {entry.version !== null ? <div>{t('version')}: {entry.version}</div> : null}
            {entry.license !== null ? <div>{t('license')}: {entry.license}</div> : null}
            {entry.homepage !== null ? <div>{t('homepage')}: <a href={entry.homepage} target="_blank" rel="noreferrer">{entry.homepage}</a></div> : null}
            {entry.repository !== null ? <div>{t('repository')}: <a href={entry.repository} target="_blank" rel="noreferrer">{entry.repository}</a></div> : null}
            {entry.readmeSummary !== null ? <div>{t('readme')}: {entry.readmeSummary}</div> : null}
          </div>
        ) : undefined}
      />
    )
  }

  const renderGroup = (title: string, entries: readonly EntryInfo[]): ReactNode => {
    const open = !collapsed[title]
    return (
      <section key={title}>
        <button
          type="button"
          className="dsh_pm_groupHead"
          aria-expanded={open}
          onClick={() => { setCollapsed(current => ({ ...current, [title]: !current[title] })) }}
        >
          <span>{open ? '▾' : '▸'}</span>
          <span>{title}</span>
          <span className="dsh_pm_groupCount">({entries.length})</span>
        </button>
        {open ? (
          entries.length === 0
            ? <div className="dsh_pm_empty">{t('search')}</div>
            : <div className="dsh_pm_cards">{entries.map(renderCard)}</div>
        ) : null}
      </section>
    )
  }

  return (
    <div className="dsh_pm_section" aria-busy={state.status === 'loading'}>
      <div className="dsh_pm_toolbar">
        <label className="dsh_pm_search">
          <input
            type="search"
            value={query}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            onChange={(event) => { setQuery(event.currentTarget.value) }}
          />
        </label>
        <button type="button" className="dsh_pm_btn" onClick={retry}>{t('retry')}</button>
      </div>
      <div className="dsh_pm_notice" data-error={notice?.error === true ? 'true' : undefined}>
        {notice !== null ? notice.text : t('restartNotice')}
      </div>
      {state.status === 'loading' ? <div className="dsh_pm_status">{t('search')}</div> : null}
      {state.status === 'error' ? (
        <div className="dsh_pm_status">
          {t('loadError')}
          <button type="button" className="dsh_pm_btn" onClick={retry}>{t('retry')}</button>
        </div>
      ) : null}
      {state.status === 'ready' ? (
        <>
          {renderGroup(t('groupOfficial'), groups.official)}
          {renderGroup(t('groupCommunity'), groups.community)}
        </>
      ) : null}
    </div>
  )
}
