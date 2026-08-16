/**
 * Plugin manager tab: official/community grouped inventory with localized
 * descriptions, enable/disable toggles (user patch layer + HMR), details,
 * and community-only uninstall.
 */
import { type ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ListResponse, OpError, ToggleResponse, UninstallResponse } from '../contract.ts';
/** Registration-side business face for the manager tab. */
export interface ManagerTabInjected {
    list: () => Promise<ListResponse>;
    toggle: (body: {
        entryId: string;
        enabled: boolean;
    }) => Promise<ToggleResponse | OpError>;
    uninstall: (packageName: string) => Promise<UninstallResponse | OpError>;
    getLang: () => 'zh' | 'en';
    subscribeLang: (listener: () => void) => () => void;
}
export type ManagerTabProps = PropsRuntime<'settings.plugins.tab'> & PropsLocale<'pluginManager'> & InjectFace<ManagerTabInjected>;
export declare function ManagerTab(props: ManagerTabProps): ReactNode;
