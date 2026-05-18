import { useMemo } from 'react'
import { cn } from '../../lib/utils'

export interface HourlyPulseProps<T> {
  items: T[]
  /** ISO timestamp accessor. */
  timestamp: (item: T) => string | null | undefined
  /** Header title. Default `24h pulse`. */
  title?: string
  /** Height of the bar area in px. Default 48. */
  height?: number
  /** Bar color — a theme token string. Default `var(--color-status-done)`. */
  color?: string
  className?: string
}

interface HourBucket {
  hour: number
  label: string
  count: number
}

const HOUR_MS = 60 * 60 * 1000

/**
 * Last-24-hours hourly activity strip. Generic over the item type — each item
 * lands in the hourly bucket of its `timestamp`.
 */
export function HourlyPulse<T>({
  items,
  timestamp,
  title = '24h pulse',
  height = 48,
  color = 'var(--color-status-done)',
  className,
}: HourlyPulseProps<T>) {
  const buckets = useMemo<HourBucket[]>(() => {
    const now = new Date()
    const list: HourBucket[] = []
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * HOUR_MS)
      list.push({
        hour: d.getHours(),
        label: `${String(d.getHours()).padStart(2, '0')}:00`,
        count: 0,
      })
    }
    const windowStart = now.getTime() - 24 * HOUR_MS
    for (const item of items) {
      const iso = timestamp(item)
      if (!iso) continue
      const t = new Date(iso).getTime()
      if (!Number.isFinite(t) || t < windowStart) continue
      const hoursAgo = Math.floor((now.getTime() - t) / HOUR_MS)
      const idx = 23 - hoursAgo
      if (idx < 0 || idx > 23) continue
      list[idx].count++
    }
    return list
  }, [items, timestamp])

  const total = buckets.reduce((a, b) => a + b.count, 0)
  const max = Math.max(1, ...buckets.map((b) => b.count))

  return (
    <div className={cn('flex flex-col gap-2', className)} aria-label={title}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/80 tabular-nums">
          {total} · 24h
        </span>
      </div>

      {total === 0 ? (
        <div
          className="flex items-center justify-center rounded-sm border border-border/60 bg-muted/20 font-mono text-[10px] text-muted-foreground"
          style={{ height: height + 16 }}
        >
          No activity in last 24h
        </div>
      ) : (
        <>
          <div
            className="flex items-end gap-[2px]"
            style={{ height }}
            role="img"
            aria-label={`${total} events in last 24 hours`}
          >
            {buckets.map((b, i) => {
              const pct = (b.count / max) * 100
              const opacity = pct <= 0 ? 0 : pct > 66 ? 1 : pct > 33 ? 0.75 : 0.4
              const shown = b.count === 0 ? 0 : Math.max(8, pct)
              return (
                <div
                  key={i}
                  title={`${b.label} — ${b.count} events`}
                  className="flex h-full flex-1 flex-col justify-end rounded-sm bg-muted/40"
                >
                  <div
                    className="w-full rounded-sm"
                    style={{ height: `${shown}%`, backgroundColor: color, opacity }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between font-mono text-[8px] text-muted-foreground/60">
            <span>-24h</span>
            <span>-12h</span>
            <span>now</span>
          </div>
        </>
      )}
    </div>
  )
}
