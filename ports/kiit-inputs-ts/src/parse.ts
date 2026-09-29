import { Temporal } from "./temporal.js";
import type { Instant, LocalDate, LocalDateTime, LocalTime } from "./temporal.js";

/** A UUID in its usual 8-4-4-4-12 text form. There's no built-in UUID type in JS, so it's a string. */
export type Uuid = string;

// Parsers for the typed getters, one per Kotlin `String.toX()` the getters lean on. Each takes the
// already-trimmed raw text and throws an Error on anything Kotlin's version would reject.
// Callers pass "" for a missing key, and that fails to parse for every type except string and bool.

const WHOLE = /^[+-]?\d+$/;
const DECIMAL = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
const SPECIAL = /^[+-]?(NaN|Infinity)$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function invalid(type: string, text: string, cause?: unknown): Error {
  return new Error(`Invalid ${type}: "${text}"`, cause === undefined ? undefined : { cause });
}

/** Kotlin's `String.toBoolean()`: "true" in any case is true, everything else is false. Never throws. */
export function toBool(text: string): boolean {
  return text.toLowerCase() === "true";
}

function toWhole(type: string, text: string, min: number, max: number): number {
  if (!WHOLE.test(text)) throw invalid(type, text);
  const n = Number(text);
  if (n < min || n > max) throw invalid(type, text);
  return n;
}

export function toShort(text: string): number {
  return toWhole("short", text, -32768, 32767);
}

export function toInt(text: string): number {
  return toWhole("int", text, -2147483648, 2147483647);
}

/**
 * Kotlin's Long is 64-bit, a JS number is only exact up to 2^53. Values past that throw instead of
 * quietly rounding.
 */
export function toLong(text: string): number {
  if (!WHOLE.test(text)) throw invalid("long", text);
  const n = Number(text);
  if (!Number.isSafeInteger(n)) throw invalid("long", text);
  return n;
}

export function toDouble(text: string): number {
  if (!DECIMAL.test(text) && !SPECIAL.test(text)) throw invalid("double", text);
  return Number(text);
}

/** A double rounded to the nearest 32-bit float, the value Kotlin's Float would hold. */
export function toFloat(text: string): number {
  if (!DECIMAL.test(text) && !SPECIAL.test(text)) throw invalid("float", text);
  return Math.fround(Number(text));
}

/** Checks the 8-4-4-4-12 hex form and returns it lowercase, the way Kotlin prints a Uuid. */
export function toUuid(text: string): Uuid {
  if (!UUID.test(text)) throw invalid("uuid", text);
  return text.toLowerCase();
}

function fromTemporal<T>(type: string, text: string, parse: (text: string) => T): T {
  try {
    return parse(text);
  } catch (e) {
    throw invalid(type, text, e);
  }
}

export function toInstant(text: string): Instant {
  return fromTemporal("instant", text, (t) => Temporal.Instant.from(t));
}

export function toLocalDate(text: string): LocalDate {
  return fromTemporal("date", text, (t) => Temporal.PlainDate.from(t));
}

export function toLocalTime(text: string): LocalTime {
  return fromTemporal("time", text, (t) => Temporal.PlainTime.from(t));
}

export function toLocalDateTime(text: string): LocalDateTime {
  return fromTemporal("date-time", text, (t) => Temporal.PlainDateTime.from(t));
}
