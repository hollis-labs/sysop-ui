interface ProgressBarProps {
  /** Completion percentage, 0–100. Values outside the range are clamped. */
  value?: number
  /**
   * Render an animated indeterminate bar — the "something is running, no
   * known total" state. Ignores `value` when set.
   */
  indeterminate?: boolean
  /** Extra classes — e.g. a taller `h-*` for hero progress bars. */
  className?: string
}

/** Thin completion bar — themed via the `--color-status-done` token. */
export function ProgressBar({ value = 0, indeterminate = false, className = '' }: ProgressBarProps) {
  if (indeterminate) {
    return (
      <div
        className={`relative h-1 w-full overflow-hidden rounded-full bg-border ${className}`}
        role="progressbar"
        aria-busy="true"
      >
        <div
          className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-status-done"
          style={{ animation: 'sysop-progress-indeterminate 1.1s ease-in-out infinite' }}
        />
      </div>
    )
  }
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
