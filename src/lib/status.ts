/**
 * Status presentation tones.
 *
 * Tuned to match Torque's `STATUS_COLORS`, which spreads each status across
 * four shades — a tinted fill, a `40%` border, a solid dot, and a *light*
 * label. The kit carries one `--color-status-*` token per status (so all four
 * palettes stay themeable); the lighter label is derived from it at use-site
 * via `color-mix` toward the palette's text color — which keeps the phosphor
 * palettes coherent (green mixes toward green, not white).
 *
 * Classes are written out as literals (not built from a template) so the
 * Tailwind scanner reliably emits every `*-status-*` and `color-mix` utility.
 */

export interface StatusTone {
  /** Tailwind background class (tinted fill). */
  bg: string
  /** Tailwind text-color class (light label). */
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

export const STATUS_TONES: Record<StatusKey, StatusTone> = {
  backlog: {
    bg: 'bg-status-backlog/10',
    border: 'border-status-backlog/40',
    dot: 'bg-status-backlog',
    text: 'text-[color-mix(in_oklab,var(--color-status-backlog)_60%,var(--color-text))]',
  },
  todo: {
    bg: 'bg-status-todo/10',
    border: 'border-status-todo/40',
    dot: 'bg-status-todo',
    text: 'text-[color-mix(in_oklab,var(--color-status-todo)_60%,var(--color-text))]',
  },
  queued: {
    bg: 'bg-status-queued/10',
    border: 'border-status-queued/40',
    dot: 'bg-status-queued',
    text: 'text-[color-mix(in_oklab,var(--color-status-queued)_60%,var(--color-text))]',
  },
  doing: {
    bg: 'bg-status-doing/10',
    border: 'border-status-doing/40',
    dot: 'bg-status-doing',
    text: 'text-[color-mix(in_oklab,var(--color-status-doing)_60%,var(--color-text))]',
  },
  review: {
    bg: 'bg-status-review/10',
    border: 'border-status-review/40',
    dot: 'bg-status-review',
    text: 'text-[color-mix(in_oklab,var(--color-status-review)_60%,var(--color-text))]',
  },
  done: {
    bg: 'bg-status-done/10',
    border: 'border-status-done/40',
    dot: 'bg-status-done',
    text: 'text-[color-mix(in_oklab,var(--color-status-done)_60%,var(--color-text))]',
  },
  blocked: {
    bg: 'bg-status-blocked/10',
    border: 'border-status-blocked/40',
    dot: 'bg-status-blocked',
    text: 'text-[color-mix(in_oklab,var(--color-status-blocked)_60%,var(--color-text))]',
  },
  paused: {
    bg: 'bg-status-paused/10',
    border: 'border-status-paused/40',
    dot: 'bg-status-paused',
    text: 'text-[color-mix(in_oklab,var(--color-status-paused)_60%,var(--color-text))]',
  },
  archived: {
    bg: 'bg-status-archived/10',
    border: 'border-status-archived/40',
    dot: 'bg-status-archived',
    text: 'text-[color-mix(in_oklab,var(--color-status-archived)_55%,var(--color-text))]',
  },
  inbox: {
    bg: 'bg-status-inbox/10',
    border: 'border-status-inbox/40',
    dot: 'bg-status-inbox',
    text: 'text-[color-mix(in_oklab,var(--color-status-inbox)_60%,var(--color-text))]',
  },
  routed: {
    bg: 'bg-status-routed/10',
    border: 'border-status-routed/40',
    dot: 'bg-status-routed',
    text: 'text-[color-mix(in_oklab,var(--color-status-routed)_60%,var(--color-text))]',
  },
  indexed: {
    bg: 'bg-status-indexed/10',
    border: 'border-status-indexed/40',
    dot: 'bg-status-indexed',
    text: 'text-[color-mix(in_oklab,var(--color-status-indexed)_60%,var(--color-text))]',
  },
}

/** Neutral fallback for statuses without a dedicated token. */
export const DEFAULT_STATUS_TONE: StatusTone = {
  bg: 'bg-panel-2',
  text: 'text-text-soft',
  border: 'border-border',
  dot: 'bg-text-subtle',
}

/** Resolve a status string (case-insensitive) to its presentation tone. */
export function statusTone(status: string): StatusTone {
  return STATUS_TONES[(status || '').toLowerCase() as StatusKey] ?? DEFAULT_STATUS_TONE
}
