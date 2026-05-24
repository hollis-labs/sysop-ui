import { useMemo } from 'react'
import { Check, Copy, Eye } from 'lucide-react'

import { useCopy } from '../hooks/use-copy'
import { JsonViewer } from './json-viewer'
import { CopyButton } from './copy-button'
import { DetailDialog } from './detail-dialog'

/** Parse `raw` as a JSON object, or null when it is not one. */
export function safeParseObject(raw: string): Record<string, unknown> | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw)
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

/** Compact display string for a decomposed payload value. */
export function scalarStr(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  const text = JSON.stringify(value)
  return text.length > 48 ? `${text.slice(0, 47)}…` : text
}

export interface PayloadActionsProps {
  raw: string
  onView: () => void
  viewLabel?: string
}

/**
 * Inline view + copy icon pair for a table cell. `onView` opens a payload
 * modal; the copy icon copies `raw` without leaving the table.
 */
export function PayloadActions({
  raw,
  onView,
  viewLabel = 'View payload',
}: PayloadActionsProps) {
  const { copied, copy } = useCopy()
  if (!raw) return <span className="text-[11px] text-text-subtle">—</span>
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        title={viewLabel}
        aria-label={viewLabel}
        onClick={(event) => {
          event.stopPropagation()
          onView()
        }}
        className="rounded p-1 text-text-subtle transition-colors hover:bg-panel-hover hover:text-text"
      >
        <Eye className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        title="Copy payload"
        aria-label="Copy payload"
        onClick={(event) => {
          event.stopPropagation()
          copy(raw)
        }}
        className="rounded p-1 text-text-subtle transition-colors hover:bg-panel-hover hover:text-text"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-status-done" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  )
}

export interface PayloadSummaryProps {
  raw: string
  maxEntries?: number
}

/** Decomposed payload preview for dense tables. */
export function PayloadSummary({ raw, maxEntries = 6 }: PayloadSummaryProps) {
  const parsed = useMemo(() => safeParseObject(raw), [raw])
  if (!parsed) {
    return raw ? (
      <span className="block truncate font-mono text-[11px] text-text-subtle">{raw}</span>
    ) : (
      <span className="text-[11px] text-text-subtle">—</span>
    )
  }
  const entries = Object.entries(parsed).slice(0, maxEntries)
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
      {entries.map(([key, value]) => (
        <span key={key} className="whitespace-nowrap text-[11px]">
          <span className="text-text-subtle">{key}:</span>{' '}
          <span className="font-mono text-text-soft">{scalarStr(value)}</span>
        </span>
      ))}
    </div>
  )
}

export interface JsonModalProps {
  open: boolean
  onClose: () => void
  title: string
  raw: string
  copyLabel?: string
}

/** Modal showing a syntax-highlighted payload with a copy action. */
export function JsonModal({
  open,
  onClose,
  title,
  raw,
  copyLabel = 'Copy payload',
}: JsonModalProps) {
  const value = useMemo<unknown>(() => {
    try {
      return JSON.parse(raw)
    } catch {
      return raw
    }
  }, [raw])

  return (
    <DetailDialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end">
          <CopyButton text={raw} label={copyLabel} />
        </div>
      }
    >
      <div className="px-4 py-3">
        <JsonViewer value={value} />
      </div>
    </DetailDialog>
  )
}
