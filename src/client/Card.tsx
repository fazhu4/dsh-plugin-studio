import type { ReactNode } from 'react'

/** Shared card shell for the manager and market tabs. */
export function CardShell(props: {
  title: string
  badges?: readonly ReactNode[]
  description?: ReactNode
  actions?: ReactNode
  details?: ReactNode
}): ReactNode {
  return (
    <div className="dsh_usage_card">
      <div className="dsh_usage_cardRow">
        <span className="dsh_usage_title" title={props.title}>{props.title}</span>
        {props.badges?.map((badge, index) => <span key={index} className="dsh_usage_badge">{badge}</span>)}
      </div>
      {props.description !== undefined ? <div className="dsh_usage_desc">{props.description}</div> : null}
      {props.actions !== undefined ? <div className="dsh_usage_actions">{props.actions}</div> : null}
      {props.details}
    </div>
  )
}
