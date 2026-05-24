import { cn } from '../../lib/utils'

export interface BarListItem {
  label: string
  value: number
}

export interface BarListProps {
  items: BarListItem[]
  className?: string
  labelClassName?: string
}

/** Horizontal name/value bar list for top-k and histogram summaries. */
export function BarList({ items, className, labelClassName }: BarListProps) {
  if (items.length === 0) {
    return <div className={cn('text-[11px] text-text-subtle', className)}>none</div>
  }
  const max = Math.max(1, ...items.map((item) => item.value))
  return (
    <div className={cn('space-y-1.5', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-[11px]">
          <span
            className={cn('w-32 shrink-0 truncate font-mono text-text-soft', labelClassName)}
            title={item.label}
          >
            {item.label}
          </span>
          <div className="relative h-3 flex-1 overflow-hidden bg-panel-2">
            <div
              className="absolute inset-y-0 left-0 bg-text-soft/55"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right font-mono tabular-nums text-text">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}
