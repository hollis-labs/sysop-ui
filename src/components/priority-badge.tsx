interface PriorityBadgeProps {
  /** Priority level — 1 (highest) … 3. Unknown values fall back to P3. */
  priority: number
  className?: string
}

// P1/P2 use a deep tint — the status color mixed into the page background —
// so the chip reads as a dark solid block, matching Torque's `*-950/40` look.
// P3 is the neutral panel tone.
const PRIORITY: Record<number, { className: string; label: string }> = {
  1: {
    className:
      'bg-[color-mix(in_oklab,var(--color-status-blocked)_22%,var(--color-bg))] text-status-blocked',
    label: 'P1',
  },
  2: {
    className:
      'bg-[color-mix(in_oklab,var(--color-status-queued)_22%,var(--color-bg))] text-status-queued',
    label: 'P2',
  },
  3: { className: 'bg-panel-2 text-text-subtle', label: 'P3' },
}

/**
 * Compact priority chip — borderless, tinted by severity. Mirrors Torque's
 * `PriorityBadge`.
 */
export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const config = PRIORITY[priority] ?? PRIORITY[3]
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${config.className} ${className}`}
    >
      {config.label}
    </span>
  )
}
