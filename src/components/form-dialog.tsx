import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

interface FormDialogProps {
  /** The dialog is open whenever this is true. */
  open: boolean
  onClose: () => void
  title: ReactNode
  /** Optional sub-title beneath the title. */
  description?: ReactNode
  /** Submit handler. The caller reads its own field state. */
  onSubmit: () => void | Promise<void>
  submitLabel?: string
  cancelLabel?: string
  /** Disable the submit button (e.g. an invalid form). */
  submitDisabled?: boolean
  /** A submit is in flight — disables both buttons. */
  submitting?: boolean
  /** Form fields. */
  children: ReactNode
  /** Override the dialog width. Height remains fixed at 450px. */
  widthClassName?: string
}

/**
 * Form-in-modal scaffold — a standardized header, a scrollable field body,
 * and a sticky Cancel/Submit footer wired to a real `<form>`. Apps supply
 * the fields and own their state; the chrome stays consistent.
 */
export function FormDialog({
  open,
  onClose,
  title,
  description,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitDisabled,
  submitting,
  children,
  widthClassName,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next: boolean) => !next && onClose()}>
      <DialogContent
        className="flex h-[450px] max-h-[calc(100vh-2rem)] flex-col gap-0 overflow-hidden p-0"
        widthClassName={widthClassName ?? 'w-[600px] max-w-[calc(100vw-2rem)]'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void onSubmit()
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex h-20 shrink-0 flex-col justify-center gap-1 pr-10 pl-4">
            <DialogTitle className="text-base font-semibold leading-snug tracking-tight text-text">
              {title}
            </DialogTitle>
            {description ? (
              <p className="text-[12px] leading-snug text-text-subtle">{description}</p>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto border-t border-border-strong px-4 py-3">
            {children}
          </div>

          <div className="flex h-14 shrink-0 items-center justify-end gap-2 border-t border-border-strong px-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={submitDisabled || submitting}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
