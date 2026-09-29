import { toUuid } from "./parse.js";
import type { Uuid } from "./parse.js";
import type { Instant, LocalDate, LocalDateTime, LocalTime } from "./temporal.js";

/**
 * Typed read access by key: string, bool, numbers, dates and UUID, each with an `OrNull` and an
 * `OrElse` variant for the optional path. `Short`, `Int`, `Long`, `Float` and `Double` are all a
 * `number` here.
 *
 * Implementing every variant by hand is a lot, so extend [GetsBase] and supply just the typed
 * getters.
 */
export interface Gets {
  getString(key: string): string;
  getBool(key: string): boolean;
  getShort(key: string): number;
  getInt(key: string): number;
  getLong(key: string): number;
  getFloat(key: string): number;
  getDouble(key: string): number;
  getInstant(key: string): Instant;
  getLocalDate(key: string): LocalDate;
  getLocalTime(key: string): LocalTime;
  getLocalDateTime(key: string): LocalDateTime;
  getUUID(key: string): Uuid;

  // Get value, or null when the key is missing.
  getStringOrNull(key: string): string | null;
  getBoolOrNull(key: string): boolean | null;
  getShortOrNull(key: string): number | null;
  getIntOrNull(key: string): number | null;
  getLongOrNull(key: string): number | null;
  getFloatOrNull(key: string): number | null;
  getDoubleOrNull(key: string): number | null;
  getInstantOrNull(key: string): Instant | null;
  getLocalDateOrNull(key: string): LocalDate | null;
  getLocalTimeOrNull(key: string): LocalTime | null;
  getLocalDateTimeOrNull(key: string): LocalDateTime | null;
  getUUIDOrNull(key: string): Uuid | null;

  // Get value, or the default when the key is missing.
  getStringOrElse(key: string, defaultValue: string): string;
  getBoolOrElse(key: string, defaultValue: boolean): boolean;
  getShortOrElse(key: string, defaultValue: number): number;
  getIntOrElse(key: string, defaultValue: number): number;
  getLongOrElse(key: string, defaultValue: number): number;
  getFloatOrElse(key: string, defaultValue: number): number;
  getDoubleOrElse(key: string, defaultValue: number): number;
  getInstantOrElse(key: string, defaultValue: Instant): Instant;
  getLocalDateOrElse(key: string, defaultValue: LocalDate): LocalDate;
  getLocalTimeOrElse(key: string, defaultValue: LocalTime): LocalTime;
  getLocalDateTimeOrElse(key: string, defaultValue: LocalDateTime): LocalDateTime;
  getUUIDOrElse(key: string, defaultValue: Uuid): Uuid;

  getOrNull<T>(key: string, fetcher: (key: string) => T): T | null;
  getOrElse<T>(key: string, fetcher: (key: string) => T, defaultValue: T): T;
}

/**
 * Kotlin interfaces can carry default methods and TypeScript ones can't, so the defaults from
 * `Gets` live here. A source supplies `get`, `containsKey` and the typed getters, and inherits the
 * `OrNull`/`OrElse` variants, `getUUID`, `getOrNull` and `getOrElse`.
 *
 * ```ts
 * class MyInputs extends GetsBase implements Inputs { ... }
 * ```
 */
export abstract class GetsBase implements Gets {
  abstract get(key: string): unknown;
  abstract containsKey(key: string): boolean;

  abstract getString(key: string): string;
  abstract getBool(key: string): boolean;
  abstract getShort(key: string): number;
  abstract getInt(key: string): number;
  abstract getLong(key: string): number;
  abstract getFloat(key: string): number;
  abstract getDouble(key: string): number;
  abstract getInstant(key: string): Instant;
  abstract getLocalDate(key: string): LocalDate;
  abstract getLocalTime(key: string): LocalTime;
  abstract getLocalDateTime(key: string): LocalDateTime;

  getUUID(key: string): Uuid {
    return toUuid(this.getString(key));
  }

