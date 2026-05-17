import { AlertCircle, Inbox, SearchX } from 'lucide-react'
import { Button } from './ui/button'

export type EmptyStateVariant = 'empty' | 'no-results' | 'error'

interface EmptyStateProps {
  variant: EmptyStateVariant
  title: string
  description: string
  /** Small uppercase eyebrow above the title. */
  eyebrow?: string
  action?: {
    label: string
    onClick: () => void
  }
  /** Optional shell command shown in a code block (e.g. a setup hint). */
  command?: string
}

const ICONS: Record<EmptyStateVariant, React.ReactNode> = {
  empty: <Inbox className="h-10 w-10 text-text-subtle" />,
  'no-results': <SearchX className="h-10 w-10 text-text-subtle" />,
  error: <AlertCircle className="h-10 w-10 text-danger-soft" />,
}

/**
 * Centered empty / no-results / error panel. Borderless and compact — sits
 * inside a page body or table region. Mirrors Torque's `EmptyState` sizing.
 */
export function EmptyState({
  variant,
  title,
  description,
  eyebrow,
  action,
  command,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {ICONS[variant]}
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-subtle">
            {eyebrow}
          </p>
        ) : null}
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mx-auto max-w-md text-sm text-text-subtle">{description}</p>
      </div>
      {command ? (
        <pre className="mt-1 w-full max-w-md overflow-x-auto rounded-md border border-border bg-panel px-3 py-2 text-left text-xs text-text-muted">
          <code>{command}</code>
        </pre>
      ) : null}
      {action ? (
        <Button variant="outline" size="sm" className="mt-1" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}
