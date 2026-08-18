/**
 * Plugin manager tab: official/community grouped inventory with localized
 * descriptions, enable/disable toggles (user patch layer + HMR), details,
 * community-only uninstall, and user custom groups (create/move/delete).
 * Custom-group assignment uses a popover anchored next to the card action.
 */

import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {
  EntryInfo, GroupResponse, ListResponse, OpError, ToggleResponse, UninstallResponse,
} from '../contract.ts'
import type { PluginManagerLocaleKey } from './locales.ts'
import { CardShell } from './Card.tsx'
import { entryDescription } from './entry-display.ts'

/** Registration-side business face for the manager tab. */
export interface ManagerTabInjected {
  list: () => Promise<ListResponse>
  toggle: (body: { entryId: string; enabled: boolean }) => Promise<ToggleResponse | OpError>
  uninstall: (packageName: string) => Promise<UninstallResponse | OpError>
  group: (moduleName: string, groupName: string | null) => Promise<GroupResponse | OpError>
  groupDelete: (groupName: string) => Promise<GroupResponse | OpError>
  groupCreate: (groupName: string) => Promise<GroupResponse | OpError>
  groupList: () => Promise<string[]>
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
  return [entry.moduleName, entry.entryId, entry.packageName ?? '', entry.group]
    .some(value => value !== '' && value.toLocaleLowerCase().includes(query))
}