  getStringOrNull(key: string): string | null {
    return this.getOrNull(key, (k) => this.getString(k));
  }

  getBoolOrNull(key: string): boolean | null {
    return this.getOrNull(key, (k) => this.getBool(k));
  }

  getShortOrNull(key: string): number | null {
    return this.getOrNull(key, (k) => this.getShort(k));
  }

  getIntOrNull(key: string): number | null {
    return this.getOrNull(key, (k) => this.getInt(k));
  }

  getLongOrNull(key: string): number | null {
    return this.getOrNull(key, (k) => this.getLong(k));
  }

  getFloatOrNull(key: string): number | null {
    return this.getOrNull(key, (k) => this.getFloat(k));
  }

  getDoubleOrNull(key: string): number | null {
    return this.getOrNull(key, (k) => this.getDouble(k));
  }

  getInstantOrNull(key: string): Instant | null {
    return this.getOrNull(key, (k) => this.getInstant(k));
  }

  getLocalDateOrNull(key: string): LocalDate | null {
    return this.getOrNull(key, (k) => this.getLocalDate(k));
  }

  getLocalTimeOrNull(key: string): LocalTime | null {
    return this.getOrNull(key, (k) => this.getLocalTime(k));
  }

  getLocalDateTimeOrNull(key: string): LocalDateTime | null {
    return this.getOrNull(key, (k) => this.getLocalDateTime(k));
  }

  getUUIDOrNull(key: string): Uuid | null {
    return this.getOrNull(key, (k) => this.getUUID(k));
  }

  getStringOrElse(key: string, defaultValue: string): string {
    return this.getOrElse(key, (k) => this.getString(k), defaultValue);
  }

  getBoolOrElse(key: string, defaultValue: boolean): boolean {
    return this.getOrElse(key, (k) => this.getBool(k), defaultValue);
  }

  getShortOrElse(key: string, defaultValue: number): number {
    return this.getOrElse(key, (k) => this.getShort(k), defaultValue);
  }

  getIntOrElse(key: string, defaultValue: number): number {
    return this.getOrElse(key, (k) => this.getInt(k), defaultValue);
  }

  getLongOrElse(key: string, defaultValue: number): number {
    return this.getOrElse(key, (k) => this.getLong(k), defaultValue);
  }

  getFloatOrElse(key: string, defaultValue: number): number {
    return this.getOrElse(key, (k) => this.getFloat(k), defaultValue);
  }

  getDoubleOrElse(key: string, defaultValue: number): number {
    return this.getOrElse(key, (k) => this.getDouble(k), defaultValue);
  }

  getInstantOrElse(key: string, defaultValue: Instant): Instant {
    return this.getOrElse(key, (k) => this.getInstant(k), defaultValue);
  }

  getLocalDateOrElse(key: string, defaultValue: LocalDate): LocalDate {
    return this.getOrElse(key, (k) => this.getLocalDate(k), defaultValue);
  }

  getLocalTimeOrElse(key: string, defaultValue: LocalTime): LocalTime {
    return this.getOrElse(key, (k) => this.getLocalTime(k), defaultValue);
  }

  getLocalDateTimeOrElse(key: string, defaultValue: LocalDateTime): LocalDateTime {
    return this.getOrElse(key, (k) => this.getLocalDateTime(k), defaultValue);
  }

  getUUIDOrElse(key: string, defaultValue: Uuid): Uuid {
    return this.getOrElse(key, (k) => this.getUUID(k), defaultValue);
  }

  /** The value from `fetcher`, or null when the key is missing or holds a null. */
  getOrNull<T>(key: string, fetcher: (key: string) => T): T | null {
    if (!this.containsKey(key)) return null;
    const value = this.get(key);
    return value === null || value === undefined ? null : fetcher(key);
  }

  /** The value from `fetcher`, or `defaultValue` when the key is missing. */
  getOrElse<T>(key: string, fetcher: (key: string) => T, defaultValue: T): T {
    return this.containsKey(key) ? fetcher(key) : defaultValue;
  }
}
