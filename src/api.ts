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

export { usePoll, refreshPolledData, type UsePollResult, type PollFetcher } from './hooks/use-poll'
export { useSSE, type SSEMessage, type UseSSEOptions, type UseSSEResult } from './hooks/use-sse'
export { createApiContext, type ApiContextHandle } from './contexts/api-context'
export { createRouter, type RouterConfig } from './lib/router'
