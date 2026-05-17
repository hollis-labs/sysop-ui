import type { ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export interface RowAction {
  label: string
  onSelect: () => void
  /** Optional leading icon. */
  icon?: ReactNode
  /** Render in the destructive group — separated, red. */
  destructive?: boolean
  disabled?: boolean
}

interface RowActionMenuProps {
  actions: RowAction[]
  ariaLabel?: string
  /** Menu alignment relative to the trigger. Default `end`. */
  align?: 'start' | 'end'
}

/**
 * The end-of-row "…" action menu. Marked `data-row-interactive` so it never
 * triggers a `DataTable` row-open. Destructive actions are grouped below a
 * separator. Apps pass a plain `RowAction[]`.
 */
export function RowActionMenu({
  actions,
  ariaLabel = 'Row actions',
  align = 'end',
}: RowActionMenuProps) {
  const normal = actions.filter((a) => !a.destructive)
  const destructive = actions.filter((a) => a.destructive)

  return (
    <span data-row-interactive="true">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={ariaLabel}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-soft transition-colors hover:bg-panel-hover hover:text-text"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        {/* data-row-interactive on the portaled content too: menu-item clicks
            bubble synthetically to the parent <tr>, whose row-open handler
            checks via DOM closest(). */}
        <DropdownMenuContent align={align} className="min-w-44" data-row-interactive="true">
          {normal.map((action) => (
            <DropdownMenuItem
              key={action.label}
              disabled={action.disabled}
              onClick={action.onSelect}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
          {destructive.length > 0 && normal.length > 0 ? <DropdownMenuSeparator /> : null}
          {destructive.map((action) => (
            <DropdownMenuItem
              key={action.label}
              variant="destructive"
              disabled={action.disabled}
              onClick={action.onSelect}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  )
}
