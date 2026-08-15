/**
 * Plugin market tab: a default board (top-starred / fastest-growing listings)
 * shown before any search, plus GitHub dsh-plugin search with one-click
 * add & enable. Searching replaces the board; "back to board" restores it.
 */

import { useEffect, useState, type ReactNode } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { InstallResponse, MarketItem, OpError } from '../contract.ts'
import type { PluginManagerLocaleKey } from './locales.ts'
import { CardShell } from './Card.tsx'

/** Registration-side business face for the market tab. */
export interface MarketTabInjected {
  /** Default board listing: 'top' = most starred, 'rising' = growth proxy. */
  board: (mode: 'top' | 'rising') => Promise<MarketItem[]>
  search: (query: string) => Promise<MarketItem[]>
  install: (spec: string) => Promise<InstallResponse | OpError>
}

export type MarketTabProps =
  PropsRuntime<'settings.plugins.tab'>
  & PropsLocale<'pluginManager'>
  & InjectFace<MarketTabInjected>

type SearchState =
  | { readonly status: 'loading' }
  | { readonly status: 'done'; readonly items: readonly MarketItem[]; readonly source: 'board' | 'search' }
  | { readonly status: 'error' }

export function MarketTab(props: MarketTabProps): ReactNode {
  const { board, search, install, t } = props
  const [query, setQuery] = useState('')
  const [boardTab, setBoardTab] = useState<'top' | 'rising'>('top')
  const [state, setState] = useState<SearchState>({ status: 'loading' })
  const [installing, setInstalling] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null)

  const loadBoard = async (mode: 'top' | 'rising'): Promise<void> => {
    setState({ status: 'loading' })
    setNotice(null)
    try {
      const items = await board(mode)
      setState({ status: 'done', items, source: 'board' })
    } catch {
      setState({ status: 'error' })
    }
  }

  // Load the default board on mount and whenever the board tab switches.
  useEffect(() => { void loadBoard(boardTab) }, [boardTab])

  const runSearch = async (): Promise<void> => {
    const q = query.trim() === '' ? t('marketDefaultQuery') : query.trim()
    setState({ status: 'loading' })
    setNotice(null)
    try {
      const items = await search(q)
      setState({ status: 'done', items, source: 'search' })
      if (items.length === 0) setNotice({ text: t('marketEmpty'), error: false })
    } catch {
      setState({ status: 'error' })
    }
  }

  const backToBoard = (): void => {
    setQuery('')
    void loadBoard(boardTab)
  }

  const onInstall = async (item: MarketItem): Promise<void> => {
    setInstalling(item.fullName)
    setNotice(null)
    const spec = item.npmName ?? item.fullName
    const result = await install(spec)
    setInstalling(null)
    if (!result.ok) {
      setNotice({ text: `${t('operationFailed')}${result.message}`, error: true })
      return
    }
    const warning = 'warning' in result && result.warning !== undefined ? ` ${t('installWarning')}${result.warning}` : ''
    setNotice({ text: `${t('installDone')}${warning}`, error: false })
  }

  const renderCards = (items: readonly MarketItem[]): ReactNode => (
    <div className="dsh_pm_cards">
      {items.map(item => {
        const badges: ReactNode[] = [
          <span key="src">{item.source === 'npm' ? t('npmDirect') : t('githubInstall')}</span>,
        ]
        if (item.dshBundle) badges.push(<span key="dsh" data-kind="patch">{t('dshBundleHint')}</span>)
        return (
          <CardShell
            key={item.fullName}
            title={item.fullName}
            badges={badges}
            description={item.description === null ? t('noDescription') : item.description}
            actions={(
              <>
                <span className="dsh_pm_badge">⭐ {item.stars}</span>
                <button
                  type="button"
                  className="dsh_pm_btn dsh_pm_btnPrimary"
                  disabled={installing === item.fullName}
                  onClick={() => { void onInstall(item) }}
                >
                  {installing === item.fullName ? t('installing') : t('install')}
                </button>
              </>
            )}
          />
        )
      })}
    </div>
  )

  const searching = state.status === 'done' && state.source === 'search'

  return (
    <div className="dsh_pm_section">
      <div className="dsh_pm_toolbar">
        <label className="dsh_pm_search">
          <input
            type="search"
            value={query}
            placeholder={t('marketDefaultQuery')}
            aria-label={t('search')}
            onKeyDown={(event) => { if (event.key === 'Enter') void runSearch() }}
            onChange={(event) => { setQuery(event.currentTarget.value) }}
          />
        </label>
        <button type="button" className="dsh_pm_btn dsh_pm_btnPrimary" onClick={() => { void runSearch() }}>
          {t('search')}
        </button>
        {searching ? (
          <button type="button" className="dsh_pm_btn" onClick={backToBoard}>{t('backToBoard')}</button>
        ) : null}
      </div>
      <div className="dsh_pm_toolbar">
        <button
          type="button"
          className={boardTab === 'top' ? 'dsh_pm_btn dsh_pm_btnPrimary' : 'dsh_pm_btn'}
          onClick={() => { setBoardTab('top') }}
        >
          {t('boardTop')}
        </button>
        <button
          type="button"
          title={t('boardRisingTitle')}
          className={boardTab === 'rising' ? 'dsh_pm_btn dsh_pm_btnPrimary' : 'dsh_pm_btn'}
          onClick={() => { setBoardTab('rising') }}
        >
          {t('boardRising')}
        </button>
      </div>
      {notice !== null ? <div className="dsh_pm_notice" data-error={notice.error ? 'true' : undefined}>{notice.text}</div> : null}
      {state.status === 'loading' ? <div className="dsh_pm_status">{t('marketSearching')}</div> : null}
      {state.status === 'error' ? (
        <div className="dsh_pm_status">
          {t('marketError')}
          <button type="button" className="dsh_pm_btn" onClick={() => { void loadBoard(boardTab) }}>{t('retry')}</button>
        </div>
      ) : null}
      {state.status === 'done' ? (
        state.items.length === 0
          ? <div className="dsh_pm_empty">{t('marketEmpty')}</div>
          : renderCards(state.items)
      ) : null}
    </div>
  )
}
