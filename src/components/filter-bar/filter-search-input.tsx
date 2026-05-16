import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

interface FilterSearchInputProps {
  value: string
  onChange: (next: string) => void
  placeholder?: string
  /** Accessible label for the input. */
  ariaLabel?: string
  /** Debounce window before `onChange` fires, in ms. */
  debounceMs?: number
  /** Bind `/` (when not already typing) to focus this input. Default: true. */
  slashToFocus?: boolean
}

const DEFAULT_DEBOUNCE_MS = 250

function isEditableTarget(el: Element | null): boolean {
  if (!el) return false
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return true
  if (el instanceof HTMLElement && el.isContentEditable) return true
  return false
}

/** Debounced search field with optional `/`-to-focus and Esc-to-clear. */
export function FilterSearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  ariaLabel = 'Search',
  debounceMs = DEFAULT_DEBOUNCE_MS,
  slashToFocus = true,
}: FilterSearchInputProps) {
  const [local, setLocal] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Mirror an externally-changed `value` into local state. Done as an
  // adjust-state-during-render rather than an effect.
  if (syncedValue !== value) {
    setSyncedValue(value)
    setLocal(value)
  }

  // Debounced emit. Skipped while `local` is already in sync with the prop,
  // so an externally-driven `value` change never echoes back through onChange.
  useEffect(() => {
    if (local === value) return
    const handle = setTimeout(() => onChange(local), debounceMs)
    return () => clearTimeout(handle)
  }, [local, value, onChange, debounceMs])

  useEffect(() => {
    if (!slashToFocus) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== '/') return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.defaultPrevented) return
      if (isEditableTarget(document.activeElement)) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [slashToFocus])

  return (
    <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded border border-border bg-panel-2/50 px-2.5 py-1 focus-within:border-border-strong">
      <Search className="h-3.5 w-3.5 text-text-subtle" />
      <input
        ref={inputRef}
        type="search"
        aria-label={ariaLabel}
        title={
          slashToFocus
            ? `${ariaLabel} (press / to focus, Esc to clear)`
            : `${ariaLabel} (Esc to clear)`
        }
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setLocal('')
            inputRef.current?.blur()
          }
        }}
        className="flex-1 bg-transparent text-xs text-text placeholder:text-text-subtle/70 focus:outline-none"
      />
      {slashToFocus ? (
        <kbd className="rounded border border-border bg-bg px-1 text-[9px] uppercase tracking-wider text-text-subtle">
          /
        </kbd>
      ) : null}
    </div>
  )
}
