import { GetsBase } from "./gets.js";
import type { Inputs } from "./inputs.js";
import { toUuid } from "./parse.js";
import type { Uuid } from "./parse.js";
import type { Instant, LocalDate, LocalDateTime, LocalTime } from "./temporal.js";

/**
 * Reads from a record-based, positionally addressable structure, like a DB row, where a column can
 * be read by name or by index: `row.getInt("id")` or `row.getInt(0)`.
 *
 * Kotlin calls this `Record`. That name clashes with TypeScript's built-in `Record<K, V>`, so it's
 * `DataRecord` here.
 */
export interface DataRecord extends Inputs {
  getPos(name: string): number;
  getName(pos: number): string;
  contains(name: string): boolean;

  getString(key: string): string;
  getString(pos: number): string;
  getBool(key: string): boolean;
  getBool(pos: number): boolean;
  getShort(key: string): number;
  getShort(pos: number): number;
  getInt(key: string): number;
  getInt(pos: number): number;
  getLong(key: string): number;
  getLong(pos: number): number;
  getFloat(key: string): number;
  getFloat(pos: number): number;
  getDouble(key: string): number;
  getDouble(pos: number): number;
  getInstant(key: string): Instant;
  getInstant(pos: number): Instant;
  getLocalDate(key: string): LocalDate;
  getLocalDate(pos: number): LocalDate;
  getLocalTime(key: string): LocalTime;
  getLocalTime(pos: number): LocalTime;
  getLocalDateTime(key: string): LocalDateTime;
  getLocalDateTime(pos: number): LocalDateTime;
  getUUID(key: string): Uuid;
  getUUID(pos: number): Uuid;
}

/**
 * The positional defaults from Kotlin's `Record`. A number is turned into a column name with
 * `getName`, then read the same way a name is. A record supplies `getPos`, `getName`, `contains`, the
 * `Inputs` members, and one `read...` hook per type, which reads a column by name.
 */
export abstract class DataRecordBase extends GetsBase implements DataRecord {
  abstract readonly raw: NonNullable<unknown>;
  abstract size(): number;
  abstract keys(): string[];

  abstract getPos(name: string): number;
  abstract getName(pos: number): string;
  abstract contains(name: string): boolean;

  protected abstract readString(name: string): string;
  protected abstract readBool(name: string): boolean;
  protected abstract readShort(name: string): number;
  protected abstract readInt(name: string): number;
  protected abstract readLong(name: string): number;
  protected abstract readFloat(name: string): number;
  protected abstract readDouble(name: string): number;
  protected abstract readInstant(name: string): Instant;
  protected abstract readLocalDate(name: string): LocalDate;
  protected abstract readLocalTime(name: string): LocalTime;
  protected abstract readLocalDateTime(name: string): LocalDateTime;

  /** Parses the column's string, unless a record overrides it to hand back a stored UUID as is. */
  protected readUuid(name: string): Uuid {
    return toUuid(this.readString(name));
  }

  private nameOf(keyOrPos: string | number): string {
    return typeof keyOrPos === "number" ? this.getName(keyOrPos) : keyOrPos;
  }

  getString(key: string): string;
  getString(pos: number): string;
  getString(keyOrPos: string | number): string {
    return this.readString(this.nameOf(keyOrPos));
  }

  getBool(key: string): boolean;
  getBool(pos: number): boolean;
  getBool(keyOrPos: string | number): boolean {
    return this.readBool(this.nameOf(keyOrPos));
  }

  getShort(key: string): number;
  getShort(pos: number): number;
  getShort(keyOrPos: string | number): number {
    return this.readShort(this.nameOf(keyOrPos));
  }

  getInt(key: string): number;
  getInt(pos: number): number;
  getInt(keyOrPos: string | number): number {
    return this.readInt(this.nameOf(keyOrPos));
  }

  getLong(key: string): number;
  getLong(pos: number): number;
  getLong(keyOrPos: string | number): number {
    return this.readLong(this.nameOf(keyOrPos));
  }

  getFloat(key: string): number;
  getFloat(pos: number): number;
  getFloat(keyOrPos: string | number): number {
    return this.readFloat(this.nameOf(keyOrPos));
  }

  getDouble(key: string): number;
  getDouble(pos: number): number;
  getDouble(keyOrPos: string | number): number {
    return this.readDouble(this.nameOf(keyOrPos));
  }

  getInstant(key: string): Instant;
  getInstant(pos: number): Instant;
  getInstant(keyOrPos: string | number): Instant {
    return this.readInstant(this.nameOf(keyOrPos));
  }

  getLocalDate(key: string): LocalDate;
  getLocalDate(pos: number): LocalDate;
  getLocalDate(keyOrPos: string | number): LocalDate {
    return this.readLocalDate(this.nameOf(keyOrPos));
  }

  getLocalTime(key: string): LocalTime;
  getLocalTime(pos: number): LocalTime;
  getLocalTime(keyOrPos: string | number): LocalTime {
    return this.readLocalTime(this.nameOf(keyOrPos));
  }

  getLocalDateTime(key: string): LocalDateTime;
  getLocalDateTime(pos: number): LocalDateTime;
  getLocalDateTime(keyOrPos: string | number): LocalDateTime {
    return this.readLocalDateTime(this.nameOf(keyOrPos));
  }

  getUUID(key: string): Uuid;
  getUUID(pos: number): Uuid;
  getUUID(keyOrPos: string | number): Uuid {
    return this.readUuid(this.nameOf(keyOrPos));
  }
}
