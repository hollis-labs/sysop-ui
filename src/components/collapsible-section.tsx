import { useState, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SectionAccent = 'blue' | 'violet' | 'amber' | 'red' | 'green' | 'neutral'

const ACCENT: Record<SectionAccent, string> = {
  blue: 'border-l-status-doing',
  violet: 'border-l-status-review',
  amber: 'border-l-status-queued',
  red: 'border-l-status-blocked',
  green: 'border-l-status-done',
  neutral: 'border-l-border-strong',
}

interface CollapsibleSectionProps {
  label: string
  /** Left accent-bar color. Default `neutral`. */
  accent?: SectionAccent
  children: ReactNode
  /** Default true. `false` → always open, no toggle. */
  collapsible?: boolean
  /** Initial open state when collapsible. Default false. */
  defaultOpen?: boolean
  /** Inline summary shown beside the label while collapsed. */
  summary?: string
  className?: string
}

/**
 * Accent-bordered, collapsible detail section — the section pattern Torque's
 * detail pages use. For the flat titled divider inside a `DetailDialog`, use
 * `DetailSection` instead.
 */
export function CollapsibleSection({
  label,
  accent = 'neutral',
  children,
  collapsible = true,
  defaultOpen = false,
  summary,
  className,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(collapsible ? defaultOpen : true)
  const show = !collapsible || open

  return (
    <section
      className={cn(
        'rounded-md border border-l-2 border-border-soft bg-panel',
        ACCENT[accent],
        className,
      )}
    >
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-panel-hover/40"
        >
          <span className="text-[10px] uppercase tracking-[.18em] text-text-subtle">{label}</span>
          <span className="flex items-center gap-2 text-[10px] text-text-subtle">
            {summary && !open ? <span className="max-w-md truncate">{summary}</span> : null}
            <ChevronRight className={cn('h-3 w-3 transition-transform', open && 'rotate-90')} />
          </span>
        </button>
      ) : (
        <div className="px-3 py-2">
          <span className="text-[10px] uppercase tracking-[.18em] text-text-subtle">{label}</span>
        </div>
      )}
      {show ? (
        <div className="border-t border-border-soft px-3 py-3">{children}</div>
      ) : null}
    </section>
  )
}
