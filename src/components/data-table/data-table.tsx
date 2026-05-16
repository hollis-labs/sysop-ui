import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { alignClass, compareBy, type ColumnDef, type SortState } from './column'
import { DataTableRow } from './data-table-row'

interface DataTableProps<T> {
  items: T[]
  columns: ColumnDef<T>[]
  /** Stable, unique id per row. */
  getRowId: (item: T) => string
  /** Initial sort. Defaults to unsorted (input order). */
  initialSort?: SortState
  /** When set, rows are openable (click / Enter / Space). */
  onRowOpen?: (id: string, item: T) => void
  /** Accessible label per row, used for openable rows + select checkboxes. */
  rowAriaLabel?: (item: T) => string
  /** Render a leading select-checkbox column. */
  selectable?: boolean
  /** Notified with the selected row ids whenever the selection changes. */
  onSelectionChange?: (ids: string[]) => void
  /** Rows rendered per window page (infinite scroll). Default 50. */
  pageSize?: number
  /** Scroll container used as the IntersectionObserver root. */
  scrollRootRef?: RefObject<HTMLElement | null>
  /** Shown in place of the body when there are no rows. */
  emptyState?: ReactNode
}

const DEFAULT_PAGE_SIZE = 50

/**
 * Generic, sortable, windowed data table. Columns are described declaratively
 * via `ColumnDef`; the table owns sorting, infinite-scroll windowing, and
 * (optional) row selection. App-specific tables are a thin `columns` array
 * plus a `getRowId`.
 */
export function DataTable<T>({
  items,
  columns,
  getRowId,
  initialSort,
  onRowOpen,
  rowAriaLabel,
  selectable,
  onSelectionChange,
  pageSize = DEFAULT_PAGE_SIZE,
  scrollRootRef,
  emptyState,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(initialSort ?? null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const sentinelRef = useRef<HTMLTableRowElement | null>(null)

  // Reset the window to the first page whenever the list, sort, or page size
  // changes. Done as an adjust-state-during-render rather than an effect so it
  // applies before the first paint of the new list.
  const [windowKey, setWindowKey] = useState({ items, sort, pageSize })
  if (windowKey.items !== items || windowKey.sort !== sort || windowKey.pageSize !== pageSize) {
    setWindowKey({ items, sort, pageSize })
    setVisibleCount(pageSize)
  }

  const columnByKey = useMemo(
    () => new Map(columns.map((column) => [column.key, column])),
    [columns],
  )

  function handleSortClick(key: string) {
    const column = columnByKey.get(key)
    if (!column?.sortValue) return
    setSort((prev) => {
      if (prev?.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      }
      return { key, dir: 'asc' }
    })
  }

  const sorted = useMemo(() => {
    if (!sort) return items
    const column = columnByKey.get(sort.key)
    if (!column?.sortValue) return items
    return [...items].sort((a, b) => compareBy(column, a, b, sort.dir))
  }, [items, sort, columnByKey])

  const visible = useMemo(() => sorted.slice(0, visibleCount), [sorted, visibleCount])
  const hasMore = visibleCount < sorted.length

  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return
    const root = scrollRootRef?.current ?? null
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((c) => Math.min(c + pageSize, sorted.length))
        }
      },
      { root, rootMargin: '200px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, sorted.length, scrollRootRef, pageSize])

  function emitSelection(next: Set<string>) {
    setSelected(next)
    onSelectionChange?.([...next])
  }

  function handleSelect(id: string, isSelected: boolean) {
    const next = new Set(selected)
    if (isSelected) next.add(id)
    else next.delete(id)
    emitSelection(next)
  }

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    emitSelection(e.target.checked ? new Set(visible.map(getRowId)) : new Set())
  }

  const allSelected = visible.length > 0 && visible.every((item) => selected.has(getRowId(item)))
  const totalCols = columns.length + (selectable ? 1 : 0)

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-full">
        <thead className="text-[10px] uppercase tracking-[.28em] text-text-subtle">
          <tr className="border-b border-border-strong">
            {selectable && (
              <th className="w-8 py-1.5 pl-[14px] pr-0">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="h-3 w-3 cursor-pointer appearance-none rounded-sm border border-border-strong bg-panel-2 checked:border-text-soft checked:bg-text-soft"
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((column) => {
              const sortable = Boolean(column.sortValue)
              const isSorted = sort?.key === column.key
              return (
                <th
                  key={column.key}
                  className={`py-1.5 font-medium ${alignClass(column.align)} ${
                    column.width === 'fill' ? 'px-3' : 'w-px whitespace-nowrap px-1.5'
                  }`}
                >
                  {sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 transition-colors hover:text-text-muted"
                      onClick={() => handleSortClick(column.key)}
                    >
                      {column.header}
                      <span className={isSorted ? 'text-text-muted' : 'text-text-subtle/50'}>
                        {isSorted ? (sort?.dir === 'asc' ? '↑' : '↓') : '⇕'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft text-[13px] leading-4">
          {visible.map((item) => {
            const id = getRowId(item)
            return (
              <DataTableRow
                key={id}
                item={item}
                rowId={id}
                columns={columns}
                selectable={selectable}
                selected={selected.has(id)}
                onSelect={handleSelect}
                onOpen={onRowOpen}
                ariaLabel={rowAriaLabel?.(item)}
              />
            )
          })}
          {visible.length === 0 && emptyState && (
            <tr>
              <td colSpan={totalCols} className="py-0">
                {emptyState}
              </td>
            </tr>
          )}
          {hasMore && (
            <tr ref={sentinelRef} aria-hidden="true">
              <td
                colSpan={totalCols}
                className="py-3 text-center text-[11px] text-text-subtle/80"
              >
                Loading more… ({visible.length} of {sorted.length})
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
