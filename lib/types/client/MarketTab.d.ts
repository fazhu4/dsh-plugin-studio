/**
 * Plugin market tab: a default board (top-starred / fastest-growing listings)
 * shown before any search, plus GitHub dsh-plugin search with one-click
 * add & enable. Searching replaces the board; "back to board" restores it.
 */
import { type ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { InstallResponse, MarketItem, OpError } from '../contract.ts';
/** Registration-side business face for the market tab. */
export interface MarketTabInjected {
    /** Default board listing: 'top' = most starred, 'rising' = growth proxy. */
    board: (mode: 'top' | 'rising') => Promise<MarketItem[]>;
    search: (query: string) => Promise<MarketItem[]>;
    install: (spec: string) => Promise<InstallResponse | OpError>;
}
export type MarketTabProps = PropsRuntime<'settings.plugins.tab'> & PropsLocale<'pluginManager'> & InjectFace<MarketTabInjected>;
export declare function MarketTab(props: MarketTabProps): ReactNode;
