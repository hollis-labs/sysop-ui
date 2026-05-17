interface ProgressBarProps {
  /** Completion percentage, 0–100. Values outside the range are clamped. */
  value: number
  /** Extra classes — e.g. a taller `h-*` for hero progress bars. */
  className?: string
}

/** Thin completion bar — themed via the `--color-status-done` token. */
export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`h-1 w-full overflow-hidden rounded-full bg-border ${className}`}>
      <div
        className="h-full rounded-full bg-status-done transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
