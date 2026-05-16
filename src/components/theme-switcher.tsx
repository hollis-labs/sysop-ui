import { useState } from 'react'
import { Check, Cog } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { buttonVariants } from '@/components/ui/button'
import { applyTheme, persistTheme, readStoredTheme, THEME_OPTIONS, type ThemeName } from '@/lib/theme'
import { cn } from '@/lib/utils'

/**
 * Palette switcher. Built on the Popover primitive (rather than a menu) so it
 * stays simple and reliable — the trigger is the gear in the app header.
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
        aria-label="Theme settings"
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'rounded-full')}
      >
        <Cog className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
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
