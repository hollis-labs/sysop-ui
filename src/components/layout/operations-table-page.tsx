import { useRef, type ReactNode } from 'react'
import { ListPageLayout } from './list-page-layout'
import { PageHeader } from '../page-header'
import { SummaryCards, type SummaryCard } from '../summary-cards'
import { FilterBar } from '../filter-bar'
import { Skeleton } from '../ui/skeleton'
import { DataTable, type ColumnDef, type SortState } from '../data-table'

interface OperationsTablePageProps<T> {
  /* ---- header ---- */
  title: string
  /** Action buttons in the page header. */
  headerActions?: ReactNode
  /** Optional tab strip pinned under the header. */
  tabs?: ReactNode

  /* ---- summary ---- */
  /** Metric strip cards. Omit to hide the summary row. */
  summaryCards?: SummaryCard[]

  /* ---- filter bar ---- */
  searchQuery: string
  onSearchChange: (q: string) => void
  searchPlaceholder?: string
  searchAriaLabel?: string
  /** Count of active facet filters (drives the row-1 badge). */
  activeFilterCount?: number
  /** Optional summary string, e.g. "2 filters · 14 matches". */
  filterSummary?: string
  /** When provided, a Clear button appears once anything is active. */
  onClear?: () => void
  /** Row-2 facet controls — status chips, cycle toggles, comboboxes. */
  filterControls?: ReactNode

  /* ---- table ---- */
  items: T[]
  columns: ColumnDef<T>[]
  getRowId: (item: T) => string
  initialSort?: SortState
  selectable?: boolean
  onSelectionChange?: (ids: string[]) => void
  onRowOpen?: (id: string, item: T) => void
  rowAriaLabel?: (item: T) => string
  pageSize?: number

  /* ---- states ---- */
  /** Render a skeleton in place of the table. */
  loading?: boolean
  /** Shown in place of the table body when there are no rows. */
  emptyState?: ReactNode
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </div>
  )
}

/**
 * The operations / list page as one component. Composes `ListPageLayout` +
 * `PageHeader` + `SummaryCards` + `FilterBar` + `DataTable`, and owns the
 * wiring every app re-derived by hand — most importantly threading a single
 * scroll-region ref to the `DataTable` so its infinite-scroll observer roots
 * on the page body.
 *
 * Apps supply data + column defs + filter config; the chrome and spacing stay
 * identical across apps. For a bespoke layout, drop down to `ListPageLayout`.
 */
export function OperationsTablePage<T>({
  title,
  headerActions,
  tabs,
  summaryCards,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  searchAriaLabel,
  activeFilterCount = 0,
  filterSummary,
  onClear,
  filterControls,
  items,
  columns,
  getRowId,
  initialSort,
  selectable,
  onSelectionChange,
  onRowOpen,
  rowAriaLabel,
  pageSize,
  loading,
  emptyState,
}: OperationsTablePageProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <ListPageLayout
      scrollRef={scrollRef}
      header={<PageHeader title={title}>{headerActions}</PageHeader>}
      tabs={tabs}
      summary={summaryCards ? <SummaryCards cards={summaryCards} /> : undefined}
      filters={
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          searchAriaLabel={searchAriaLabel}
          activeFilterCount={activeFilterCount}
          summary={filterSummary}
          onClear={onClear}
        >
          {filterControls}
        </FilterBar>
      }
    >
      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          items={items}
          columns={columns}
          getRowId={getRowId}
          initialSort={initialSort}
          selectable={selectable}
          onSelectionChange={onSelectionChange}
          onRowOpen={onRowOpen}
          rowAriaLabel={rowAriaLabel}
          pageSize={pageSize}
          scrollRootRef={scrollRef}
          emptyState={emptyState}
        />
      )}
    </ListPageLayout>
  )
}
