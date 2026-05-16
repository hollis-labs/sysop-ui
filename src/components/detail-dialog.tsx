import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface DetailDialogProps {
  /** The dialog is open whenever this is true. */
  open: boolean
  onClose: () => void
  title: ReactNode
  /** Optional node rendered before the title (e.g. a `StatusBadge`). */
  badge?: ReactNode
  /** Optional meta row beneath the title — ids, timestamps, source. */
  meta?: ReactNode
  /** Sticky footer, e.g. action buttons. */
  footer?: ReactNode
  /** Scrollable body. Compose `DetailSection`s here. */
  children: ReactNode
  /** Override the max-width (default `max-w-2xl`). */
  widthClassName?: string
}

/**
 * Detail-dialog shell — a standardized header (badge + title + meta), a
 * scrollable body, and an optional sticky footer. App-specific detail views
 * supply the body content; the chrome stays consistent across apps.
 */
export function DetailDialog({
  open,
  onClose,
  title,
  badge,
  meta,
  footer,
  children,
  widthClassName = 'max-w-2xl',
}: DetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next: boolean) => !next && onClose()}>
      <DialogContent
        className={`flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 ${widthClassName}`}
      >
        <div className="flex flex-col gap-2 px-4 pb-3 pr-10 pt-4">
          <div className="flex items-start gap-2">
            {badge ? <span className="mt-0.5 shrink-0">{badge}</span> : null}
            <DialogTitle className="line-clamp-2 min-w-0 break-words text-base font-semibold leading-snug tracking-tight text-text">
              {title}
            </DialogTitle>
          </div>
          {meta ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-subtle">
              {meta}
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border-strong px-4 py-3">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

/** Titled section divider for use inside a `DetailDialog` body. */
export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border-strong px-4 py-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-text-subtle">
        {title}
      </p>
      {children}
    </section>
  )
}
