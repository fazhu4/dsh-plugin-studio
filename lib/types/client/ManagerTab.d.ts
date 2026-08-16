/**
 * Plugin manager tab: official/community grouped inventory with localized
 * descriptions, enable/disable toggles (user patch layer + HMR), details,
 * community-only uninstall, and user custom groups (create/move/delete).
 * Custom-group assignment uses a popover anchored next to the card action.
 */
import { type ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { GroupResponse, ListResponse, OpError, ToggleResponse, UninstallResponse } from '../contract.ts';
/** Registration-side business face for the manager tab. */
export interface ManagerTabInjected {
    list: () => Promise<ListResponse>;
    toggle: (body: {
        entryId: string;
        enabled: boolean;
    }) => Promise<ToggleResponse | OpError>;
    uninstall: (packageName: string) => Promise<UninstallResponse | OpError>;
    group: (moduleName: string, groupName: string | null) => Promise<GroupResponse | OpError>;
    groupDelete: (groupName: string) => Promise<GroupResponse | OpError>;
    groupCreate: (groupName: string) => Promise<GroupResponse | OpError>;
    groupList: () => Promise<string[]>;
    getLang: () => 'zh' | 'en';
    subscribeLang: (listener: () => void) => () => void;
}
export type ManagerTabProps = PropsRuntime<'settings.plugins.tab'> & PropsLocale<'pluginManager'> & InjectFace<ManagerTabInjected>;
export declare function ManagerTab(props: ManagerTabProps): ReactNode;
