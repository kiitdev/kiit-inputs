import { GetsBase } from "./gets.js";
import { toBool, toDouble, toFloat, toInstant, toInt, toLocalDate, toLocalDateTime, toLocalTime, toLong, toShort } from "./parse.js";
import type { Instant, LocalDate, LocalDateTime, LocalTime } from "./temporal.js";

/**
 * Typed getters over raw strings. HTTP headers, query values and CLI flags are always strings on
 * the wire, so each getter parses the trimmed text and throws when it doesn't fit the type. A
 * missing key reads as "". Kotlin repeats this in `MapReads` and `ListMapReads`, here they share it.
 * Not exported from the package.
 */
export abstract class StringGets extends GetsBase {
  protected abstract getStringRaw(key: string): string;

  getString(key: string): string {
    return this.getStringRaw(key);
  }

  getBool(key: string): boolean {
    return toBool(this.getStringRaw(key));
  }

  getShort(key: string): number {
    return toShort(this.getStringRaw(key));
  }

  getInt(key: string): number {
    return toInt(this.getStringRaw(key));
  }

  getLong(key: string): number {
    return toLong(this.getStringRaw(key));
  }

  getFloat(key: string): number {
    return toFloat(this.getStringRaw(key));
  }

  getDouble(key: string): number {
    return toDouble(this.getStringRaw(key));
  }

  getInstant(key: string): Instant {
    return toInstant(this.getStringRaw(key));
  }

  getLocalDate(key: string): LocalDate {
    return toLocalDate(this.getStringRaw(key));
  }

  getLocalTime(key: string): LocalTime {
    return toLocalTime(this.getStringRaw(key));
  }

  getLocalDateTime(key: string): LocalDateTime {
    return toLocalDateTime(this.getStringRaw(key));
  }
}
