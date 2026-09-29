import type { Uuid } from "./parse.js";
import type { Instant, LocalDate, LocalDateTime, LocalTime } from "./temporal.js";

/**
 * Typed write access, mirroring [Gets]. Secondary to reading: it's there for sources that need to
 * persist a value back, like a settings screen. `Short`, `Int`, `Long`, `Float` and `Double` are all
 * a `number` here.
 */
export interface Puts {
  putString(key: string, value: string): void;
  putBool(key: string, value: boolean): void;
  putShort(key: string, value: number): void;
  putInt(key: string, value: number): void;
  putLong(key: string, value: number): void;
  putFloat(key: string, value: number): void;
  putDouble(key: string, value: number): void;
  putInstant(key: string, value: Instant): void;
  putLocalDate(key: string, value: LocalDate): void;
  putLocalTime(key: string, value: LocalTime): void;
  putLocalDateTime(key: string, value: LocalDateTime): void;
  putUUID(key: string, value: Uuid): void;

  putStringOrNull(key: string, value: string | null): void;
  putBoolOrNull(key: string, value: boolean | null): void;
  putShortOrNull(key: string, value: number | null): void;
  putIntOrNull(key: string, value: number | null): void;
  putLongOrNull(key: string, value: number | null): void;
  putFloatOrNull(key: string, value: number | null): void;
  putDoubleOrNull(key: string, value: number | null): void;
  putInstantOrNull(key: string, value: Instant | null): void;
  putLocalDateOrNull(key: string, value: LocalDate | null): void;
  putLocalTimeOrNull(key: string, value: LocalTime | null): void;
  putLocalDateTimeOrNull(key: string, value: LocalDateTime | null): void;
  putUUIDOrNull(key: string, value: Uuid | null): void;
}
