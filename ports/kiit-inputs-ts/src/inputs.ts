import type { Gets } from "./gets.js";

export interface InputsUpdatable {
  /** Immutable add. Returns a new `Inputs`, doesn't change the receiver. */
  add(key: string, value: NonNullable<unknown>): Inputs;
}

/**
 * Read access to key-value data from multiple sources: CLI arguments, config settings, HTTP
 * requests, in-memory settings. Abstracts the source so higher-level code doesn't need to know
 * where the data came from.
 *
 * To implement one, extend `GetsBase` and supply the typed getters, `get`, `containsKey`, `raw`,
 * `size` and `keys`.
 */
export interface Inputs extends Gets {
  /** The underlying backing value, supplied by the implementing class. */
  readonly raw: NonNullable<unknown>;

  get(key: string): unknown;

  containsKey(key: string): boolean;

  size(): number;

  /** Every key present, in whatever order the backing source holds them. */
  keys(): string[];
}
