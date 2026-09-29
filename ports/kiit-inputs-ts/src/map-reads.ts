import { StringGets } from "./string-gets.js";

/**
 * Simple in-memory, read-only `Gets` backed by a plain map. Handy for tests and prototyping, not a
 * production data source. Takes a `Map` or a plain object.
 */
export class MapReads extends StringGets {
  private readonly data: ReadonlyMap<string, unknown>;

  constructor(data: ReadonlyMap<string, unknown> | Readonly<Record<string, unknown>> = new Map()) {
    super();
    this.data = data instanceof Map ? data : new Map(Object.entries(data));
  }

  size(): number {
    return this.data.size;
  }

  get(key: string): unknown {
    return this.data.get(key) ?? null;
  }

  containsKey(key: string): boolean {
    return this.data.has(key);
  }

  protected getStringRaw(key: string): string {
    const value = this.data.get(key);
    return value === null || value === undefined ? "" : String(value).trim();
  }
}
