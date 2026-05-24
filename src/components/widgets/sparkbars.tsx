import { cn } from '../../lib/utils'

export interface SparkbarsProps {
  data: number[]
  className?: string
}

/** Lightweight CSS bar sparkline for time-bucketed series. */
export function Sparkbars({ data, className }: SparkbarsProps) {
  const max = Math.max(1, ...data)
  const rows = 6
  if (data.length === 0) {
    return <div className={cn('h-9 text-[11px] text-text-subtle', className)}>no data</div>
  }
  return (
    <div className={cn('flex h-9 items-end gap-px overflow-hidden', className)} aria-hidden>
      {data.map((value, index) => {
        const filled = value > 0 ? Math.max(1, Math.ceil((value / max) * rows)) : 0
        return (
          <div key={index} className="flex min-w-0 flex-1 flex-col-reverse gap-px" title={String(value)}>
            {Array.from({ length: rows }, (_, row) => (
              <div
                key={row}
                className={cn(
                  'aspect-square w-full min-h-[2px]',
                  row < filled ? 'bg-text-soft/65' : 'bg-text-subtle/10',
                )}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
