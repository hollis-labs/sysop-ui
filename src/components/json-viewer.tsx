import { useMemo, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface JsonViewerProps {
  /** Any JSON-serializable value. */
  value: unknown
  /** Extra classes on the `<pre>` (e.g. a `max-h-*` to cap height). */
  className?: string
}

// Matches: a quoted string (optionally a key — trailed by `:`), a literal
// (true/false/null), or a number.
const TOKEN = /("(?:[^"\\]|\\.)*"\s*:?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g

function classFor(match: string): string {
  if (match.startsWith('"')) {
    return match.trimEnd().endsWith(':') ? 'text-status-doing' : 'text-status-done'
  }
  if (match === 'true' || match === 'false') return 'text-status-review'
  if (match === 'null') return 'text-text-subtle'
  return 'text-status-queued'
}

/**
 * Syntax-highlighted, read-only JSON view. Pretty-prints the value and tints
 * keys / strings / numbers / literals via the theme's `--color-status-*`
 * tokens, so it follows the active palette.
 */
export function JsonViewer({ value, className }: JsonViewerProps) {
  const nodes = useMemo<ReactNode[]>(() => {
    let text: string
    try {
      text = JSON.stringify(value, null, 2) ?? String(value)
    } catch {
      text = String(value)
    }

    const out: ReactNode[] = []
    let last = 0
    let key = 0
    for (const match of text.matchAll(TOKEN)) {
      const index = match.index ?? 0
      if (index > last) out.push(text.slice(last, index))
      out.push(
        <span key={key++} className={classFor(match[0])}>
          {match[0]}
        </span>,
      )
      last = index + match[0].length
    }
    if (last < text.length) out.push(text.slice(last))
    return out
  }, [value])

  return (
    <pre
      className={cn(
        'overflow-auto rounded-md border border-border bg-panel px-3 py-2 font-mono text-xs leading-5 text-text-muted',
        className,
      )}
    >
      <code>{nodes}</code>
    </pre>
  )
}
