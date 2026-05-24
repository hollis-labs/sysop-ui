import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  /**
   * Confirm handler. Should close the dialog (`onOpenChange(false)`) on
   * success — left to the caller so a failed async action keeps it open.
   */
  onConfirm: () => void | Promise<void>
  confirmLabel?: string
  cancelLabel?: string
  /** Style the confirm button as destructive. Default true. */
  destructive?: boolean
  /** A confirm is in flight — disables both buttons. */
  busy?: boolean
  /** Override the dialog width. Height remains fixed at 450px. */
  widthClassName?: string
}

/**
 * Confirmation dialog for destructive or irreversible actions. Built on the
 * kit's `Dialog` so it carries the same dark-panel chrome as `DetailDialog`
 * and `FormDialog`.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  busy,
  widthClassName,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next: boolean) => !next && onOpenChange(false)}>
      <DialogContent
        className="flex h-[450px] max-h-[calc(100vh-2rem)] flex-col gap-0 overflow-hidden p-0"
        widthClassName={widthClassName ?? 'w-[600px] max-w-[calc(100vw-2rem)]'}
      >
        <div className="flex h-20 shrink-0 flex-col justify-center gap-1 pr-10 pl-4">
          <DialogTitle className="text-base font-semibold leading-snug tracking-tight text-text">
            {title}
          </DialogTitle>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-border-strong px-4 py-3">
          {description ? (
            <p className="text-[12px] leading-5 text-text-subtle">{description}</p>
          ) : null}
        </div>
        <div className="flex h-14 shrink-0 items-center justify-end gap-2 border-t border-border-strong px-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={() => void onConfirm()}
            disabled={busy}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
