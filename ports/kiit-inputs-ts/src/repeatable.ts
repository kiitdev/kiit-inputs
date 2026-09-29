/**
 * A key-value source where the same key can carry more than one value (HTTP headers like
 * `Set-Cookie`, repeated query-string params). `get` still resolves to a single, last-write-wins
 * value. `getAll` is for callers that need every occurrence.
 */
export interface Repeatable {
  getAll(key: string): string[];
}
