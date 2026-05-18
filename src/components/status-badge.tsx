import { statusTone } from '../lib/status'

interface StatusBadgeProps {
  status: string
  className?: string
}

/**
 * Status pill — a dot + label in a tinted, bordered chip. Dimensions and
 * shade relationships match Torque's status pills exactly; themed via the
 * `--color-status-*` tokens.
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const tone = statusTone(status)

  return (
    <span
      className={`inline-flex items-center gap-2 rounded border px-2 py-1 text-[11px] uppercase tracking-[0.14em] ${tone.border} ${tone.bg} ${tone.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      <span>{status || 'unknown'}</span>
    </span>
  )
}
