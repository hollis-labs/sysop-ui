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
export {
  createScopedStorage,
  type StorageArea,
  type ScopedStorage,
  type ScopedStorageOptions,
} from './lib/storage'
export {
  createListCursor,
  listCursorNeighbors,
  type ListCursor,
  type ListCursorNeighbors,
  type ListCursorHandle,
} from './lib/list-cursor'

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
export { useCopy, type UseCopyResult } from './hooks/use-copy'
export { useElapsed } from './hooks/use-elapsed'
export { createApiContext, type ApiContextHandle } from './contexts/api-context'

/* ---- layout ---- */
export {
  ListPageLayout,
  DetailPageLayout,
  DetailHeader,
  TabStrip,
  OperationsTablePage,
  type TabStripItem,
} from './components/layout'

/* ---- domain components ---- */
export { PageHeader } from './components/page-header'
export { NavRail, type NavRailItem } from './components/nav-rail'
export { CopyableId } from './components/copyable-id'
export { CopyButton } from './components/copy-button'
export { StatusBadge } from './components/status-badge'
export { PriorityBadge } from './components/priority-badge'
export { Combobox, type ComboboxItem } from './components/combobox'
export { FormDialog } from './components/form-dialog'
export { JsonViewer } from './components/json-viewer'
export { MetaList, type MetaItem } from './components/meta-list'
export { Metric } from './components/metric'
export { Pill, type PillTone } from './components/pill'
export { LiveDot } from './components/live-dot'
export { Callout } from './components/callout'
export { CollapsibleSection, type SectionAccent } from './components/collapsible-section'
export { ProgressBar } from './components/progress-bar'
export { RowActionMenu, type RowAction } from './components/row-action-menu'
export { ConfirmDialog } from './components/confirm-dialog'
export { SummaryCards, type SummaryCard } from './components/summary-cards'
export { EmptyState, type EmptyStateVariant } from './components/empty-state'
export { DetailDialog, DetailSection } from './components/detail-dialog'
export { default as ThemeSwitcher } from './components/theme-switcher'
export {
  FilterBar,
  FilterChipGroup,
  FilterCycleToggle,
  FilterEntityCombobox,
  FilterSearchInput,
  type CycleOption,
  type FilterChip,
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

/* ---- widgets ---- */
export {
  TimeSeriesChart,
  type TimeSeriesChartProps,
  type TimeSeriesSeries,
  DonutChart,
  type DonutChartProps,
  type DonutSegment,
  BarMeter,
  type BarMeterProps,
  type BarMeterRow,
  ActivityHeatmap,
  type ActivityHeatmapProps,
  HourlyPulse,
  type HourlyPulseProps,
  RecentList,
  type RecentListProps,
} from './components/widgets'

/* ---- shadcn ui primitives ---- */
export * from './components/ui/alert-dialog'
export * from './components/ui/badge'
export * from './components/ui/button'
export * from './components/ui/card'
export * from './components/ui/command'
export * from './components/ui/dialog'
export * from './components/ui/dropdown-menu'
export * from './components/ui/input'
export * from './components/ui/input-group'
export * from './components/ui/label'
export * from './components/ui/popover'
export * from './components/ui/scroll-area'
export * from './components/ui/select'
export * from './components/ui/separator'
export * from './components/ui/sheet'
export * from './components/ui/skeleton'
export * from './components/ui/sonner'
export * from './components/ui/switch'
export * from './components/ui/table'
export * from './components/ui/tabs'
export * from './components/ui/textarea'
export * from './components/ui/tooltip'
