import { describe, expect, it } from "vitest";
import { FakeInputs } from "./fakes.js";

describe("Inputs", () => {
  it("getOrNullChecksContainsKeyFirst", () => {
    const inputs = new FakeInputs({ name: "kiit", count: 3 });
    expect(inputs.getStringOrNull("name")).toBe("kiit");
    expect(inputs.getIntOrNull("count")).toBe(3);
    expect(inputs.getStringOrNull("missing")).toBeNull();
  });

  it("getOrElseChecksContainsKeyFirst", () => {
    const inputs = new FakeInputs({ count: 3 });
    expect(inputs.getIntOrElse("count", -1)).toBe(3);
    expect(inputs.getIntOrElse("missing", -1)).toBe(-1);
  });

  it("containsKeySizeAndGet", () => {
    const inputs = new FakeInputs({ a: 1, b: 2 });
    expect(inputs.containsKey("a")).toBe(true);
    expect(inputs.containsKey("z")).toBe(false);
    expect(inputs.size()).toBe(2);
    expect(inputs.get("a")).toBe(1);
    expect(inputs.get("z")).toBeNull();
  });

  it("keysListsEveryKeyPresent", () => {
    const inputs = new FakeInputs({ a: 1, b: 2 });
    expect(inputs.keys()).toEqual(["a", "b"]);
  });

  it("getOrNullIsNullWhenTheKeyHoldsANull", () => {
    const inputs = new FakeInputs({ name: null });
    expect(inputs.containsKey("name")).toBe(true);
    expect(inputs.getStringOrNull("name")).toBeNull();
  });
});

describe("InputsUpdatable", () => {
  it("addReturnsNewInstanceWithoutMutatingOriginal", () => {
    const original = new FakeInputs({ a: 1 });
    const updated = original.add("b", 2);
    expect(original.size()).toBe(1);
    expect(original.containsKey("b")).toBe(false);
    expect(updated.size()).toBe(2);
    expect(updated.containsKey("a")).toBe(true);
    expect(updated.containsKey("b")).toBe(true);
  });

  it("addOverwritingExistingKeyReplacesValue", () => {
    const original = new FakeInputs({ a: 1 });
    const updated = original.add("a", 99);
    expect(original.get("a")).toBe(1);
    expect(updated.get("a")).toBe(99);
  });
});

describe("Meta", () => {
  it("toMapReflectsUnderlyingData", () => {
    const meta = new FakeInputs({ x: "1", y: "two" });
    expect(meta.toMap()).toEqual(new Map([["x", "1"], ["y", "two"]]));
  });

  it("toMapStringifiesNonStringValues", () => {
    const meta = new FakeInputs({ count: 3 });
    expect(meta.toMap()).toEqual(new Map([["count", "3"]]));
  });

  it("toMapOnEmptyInputsIsEmpty", () => {
    expect(new FakeInputs().toMap()).toEqual(new Map());
  });
});
