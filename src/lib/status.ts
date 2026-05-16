/**
 * Status presentation tones.
 *
 * Colors are built on the theme-aware `--color-status-*` tokens (see
 * `styles/theme.css`) so chips and badges follow the active palette. The map
 * covers the canonical status vocabulary shared across apps — task lifecycle
 * (`backlog`…`archived`) and ingest/fragment lifecycle (`inbox`/`routed`/
 * `indexed`). Apps that use a narrower set simply reference fewer keys.
 */

export interface StatusTone {
  /** Tailwind background class (tinted). */
  bg: string
  /** Tailwind text-color class. */
  text: string
  /** Tailwind border-color class. */
  border: string
  /** Tailwind background class for the leading dot (solid). */
  dot: string
}

/** Canonical status keys with a dedicated `--color-status-*` token. */
export const STATUS_KEYS = [
  'backlog',
  'todo',
  'queued',
  'doing',
  'review',
  'done',
  'blocked',
  'paused',
  'archived',
  'inbox',
  'routed',
  'indexed',
] as const

export type StatusKey = (typeof STATUS_KEYS)[number]

function tone(key: StatusKey): StatusTone {
  return {
    bg: `bg-status-${key}/10`,
    text: `text-status-${key}`,
    border: `border-status-${key}/40`,
    dot: `bg-status-${key}`,
  }
}

export const STATUS_TONES: Record<string, StatusTone> = Object.fromEntries(
  STATUS_KEYS.map((key) => [key, tone(key)]),
)

/** Neutral fallback for statuses without a dedicated token. */
export const DEFAULT_STATUS_TONE: StatusTone = {
  bg: 'bg-panel-2',
  text: 'text-text-soft',
  border: 'border-border',
  dot: 'bg-text-subtle',
}

/** Resolve a status string (case-insensitive) to its presentation tone. */
export function statusTone(status: string): StatusTone {
  return STATUS_TONES[(status || '').toLowerCase()] ?? DEFAULT_STATUS_TONE
}
