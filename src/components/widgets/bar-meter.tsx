import { cn } from '@/lib/utils'

/** One labeled row in a {@link BarMeter}. */
export interface BarMeterRow {
  /** Stable key. */
  key: string
  /** Human label shown beside the bar. */
  label: string
  /** Numeric magnitude — bar width is `value / max`. */
  value: number
  /** Bar color — a theme token string. Default `var(--color-status-doing)`. */
  color?: string
}

export interface BarMeterProps {
  /** Pre-computed rows — the caller owns the bucketing. */
  rows: BarMeterRow[]
  /** Header title. */
  title?: string
  /** Bar-width denominator. Default = largest row value (min 1). */
  max?: number
  className?: string
}

const DEFAULT_COLOR = 'var(--color-status-doing)'

/**
 * Horizontal labeled bar meter — a stack of thin bars sized against a shared
 * max. Generic and dependency-free; the caller pre-computes the rows.
 */
export function BarMeter({ rows, title, max, className }: BarMeterProps) {
  const resolvedMax = max ?? Math.max(1, ...rows.map((r) => r.value))
  const total = rows.reduce((a, r) => a + r.value, 0)

  return (
    <div className={cn('flex flex-col gap-2', className)} aria-label={title}>
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/80 tabular-nums">
          {total} total
        </span>
      </div>
      {rows.map((row) => {
        const color = row.color ?? DEFAULT_COLOR
        const pct = (row.value / resolvedMax) * 100
        return (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between">
              <span
                className="font-mono text-[9px] uppercase tracking-widest"
                style={{ color }}
              >
                {row.label}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {row.value}
              </span>
            </div>
            <div className="h-[5px] w-full overflow-hidden rounded-sm bg-muted/50">
              <div
                className="h-full rounded-sm"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
