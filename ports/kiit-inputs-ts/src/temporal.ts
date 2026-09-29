import { Temporal as PolyfillTemporal } from "temporal-polyfill";

/**
 * The `Temporal` this package parses and builds date/time values with. A runtime that already has
 * `Temporal` wins, otherwise the `temporal-polyfill` package fills in. The polyfill is never
 * installed on the global, so importing this package doesn't change anything outside it.
 *
 * Types always come from the polyfill. The native and polyfill classes have the same shape, but
 * they are different classes: a value made by one won't pass `instanceof` against the other.
 */
export const Temporal: typeof PolyfillTemporal =
  (globalThis as { Temporal?: typeof PolyfillTemporal }).Temporal ?? PolyfillTemporal;

/** A point on the UTC timeline. Kotlin's `kotlinx.datetime.Instant`. */
export type Instant = PolyfillTemporal.Instant;

/** A calendar date with no time zone. Kotlin's `kotlinx.datetime.LocalDate`. */
export type LocalDate = PolyfillTemporal.PlainDate;

/** A wall-clock time with no date or time zone. Kotlin's `kotlinx.datetime.LocalTime`. */
export type LocalTime = PolyfillTemporal.PlainTime;

/** A date and a wall-clock time with no time zone. Kotlin's `kotlinx.datetime.LocalDateTime`. */
export type LocalDateTime = PolyfillTemporal.PlainDateTime;
