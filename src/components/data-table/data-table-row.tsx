import { alignClass, type ColumnDef } from './column'

interface DataTableRowProps<T> {
  item: T
  rowId: string
  columns: ColumnDef<T>[]
  selectable?: boolean
  selected?: boolean
  onSelect?: (id: string, selected: boolean) => void
  onOpen?: (id: string, item: T) => void
  /** Accessible label for the (interactive) row. */
  ariaLabel?: string
}

// Descendants marked data-row-interactive own their own clicks and must not
// trigger row-level open (checkboxes, copy buttons, inline menus).
const INTERACTIVE_SELECTOR = '[data-row-interactive="true"]'

/** A single `DataTable` row. Internal — rendered by `DataTable`. */
export function DataTableRow<T>({
  item,
  rowId,
  columns,
  selectable,
  selected,
  onSelect,
  onOpen,
  ariaLabel,
}: DataTableRowProps<T>) {
  function handleOpen(e: React.MouseEvent<HTMLTableRowElement>) {
    if (!onOpen) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const target = e.target as HTMLElement | null
    if (target?.closest(INTERACTIVE_SELECTOR)) return
    onOpen(rowId, item)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTableRowElement>) {
    if (!onOpen || e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(rowId, item)
    }
  }

  return (
    <tr
      className={`outline-none focus-visible:ring-1 focus-visible:ring-ring ${
        onOpen ? 'cursor-pointer' : ''
      } ${selected ? 'bg-panel-hover/70' : 'bg-bg hover:bg-panel-hover/60'}`}
      data-testid="data-table-row"
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      tabIndex={onOpen ? 0 : undefined}
      role={onOpen ? 'button' : undefined}
      aria-label={onOpen ? ariaLabel : undefined}
    >
      {selectable && (
        <td className="w-8 align-top py-1.5 pl-4 pr-0">
          <input
            type="checkbox"
            checked={selected ?? false}
            onChange={(e) => onSelect?.(rowId, e.target.checked)}
            className="mt-[3px] h-3 w-3 cursor-pointer appearance-none rounded-sm border border-border-strong bg-panel-2 checked:border-text-soft checked:bg-text-soft"
            aria-label={ariaLabel ? `Select ${ariaLabel}` : 'Select row'}
            data-row-interactive="true"
          />
        </td>
      )}
      {columns.map((column) => (
        <td
          key={column.key}
          className={`px-3 py-1.5 align-top ${alignClass(column.align)} ${
            column.width === 'fill'
              ? 'w-full max-w-0'
              : 'w-px whitespace-nowrap'
          } ${column.className ?? ''}`}
        >
          {column.cell(item)}
        </td>
      ))}
    </tr>
  )
}
