import type { ReactNode } from 'react'
import { AlertCircle, AlertTriangle, CircleCheck, Info } from 'lucide-react'
import { cn } from '../lib/utils'
import type { PillTone } from './pill'

const TONE_CLASSES: Record<PillTone, string> = {
  neutral: 'border-border bg-panel-2 text-text-soft',
  success: 'border-status-done/40 bg-status-done/10 text-status-done',
  danger: 'border-status-blocked/40 bg-status-blocked/10 text-status-blocked',
  warning: 'border-status-paused/40 bg-status-paused/10 text-status-paused',
  info: 'border-status-doing/40 bg-status-doing/10 text-status-doing',
}

const TONE_ICONS: Record<PillTone, ReactNode> = {
  neutral: <Info />,
  success: <CircleCheck />,
  danger: <AlertCircle />,
  warning: <AlertTriangle />,
  info: <Info />,
}

interface CalloutProps {
  /** Color tone. Default `info`. */
  tone?: PillTone
  /** Optional eyebrow label, rendered uppercase above the body. */
  title?: string
  /** Override the default tone icon. Pass `null` to omit the icon entirely. */
  icon?: ReactNode
  /** Trailing action slot — buttons, links. */
  actions?: ReactNode
  className?: string
  children: ReactNode
}

/**
 * Tone-colored message box — the generic alert/notice primitive. Apps wrap it
 * for domain notices (a blocked-reason banner, a checkpoint prompt) instead of
 * re-styling a bordered box each time.
 */
export function Callout({
  tone = 'info',
  title,
  icon,
  actions,
  className,
  children,
}: CalloutProps) {
  const resolvedIcon = icon === undefined ? TONE_ICONS[tone] : icon
  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-md border px-4 py-3 text-[13px]',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {resolvedIcon ? (
        <span className="mt-0.5 shrink-0 [&_svg]:h-4 [&_svg]:w-4" aria-hidden>
          {resolvedIcon}
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? (
          <div className="text-[10px] font-medium uppercase tracking-[.18em]">{title}</div>
        ) : null}
        <div className="min-w-0 break-words leading-relaxed">{children}</div>
      </div>
      {actions ? <div className="flex shrink-0 items-start gap-2">{actions}</div> : null}
    </div>
  )
}
