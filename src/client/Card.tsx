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
    <div className="dspm_card">
      <div className="dspm_cardRow">
        <span className="dspm_title" title={props.title}>{props.title}</span>
        {props.badges?.map((badge, index) => <span key={index} className="dspm_badge">{badge}</span>)}
      </div>
      {props.description !== undefined ? <div className="dspm_desc">{props.description}</div> : null}
      {props.actions !== undefined ? <div className="dspm_actions">{props.actions}</div> : null}
      {props.details}
    </div>
  )
}
