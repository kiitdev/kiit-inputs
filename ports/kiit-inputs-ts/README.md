# @kiitdev/inputs

Typed read/write access to key-value data, for request inputs, config, DB records, and settings. A native TypeScript port of the Kotlin [`kiit-inputs`](../../README.md), checked against it. It isn't a wrapper. Runs on Node 24+, with one dependency, [`temporal-polyfill`](https://www.npmjs.com/package/temporal-polyfill).

```ts
import { MapReads } from "@kiitdev/inputs";

const query = new MapReads({ name: "kiit", count: "3", active: "true" });

query.getString("name");  // "kiit"
query.getInt("count");    // 3
query.getBool("active");  // true
```

Pre-1.0: the API may still shift before a stable release.

## Install

```bash
npm install @kiitdev/inputs
```

## Reading

**From a plain map or object**, the shape request query params or parsed CLI flags usually arrive in:

```ts
import { MapReads } from "@kiitdev/inputs";

const settings = new MapReads({ env: "prod", retries: "3" });
settings.getString("env");                   // "prod"
settings.getIntOrElse("retries", 1);         // 3
settings.getIntOrElse("timeout", 30);        // 30, the key is missing
settings.getIntOrNull("timeout");            // null
```

**A record, by name or by position**, the shape a DB row needs:

```ts
import { ListMap, RecordMap } from "@kiitdev/inputs";

const row = new RecordMap(new ListMap<string, unknown>([["id", 1], ["name", "kiit"]]));
row.getInt("id");  // by name
row.getInt(0);     // by position, same column
```

**Header-like metadata, including a key that repeats**, the shape HTTP headers or CLI flags need:

```ts
import { ListMap, MetaMap } from "@kiitdev/inputs";

const headers = new MetaMap(
  new ListMap([["Set-Cookie", "a=1"], ["Set-Cookie", "b=2"], ["Content-Type", "text/plain"]]),
);
headers.getString("Set-Cookie");  // "b=2", the last value wins, same as get()
headers.getAll("Set-Cookie");     // ["a=1", "b=2"], every value
headers.keys();                   // ["Set-Cookie", "Content-Type"], every key, deduplicated
```

See [`samples/sample-ts`](../../samples/sample-ts) for a runnable example, including a small custom `Inputs`.

## Concepts

The names match the Kotlin module, apart from `Record`.

| Term | What it is |
|---|---|
| `Gets` | Typed read by key: string, bool, numbers, dates, UUID, each with an `OrNull` and an `OrElse` variant. |
| `Puts` | Typed write, mirroring `Gets`. Secondary to reading. |
| `Inputs` | `Gets` plus `get`, `containsKey`, `size`, `keys`, `raw`. The read contract for a key-value source. |
| `InputsUpdatable` | An immutable `add(key, value)` that returns a new `Inputs`. |
| `Repeatable` | `getAll(key)`, every value for a key that can repeat, like an HTTP `Set-Cookie`. |
| `Meta` | `Inputs` plus `Repeatable` plus `toMap()`. For headers, CLI flags, queue attributes. |
| `Args` | The same shape as `Meta`, for query and call arguments. A separate type, so the two aren't swapped by accident. |
| `MetaMap` / `ArgsMap` | Concrete `Meta` and `Args`, both backed by `ListMapReads`. Typed getters parse the raw string. |
| `Settings` | `Inputs` plus `Puts`, plus `edit(() => { ... })` to bracket a batch of writes. |
| `DataRecord` | An `Inputs` you can also read by position. **Kotlin calls this `Record`.** It's `DataRecord` here because `Record` is also a built-in TypeScript type. |
| `RecordMap` | A concrete `DataRecord` backed by a `ListMap`. Getters return the stored value as is. |
| `MapReads` | A concrete `Gets` over a `Map` or object. Handy for tests and prototyping. |
| `ListMap` | An ordered, immutable collection with lookup by key and by position, and duplicate keys allowed. |

## Types

| Kotlin | TypeScript |
|---|---|
| `Short`, `Int`, `Long`, `Float`, `Double` | `number` |
| `Uuid` | `Uuid`, an alias for `string` |
| `Instant` | `Instant`, an alias for `Temporal.Instant` |
| `LocalDate`, `LocalTime`, `LocalDateTime` | aliases for `Temporal.PlainDate`, `PlainTime`, `PlainDateTime` |
| `T?` | `T \| null` |
| `Pair<A, B>` | `[A, B]` |

Dates and times use the [Temporal](https://tc39.es/proposal-temporal/docs/) API. Node 24 doesn't have it yet, so the package uses `temporal-polyfill`, and switches to the runtime's own `Temporal` once there is one. The polyfill is never put on the global. To build a value to pass in, import `Temporal` from this package so you get the same classes it uses:

```ts
import { Temporal } from "@kiitdev/inputs";

const created = Temporal.Instant.from("2024-03-05T10:15:30Z");
```

## Writing your own Inputs

Kotlin interfaces can carry default methods and TypeScript ones can't, so the defaults live in abstract classes. Extend `GetsBase`, supply the typed getters plus `get`, `containsKey`, `raw`, `size` and `keys`, and you get every `OrNull` and `OrElse` variant, `getUUID`, `getOrNull` and `getOrElse`.

```ts
import { GetsBase } from "@kiitdev/inputs";
import type { Inputs } from "@kiitdev/inputs";

class MyInputs extends GetsBase implements Inputs {
  // get, containsKey, raw, size, keys, and getString, getInt, getBool, ...
}
```

`SettingsBase` adds `edit` and `put` on top, and `DataRecordBase` adds the by-position reads. For `DataRecordBase`, implement `getPos`, `getName`, `contains` and one protected `read...(name)` method per type.

## Differences from Kotlin

1. **`Record` is `DataRecord`.** See above.
2. **`Args` and `Meta` carry a `kind`.** TypeScript compares shapes, so each has a `kind` property (`"args"` or `"meta"`) to keep them from being assignable to each other.
3. **`Long` stops at 2^53.** A `Long` is a `number` here. Text past the safe-integer limit throws instead of rounding.
4. **Date and time parsing follows Temporal.** It accepts what `Temporal.*.from` accepts, which is a little looser than `kotlinx-datetime`. For example, a date-time string is accepted where a date is expected.
5. **`RecordMap` checks nothing about types.** A wrongly typed stored value comes back unchanged, where Kotlin throws a `ClassCastException`. It does throw when the value is `null` or `undefined`.
6. **`MapReads` also takes an object,** not only a `Map`.
7. **Errors are plain `Error`s.** Bad text throws `Invalid int: "abc"` and so on. A position outside a record throws a `RangeError`.

## Requirements

- Node 24+ (ESM only)
- One dependency: `temporal-polyfill`

## License

[Apache License 2.0](./LICENSE)
