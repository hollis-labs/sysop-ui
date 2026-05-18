import { cn } from '@/lib/utils'

/** One slice of a {@link DonutChart}. */
export interface DonutSegment {
  /** Stable key. */
  key: string
  /** Human label shown in the legend. */
  label: string
  /** Slice color — a theme token string (e.g. `var(--color-status-done)`). */
  color: string
  /** Numeric magnitude of the slice. */
  value: number
}

export interface DonutChartProps {
  /** Pre-computed segments — the caller owns the bucketing. */
  segments: DonutSegment[]
  /** Diameter of the donut in px. Default 120. */
  size?: number
  /** Header title. */
  title?: string
  /** Caption under the center total. Default `total`. */
  centerLabel?: string
  className?: string
}

/**
 * Hand-rolled SVG donut chart with a legend list. Generic and dependency-free —
 * the caller pre-computes the segments.
 */
export function DonutChart({
  segments,
  size = 120,
  title,
  centerLabel = 'total',
  className,
}: DonutChartProps) {
  const total = segments.reduce((acc, s) => acc + s.value, 0)
  const radius = size / 2
  const stroke = Math.max(10, Math.round(size * 0.18))
  const innerRadius = radius - stroke
  const circumference = 2 * Math.PI * (radius - stroke / 2)

  const arcs = segments
    .filter((s) => s.value > 0)
    .reduce<{
      acc: { key: string; color: string; len: number; dashOffset: number }[]
      offset: number
    }>(
      (state, s) => {
        const frac = total === 0 ? 0 : s.value / total
        const len = frac * circumference
        state.acc.push({ key: s.key, color: s.color, len, dashOffset: -state.offset })
        state.offset += len
        return state
      },
      { acc: [], offset: 0 },
    ).acc

  return (
    <div className={cn('flex flex-col gap-3', className)} aria-label={title}>
      {title ? (
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/80 tabular-nums">
            {total} {centerLabel}
          </span>
        </div>
      ) : null}

      {total === 0 ? (
        <div
          className="flex items-center justify-center rounded-sm border border-border/60 bg-muted/20 font-mono text-[10px] text-muted-foreground"
          style={{ height: size + 4 }}
        >
          No data recorded
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={radius}
                cy={radius}
                r={radius - stroke / 2}
                fill="none"
                stroke="var(--muted)"
                strokeOpacity={0.4}
                strokeWidth={stroke}
              />
              {arcs.map((a) => (
                <circle
                  key={a.key}
                  cx={radius}
                  cy={radius}
                  r={radius - stroke / 2}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${a.len} ${circumference - a.len}`}
                  strokeDashoffset={a.dashOffset}
                  transform={`rotate(-90 ${radius} ${radius})`}
                  strokeLinecap="butt"
                />
              ))}
            </svg>
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
              style={{ paddingInline: innerRadius / 8 }}
            >
              <span className="font-mono text-[16px] font-medium tabular-nums text-foreground">
                {total}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground/70">
                {centerLabel}
              </span>
            </div>
          </div>

          <ul className="flex min-w-0 flex-1 flex-col gap-1">
            {segments.map((s) => {
              const pct = total === 0 ? 0 : Math.round((s.value / total) * 100)
              return (
                <li
                  key={s.key}
                  className="flex items-center justify-between gap-2 font-mono text-[10px]"
                >
                  <span className="inline-flex items-center gap-2 uppercase tracking-widest">
                    <span
                      className="inline-block h-2 w-2 rounded-sm"
                      style={{ backgroundColor: s.color }}
                      aria-hidden
                    />
                    <span style={{ color: s.color }}>{s.label}</span>
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {s.value} · {pct}%
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
