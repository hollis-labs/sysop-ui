import type { ReactNode } from 'react'

export interface NavRailItem {
  /** Stable key. */
  key: string
  /** Tooltip + accessible label. */
  label: string
  /** Icon node (e.g. a lucide icon at `h-4 w-4`). */
  icon: ReactNode
  /** Whether this item is the current route. */
  active?: boolean
  /** Render as a link to this href… */
  href?: string
  /** …or as a button invoking this handler. One of `href`/`onSelect`. */
  onSelect?: () => void
  /** Pin to the bottom of the rail (e.g. Settings). */
  footer?: boolean
}

interface NavRailProps {
  items: NavRailItem[]
  /** Brand mark shown at the top (e.g. an icon). */
  logo?: ReactNode
  /** Tooltip for the brand mark. */
  logoLabel?: string
}

const ITEM_BASE =
  'flex h-9 w-9 items-center justify-center rounded-md transition-colors text-text-subtle hover:bg-panel-hover hover:text-foreground'

function NavRailButton({ item }: { item: NavRailItem }) {
  const className = `${ITEM_BASE} ${item.active ? 'bg-panel-hover text-foreground' : ''}`
  const common = {
    className,
    title: item.label,
    'aria-label': item.label,
    'aria-current': item.active ? ('page' as const) : undefined,
  }

  if (item.href !== undefined) {
    return (
      <a href={item.href} {...common}>
        {item.icon}
      </a>
    )
  }

  return (
    <button type="button" onClick={item.onSelect} {...common}>
      {item.icon}
    </button>
  )
}

/**
 * Vertical icon nav rail — the left edge of the Sysop shell. Router-agnostic:
 * pass `href` for link items or `onSelect` for handler items, and compute
 * `active` from your router. Items flagged `footer` pin to the bottom.
 */
export function NavRail({ items, logo, logoLabel = 'Home' }: NavRailProps) {
  const primary = items.filter((i) => !i.footer)
  const footer = items.filter((i) => i.footer)

  return (
    <nav className="flex w-14 flex-col items-center gap-2 border-r border-border bg-panel py-4">
      {logo ? (
        <>
          <div
            className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel-hover text-text-soft"
            title={logoLabel}
          >
            {logo}
          </div>
          <div className="mb-1 h-px w-8 bg-border" />
        </>
      ) : null}

      {primary.map((item) => (
        <NavRailButton key={item.key} item={item} />
      ))}

      {footer.length > 0 && (
        <div className="mt-auto flex flex-col items-center gap-2">
          {footer.map((item) => (
            <NavRailButton key={item.key} item={item} />
          ))}
        </div>
      )}
    </nav>
  )
}
