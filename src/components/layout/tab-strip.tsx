import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface TabStripItem<K extends string> {
  /** Stable key — also the value passed to `onChange`. */
  key: K
  /** Visible label. */
  label: string
  /** Optional leading icon (e.g. a lucide icon at `h-3.5 w-3.5`). */
  icon?: ReactNode
  /** Optional trailing count badge. */
  count?: number
}

interface TabStripProps<K extends string> {
  tabs: readonly TabStripItem<K>[]
  value: K
  onChange: (key: K) => void
  /** Right-aligned controls (e.g. a Refresh button). */
  actions?: ReactNode
}

/**
 * Pinned underline tab strip — the in-page tab switcher used across the Sysop
 * apps' operations/activity pages. Place it in a `ListPageLayout`'s `tabs`
 * slot. Controlled: the caller owns the active key.
 */
export function TabStrip<K extends string>({ tabs, value, onChange, actions }: TabStripProps<K>) {
  return (
    <div className="flex items-center justify-between border-b border-border-strong bg-bg px-4">
      <div className="flex items-center gap-4">
        {tabs.map((tab) => {
          const active = tab.key === value
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 border-b-2 px-1 text-[11px] font-semibold uppercase tracking-[.14em] transition-colors',
                active
                  ? 'border-text-soft text-text'
                  : 'border-transparent text-text-subtle hover:text-text-muted',
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined ? (
                <span className="rounded-sm bg-panel-2 px-1 text-[10px] font-medium tabular-nums text-text-soft">
                  {tab.count}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
