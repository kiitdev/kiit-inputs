import type { ListMap } from "./list-map.js";
import type { Uuid } from "./parse.js";
import { DataRecordBase } from "./record.js";
import type { Instant, LocalDate, LocalDateTime, LocalTime } from "./temporal.js";

/**
 * A `DataRecord` backed by a `ListMap` of raw values. Every getter hands back the stored value as
 * is. It's assumed to already be the target type (an `Instant`, not a driver-specific timestamp).
 * Turning a source's own value into the matching kiit-inputs type is up to whatever fills the
 * `ListMap`, not `RecordMap`, which keeps every getter the same shape instead of special-casing
 * dates. The one check is that the value isn't null or undefined.
 */
export class RecordMap extends DataRecordBase {
  readonly raw: NonNullable<unknown>;

  constructor(private readonly rs: ListMap<string, unknown>) {
    super();
    this.raw = rs;
  }

  size(): number {
    return this.rs.size;
  }

  get(key: string): unknown {
    return this.rs.get(key);
  }

  getPos(name: string): number {
    return this.rs.keys().indexOf(name);
  }

  getName(pos: number): string {
    const name = Number.isInteger(pos) ? this.rs.keys()[pos] : undefined;
    if (name === undefined) throw new RangeError(`No column at position ${pos}, size is ${this.size()}`);
    return name;
  }

  contains(name: string): boolean {
    return this.rs.contains(name);
  }

  containsKey(key: string): boolean {
    return this.rs.contains(key);
  }

  keys(): string[] {
    return [...new Set(this.rs.keys())];
  }

  private stored<T>(name: string): T {
    const value = this.rs.get(name);
    if (value === null || value === undefined) throw new Error(`No value for column "${name}"`);
    return value as T;
  }

  protected readString(name: string): string {
    return this.stored<string>(name);
  }

  protected readBool(name: string): boolean {
    return this.stored<boolean>(name);
  }

  protected readShort(name: string): number {
    return this.stored<number>(name);
  }

  protected readInt(name: string): number {
    return this.stored<number>(name);
  }

  protected readLong(name: string): number {
    return this.stored<number>(name);
  }

  protected readFloat(name: string): number {
    return this.stored<number>(name);
  }

  protected readDouble(name: string): number {
    return this.stored<number>(name);
  }

  protected override readUuid(name: string): Uuid {
    return this.stored<Uuid>(name);
  }

  protected readInstant(name: string): Instant {
    return this.stored<Instant>(name);
  }

  protected readLocalDate(name: string): LocalDate {
    return this.stored<LocalDate>(name);
  }

  protected readLocalTime(name: string): LocalTime {
    return this.stored<LocalTime>(name);
  }

  protected readLocalDateTime(name: string): LocalDateTime {
    return this.stored<LocalDateTime>(name);
  }
}
