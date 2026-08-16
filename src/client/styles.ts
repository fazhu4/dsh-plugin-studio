/** Inline styles for the plugin manager tabs (DSH design tokens). */

export const cssText = `
.dsh_ps_section { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.dsh_ps_toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dsh_ps_search { display: inline-flex; align-items: center; gap: 6px; flex: 1 1 220px; max-width: 340px; padding: 5px 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: var(--dsw-alias-bg-layer-1); }
.dsh_ps_search input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; color: var(--dsw-alias-label-primary); font-size: 13px; }
.dsh_ps_search input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh_ps_notice { padding: 8px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; }
.dsh_ps_notice[data-error='true'] { border-color: var(--dsw-alias-state-danger-border, var(--dsw-alias-border-l2)); color: var(--dsw-alias-state-danger-fg, var(--dsw-alias-label-primary)); }
.dsh_ps_groupHead { display: flex; align-items: center; gap: 8px; width: 100%; border: none; background: transparent; padding: 6px 2px; cursor: pointer; color: var(--dsw-alias-label-primary); font-size: 14px; line-height: 22px; font-weight: 600; text-align: left; }
.dsh_ps_groupHead:hover { color: var(--dsw-alias-brand-primary); }
.dsh_ps_groupCount { color: var(--dsw-alias-label-tertiary); font-size: 12px; font-weight: 400; }
.dsh_ps_cards { display: flex; flex-direction: column; gap: 8px; }
.dsh_ps_card { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); min-width: 0; }
.dsh_ps_cardRow { display: flex; align-items: center; gap: 8px; min-width: 0; }
.dsh_ps_title { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 20px; font-weight: 600; }
.dsh_ps_badge { flex: 0 0 auto; padding: 1px 8px; border-radius: 999px; font-size: 11px; line-height: 18px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-2); }
.dsh_ps_badge[data-kind='protected'] { color: var(--dsw-alias-state-danger-fg, var(--dsw-alias-label-secondary)); }
.dsh_ps_badge[data-kind='patch'] { color: var(--dsw-alias-state-business-primary, var(--dsw-alias-label-secondary)); }
.dsh_ps_desc { color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.dsh_ps_actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.dsh_ps_btn { border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; padding: 2px 10px; font-size: 12px; line-height: 20px; cursor: pointer; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
.dsh_ps_btn:hover { border-color: var(--dsw-alias-brand-primary); }
.dsh_ps_btn:disabled { opacity: 0.5; cursor: default; }
.dsh_ps_btnPrimary { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.dsh_ps_btnDanger { color: var(--dsw-alias-state-danger-fg, var(--dsw-alias-label-primary)); }
.dsh_ps_statusDot { width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-bg-layer-3); }
.dsh_ps_statusDot[data-phase='active'] { background: var(--dsw-alias-state-success-fg, #2f9e44); }
.dsh_ps_statusDot[data-phase='failed'] { background: var(--dsw-alias-state-danger-fg, #e03131); }
.dsh_ps_statusDot[data-phase='loading'] { background: var(--dsw-alias-brand-primary); }
.dsh_ps_details { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-top: 1px solid var(--dsw-alias-border-l1); font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); min-width: 0; }
.dsh_ps_details a { color: var(--dsw-alias-brand-primary); text-decoration: none; overflow-wrap: anywhere; }
.dsh_ps_details code { color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }
.dsh_ps_status { padding: 24px 0; text-align: center; color: var(--dsw-alias-label-tertiary); font-size: 13px; }
.dsh_ps_empty { padding: 24px 0; text-align: center; color: var(--dsw-alias-label-tertiary); font-size: 13px; }
.dsh_ps_groupRow { display: flex; align-items: center; gap: 8px; }
.dsh_ps_groupRow .dsh_ps_groupHead { width: auto; flex: 1 1 auto; }
.dsh_ps_groupDel { flex: 0 0 auto; }
.dsh_ps_groupList { display: flex; flex-direction: column; gap: 6px; }
.dsh_ps_input { flex: 1; min-width: 0; padding: 5px 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font-size: 13px; }
.dsh_ps_input:focus { outline: none; border-color: var(--dsw-alias-brand-primary); }
.dsh_ps_actionsWrap { position: relative; }
.dsh_ps_newGroupInput { flex: 0 1 160px; }
.dsh_ps_popover { position: absolute; top: calc(100% + 6px); left: 0; z-index: 50; min-width: 200px; max-width: 260px; display: flex; flex-direction: column; gap: 6px; padding: 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18); }
.dsh_ps_popTitle { color: var(--dsw-alias-label-tertiary); font-size: 12px; }
.dsh_ps_popItem { display: block; width: 100%; text-align: left; border: none; background: transparent; padding: 5px 8px; border-radius: 6px; font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-primary); cursor: pointer; }
.dsh_ps_popItem:hover { background: var(--dsw-alias-bg-layer-2); }
.dsh_ps_popReset { color: var(--dsw-alias-state-danger-fg, var(--dsw-alias-label-primary)); }
`

/** Adopt the stylesheet once. */
export function adoptStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById('dsh-plugin-studio-styles')) return
  const style = document.createElement('style')
  style.id = 'dsh-plugin-studio-styles'
  style.textContent = cssText
  document.head.appendChild(style)
}
