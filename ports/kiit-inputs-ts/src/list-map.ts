/**
 * An ordered, immutable collection with O(1) lookup both by key and by position. `DataRecord`
 * implementations need that combination, since a DB row is addressable by column name or index,
 * and neither an array of pairs (no fast key lookup) nor a plain `Map` (no positional index, no
 * duplicate keys) gives you both.
 */
export class ListMap<A, B> {
  protected readonly list: ReadonlyArray<readonly [A, B]>;

  // Index of each key's last position in `list`. Duplicate keys are kept in `list` itself, but
  // looking one up by key gives the last occurrence, same as a Map would.
  protected readonly map: ReadonlyMap<A, number>;

  readonly size: number;

  constructor(list: ReadonlyArray<readonly [A, B]> = []) {
    this.list = Array.from(list);
    this.map = ListMap.convert(this.list);
    this.size = this.list.length;
  }

  contains(key: A): boolean {
    return this.map.has(key);
  }

  /** The value associated with `key`, or null if the key isn't there. */
  get(key: A): B | null {
    const ndx = this.map.get(key);
    return ndx === undefined ? null : this.list[ndx]![1];
  }

  /** The value at the given position. Throws if there's nothing there. */
  getAt(pos: number): B | null {
    const item = this.list[pos];
    if (item === undefined) throw new RangeError(`No item at position ${pos}, size is ${this.size}`);
    return item[1];
  }

  /**
   * Every value stored under `key`, in insertion order. `get` gives only the last one (last write
   * wins), this gives all of them. It's what backs multi-value keys like HTTP `Set-Cookie` or
   * repeated query params.
   */
  getAll(key: A): B[] {
    return this.list.filter((item) => item[0] === key).map((item) => item[1]);
  }

  plus(item: readonly [A, B]): ListMap<A, B> {
    return this.add(item);
  }

  minus(key: A): ListMap<A, B> {
    return this.remove(key);
  }

  add(key: A, value: B): ListMap<A, B>;
  add(item: readonly [A, B]): ListMap<A, B>;
  add(...args: [A, B] | [readonly [A, B]]): ListMap<A, B> {
    const item: readonly [A, B] = args.length === 2 ? [args[0], args[1]] : args[0];
    return new ListMap([...this.list, item]);
  }

  remove(key: A): ListMap<A, B> {
    return new ListMap(this.list.filter((item) => item[0] !== key));
  }

  clone(): ListMap<A, B> {
    return new ListMap(this.list.map((item): readonly [A, B] => [item[0], item[1]]));
  }

  keys(): A[] {
    return this.list.map((item) => item[0]);
  }

  values(): B[] {
    return this.list.map((item) => item[1]);
  }

  entries(): Array<[A, B]> {
    return this.list.map((item): [A, B] => [item[0], item[1]]);
  }

  all(): B[] {
    return this.values();
  }

  /** Visits every key/value pair, in order, with its position. */
  each(callback: (index: number, key: A, value: B) => void): void {
    this.list.forEach((item, index) => callback(index, item[0], item[1]));
  }

  /** One entry per distinct key, holding its last value. Keys become strings. */
  toMap(): Map<string, unknown> {
    const out = new Map<string, unknown>();
    for (const [key, ndx] of this.map) {
      out.set(String(key), this.list[ndx]![1]);
    }
    return out;
  }

  static convert<A, B>(items: ReadonlyArray<readonly [A, B]>): Map<A, number> {
    const map = new Map<A, number>();
    items.forEach((item, index) => map.set(item[0], index));
    return map;
  }
}
