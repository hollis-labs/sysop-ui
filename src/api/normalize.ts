import type { JsonObject } from '../lib/json'

/**
 * Normalize scaffold — generic helpers for turning loosely-typed API payloads
 * into stable shapes. App-specific record normalizers (fragments, routes,
 * tasks, …) live in the consuming app, built on top of these primitives.
 */

const ZERO_TIME_RFC3339 = '0001-01-01T00:00:00Z'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/** Convert a camelCase / PascalCase / kebab-case key to snake_case. */
export function toSnakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/-/g, '_')
    .toLowerCase()
}

/** Recursively rewrite every object key to snake_case. */
export function normalizeKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeKeys(item)) as T
  }

  if (isRecord(value)) {
    const entries = Object.entries(value).map(([key, item]) => [
      toSnakeCase(key),
      normalizeKeys(item),
    ])
    return Object.fromEntries(entries) as T
  }

  return value
}

/** Parse a JSON string (or pass through an object) into a JsonObject. */
export function parseMetadataJson(value: unknown): JsonObject {
  if (isRecord(value)) {
    return value as JsonObject
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return {}
  }

  try {
    const parsed = JSON.parse(value)
    return isRecord(parsed) ? (parsed as JsonObject) : {}
  } catch {
    return {}
  }
}

/** Coerce a value to a string, defaulting to empty. */
export function normalizeDateString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/** Coerce a value to a date string, dropping empty + Go zero-time values. */
export function normalizeOptionalDateString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  if (value === '' || value === ZERO_TIME_RFC3339) {
    return undefined
  }

  return value
}

/** Keep only the string members of an array, or undefined if not an array. */
export function normalizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  return value.filter((item): item is string => typeof item === 'string')
}

/** Pass through numbers, otherwise undefined. */
export function normalizeNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

/** Pass through booleans, otherwise undefined. */
export function normalizeBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}
