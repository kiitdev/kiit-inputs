import { describe, expect, it } from "vitest";
import { MapReads, Temporal } from "../src/index.js";

const uuid = crypto.randomUUID();

const reads = new MapReads({
  str: "hello",
  bool: "true",
  short: "7",
  int: "42",
  long: "9999999999",
  float: "1.5",
  double: "2.25",
  instant: "2024-03-05T10:15:30Z",
  date: "2024-03-05",
  time: "10:15:30",
  datetime: "2024-03-05T10:15:30",
  uuid,
});

describe("MapReads", () => {
  it("readsTypedValues", () => {
    expect(reads.getString("str")).toBe("hello");
    expect(reads.getBool("bool")).toBe(true);
    expect(reads.getShort("short")).toBe(7);
    expect(reads.getInt("int")).toBe(42);
    expect(reads.getLong("long")).toBe(9999999999);
    expect(reads.getFloat("float")).toBe(1.5);
    expect(reads.getDouble("double")).toBe(2.25);
    expect(reads.getInstant("instant").toString()).toBe(Temporal.Instant.from("2024-03-05T10:15:30Z").toString());
    expect(reads.getLocalDate("date").toString()).toBe(Temporal.PlainDate.from("2024-03-05").toString());
    expect(reads.getLocalTime("time").toString()).toBe(Temporal.PlainTime.from("10:15:30").toString());
    expect(reads.getLocalDateTime("datetime").toString()).toBe(Temporal.PlainDateTime.from("2024-03-05T10:15:30").toString());
    expect(reads.getUUID("uuid")).toBe(uuid);
  });

  it("containsKeyAndSize", () => {
    expect(reads.containsKey("str")).toBe(true);
    expect(reads.containsKey("missing")).toBe(false);
    expect(reads.size()).toBe(12);
  });

  it("orNullReturnsNullWhenMissing", () => {
    expect(reads.getStringOrNull("str")).toBe("hello");
    expect(reads.getStringOrNull("missing")).toBeNull();
    expect(reads.getIntOrNull("missing")).toBeNull();
  });

  it("orElseReturnsDefaultWhenMissing", () => {
    expect(reads.getIntOrElse("int", -1)).toBe(42);
    expect(reads.getIntOrElse("missing", -1)).toBe(-1);
    expect(reads.getStringOrElse("missing", "fallback")).toBe("fallback");
  });

  it("emptyMapReadsHaveZeroSize", () => {
    const empty = new MapReads();
    expect(empty.size()).toBe(0);
    expect(empty.containsKey("anything")).toBe(false);
  });

  it("takesAMapAsWellAsAnObject", () => {
    const fromMap = new MapReads(new Map([["count", "3"]]));
    expect(fromMap.getInt("count")).toBe(3);
  });

  it("trimsTheRawTextBeforeParsing", () => {
    const padded = new MapReads({ count: "  3  ", name: "  kiit " });
    expect(padded.getInt("count")).toBe(3);
    expect(padded.getString("name")).toBe("kiit");
  });

  it("aMissingKeyReadsAsEmptyText", () => {
    expect(reads.getString("missing")).toBe("");
    expect(reads.getBool("missing")).toBe(false);
    expect(() => reads.getInt("missing")).toThrow();
  });

  it("getIsNullForAMissingKey", () => {
    expect(reads.get("missing")).toBeNull();
    expect(reads.get("str")).toBe("hello");
  });

  it("aBadValueThrows", () => {
    const bad = new MapReads({ n: "abc", d: "not a date" });
    expect(() => bad.getInt("n")).toThrow();
    expect(() => bad.getLocalDate("d")).toThrow();
    expect(() => bad.getIntOrNull("n")).toThrow();
  });
});
