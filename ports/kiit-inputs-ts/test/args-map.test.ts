import { describe, expect, it } from "vitest";
import { ArgsMap, ListMap, MetaMap } from "../src/index.js";
import type { Args, Meta } from "../src/index.js";

/**
 * ArgsMap shares its whole implementation with MetaMap through ListMapReads (see meta-map.test.ts
 * for the full read behavior). These check that ArgsMap works on its own, and that it isn't
 * interchangeable with Meta.
 */
describe("ArgsMap", () => {
  it("behavesLikeAnInputsAndRepeatable", () => {
    const args = new ArgsMap(new ListMap([["tag", "a"], ["tag", "b"], ["page", "2"]]));
    expect(args.getInt("page")).toBe(2);
    expect(args.getString("tag")).toBe("b");
    expect(args.getAll("tag")).toEqual(["a", "b"]);
    expect(args.toMap()).toEqual(new Map([["tag", "b"], ["page", "2"]]));
  });

  it("isNotAMeta", () => {
    const args: Args = new ArgsMap(new ListMap([["a", "1"]]));
    expect(args.kind).toBe("args");
    expect(args instanceof MetaMap).toBe(false);
  });

  // Checked at compile time by `npm run typecheck`. Structurally the two are the same shape, and it
  // is the `kind` property that keeps them apart. If they became assignable, the
  // `@ts-expect-error` lines below would themselves be an error.
  it("argsAndMetaAreNotAssignableToEachOther", () => {
    const args = new ArgsMap(new ListMap<string, string>());
    const meta = new MetaMap(new ListMap<string, string>());

    // @ts-expect-error an Args is not a Meta
    const notMeta: Meta = args;
    // @ts-expect-error a Meta is not an Args
    const notArgs: Args = meta;

    expect([notMeta, notArgs]).toHaveLength(2);
  });
});
