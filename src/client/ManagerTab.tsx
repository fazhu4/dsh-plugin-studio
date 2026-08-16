/**
 * Plugin manager tab: official/community grouped inventory with localized
 * descriptions, enable/disable toggles (user patch layer + HMR), details,
 * community-only uninstall, and user custom groups (move/delete).
 */

import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { describe } from '../descriptions.ts'
import type {
  EntryInfo, GroupResponse, ListResponse, OpError, ToggleResponse, UninstallResponse,
} from '../contract.ts'
import type { PluginManagerLocaleKey } from './locales.ts'
import { CardShell } from './Card.tsx'

/** Registration-side business face for the manager tab. */
export interface ManagerTabInjected {
  list: () => Promise<ListResponse>
  toggle: (body: { entryId: string; enabled: boolean }) => Promise<ToggleResponse | OpError>
  uninstall: (packageName: string) => Promise<UninstallResponse | OpError>
  group: (moduleName: string, groupName: string | null) => Promise<GroupResponse | OpError>
  groupDelete: (groupName: string) => Promise<GroupResponse | OpError>
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

interface Picker {
  readonly entry: EntryInfo
  readonly groups: readonly string[]
}

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
  return [entry.moduleName, entry.entryId, entry.packageName ?? '', entry.group]
    .some(value => value !== '' && value.toLocaleLowerCase().includes(query))
}

