import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type PillTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info'

const TONES: Record<PillTone, string> = {
  neutral: 'border-border bg-panel-2 text-text-soft',
  success: 'border-status-done/40 bg-status-done/10 text-status-done',
  danger: 'border-status-blocked/40 bg-status-blocked/10 text-status-blocked',
  warning: 'border-status-paused/40 bg-status-paused/10 text-status-paused',
  info: 'border-status-doing/40 bg-status-doing/10 text-status-doing',
}

interface PillProps {
  children: ReactNode
  /** Color tone. Default `neutral`. */
  tone?: PillTone
  /** Render a leading dot in the current color. */
  dot?: boolean
  className?: string
}

/**
 * Mini status chip — a compact inline pill for on/off, enabled/disabled, and
 * ok/error indicators. Smaller and lighter than `StatusBadge`; not tied to the
 * canonical status vocabulary.
 */
export function Pill({ children, tone = 'neutral', dot = false, className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider',
        TONES[tone],
        className,
      )}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden /> : null}
      {children}
    </span>
  )
}
