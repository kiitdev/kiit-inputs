import { describe, expect, it } from "vitest";
import { ListMap, RecordMap, Temporal } from "../src/index.js";

const uuid = crypto.randomUUID();
const instant = Temporal.Instant.from("2024-03-05T10:15:30Z");
const date = Temporal.PlainDate.from("2024-03-05");
const time = Temporal.PlainTime.from("10:15:30");
const dateTime = Temporal.PlainDateTime.from("2024-03-05T10:15:30");

const record = new RecordMap(
  new ListMap<string, unknown>([
    ["id", 1],
    ["name", "kiit"],
    ["active", true],
    ["uuid", uuid],
    ["created", instant],
    ["date", date],
    ["time", time],
    ["datetime", dateTime],
  ]),
);

describe("RecordMap", () => {
  it("readsByNamePlainCast", () => {
    expect(record.getInt("id")).toBe(1);
    expect(record.getString("name")).toBe("kiit");
    expect(record.getBool("active")).toBe(true);
    expect(record.getUUID("uuid")).toBe(uuid);
    expect(record.getInstant("created")).toBe(instant);
    expect(record.getLocalDate("date")).toBe(date);
    expect(record.getLocalTime("time")).toBe(time);
    expect(record.getLocalDateTime("datetime")).toBe(dateTime);
  });

  it("positionalAccessDelegatesToNameBasedAccess", () => {
    // "id" is position 0, "name" is position 1, per declaration order.
    expect(record.getInt(0)).toBe(1);
    expect(record.getString(1)).toBe("kiit");
    expect(record.getBool(2)).toBe(true);
    expect(record.getUUID(3)).toBe(uuid);
    expect(record.getInstant(4)).toBe(instant);
  });

  it("getPosAndGetNameRoundTrip", () => {
    expect(record.getPos("id")).toBe(0);
    expect(record.getName(0)).toBe("id");
    expect(record.getPos("name")).toBe(1);
    expect(record.getName(1)).toBe("name");
  });

  it("containsChecksColumnPresence", () => {
    expect(record.contains("name")).toBe(true);
    expect(record.containsKey("name")).toBe(true);
    expect(record.contains("missing")).toBe(false);
  });

  it("sizeReflectsColumnCount", () => {
    expect(record.size()).toBe(8);
  });

  it("keysReflectsColumnNamesInOrder", () => {
    expect(record.keys()).toEqual(["id", "name", "active", "uuid", "created", "date", "time", "datetime"]);
  });

  it("aPositionOutsideTheRecordThrows", () => {
    expect(() => record.getName(8)).toThrow(RangeError);
    expect(() => record.getName(-1)).toThrow(RangeError);
    expect(() => record.getInt(99)).toThrow(RangeError);
    expect(() => record.getName(1.5)).toThrow(RangeError);
  });

  it("aNullOrMissingValueThrowsOnAPlainRead", () => {
    const withNull = new RecordMap(new ListMap<string, unknown>([["a", null]]));
    expect(() => withNull.getString("a")).toThrow(/No value for column "a"/);
    expect(() => record.getString("missing")).toThrow(/No value for column "missing"/);
  });

  it("orNullAndOrElseWorkOnRecords", () => {
    const withNull = new RecordMap(new ListMap<string, unknown>([["a", null], ["b", 5]]));
    expect(withNull.getStringOrNull("a")).toBeNull();
    expect(withNull.getIntOrNull("b")).toBe(5);
    expect(withNull.getIntOrNull("missing")).toBeNull();
    expect(withNull.getIntOrElse("missing", -1)).toBe(-1);
    expect(record.getUUIDOrNull("uuid")).toBe(uuid);
    expect(record.getUUIDOrElse("missing", "fallback")).toBe("fallback");
  });

  it("aNameThatLooksLikeANumberIsStillAName", () => {
    const numeric = new RecordMap(new ListMap<string, unknown>([["0", "zero"], ["first", "one"]]));
    expect(numeric.getString("0")).toBe("zero");
    expect(numeric.getString(1)).toBe("one");
  });

  it("duplicateColumnNamesKeepLastValueByNameAndAllByPosition", () => {
    const dup = new RecordMap(new ListMap<string, unknown>([["a", 1], ["a", 2]]));
    expect(dup.getInt("a")).toBe(2);
    expect(dup.getInt(0)).toBe(2); // position 0 is named "a", read by name
    expect(dup.size()).toBe(2);
    expect(dup.keys()).toEqual(["a"]);
  });
});
