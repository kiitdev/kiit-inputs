import { describe, expect, it } from "vitest";
import { ListMap, MetaMap } from "../src/index.js";

describe("MetaMap", () => {
  it("getParsesRawStringsByType", () => {
    const meta = new MetaMap(new ListMap([["count", "3"], ["active", "true"]]));
    expect(meta.getInt("count")).toBe(3);
    expect(meta.getBool("active")).toBe(true);
  });

  it("getResolvesToLastValueForARepeatedKey", () => {
    const meta = new MetaMap(new ListMap([["Set-Cookie", "a=1"], ["Set-Cookie", "b=2"]]));
    expect(meta.getString("Set-Cookie")).toBe("b=2");
  });

  it("getAllReturnsEveryValueForARepeatedKey", () => {
    const meta = new MetaMap(new ListMap([["Set-Cookie", "a=1"], ["Set-Cookie", "b=2"]]));
    expect(meta.getAll("Set-Cookie")).toEqual(["a=1", "b=2"]);
  });

  it("getAllOnAMissingKeyIsEmpty", () => {
    const meta = new MetaMap(new ListMap([["a", "1"]]));
    expect(meta.getAll("missing")).toEqual([]);
  });

  it("toMapCollapsesRepeatedKeysToTheLastValue", () => {
    const meta = new MetaMap(new ListMap([["Set-Cookie", "a=1"], ["Set-Cookie", "b=2"], ["Content-Type", "text/plain"]]));
    expect(meta.toMap()).toEqual(new Map([["Set-Cookie", "b=2"], ["Content-Type", "text/plain"]]));
  });

  it("containsKeyAndSize", () => {
    const meta = new MetaMap(new ListMap([["a", "1"], ["b", "2"]]));
    expect(meta.size()).toBe(2);
    expect(meta.containsKey("a")).toBe(true);
    expect(meta.containsKey("z")).toBe(false);
  });

  it("keysAreDeduplicatedForARepeatedKey", () => {
    const meta = new MetaMap(new ListMap([["Set-Cookie", "a=1"], ["Set-Cookie", "b=2"], ["Content-Type", "text/plain"]]));
    expect(meta.keys()).toEqual(["Set-Cookie", "Content-Type"]);
  });

  it("sizeCountsEveryEntryEvenWhenAKeyRepeats", () => {
    const meta = new MetaMap(new ListMap([["a", "1"], ["a", "2"]]));
    expect(meta.size()).toBe(2);
  });

  it("rawIsTheBackingListMap", () => {
    const backing = new ListMap([["a", "1"]]);
    expect(new MetaMap(backing).raw).toBe(backing);
  });

  it("getIsNullForAMissingKey", () => {
    expect(new MetaMap(new ListMap([["a", "1"]])).get("missing")).toBeNull();
  });

  it("aMissingKeyReadsAsEmptyTextSoTypedReadsThrow", () => {
    const meta = new MetaMap(new ListMap([["a", "1"]]));
    expect(meta.getString("missing")).toBe("");
    expect(() => meta.getInt("missing")).toThrow();
    expect(meta.getIntOrNull("missing")).toBeNull();
    expect(meta.getIntOrElse("missing", 7)).toBe(7);
  });

  it("isAMetaKind", () => {
    expect(new MetaMap(new ListMap<string, string>()).kind).toBe("meta");
  });
});
