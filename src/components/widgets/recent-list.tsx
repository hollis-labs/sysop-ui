import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface RecentListProps<T> {
  /** Items — the caller passes them pre-sorted; the list does not sort. */
  items: T[]
  /** Stable key accessor for each row. */
  getKey: (item: T) => string | number
  /** Row renderer — the caller owns the row markup. */
  renderItem: (item: T) => ReactNode
  /** Header title. */
  title?: string
  /** Max rows to show — items are sliced to this length. Default 12. */
  limit?: number
  /** When set, each row becomes a button invoking this on click. */
  onSelect?: (item: T) => void
  /** Empty-state message. Default `Nothing yet`. */
  emptyLabel?: string
  className?: string
}

/**
 * Recent-items list shell — header, divided list, optional row selection, and
 * empty state. Generic: the kit owns the shell, the caller owns the row via
 * `renderItem`. Caller pre-sorts.
 */
export function RecentList<T>({
  items,
  getKey,
  renderItem,
  title,
  limit = 12,
  onSelect,
  emptyLabel = 'Nothing yet',
  className,
}: RecentListProps<T>) {
  const shown = items.slice(0, limit)

  return (
    <div className={cn('flex flex-col gap-2', className)} aria-label={title}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/80 tabular-nums">
          {shown.length} shown
        </span>
      </div>

      {shown.length === 0 ? (
        <div className="flex items-center justify-center rounded-sm border border-border/60 bg-muted/20 px-3 py-6 font-mono text-[10px] text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border/40">
          {shown.map((item) => {
            const row = renderItem(item)
            return (
              <li key={getKey(item)}>
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="w-full rounded-sm text-left transition-colors hover:bg-accent/40 focus:bg-accent/40 focus:outline-none"
                  >
                    {row}
                  </button>
                ) : (
                  row
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
