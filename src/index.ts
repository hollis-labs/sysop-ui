/**
 * @hollis-labs/sysop-ui — the System Operations React kit.
 *
 * The canonical theme ships separately as raw CSS; import it once in your app:
 *   import '@hollis-labs/sysop-ui/theme.css'
 */

/* ---- lib ---- */
export { cn, formatRelativeTime, formatShortDate, formatCount } from './lib/utils'
export {
  THEME_STORAGE_KEY,
  DEFAULT_THEME,
  THEME_OPTIONS,
  isThemeName,
  resolveTheme,
  readStoredTheme,
  persistTheme,
  applyTheme,
  getInitialTheme,
  type ThemeName,
} from './lib/theme'
export {
  STATUS_KEYS,
  STATUS_TONES,
  DEFAULT_STATUS_TONE,
  statusTone,
  type StatusKey,
  type StatusTone,
} from './lib/status'
export type { ISODateString, JsonPrimitive, JsonValue, JsonObject } from './lib/json'

/* ---- api scaffold ---- */
export {
  ApiError,
  createApiClient,
  type ApiClient,
  type ApiClientOptions,
  type ApiRequestOptions,
  type QueryValue,
} from './api/client'
export {
  toSnakeCase,
  normalizeKeys,
  parseMetadataJson,
  normalizeDateString,
  normalizeOptionalDateString,
  normalizeStringArray,
  normalizeNumber,
  normalizeBoolean,
} from './api/normalize'

/* ---- hooks + context ---- */
export { usePoll, refreshPolledData, type UsePollResult, type PollFetcher } from './hooks/use-poll'
export { createApiContext, type ApiContextHandle } from './contexts/api-context'

/* ---- domain components ---- */
export { PageHeader } from './components/page-header'
export { NavRail, type NavRailItem } from './components/nav-rail'
export { CopyableId } from './components/copyable-id'
export { StatusBadge } from './components/status-badge'
export { SummaryCards } from './components/summary-cards'
export { EmptyState, type EmptyStateVariant } from './components/empty-state'
export { DetailDialog, DetailSection } from './components/detail-dialog'
export { default as ThemeSwitcher } from './components/theme-switcher'
export {
  FilterBar,
  FilterCycleToggle,
  FilterEntityCombobox,
  FilterSearchInput,
  type CycleOption,
  type FilterEntityComboboxItem,
} from './components/filter-bar'
export {
  DataTable,
  DataTableRow,
  alignClass,
  compareBy,
  type ColumnDef,
  type SortDir,
  type SortState,
} from './components/data-table'

/* ---- shadcn ui primitives ---- */
export * from './components/ui/badge'
export * from './components/ui/button'
export * from './components/ui/command'
export * from './components/ui/dialog'
export * from './components/ui/input'
export * from './components/ui/input-group'
export * from './components/ui/popover'
export * from './components/ui/scroll-area'
export * from './components/ui/skeleton'
export * from './components/ui/sonner'
export * from './components/ui/table'
export * from './components/ui/textarea'
export * from './components/ui/tooltip'
