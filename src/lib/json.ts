/** Shared JSON value types — used by the API + normalize scaffold. */

export type ISODateString = string

export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]

export interface JsonObject {
  [key: string]: JsonValue
}
