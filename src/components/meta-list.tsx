import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface MetaItem {
  label: string
  value: ReactNode
}

interface MetaListProps {
  items: MetaItem[]
  /** Column count for the grid. Default 2. */
  columns?: 1 | 2 | 3 | 4
  className?: string
}

const COLS: Record<NonNullable<MetaListProps['columns']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

/**
 * Definition-list metadata pane — label/value pairs in a responsive grid.
 * The standard way to render runtime/config detail blocks (Cerberus's `Meta`,
 * Torque's scope-meta card).
 */
export function MetaList({ items, columns = 2, className }: MetaListProps) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-3', COLS[columns], className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-[10px] uppercase tracking-[.16em] text-text-subtle">
            {item.label}
          </dt>
          <dd className="mt-0.5 break-words text-[13px] text-text">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
