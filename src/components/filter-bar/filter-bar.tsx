import type { ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { FilterSearchInput } from './filter-search-input'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  searchPlaceholder?: string
  searchAriaLabel?: string
  /** Count of active facet filters — shown in the row-1 badge. */
  activeFilterCount: number
  /** Optional summary string (e.g. "2 filters · 14 matches"). */
  summary?: string
  /** When provided, a Clear button appears once anything is active. */
  onClear?: () => void
  /** Row 2 — the chip row. Apps compose their own facet controls here. */
  children?: ReactNode
}

/**
 * Two-row filter shell: a search hero (row 1) and an app-composed chip row
 * (row 2, via `children`). Facet controls — status chips, cycle toggles,
 * entity comboboxes — are app-specific; build them with the filter primitives
 * (`FilterCycleToggle`, `FilterEntityCombobox`) and pass them as children.
 */
export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  searchAriaLabel,
  activeFilterCount,
  summary,
  onClear,
  children,
}: FilterBarProps) {
  const anyActive = activeFilterCount > 0 || searchQuery.length > 0
  const showClear = Boolean(onClear) && anyActive

  return (
    <div className="flex flex-col border-b border-border-strong bg-bg">
      {/* Row 1: search hero + summary + clear */}
      <div className="flex items-center gap-3 px-4 py-2">
        <FilterSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          ariaLabel={searchAriaLabel}
        />
        <div className="inline-flex h-8 items-center gap-1.5 rounded border border-border bg-panel-2/50 px-2 text-[10px] uppercase tracking-wider text-text-soft">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {activeFilterCount}
        </div>
        {summary && anyActive && (
          <span className="whitespace-nowrap text-[10px] uppercase tracking-wider text-text-subtle">
            {summary}
          </span>
        )}
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear all filters and search"
            className="rounded border border-border-strong bg-transparent px-2 py-1 text-[10px] uppercase tracking-wider text-text-muted transition-colors hover:border-border hover:text-text"
          >
            Clear
          </button>
        )}
      </div>

      {/* Row 2: app-composed chip row */}
      {children && (
        <div className="border-t border-border-strong px-4 py-2">
          <div className="flex flex-wrap items-center gap-3 text-xs">{children}</div>
        </div>
      )}
    </div>
  )
}
