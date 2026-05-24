import { cn } from '../../lib/utils'

export interface SignalBarsProps {
  data: number[]
  secondaryData?: number[]
  className?: string
  heightClassName?: string
  primaryLabel?: string
  secondaryLabel?: string
}

/** Dense grid-backed column chart for instrumentation dashboards. */
export function SignalBars({
  data,
  secondaryData,
  className,
  heightClassName = 'h-44',
  primaryLabel = 'Primary',
  secondaryLabel = 'Secondary',
}: SignalBarsProps) {
  const rows = 18
  const subColumns = 2
  const totals = data.map((value, index) => value + (secondaryData?.[index] ?? 0))
  const peak = Math.max(1, ...totals)
  const ceiling = Math.ceil(peak * 1.25)
  const active = totals.filter((value) => value > 0).length
  const primaryTotal = data.reduce((sum, value) => sum + value, 0)
  const secondaryTotal = (secondaryData ?? []).reduce((sum, value) => sum + value, 0)

  if (data.length === 0) {
    return <div className={cn(heightClassName, 'text-[11px] text-text-subtle', className)}>no data</div>
  }

  return (
    <div className={cn('bg-bg', className)}>
      <div className="flex h-7 items-center justify-between gap-3 bg-bg px-2 text-[10px] font-mono tabular-nums text-text-subtle">
        <span>peak {peak}</span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 bg-text-soft/50" />
            {primaryLabel} {primaryTotal}
          </span>
          {secondaryData ? (
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 bg-text-soft/30" />
              {secondaryLabel} {secondaryTotal}
            </span>
          ) : null}
          <span>
            {active}/{data.length} active
          </span>
        </span>
      </div>
      <div className={cn('border-y border-border-strong px-2 py-2', heightClassName)}>
        <div className="relative flex h-full items-end gap-px overflow-hidden" aria-hidden>
          {Array.from({ length: data.length * subColumns }, (_, column) => {
            const index = Math.floor(column / subColumns)
            const primary = data[index] ?? 0
            const secondary = secondaryData?.[index] ?? 0
            const total = primary + secondary
            const filled = total > 0 ? Math.max(1, Math.ceil((total / ceiling) * rows)) : 0
            const secondaryCells =
              total > 0 && secondary > 0 ? Math.max(1, Math.round((secondary / total) * filled)) : 0
            const primaryCells = Math.max(0, filled - secondaryCells)
            return (
              <div key={column} className="flex min-w-0 flex-1 flex-col-reverse gap-px" title={`${total}`}>
                {Array.from({ length: rows }, (_, row) => {
                  const filledCell = row < filled
                  const secondaryCell = row < secondaryCells
                  const primaryCell = row >= secondaryCells && row < secondaryCells + primaryCells
                  return (
                    <div
                      key={row}
                      className={cn(
                        'aspect-square w-full min-h-[4px]',
                        !filledCell && 'bg-text-subtle/10',
                        primaryCell && 'bg-text-soft/50',
                        secondaryCell && 'bg-text-soft/30',
                      )}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
