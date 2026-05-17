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
  /** Override the max-width (default `max-w-md`). */
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
  widthClassName = 'max-w-md',
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next: boolean) => !next && onClose()}>
      <DialogContent
        className={`flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 ${widthClassName}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void onSubmit()
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex flex-col gap-1 px-4 pb-3 pr-10 pt-4">
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

          <div className="flex items-center justify-end gap-2 border-t border-border-strong px-4 py-3">
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
