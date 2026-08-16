import type { ReactNode } from 'react';
/** Shared card shell for the manager and market tabs. */
export declare function CardShell(props: {
    title: string;
    badges?: readonly ReactNode[];
    description?: ReactNode;
    actions?: ReactNode;
    details?: ReactNode;
}): ReactNode;
