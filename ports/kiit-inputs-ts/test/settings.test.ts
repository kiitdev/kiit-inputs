import { describe, expect, it } from "vitest";
import { FakeSettings } from "./fakes.js";

describe("Settings", () => {
  it("putThenGetRoundTrips", () => {
    const settings = new FakeSettings();
    settings.putString("name", "kiit");
    settings.putInt("count", 42);
    expect(settings.getString("name")).toBe("kiit");
    expect(settings.getInt("count")).toBe(42);
  });

  it("putDoesNotOverwriteByDefault", () => {
    const settings = new FakeSettings();
    settings.put("name", "first");
    settings.put("name", "second");
    expect(settings.getString("name")).toBe("first");
  });

  it("putOverwritesWhenExplicitlyAllowed", () => {
    const settings = new FakeSettings();
    settings.put("name", "first");
    settings.put("name", "second", true);
    expect(settings.getString("name")).toBe("second");
  });

  it("editBracketsWithInitAndDone", () => {
    const settings = new FakeSettings();
    settings.edit(() => {
      settings.putString("name", "kiit");
    });
    expect(settings.initCalled).toBe(true);
    expect(settings.doneCalled).toBe(true);
    expect(settings.editCalls).toBe(1);
    expect(settings.getString("name")).toBe("kiit");
  });

  it("editRunsInitFirstAndDoneLast", () => {
    const calls: string[] = [];
    const settings = new FakeSettings();
    settings.init = () => calls.push("init");
    settings.done = () => calls.push("done");
    settings.edit(() => calls.push("op"));
    expect(calls).toEqual(["init", "op", "done"]);
  });

  it("editDoesNotCallDoneWhenTheBlockThrows", () => {
    const settings = new FakeSettings();
    expect(() =>
      settings.edit(() => {
        throw new Error("boom");
      }),
    ).toThrow("boom");
    expect(settings.initCalled).toBe(true);
    expect(settings.doneCalled).toBe(false);
  });
});
