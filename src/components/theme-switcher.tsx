import { useState } from 'react'
import { Check, Palette } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { applyTheme, persistTheme, readStoredTheme, THEME_OPTIONS, type ThemeName } from '../lib/theme'

/**
 * Palette switcher. Styled as a NavRail-sized icon button so it can sit in
 * the rail's footer (above the Settings item). The trigger is a paint-palette
 * icon — deliberately not a gear, which reads as Settings.
 */
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>(() => readStoredTheme())
  const [open, setOpen] = useState(false)

  function pick(next: ThemeName) {
    applyTheme(next)
    persistTheme(next)
    setTheme(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Theme"
        title="Theme"
        className="flex h-9 w-9 items-center justify-center rounded-md text-text-subtle transition-colors hover:bg-panel-hover hover:text-foreground"
      >
        <Palette className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent side="right" align="end" className="w-56 p-1">
        <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[.2em] text-text-subtle">
          Palette
        </p>
        {THEME_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => pick(option.value)}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-text transition-colors hover:bg-muted"
          >
            <span className="flex-1">{option.label}</span>
            <span className="text-[10px] uppercase tracking-[.2em] text-text-subtle">
              {option.shortLabel}
            </span>
            {theme === option.value && <Check className="h-3.5 w-3.5 text-status-routed" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
