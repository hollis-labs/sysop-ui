import type { ReactNode } from 'react'

interface MetricProps {
  label: string
  value: ReactNode
  /** Optional sub-text beneath the value. */
  hint?: string
  /** CSS color override for the value (e.g. a `--color-status-*` token). */
  accentColor?: string
}

/**
 * Large mono value over a small uppercase label — the dashboard/overview
 * stat block (Tether's `Metric`). For a dense single-row strip use
 * `SummaryCards` instead.
 */
export function Metric({ label, value, hint, accentColor }: MetricProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[.16em] text-text-subtle">{label}</span>
      <span
        className="font-mono text-2xl font-semibold tabular-nums text-text"
        style={accentColor ? { color: accentColor } : undefined}
      >
        {value}
      </span>
      {hint ? <span className="text-[11px] text-text-subtle">{hint}</span> : null}
    </div>
  )
}
