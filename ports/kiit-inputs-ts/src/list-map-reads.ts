import type { Inputs } from "./inputs.js";
import type { ListMap } from "./list-map.js";
import type { Repeatable } from "./repeatable.js";
import { StringGets } from "./string-gets.js";

/**
 * Shared `Inputs`/`Repeatable` implementation over a `ListMap` of raw wire-format strings (HTTP
 * header and query values, CLI flag values). Values are always strings, never pre-typed, so the
 * typed getters parse the text, the same as `MapReads`. `get` and `getString` give the last value
 * for a key, `getAll` gives every value, for keys that legitimately repeat (`Set-Cookie`, repeated
 * query params).
 *
 * It isn't `Meta` or `Args` itself. Those mean the same shape but aren't meant to be
 * interchangeable, see `MetaMap` and `ArgsMap`.
 */
export abstract class ListMapReads extends StringGets implements Inputs, Repeatable {
  readonly raw: NonNullable<unknown>;

  constructor(private readonly rs: ListMap<string, string>) {
    super();
    this.raw = rs;
  }

  size(): number {
    return this.rs.size;
  }

  get(key: string): unknown {
    return this.rs.get(key);
  }

  containsKey(key: string): boolean {
    return this.rs.contains(key);
  }

  keys(): string[] {
    return [...new Set(this.rs.keys())];
  }

  getAll(key: string): string[] {
    return this.rs.getAll(key);
  }

  /** One entry per distinct key, holding its last value. */
  toMap(): Map<string, string> {
    return new Map(this.keys().map((key): [string, string] => [key, this.rs.get(key) as string]));
  }

  protected getStringRaw(key: string): string {
    return this.rs.get(key)?.trim() ?? "";
  }
}
