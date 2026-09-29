/**
 * Mirrors samples/sample-kotlin: read typed values from a plain map, read a record by name and by
 * position, then plug a small custom Inputs into the library. Type-checked against the native port
 * with `npm run typecheck`.
 */
import { GetsBase, ListMap, MapReads, RecordMap } from "@kiitdev/inputs";
import type { Inputs, InputsUpdatable, Instant, LocalDate, LocalDateTime, LocalTime, Meta } from "@kiitdev/inputs";

/**
 * MapReads: the simplest way to get typed access to a plain map, e.g. request query parameters or
 * CLI flags already parsed into strings.
 */
function mapReadsExample(): void {
  const query = new MapReads({ name: "kiit", count: "3", active: "true" });
  console.log(`name=${query.getString("name")} count=${query.getInt("count")} active=${query.getBool("active")}`);
  console.log(`missing key -> ${query.getStringOrElse("missing", "(default)")}`);
}

/**
 * RecordMap: positional and name-based access, the shape a DB row (or anything else addressable by
 * both column name and index) needs.
 */
function recordMapExample(): void {
  const row = new RecordMap(
    new ListMap<string, unknown>([
      ["id", 1],
      ["name", "kiit"],
      ["active", true],
    ]),
  );
  console.log(`by name: id=${row.getInt("id")}, name=${row.getString("name")}`);
  console.log(`by position: id=${row.getInt(0)}, name=${row.getString(1)}`);
}

/**
 * A minimal custom Inputs implementation. Shows what a host (an HTTP framework adapter, a CLI
 * parser, etc.) needs to provide to plug into kiit-inputs: extend GetsBase for the OrNull/OrElse
 * defaults and supply the rest. Values are stored pre-typed here for simplicity, a real host
 * reading raw strings would parse them in these getters.
 */
class SimpleInputs extends GetsBase implements Inputs, InputsUpdatable, Meta {
  readonly kind = "meta" as const;
  readonly raw: NonNullable<unknown>;

  constructor(private readonly data: Record<string, unknown>) {
    super();
    this.raw = data;
  }

  get(key: string): unknown {
    return this.data[key] ?? null;
  }

  containsKey(key: string): boolean {
    return key in this.data;
  }

  size(): number {
    return Object.keys(this.data).length;
  }

  keys(): string[] {
    return Object.keys(this.data);
  }

  toMap(): Map<string, string> {
    const entries = Object.entries(this.data).filter(([, value]) => value !== null && value !== undefined);
    return new Map(entries.map(([key, value]): [string, string] => [key, String(value)]));
  }

  getAll(key: string): string[] {
    const value = this.data[key];
    return value === null || value === undefined ? [] : [String(value)];
  }

  add(key: string, value: NonNullable<unknown>): Inputs {
    return new SimpleInputs({ ...this.data, [key]: value });
  }

  getString(key: string): string {
    return this.data[key] as string;
  }

  getBool(key: string): boolean {
    return this.data[key] as boolean;
  }

  getShort(key: string): number {
    return this.data[key] as number;
  }

  getInt(key: string): number {
    return this.data[key] as number;
  }

  getLong(key: string): number {
    return this.data[key] as number;
  }

  getFloat(key: string): number {
    return this.data[key] as number;
  }

  getDouble(key: string): number {
    return this.data[key] as number;
  }

  getInstant(key: string): Instant {
    return this.data[key] as Instant;
  }

  getLocalDate(key: string): LocalDate {
    return this.data[key] as LocalDate;
  }

  getLocalTime(key: string): LocalTime {
    return this.data[key] as LocalTime;
  }

  getLocalDateTime(key: string): LocalDateTime {
    return this.data[key] as LocalDateTime;
  }
}

/** Prints a map the way the Kotlin sample does: `{a=1, b=2}`. */
function show(map: Map<string, string>): string {
  return `{${[...map].map(([key, value]) => `${key}=${value}`).join(", ")}}`;
}

function customInputsExample(): void {
  const original = new SimpleInputs({ env: "prod" });
  const updated = original.add("region", "us-east-1");

  console.log(`original has region? ${original.containsKey("region")}`);
  console.log(`updated has region? ${updated.containsKey("region")}`);
  console.log(`updated as map: ${show((updated as Meta).toMap())}`);
}

mapReadsExample();
recordMapExample();
customInputsExample();
