import { AlertCircle, Inbox, SearchX } from 'lucide-react'

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

/** Centered empty / no-results / error panel. */
export function EmptyState({
  variant,
  title,
  description,
  eyebrow,
  action,
  command,
}: EmptyStateProps) {
  return (
    <section className="hud-panel px-6 py-16 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        {ICONS[variant]}
        <div className="space-y-3">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-text-subtle">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-text-soft">{description}</p>
        </div>
        {command ? (
          <pre className="w-full max-w-md overflow-x-auto rounded-md border border-border bg-panel px-4 py-3 text-left text-sm text-text-muted">
            <code>{command}</code>
          </pre>
        ) : null}
        {action ? (
          <button type="button" onClick={action.onClick} className="hud-button px-4 py-2 text-sm">
            {action.label}
          </button>
        ) : null}
      </div>
    </section>
  )
}
