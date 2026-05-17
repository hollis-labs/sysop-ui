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
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next: boolean) => !next && onOpenChange(false)}>
      <DialogContent className="flex flex-col gap-0 p-0">
        <div className="flex flex-col gap-1 px-4 pb-3 pr-10 pt-4">
          <DialogTitle className="text-base font-semibold leading-snug tracking-tight text-text">
            {title}
          </DialogTitle>
          {description ? (
            <p className="text-[12px] leading-snug text-text-subtle">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border-strong px-4 py-3">
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
