import { describe, expect, it } from "vitest";
import {
  toBool,
  toDouble,
  toFloat,
  toInstant,
  toInt,
  toLocalDate,
  toLocalDateTime,
  toLocalTime,
  toLong,
  toShort,
  toUuid,
} from "../src/parse.js";

describe("toBool", () => {
  it("isTrueForTrueInAnyCase", () => {
    expect(toBool("true")).toBe(true);
    expect(toBool("TRUE")).toBe(true);
    expect(toBool("True")).toBe(true);
  });

  it("isFalseForEverythingElseAndNeverThrows", () => {
    for (const text of ["false", "", "yes", "1", "tru", " true"]) {
      expect(toBool(text)).toBe(false);
    }
  });
});

describe("toShort", () => {
  it("parsesWholeNumbersWithinRange", () => {
    expect(toShort("7")).toBe(7);
    expect(toShort("-32768")).toBe(-32768);
    expect(toShort("32767")).toBe(32767);
    expect(toShort("+5")).toBe(5);
  });

  it("throwsOutsideTheRangeOrOnNonWholeText", () => {
    for (const text of ["32768", "-32769", "1.5", "abc", "", " 7", "1e3"]) {
      expect(() => toShort(text), text).toThrow(/Invalid short/);
    }
  });
});

describe("toInt", () => {
  it("parsesWholeNumbersWithinRange", () => {
    expect(toInt("42")).toBe(42);
    expect(toInt("-2147483648")).toBe(-2147483648);
    expect(toInt("2147483647")).toBe(2147483647);
    expect(toInt("+42")).toBe(42);
    expect(toInt("007")).toBe(7);
  });

  it("throwsOutsideTheRangeOrOnNonWholeText", () => {
    for (const text of ["2147483648", "-2147483649", "1.5", "abc", "", "4 2"]) {
      expect(() => toInt(text), text).toThrow(/Invalid int/);
    }
  });
});

describe("toLong", () => {
  it("parsesWholeNumbersUpToTheSafeIntegerLimit", () => {
    expect(toLong("9999999999")).toBe(9999999999);
    expect(toLong("-9007199254740991")).toBe(-9007199254740991);
    expect(toLong("9007199254740991")).toBe(9007199254740991);
  });

  it("throwsPastTheSafeIntegerLimitInsteadOfRounding", () => {
    expect(() => toLong("9007199254740992")).toThrow(/Invalid long/);
    expect(() => toLong("9223372036854775807")).toThrow(/Invalid long/);
  });

  it("throwsOnNonWholeText", () => {
    for (const text of ["1.5", "abc", ""]) {
      expect(() => toLong(text), text).toThrow(/Invalid long/);
    }
  });
});

describe("toDouble", () => {
  it("parsesDecimalsExponentsAndSpecialValues", () => {
    expect(toDouble("2.25")).toBe(2.25);
    expect(toDouble(".5")).toBe(0.5);
    expect(toDouble("5.")).toBe(5);
    expect(toDouble("-1e3")).toBe(-1000);
    expect(toDouble("1E-2")).toBe(0.01);
    expect(toDouble("7")).toBe(7);
    expect(toDouble("Infinity")).toBe(Infinity);
    expect(toDouble("-Infinity")).toBe(-Infinity);
    expect(toDouble("NaN")).toBeNaN();
  });

  it("throwsOnTextThatIsNotANumber", () => {
    for (const text of ["", "abc", "1,5", "1.2.3", "0x10", "1 2", "e5"]) {
      expect(() => toDouble(text), text).toThrow(/Invalid double/);
    }
  });
});

describe("toFloat", () => {
  it("roundsToTheNearest32BitFloat", () => {
    expect(toFloat("1.5")).toBe(1.5);
    expect(toFloat("0.1")).toBe(Math.fround(0.1));
    expect(toFloat("0.1")).not.toBe(0.1);
  });

  it("throwsOnTextThatIsNotANumber", () => {
    for (const text of ["", "abc", "1,5"]) {
      expect(() => toFloat(text), text).toThrow(/Invalid float/);
    }
  });
});

describe("toUuid", () => {
  it("acceptsTheStandardFormAndReturnsItLowercase", () => {
    expect(toUuid("4a3b300b-d0ac-4776-8a9c-31aa75e412b3")).toBe("4a3b300b-d0ac-4776-8a9c-31aa75e412b3");
    expect(toUuid("4A3B300B-D0AC-4776-8A9C-31AA75E412B3")).toBe("4a3b300b-d0ac-4776-8a9c-31aa75e412b3");
  });

  it("acceptsWhatCryptoRandomUuidMakes", () => {
    const made = crypto.randomUUID();
    expect(toUuid(made)).toBe(made);
  });

  it("throwsOnAnythingElse", () => {
    const bad = ["", "nope", "4a3b300bd0ac47768a9c31aa75e412b3", "4a3b300b-d0ac-4776-8a9c-31aa75e412b", "g a3b300b-d0ac-4776-8a9c-31aa75e412b3"];
    for (const text of bad) {
      expect(() => toUuid(text), text).toThrow(/Invalid uuid/);
    }
  });
});

describe("date and time", () => {
  it("parsesIsoText", () => {
    expect(toInstant("2024-03-05T10:15:30Z").toString()).toBe("2024-03-05T10:15:30Z");
    expect(toInstant("2024-03-05T10:15:30+01:00").toString()).toBe("2024-03-05T09:15:30Z");
    expect(toLocalDate("2024-03-05").toString()).toBe("2024-03-05");
    expect(toLocalTime("10:15:30").toString()).toBe("10:15:30");
    expect(toLocalDateTime("2024-03-05T10:15:30").toString()).toBe("2024-03-05T10:15:30");
  });

  it("anInstantNeedsAnOffset", () => {
    expect(() => toInstant("2024-03-05T10:15:30")).toThrow(/Invalid instant/);
    expect(() => toInstant("2024-03-05")).toThrow(/Invalid instant/);
  });

  it("throwsOnInvalidOrEmptyText", () => {
    expect(() => toLocalDate("2024-02-30")).toThrow(/Invalid date/);
    expect(() => toLocalDate("nope")).toThrow(/Invalid date/);
    expect(() => toLocalDate("")).toThrow(/Invalid date/);
    expect(() => toLocalTime("25:00:00")).toThrow(/Invalid time/);
    expect(() => toLocalDateTime("")).toThrow(/Invalid date-time/);
  });

  it("keepsTheUnderlyingErrorAsTheCause", () => {
    try {
      toLocalDate("nope");
      expect.unreachable();
    } catch (e) {
      expect((e as Error).cause).toBeInstanceOf(RangeError);
    }
  });

  it("aDateTimeTextIsAcceptedAsADateBecauseTemporalAllowsIt", () => {
    // Known difference from Kotlin, listed in the README.
    expect(toLocalDate("2024-03-05T10:15:30").toString()).toBe("2024-03-05");
  });
});
