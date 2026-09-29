import { GetsBase } from "./gets.js";
import type { Inputs } from "./inputs.js";
import type { Uuid } from "./parse.js";
import type { Puts } from "./puts.js";
import type { Instant, LocalDate, LocalDateTime, LocalTime } from "./temporal.js";

/** Provides both gets (reads) and puts (writes) on configurable settings. */
export interface Settings extends Inputs, Puts {
  /** Brackets a batch of edits with `init()` and `done()`. */
  edit(op: () => void): void;

  /**
   * Begins a batch of edits. It matches the edit-transaction shape of Android's SharedPreferences,
   * so an implementation can wrap that directly.
   */
  init(): void;

  /** Completes a batch of edits. */
  done(): void;

  /** Writes `value` as a string, unless the key already exists and `overwrite` is false. */
  put(key: string, value: string, overwrite?: boolean): void;
}

/**
 * The defaults from `Settings` (`edit` and `put`), plus everything `GetsBase` gives an `Inputs`.
 * An implementation supplies the typed getters and putters, `get`, `containsKey`, `raw`, `size`,
 * `keys`, `init` and `done`.
 */
export abstract class SettingsBase extends GetsBase implements Settings {
  abstract readonly raw: NonNullable<unknown>;
  abstract size(): number;
  abstract keys(): string[];

  abstract init(): void;
  abstract done(): void;

  edit(op: () => void): void {
    this.init();
    op();
    this.done();
  }

  put(key: string, value: string, overwrite = false): void {
    if (!this.containsKey(key) || overwrite) {
      this.putString(key, value);
    }
  }

  abstract putString(key: string, value: string): void;
  abstract putBool(key: string, value: boolean): void;
  abstract putShort(key: string, value: number): void;
  abstract putInt(key: string, value: number): void;
  abstract putLong(key: string, value: number): void;
  abstract putFloat(key: string, value: number): void;
  abstract putDouble(key: string, value: number): void;
  abstract putInstant(key: string, value: Instant): void;
  abstract putLocalDate(key: string, value: LocalDate): void;
  abstract putLocalTime(key: string, value: LocalTime): void;
  abstract putLocalDateTime(key: string, value: LocalDateTime): void;
  abstract putUUID(key: string, value: Uuid): void;

  abstract putStringOrNull(key: string, value: string | null): void;
  abstract putBoolOrNull(key: string, value: boolean | null): void;
  abstract putShortOrNull(key: string, value: number | null): void;
  abstract putIntOrNull(key: string, value: number | null): void;
  abstract putLongOrNull(key: string, value: number | null): void;
  abstract putFloatOrNull(key: string, value: number | null): void;
  abstract putDoubleOrNull(key: string, value: number | null): void;
  abstract putInstantOrNull(key: string, value: Instant | null): void;
  abstract putLocalDateOrNull(key: string, value: LocalDate | null): void;
  abstract putLocalTimeOrNull(key: string, value: LocalTime | null): void;
  abstract putLocalDateTimeOrNull(key: string, value: LocalDateTime | null): void;
  abstract putUUIDOrNull(key: string, value: Uuid | null): void;
}
