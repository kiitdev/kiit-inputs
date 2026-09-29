import { GetsBase, SettingsBase } from "../src/index.js";
import type { Inputs, InputsUpdatable, Instant, LocalDate, LocalDateTime, LocalTime, Meta, Uuid } from "../src/index.js";

/**
 * Minimal test-only Inputs/InputsUpdatable/Meta implementation, backed by a plain map of
 * already-typed values (the same "plain cast" contract as RecordMap). kiit-inputs ships no
 * general-purpose concrete Inputs of its own, so these fakes exist to exercise the defaults that
 * GetsBase provides.
 */
export class FakeInputs extends GetsBase implements Inputs, InputsUpdatable, Meta {
  readonly kind = "meta" as const;
  readonly raw: NonNullable<unknown>;
  private readonly data: Map<string, unknown>;

  constructor(data: Record<string, unknown> = {}) {
    super();
    this.data = new Map(Object.entries(data));
    this.raw = this.data;
  }

  get(key: string): unknown {
    return this.data.get(key) ?? null;
  }

  containsKey(key: string): boolean {
    return this.data.has(key);
  }

  size(): number {
    return this.data.size;
  }

  keys(): string[] {
    return [...this.data.keys()];
  }

  toMap(): Map<string, string> {
    const out = new Map<string, string>();
    for (const [key, value] of this.data) {
      if (value !== null && value !== undefined) out.set(key, String(value));
    }
    return out;
  }

  // Backed by a plain, single-value-per-key map, so every key has at most one occurrence.
  getAll(key: string): string[] {
    const value = this.data.get(key);
    return value === null || value === undefined ? [] : [String(value)];
  }

  add(key: string, value: NonNullable<unknown>): Inputs {
    return new FakeInputs({ ...Object.fromEntries(this.data), [key]: value });
  }

  getString(key: string): string {
    return this.data.get(key) as string;
  }

  getBool(key: string): boolean {
    return this.data.get(key) as boolean;
  }

  getShort(key: string): number {
    return this.data.get(key) as number;
  }

  getInt(key: string): number {
    return this.data.get(key) as number;
  }

  getLong(key: string): number {
    return this.data.get(key) as number;
  }

  getFloat(key: string): number {
    return this.data.get(key) as number;
  }

  getDouble(key: string): number {
    return this.data.get(key) as number;
  }

  getInstant(key: string): Instant {
    return this.data.get(key) as Instant;
  }

  getLocalDate(key: string): LocalDate {
    return this.data.get(key) as LocalDate;
  }

  getLocalTime(key: string): LocalTime {
    return this.data.get(key) as LocalTime;
  }

  getLocalDateTime(key: string): LocalDateTime {
    return this.data.get(key) as LocalDateTime;
  }

  override getUUID(key: string): Uuid {
    return this.data.get(key) as Uuid;
  }
}

/**
 * Minimal test-only Settings implementation: an in-memory, mutable key-value store, used to
 * exercise the defaults in Settings and Puts (`edit`, `put`, overwrite behavior).
 */
export class FakeSettings extends SettingsBase {
  editCalls = 0;
  initCalled = false;
  doneCalled = false;
  readonly raw: NonNullable<unknown>;
  private readonly data: Map<string, unknown>;

  constructor(data: Record<string, unknown> = {}) {
    super();
    this.data = new Map(Object.entries(data));
    this.raw = this.data;
  }

  get(key: string): unknown {
    return this.data.get(key) ?? null;
  }

  containsKey(key: string): boolean {
    return this.data.has(key);
  }

  size(): number {
    return this.data.size;
  }

  keys(): string[] {
    return [...this.data.keys()];
  }

  init(): void {
    this.initCalled = true;
  }

  done(): void {
    this.doneCalled = true;
    this.editCalls += 1;
  }

  getString(key: string): string {
    return this.data.get(key) as string;
  }

  getBool(key: string): boolean {
    return this.data.get(key) as boolean;
  }

  getShort(key: string): number {
    return this.data.get(key) as number;
  }

  getInt(key: string): number {
    return this.data.get(key) as number;
  }

  getLong(key: string): number {
    return this.data.get(key) as number;
  }

  getFloat(key: string): number {
    return this.data.get(key) as number;
  }

  getDouble(key: string): number {
    return this.data.get(key) as number;
  }

  getInstant(key: string): Instant {
    return this.data.get(key) as Instant;
  }

  getLocalDate(key: string): LocalDate {
    return this.data.get(key) as LocalDate;
  }

  getLocalTime(key: string): LocalTime {
    return this.data.get(key) as LocalTime;
  }

  getLocalDateTime(key: string): LocalDateTime {
    return this.data.get(key) as LocalDateTime;
  }

  override getUUID(key: string): Uuid {
    return this.data.get(key) as Uuid;
  }

  putString(key: string, value: string): void {
    this.data.set(key, value);
  }

  putBool(key: string, value: boolean): void {
    this.data.set(key, value);
  }

  putShort(key: string, value: number): void {
    this.data.set(key, value);
  }

  putInt(key: string, value: number): void {
    this.data.set(key, value);
  }

  putLong(key: string, value: number): void {
    this.data.set(key, value);
  }

  putFloat(key: string, value: number): void {
    this.data.set(key, value);
  }

  putDouble(key: string, value: number): void {
    this.data.set(key, value);
  }

  putInstant(key: string, value: Instant): void {
    this.data.set(key, value);
  }

  putLocalDate(key: string, value: LocalDate): void {
    this.data.set(key, value);
  }

  putLocalTime(key: string, value: LocalTime): void {
    this.data.set(key, value);
  }

  putLocalDateTime(key: string, value: LocalDateTime): void {
    this.data.set(key, value);
  }

  putUUID(key: string, value: Uuid): void {
    this.data.set(key, value);
  }

  putStringOrNull(key: string, value: string | null): void {
    this.data.set(key, value);
  }

  putBoolOrNull(key: string, value: boolean | null): void {
    this.data.set(key, value);
  }

  putShortOrNull(key: string, value: number | null): void {
    this.data.set(key, value);
  }

  putIntOrNull(key: string, value: number | null): void {
    this.data.set(key, value);
  }

  putLongOrNull(key: string, value: number | null): void {
    this.data.set(key, value);
  }

  putFloatOrNull(key: string, value: number | null): void {
    this.data.set(key, value);
  }

  putDoubleOrNull(key: string, value: number | null): void {
    this.data.set(key, value);
  }

  putInstantOrNull(key: string, value: Instant | null): void {
    this.data.set(key, value);
  }

  putLocalDateOrNull(key: string, value: LocalDate | null): void {
    this.data.set(key, value);
  }

  putLocalTimeOrNull(key: string, value: LocalTime | null): void {
    this.data.set(key, value);
  }

  putLocalDateTimeOrNull(key: string, value: LocalDateTime | null): void {
    this.data.set(key, value);
  }

  putUUIDOrNull(key: string, value: Uuid | null): void {
    this.data.set(key, value);
  }
}
