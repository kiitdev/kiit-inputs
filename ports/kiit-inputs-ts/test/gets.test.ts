import { describe, expect, it } from "vitest";
import { MapReads, Temporal } from "../src/index.js";
import type { Gets } from "../src/index.js";
import { FakeInputs } from "./fakes.js";

const uuid = crypto.randomUUID();
const instant = Temporal.Instant.from("2024-03-05T10:15:30Z");
const date = Temporal.PlainDate.from("2024-03-05");
const time = Temporal.PlainTime.from("10:15:30");
const dateTime = Temporal.PlainDateTime.from("2024-03-05T10:15:30");

const inputs = new FakeInputs({
  string: "kiit",
  bool: true,
  short: 7,
  int: 42,
  long: 9999999999,
  float: 1.5,
  double: 2.25,
  instant,
  date,
  time,
  dateTime,
  uuid,
});

// One row per type: the key, the stored value, a different value to use as the default, and the
// OrNull / OrElse pair under test.
const cases: Array<{
  type: string;
  key: string;
  value: unknown;
  other: unknown;
  orNull: (g: Gets, key: string) => unknown;
  orElse: (g: Gets, key: string, d: never) => unknown;
}> = [
  { type: "String", key: "string", value: "kiit", other: "other", orNull: (g, k) => g.getStringOrNull(k), orElse: (g, k, d) => g.getStringOrElse(k, d) },
  { type: "Bool", key: "bool", value: true, other: false, orNull: (g, k) => g.getBoolOrNull(k), orElse: (g, k, d) => g.getBoolOrElse(k, d) },
  { type: "Short", key: "short", value: 7, other: -1, orNull: (g, k) => g.getShortOrNull(k), orElse: (g, k, d) => g.getShortOrElse(k, d) },
  { type: "Int", key: "int", value: 42, other: -1, orNull: (g, k) => g.getIntOrNull(k), orElse: (g, k, d) => g.getIntOrElse(k, d) },
  { type: "Long", key: "long", value: 9999999999, other: -1, orNull: (g, k) => g.getLongOrNull(k), orElse: (g, k, d) => g.getLongOrElse(k, d) },
  { type: "Float", key: "float", value: 1.5, other: -1, orNull: (g, k) => g.getFloatOrNull(k), orElse: (g, k, d) => g.getFloatOrElse(k, d) },
  { type: "Double", key: "double", value: 2.25, other: -1, orNull: (g, k) => g.getDoubleOrNull(k), orElse: (g, k, d) => g.getDoubleOrElse(k, d) },
  { type: "Instant", key: "instant", value: instant, other: Temporal.Instant.from("2000-01-01T00:00:00Z"), orNull: (g, k) => g.getInstantOrNull(k), orElse: (g, k, d) => g.getInstantOrElse(k, d) },
  { type: "LocalDate", key: "date", value: date, other: Temporal.PlainDate.from("2000-01-01"), orNull: (g, k) => g.getLocalDateOrNull(k), orElse: (g, k, d) => g.getLocalDateOrElse(k, d) },
  { type: "LocalTime", key: "time", value: time, other: Temporal.PlainTime.from("00:00:00"), orNull: (g, k) => g.getLocalTimeOrNull(k), orElse: (g, k, d) => g.getLocalTimeOrElse(k, d) },
  { type: "LocalDateTime", key: "dateTime", value: dateTime, other: Temporal.PlainDateTime.from("2000-01-01T00:00:00"), orNull: (g, k) => g.getLocalDateTimeOrNull(k), orElse: (g, k, d) => g.getLocalDateTimeOrElse(k, d) },
  { type: "UUID", key: "uuid", value: uuid, other: crypto.randomUUID(), orNull: (g, k) => g.getUUIDOrNull(k), orElse: (g, k, d) => g.getUUIDOrElse(k, d) },
];

describe("GetsBase defaults", () => {
  for (const c of cases) {
    it(`get${c.type}OrNullReturnsTheValueOrNull`, () => {
      expect(c.orNull(inputs, c.key)).toBe(c.value);
      expect(c.orNull(inputs, "missing")).toBeNull();
    });

    it(`get${c.type}OrElseReturnsTheValueOrTheDefault`, () => {
      expect(c.orElse(inputs, c.key, c.other as never)).toBe(c.value);
      expect(c.orElse(inputs, "missing", c.other as never)).toBe(c.other);
    });
  }

  it("getOrNullDoesNotCallTheFetcherForAMissingKeyOrANull", () => {
    const withNull = new FakeInputs({ a: null });
    let calls = 0;
    const fetcher = () => {
      calls += 1;
      return "x";
    };
    expect(withNull.getOrNull("missing", fetcher)).toBeNull();
    expect(withNull.getOrNull("a", fetcher)).toBeNull();
    expect(calls).toBe(0);
  });

  it("getOrNullPassesTheKeyToTheFetcher", () => {
    expect(inputs.getOrNull("int", (key) => `read ${key}`)).toBe("read int");
  });

  it("getOrElseOnlyChecksThatTheKeyIsPresent", () => {
    // Same as Kotlin: a present key with a null value still calls the fetcher.
    const withNull = new FakeInputs({ a: null });
    expect(withNull.getOrElse("a", () => "fetched", "default")).toBe("fetched");
    expect(withNull.getOrElse("missing", () => "fetched", "default")).toBe("default");
  });

  it("getUUIDParsesTheStringAndReturnsItLowercase", () => {
    const reads = new MapReads({ id: uuid.toUpperCase() });
    expect(reads.getUUID("id")).toBe(uuid);
  });

  it("getUUIDThrowsOnAMalformedValue", () => {
    const reads = new MapReads({ id: "not-a-uuid" });
    expect(() => reads.getUUID("id")).toThrow(/Invalid uuid/);
    expect(() => reads.getUUIDOrNull("id")).toThrow(/Invalid uuid/);
    expect(reads.getUUIDOrNull("missing")).toBeNull();
  });
});
