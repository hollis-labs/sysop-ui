export const THEME_STORAGE_KEY = 'sysop.theme'
export const DEFAULT_THEME = 'p4-white'

export const THEME_OPTIONS = [
  { value: 'p1-green-phosphor', shortLabel: 'P1', label: 'P1 Green' },
  { value: 'p3-amber-phosphor', shortLabel: 'P3', label: 'P3 Amber' },
  { value: 'p4-white', shortLabel: 'P4', label: 'P4 White' },
  { value: 'hi-contrast', shortLabel: 'HC', label: 'Hi-Contrast' },
] as const

export type ThemeName = (typeof THEME_OPTIONS)[number]['value']

const THEMES = new Set<ThemeName>(THEME_OPTIONS.map((theme) => theme.value))

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && THEMES.has(value as ThemeName)
}

export function resolveTheme(value: unknown): ThemeName {
  return isThemeName(value) ? value : DEFAULT_THEME
}

export function readStoredTheme(storage: Pick<Storage, 'getItem'> | null = globalThis.localStorage ?? null): ThemeName {
  try {
    return resolveTheme(storage?.getItem(THEME_STORAGE_KEY))
  } catch {
    return DEFAULT_THEME
  }
}

export function persistTheme(
  theme: ThemeName,
  storage: Pick<Storage, 'setItem'> | null = globalThis.localStorage ?? null,
): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage failures so the live theme switch still works.
  }
}

export function applyTheme(theme: ThemeName, root: Pick<HTMLElement, 'setAttribute'> = document.documentElement): void {
  root.setAttribute('data-theme', theme)
}

export function getInitialTheme(): ThemeName {
  return readStoredTheme()
}
