import { describe, expect, it } from "vitest";
import { ListMap } from "../src/index.js";

describe("ListMap", () => {
  it("getByKeyAndByPosition", () => {
    const m = new ListMap<string, number>([["a", 1], ["b", 2], ["c", 3]]);
    expect(m.get("a")).toBe(1);
    expect(m.get("b")).toBe(2);
    expect(m.get("missing")).toBeNull();
    expect(m.getAt(0)).toBe(1);
    expect(m.getAt(2)).toBe(3);
  });

  it("containsAndSize", () => {
    const m = new ListMap<string, number>([["a", 1], ["b", 2]]);
    expect(m.contains("a")).toBe(true);
    expect(m.contains("z")).toBe(false);
    expect(m.size).toBe(2);
  });

  it("addReturnsNewInstanceWithoutMutatingOriginal", () => {
    const original = new ListMap<string, number>([["a", 1]]);
    const updated = original.add("b", 2);
    expect(original.size).toBe(1);
    expect(updated.size).toBe(2);
    expect(original.get("b")).toBeNull();
    expect(updated.get("b")).toBe(2);
  });

  it("addAcceptsAPairAndPlusIsTheSameThing", () => {
    const original = new ListMap<string, number>([["a", 1]]);
    expect(original.add(["b", 2]).get("b")).toBe(2);
    expect(original.plus(["b", 2]).get("b")).toBe(2);
    expect(original.size).toBe(1);
  });

  it("removeReturnsNewInstanceWithoutMutatingOriginal", () => {
    const original = new ListMap<string, number>([["a", 1], ["b", 2]]);
    const updated = original.remove("a");
    expect(original.size).toBe(2);
    expect(updated.size).toBe(1);
    expect(original.contains("a")).toBe(true);
    expect(updated.contains("a")).toBe(false);
    expect(original.minus("a").size).toBe(1);
  });

  it("duplicateKeysKeepLastValueForKeyLookupButAllEntriesInIteration", () => {
    const m = new ListMap<string, number>([["a", 1], ["a", 2]]);
    expect(m.get("a")).toBe(2); // last write wins for key lookup
    expect(m.values()).toEqual([1, 2]); // but both entries survive in iteration
    expect(m.size).toBe(2);
  });

  it("getAllReturnsEveryValueForADuplicateKey", () => {
    const m = new ListMap<string, string>([["Set-Cookie", "a=1"], ["Set-Cookie", "b=2"], ["Content-Type", "text/plain"]]);
    expect(m.getAll("Set-Cookie")).toEqual(["a=1", "b=2"]);
    expect(m.getAll("Content-Type")).toEqual(["text/plain"]);
    expect(m.getAll("missing")).toEqual([]);
  });

  it("keysValuesEntriesAndAll", () => {
    const m = new ListMap<string, number>([["a", 1], ["b", 2]]);
    expect(m.keys()).toEqual(["a", "b"]);
    expect(m.values()).toEqual([1, 2]);
    expect(m.entries()).toEqual([["a", 1], ["b", 2]]);
    expect(m.all()).toEqual([1, 2]);
  });

  it("eachIteratesInOrderWithIndex", () => {
    const m = new ListMap<string, number>([["a", 1], ["b", 2]]);
    const seen: Array<[number, string, number]> = [];
    m.each((i, k, v) => seen.push([i, k, v]));
    expect(seen).toEqual([[0, "a", 1], [1, "b", 2]]);
  });

  it("emptyListMapHasZeroSize", () => {
    const m = new ListMap<string, number>();
    expect(m.size).toBe(0);
    expect(m.get("anything")).toBeNull();
  });

  it("getAtOutOfRangeThrows", () => {
    const m = new ListMap<string, number>([["a", 1]]);
    expect(() => m.getAt(1)).toThrow(RangeError);
    expect(() => m.getAt(-1)).toThrow(RangeError);
  });

  it("toMapKeepsFirstSeenKeyOrderAndLastValue", () => {
    const m = new ListMap<string, number>([["a", 1], ["b", 2], ["a", 3]]);
    expect([...m.toMap()]).toEqual([["a", 3], ["b", 2]]);
  });

  it("cloneIsIndependentOfTheOriginal", () => {
    const original = new ListMap<string, number>([["a", 1]]);
    const copy = original.clone();
    expect(copy).not.toBe(original);
    expect(copy.entries()).toEqual(original.entries());
  });

  it("changingTheInputArrayAfterwardsDoesNotChangeTheListMap", () => {
    const items: Array<[string, number]> = [["a", 1]];
    const m = new ListMap(items);
    items.push(["b", 2]);
    expect(m.size).toBe(1);
    expect(m.contains("b")).toBe(false);
  });
});
