import { describe, expect, it } from 'vitest'
import {
  normalizeKeys,
  normalizeOptionalDateString,
  parseMetadataJson,
  toSnakeCase,
} from '@/api/normalize'

describe('toSnakeCase', () => {
  it('converts camelCase, PascalCase and kebab-case to snake_case', () => {
    expect(toSnakeCase('fragmentId')).toBe('fragment_id')
    expect(toSnakeCase('FragmentId')).toBe('fragment_id')
    expect(toSnakeCase('fragment-id')).toBe('fragment_id')
    expect(toSnakeCase('HTTPStatus')).toBe('http_status')
  })
})

describe('normalizeKeys', () => {
  it('recursively snake-cases object keys', () => {
    const input = { fragmentId: '1', nestedObj: { sourceType: 'note' }, items: [{ rowId: 2 }] }
    expect(normalizeKeys(input)).toEqual({
      fragment_id: '1',
      nested_obj: { source_type: 'note' },
      items: [{ row_id: 2 }],
    })
  })

  it('passes through primitives untouched', () => {
    expect(normalizeKeys(42)).toBe(42)
    expect(normalizeKeys('text')).toBe('text')
  })
})

describe('parseMetadataJson', () => {
  it('parses a JSON string into an object', () => {
    expect(parseMetadataJson('{"a":1}')).toEqual({ a: 1 })
  })

  it('passes through an object and rejects junk', () => {
    expect(parseMetadataJson({ a: 1 })).toEqual({ a: 1 })
    expect(parseMetadataJson('not json')).toEqual({})
    expect(parseMetadataJson('')).toEqual({})
    expect(parseMetadataJson(null)).toEqual({})
  })
})

describe('normalizeOptionalDateString', () => {
  it('drops empty + Go zero-time values', () => {
    expect(normalizeOptionalDateString('')).toBeUndefined()
    expect(normalizeOptionalDateString('0001-01-01T00:00:00Z')).toBeUndefined()
    expect(normalizeOptionalDateString(123)).toBeUndefined()
  })

  it('keeps a real timestamp', () => {
    expect(normalizeOptionalDateString('2026-05-15T10:00:00Z')).toBe('2026-05-15T10:00:00Z')
  })
})