export function ManagerTab(props: ManagerTabProps): ReactNode {
  const { list, toggle, uninstall, group, groupDelete, groupCreate, groupList, getLang, subscribeLang, t } = props
  const [request, setRequest] = useState(0)
  const [query, setQuery] = useState('')
  const [state, setState] = useState<ViewState>({ status: 'loading' })
  const [lang, setLang] = useState(getLang())
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ official: true, community: false })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [busy, setBusy] = useState<Record<string, boolean>>({})
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null)
  // Custom-group assignment UI.
  const [pickerEntry, setPickerEntry] = useState<EntryInfo | null>(null)
  const [groupNames, setGroupNames] = useState<string[]>([])
  const [pickNew, setPickNew] = useState('')
  const [showNewGroupToolbar, setShowNewGroupToolbar] = useState(false)
  const [toolbarNew, setToolbarNew] = useState('')
  const pickerRef = useRef<HTMLDivElement | null>(null)
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

  // Close the picker on an outside click.
  useEffect(() => {
    if (pickerEntry === null) return
    const onDocDown = (event: MouseEvent): void => {
      if (pickerRef.current !== null && !pickerRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('.dspm_groupButton')) {
        setPickerEntry(null)
      }
    }
    document.addEventListener('mousedown', onDocDown)
    return () => { document.removeEventListener('mousedown', onDocDown) }
  }, [pickerEntry])

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

  const displayName = (entry: EntryInfo): string => entryDescription(entry, lang, t('noDescription'))

  const retry = (): void => { setRequest(value => value + 1) }
  const refresh = (): void => { setRequest(value => value + 1) }

  /** Apply `map` to every entry in the snapshot, preserving group buckets. */
  const mapEntries = (map: (e: EntryInfo) => EntryInfo): void => {
    setState(current => current.status === 'ready'
      ? {
          status: 'ready',
          data: {
            ...current.data,
            official: current.data.official.map(map),
            community: current.data.community.map(map),
            customGroups: current.data.customGroups.map(g => ({ ...g, entries: g.entries.map(map) })),
          },
        }
      : current)
  }

  const onToggle = async (entry: EntryInfo): Promise<void> => {
    const target = !entry.enabled
    setBusy(current => ({ ...current, [entry.entryId]: true }))
    setNotice(null)
    mapEntries(e => e.entryId === entry.entryId ? { ...e, enabled: target } : e)
    const result = await toggle({ entryId: entry.entryId, enabled: target })
    setBusy(current => ({ ...current, [entry.entryId]: false }))
    if (!result.ok) {
      mapEntries(e => e.entryId === entry.entryId ? { ...e, enabled: !target } : e)
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

  const openPicker = async (entry: EntryInfo): Promise<void> => {
    setPickerEntry(entry)
    setPickNew('')
    try {
      setGroupNames(await groupList())
    } catch {
      setGroupNames(state.status === 'ready' ? state.data.customGroups.map(g => g.name) : [])
    }
  }

  const commitMove = async (groupName: string | null): Promise<void> => {
    if (pickerEntry === null) return
    const result = await group(pickerEntry.moduleName, groupName)
    setPickerEntry(null)
    if (!result.ok) {
      setNotice({ text: `${t('operationFailed')}${result.message}`, error: true })
      return
    }
    refresh()
  }

  const createFromPicker = async (): Promise<void> => {
    const name = pickNew.trim()
    if (name === '') return
    const result = await groupCreate(name)
    if (!result.ok) {
      setNotice({ text: `${t('operationFailed')}${result.message}`, error: true })
      return
    }
    setGroupNames(prev => [...prev.filter(n => n !== name), name].sort((a, b) => a.localeCompare(b)))
    setPickNew('')
  }

  const createFromToolbar = async (): Promise<void> => {
    const name = toolbarNew.trim()
    if (name === '') return
    const result = await groupCreate(name)
    setToolbarNew('')
    setShowNewGroupToolbar(false)
    if (!result.ok) {
      setNotice({ text: `${t('operationFailed')}${result.message}`, error: true })
      return
    }
    refresh()
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
    const isPickerTarget = pickerEntry?.entryId === entry.entryId
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
          <div className="dspm_actionsWrap">
            <div className="dspm_actions">
              <span className="dspm_statusDot" data-phase={phase} role="img" aria-label={phase} title={phase} />
              <button
                type="button"
                className="dspm_btn dspm_btnPrimary"
                disabled={protectedModule || busy[entry.entryId] === true}
                onClick={() => { void onToggle(entry) }}
              >
                {entry.enabled ? t('disable') : t('enable')}
              </button>
              <button
                type="button"
                className="dspm_btn dspm_groupButton"
                aria-haspopup="listbox"
                aria-expanded={isPickerTarget}
                onClick={() => { if (isPickerTarget) { setPickerEntry(null) } else { void openPicker(entry) } }}
              >
                {t('groupButton')}
              </button>
              {entry.group === 'community' && !entry.groupOverridden && entry.packageName !== null ? (
                <button
                  type="button"
                  className="dspm_btn dspm_btnDanger"
                  disabled={protectedModule || busy[entry.entryId] === true}
                  onClick={() => { void onUninstall(entry) }}
                >
                  {t('uninstall')}
                </button>
              ) : null}
              <button
                type="button"
                className="dspm_btn"
                onClick={() => { setExpandedId(open ? null : entry.entryId) }}
              >
                {open ? t('collapse') : t('details')}
              </button>
            </div>
            {isPickerTarget ? (
              <div className="dspm_popover" ref={pickerRef} role="listbox" aria-label={t('moveToGroup')}>
                <div className="dspm_popTitle">{t('moveToGroup')}</div>
                {groupNames.length > 0 ? (
                  <div className="dspm_groupList">
                    {groupNames.map(name => (
                      <button key={name} type="button" role="option" className="dspm_popItem" onClick={() => { void commitMove(name) }}>
                        {name}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="dspm_toolbar">
                  <input
                    className="dspm_input"
                    type="text"
                    value={pickNew}
                    placeholder={t('newGroupPlaceholder')}
                    onChange={(event) => { setPickNew(event.currentTarget.value) }}
                    onKeyDown={(event) => { if (event.key === 'Enter') void createFromPicker() }}
                  />
                  <button type="button" className="dspm_btn dspm_btnPrimary" onClick={() => { void createFromPicker() }}>{t('newGroup')}</button>
                </div>
                {pickerEntry.groupOverridden ? (
                  <button type="button" className="dspm_popItem dspm_popReset" onClick={() => { void commitMove(null) }}>{t('restoreDefault')}</button>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
        details={open ? (
          <div className="dspm_details">
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
        <div className="dspm_groupRow">
          <button
            type="button"
            className="dspm_groupHead"
            aria-expanded={open}
            onClick={() => { setCollapsed(current => ({ ...current, [title]: !current[title] })) }}
          >
            <span>{open ? '▾' : '▸'}</span>
            <span>{title}</span>
            <span className="dspm_groupCount">({entries.length})</span>
          </button>
          {deletable ? (
            <button type="button" className="dspm_btn dspm_btnDanger dspm_groupDel" onClick={() => { void onDeleteGroup(title) }}>
              {t('deleteGroup')}
            </button>
          ) : null}
        </div>
        {open ? (
          entries.length === 0
            ? <div className="dspm_empty">{t('emptyGroup')}</div>
            : <div className="dspm_cards">{entries.map(renderCard)}</div>
        ) : null}
      </section>
    )
  }

  return (
    <div className="dspm_section" aria-busy={state.status === 'loading'}>
      <div className="dspm_toolbar">
        <label className="dspm_search">
          <input
            type="search"
            value={query}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            onChange={(event) => { setQuery(event.currentTarget.value) }}
          />
        </label>
        {showNewGroupToolbar ? (
          <>
            <input
              className="dspm_input dspm_newGroupInput"
              type="text"
              value={toolbarNew}
              placeholder={t('newGroupPlaceholder')}
              autoFocus
              onChange={(event) => { setToolbarNew(event.currentTarget.value) }}
              onKeyDown={(event) => { if (event.key === 'Enter') void createFromToolbar(); if (event.key === 'Escape') setShowNewGroupToolbar(false) }}
            />
            <button type="button" className="dspm_btn dspm_btnPrimary" onClick={() => { void createFromToolbar() }}>{t('confirm')}</button>
            <button type="button" className="dspm_btn" onClick={() => { setShowNewGroupToolbar(false) }}>{t('cancel')}</button>
          </>
        ) : (
          <button type="button" className="dspm_btn dspm_btnPrimary" onClick={() => { setShowNewGroupToolbar(true) }}>
            + {t('newGroup')}
          </button>
        )}
        <button type="button" className="dspm_btn" onClick={retry}>{t('retry')}</button>
      </div>
      <div className="dspm_notice" data-error={notice?.error === true ? 'true' : undefined}>
        {notice !== null ? notice.text : t('restartNotice')}
      </div>
      {state.status === 'loading' ? <div className="dspm_status">{t('search')}</div> : null}
      {state.status === 'error' ? (
        <div className="dspm_status">
          {t('loadError')}
          <button type="button" className="dspm_btn" onClick={retry}>{t('retry')}</button>
        </div>
      ) : null}
      {state.status === 'ready' ? (
        <>
          {renderGroup(t('groupOfficial'), filtered.official)}
          {renderGroup(t('groupCommunity'), filtered.community)}
          {filtered.custom.map(g => renderGroup(g.name, g.entries, true))}
        </>
      ) : null}
    </div>
  )
}