export function ManagerTab(props: ManagerTabProps): ReactNode {
  const { list, toggle, uninstall, group, groupDelete, getLang, subscribeLang, t } = props
  const [request, setRequest] = useState(0)
  const [query, setQuery] = useState('')
  const [state, setState] = useState<ViewState>({ status: 'loading' })
  const [lang, setLang] = useState(getLang())
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ official: true, community: false })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [busy, setBusy] = useState<Record<string, boolean>>({})
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null)
  const [picker, setPicker] = useState<Picker | null>(null)
  const [newGroupName, setNewGroupName] = useState('')
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
  const filtered = useMemo(() => {
    if (state.status !== 'ready') return { official: [], community: [], custom: [] as Array<{ name: string; entries: EntryInfo[] }> }
    const pick = (entries: readonly EntryInfo[]): EntryInfo[] => entries.filter(e => matches(e, normalized))
    return {
      official: pick(state.data.official),
      community: pick(state.data.community),
      custom: state.data.customGroups.map(g => ({ name: g.name, entries: pick(g.entries) })),
    }
  }, [normalized, state])

  const displayName = (entry: EntryInfo): string =>
    entry.packageName !== null ? describe(entry.packageName, lang) ?? entry.description ?? t('noDescription') : entry.description ?? t('noDescription')

  const retry = (): void => { setRequest(value => value + 1) }

  const refresh = (): void => { setRequest(value => value + 1) }

  const onToggle = async (entry: EntryInfo): Promise<void> => {
    const target = !entry.enabled
    setBusy(current => ({ ...current, [entry.entryId]: true }))
    setNotice(null)
    setState(current => current.status === 'ready'
      ? { status: 'ready', data: mapEntry(current.data, entry.entryId, e => ({ ...e, enabled: target })) }
      : current)
    const result = await toggle({ entryId: entry.entryId, enabled: target })
    setBusy(current => ({ ...current, [entry.entryId]: false }))
    if (!result.ok) {
      setState(current => current.status === 'ready'
        ? { status: 'ready', data: mapEntry(current.data, entry.entryId, e => ({ ...e, enabled: !target })) }
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
    refresh()
    setNotice({ text: t('uninstallDone'), error: false })
  }

  const openPicker = (entry: EntryInfo): void => {
    if (state.status !== 'ready') return
    setPicker({ entry, groups: state.data.customGroups.map(g => g.name) })
    setNewGroupName('')
  }

  const moveTo = async (groupName: string | null): Promise<void> => {
    if (picker === null) return
    const result = await group(picker.entry.moduleName, groupName)
    if (!result.ok) {
      setNotice({ text: `${t('operationFailed')}${result.message}`, error: true })
      return
    }
    setPicker(null)
    refresh()
    setNotice({ text: t('groupUpdated'), error: false })
  }

  const createGroup = async (): Promise<void> => {
    const name = newGroupName.trim()
    if (name === '') return
    await moveTo(name)
  }

  const onDeleteGroup = async (name: string): Promise<void> => {
    if (!globalThis.confirm(t('deleteGroupConfirm'))) return
    const result = await groupDelete(name)
    if (!result.ok) {
      setNotice({ text: `${t('operationFailed')}${result.message}`, error: true })
      return
    }
    refresh()
  }

  const renderCard = (entry: EntryInfo): ReactNode => {
    const protectedModule = state.status === 'ready' && state.data.protectedModules.includes(entry.moduleName)
    const open = expandedId === entry.entryId
    const badges: ReactNode[] = []
    if (protectedModule) badges.push(<span key="p" data-kind="protected">{t('protected')}</span>)
    if (entry.patchState === 'disabled') badges.push(<span key="d" data-kind="patch">{t('patchDisabled')}</span>)
    if (entry.patchState === 'forced') badges.push(<span key="f" data-kind="patch">{t('patchForced')}</span>)
    if (entry.groupOverridden) badges.push(<span key="g" data-kind="patch">{entry.group}</span>)
    const phase = entry.fiberPhase ?? 'unobserved'
    return (
      <CardShell
        key={entry.entryId}
        title={moduleShortName(entry.moduleName)}
        badges={badges}
        description={displayName(entry)}
        actions={(
          <>
            <span className="dsh_pm_statusDot" data-phase={phase} role="img" aria-label={phase} title={phase} />
            <button
              type="button"
              className="dsh_pm_btn dsh_pm_btnPrimary"
              disabled={protectedModule || busy[entry.entryId] === true}
              onClick={() => { void onToggle(entry) }}
            >
              {entry.enabled ? t('disable') : t('enable')}
            </button>
            <button
              type="button"
              className="dsh_pm_btn"
              onClick={() => { openPicker(entry) }}
            >
              {t('groupButton')}
            </button>
            {entry.group === 'community' && !entry.groupOverridden && entry.packageName !== null ? (
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

  const renderGroup = (title: string, entries: readonly EntryInfo[], deletable = false): ReactNode => {
    const open = !collapsed[title]
    return (
      <section key={title}>
        <div className="dsh_pm_groupRow">
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
          {deletable ? (
            <button type="button" className="dsh_pm_btn dsh_pm_btnDanger dsh_pm_groupDel" onClick={() => { void onDeleteGroup(title) }}>
              {t('deleteGroup')}
            </button>
          ) : null}
        </div>
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
          {renderGroup(t('groupOfficial'), filtered.official)}
          {renderGroup(t('groupCommunity'), filtered.community)}
          {filtered.custom.map(g => renderGroup(g.name, g.entries, true))}
        </>
      ) : null}

      {picker !== null ? (
        <div className="dsh_pm_overlay" role="dialog" aria-label={t('moveToGroup')}>
          <div className="dsh_pm_dialog">
            <div className="dsh_pm_dialogTitle">{t('moveToGroup')}: {moduleShortName(picker.entry.moduleName)}</div>
            {picker.groups.length > 0 ? (
              <div className="dsh_pm_groupList">
                {picker.groups.map(name => (
                  <button key={name} type="button" className="dsh_pm_btn" onClick={() => { void moveTo(name) }}>
                    {name}
                  </button>
                ))}
              </div>
            ) : <div className="dsh_pm_empty">{t('noDescription')}</div>}
            <div className="dsh_pm_toolbar">
              <input
                className="dsh_pm_input"
                type="text"
                value={newGroupName}
                placeholder={t('newGroupPlaceholder')}
                onChange={(event) => { setNewGroupName(event.currentTarget.value) }}
                onKeyDown={(event) => { if (event.key === 'Enter') void createGroup() }}
              />
              <button type="button" className="dsh_pm_btn dsh_pm_btnPrimary" onClick={() => { void createGroup() }}>{t('newGroup')}</button>
            </div>
            {picker.entry.groupOverridden ? (
              <button type="button" className="dsh_pm_btn" onClick={() => { void moveTo(null) }}>{t('restoreDefault')}</button>
            ) : null}
            <div className="dsh_pm_toolbar">
              <button type="button" className="dsh_pm_btn" onClick={() => { setPicker(null) }}>{t('cancel')}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** Apply `map` to every entry in a ListResponse, preserving group buckets. */
function mapEntry(data: ListResponse, entryId: string, map: (e: EntryInfo) => EntryInfo): ListResponse {
  return {
    ...data,
    official: data.official.map(e => e.entryId === entryId ? map(e) : e),
    community: data.community.map(e => e.entryId === entryId ? map(e) : e),
    customGroups: data.customGroups.map(g => ({ ...g, entries: g.entries.map(e => e.entryId === entryId ? map(e) : e) })),
  }
}
