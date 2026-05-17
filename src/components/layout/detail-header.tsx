import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { StatusBadge } from '../status-badge'

interface DetailHeaderProps {
  title: string
  /** Back-link label, e.g. "Operations". */
  backLabel: string
  /** Render the back-link as an anchor to this href… */
  backHref?: string
  /** …or as a button invoking this handler. One of `backHref` / `onBack`. */
  onBack?: () => void
  /** Identifier shown in the breadcrumb row. */
  id?: string
  /** Status — rendered as a `StatusBadge` beside the title. */
  status?: string
  /** Badges / inline meta rendered in the title row, beside the status. */
  children?: ReactNode
  /** Action buttons, pinned to the right of the title row. */
  actions?: ReactNode
}

/**
 * Detail-page header. Two pinned bands of page chrome — a thin breadcrumb row
 * over the page-level title row — both flush on `bg-bg`, matching a list
 * page's `PageHeader` + `FilterBar` chrome. No gray hero fill.
 */
export function DetailHeader({
  title,
  backLabel,
  backHref,
  onBack,
  id,
  status,
  children,
  actions,
}: DetailHeaderProps) {
  const backClassName =
    'flex items-center gap-1 text-[11px] uppercase tracking-[.14em] text-text-subtle transition-colors hover:text-foreground'

  return (
    <div>
      {/* Breadcrumb row — PageHeader-weight chrome. */}
      <div className="flex items-center gap-2 border-b border-border-strong bg-bg px-4 py-2.5">
        {backHref !== undefined ? (
          <a href={backHref} className={backClassName}>
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </a>
        ) : (
          <button type="button" onClick={onBack} className={backClassName}>
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </button>
        )}
        {id ? (
          <>
            <span className="text-text-subtle/40">/</span>
            <span className="font-mono text-[11px] text-text-subtle">{id}</span>
          </>
        ) : null}
      </div>

      {/* Page-level header row. */}
      <div className="flex items-start justify-between gap-4 border-b border-border-strong bg-bg px-4 py-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="text-lg font-semibold leading-tight text-foreground">{title}</h1>
          {status || children ? (
            <div className="flex flex-wrap items-center gap-2">
              {status ? <StatusBadge status={status} /> : null}
              {children}
            </div>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
