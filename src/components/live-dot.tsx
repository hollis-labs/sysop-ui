import { cn } from '@/lib/utils'
import type { PillTone } from '@/components/pill'

const DOT_COLORS: Record<PillTone, string> = {
  neutral: 'bg-text-subtle',
  success: 'bg-status-done',
  danger: 'bg-status-blocked',
  warning: 'bg-status-paused',
  info: 'bg-status-doing',
}

interface LiveDotProps {
  /** Color tone. Default `warning` — the amber "running" convention. */
  tone?: PillTone
  /** Pulse animation. Default true; pass false for a static dot. */
  pulsing?: boolean
  /** Dot diameter. Default `sm`. */
  size?: 'sm' | 'md'
  /** Accessible label — when set, the dot becomes a `role="status"` element. */
  label?: string
  className?: string
}

/**
 * A small dot with an optional ping animation — the generic "live / running"
 * indicator. Apps compose it into domain widgets (an active-run pulse, a
 * connection light) rather than re-rolling the animation each time.
 */
export function LiveDot({
  tone = 'warning',
  pulsing = true,
  size = 'sm',
  label,
  className,
}: LiveDotProps) {
  const outer = size === 'md' ? 'h-2.5 w-2.5' : 'h-2 w-2'
  const inner = size === 'md' ? 'h-2 w-2' : 'h-1.5 w-1.5'
  const color = DOT_COLORS[tone]
  return (
    <span
      className={cn('relative inline-flex items-center justify-center', outer, className)}
      role={label ? 'status' : undefined}
      aria-label={label}
    >
      {pulsing && (
        <span
          className={cn('absolute inset-0 animate-ping rounded-full opacity-80', color)}
          aria-hidden
        />
      )}
      <span className={cn('relative inline-block rounded-full', inner, color)} aria-hidden />
    </span>
  )
}
