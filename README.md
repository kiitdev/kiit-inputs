<div align="center">

# kiit-inputs

**Read/write abstraction for typed key-value data, for request inputs, config, DB records, and settings. Kotlin Multiplatform and protocol-neutral.**

[![Build](https://img.shields.io/github/actions/workflow/status/kiitdev/kiit-inputs/ci.yml?branch=main)](https://github.com/kiitdev/kiit-inputs/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/kiitdev/kiit-inputs)](./LICENSE)
[![Kotlin](https://img.shields.io/badge/kotlin-multiplatform-purple.svg)](https://kotlinlang.org)

Part of [Kiit](https://www.kiit.dev)

</div>

## Table of Contents

- [Why](#why)
- [Start](#start)
- [Concepts](#concepts)
- [Usage](#usage)
- [Requirements](#requirements)
- [License](#license)

## Why

An HTTP query parameter, a CLI flag, a config setting, and a database column all end up the same shape: a string key mapped to some value you actually want typed. `getInt("port")`, not a raw string you parse by hand at every call site. Most codebases solve this once per source, so config reading looks nothing like request parsing, which looks nothing like how a repository layer reads a row back. kiit-inputs is that one shape, reused everywhere instead of reinvented per source.

Reading comes first. `Gets`/`Inputs` cover the common case: string, bool, numeric, date, and UUID accessors, plus `OrNull`/`OrElse` variants for the optional path. `Record` adds position-based reads on top of name-based ones, for anything addressable by column index the way a DB row is. Writing is there too, `Puts`/`Settings`, but it's the secondary half, layered on for the sources that actually need to persist a value back, like a settings screen.

```kotlin
import kiit.inputs.MapReads

val query = MapReads(mapOf("name" to "kiit", "count" to "3", "active" to "true"))
val name = query.getString("name")
val count = query.getInt("count")
val active = query.getBool("active")
```

## Start

kiit-inputs hasn't been published to Maven Central yet. Once it is:

```kotlin
dependencies {
    implementation("dev.kiit:kiit-inputs:<version>")
}
```

**Read from a plain map**, the shape request query params or parsed CLI flags usually arrive in:

```kotlin
import kiit.inputs.MapReads

val settings = MapReads(mapOf("env" to "prod", "retries" to "3"))
println(settings.getString("env"))
println(settings.getIntOrElse("retries", default = 1))
```

**Read a record by name or position**, the shape a DB row needs:

```kotlin
import kiit.inputs.ListMap
import kiit.inputs.RecordMap

val row = RecordMap(ListMap(listOf("id" to 1, "name" to "kiit")))
row.getInt("id")   // by name
row.getInt(0)      // by position, same column
```

See [`samples/sample-kotlin`](./samples/sample-kotlin) for a runnable end-to-end example, including a
minimal custom `Inputs` implementation.

## Concepts

| Term | What it is |
|---|---|
| **`Gets`** | Typed read access by key: string, bool, numeric, date, UUID, each with an `OrNull`/`OrElse` variant. |
| **`Inputs`** | `Gets` plus `get`/`containsKey`/`size`/`raw`, the general-purpose read contract for a key-value source. |
| **`InputsUpdateable`** | An immutable `add(key, value)`, returning a new `Inputs` rather than mutating in place. |
| **`Metadata`** | An `Inputs` that can also flatten itself to a `Map<String, Any>`. |
| **`Puts`** | Typed write access, mirroring `Gets`. Secondary to reading. |
| **`Settings`** | `Inputs` + `Puts`, plus `edit { }` for bracketing a batch of writes. |
| **`Record`** | An `Inputs` addressable by position as well as by name, for row-shaped data. |
| **`RecordMap`** | A concrete `Record` backed by a `ListMap`. Every getter is a plain cast; converting a source-specific value (a JDBC timestamp, say) into the right type happens wherever the `ListMap` gets built, not inside `RecordMap`. |
| **`MapReads`** | A concrete `Gets` backed by a plain `Map<String, Any?>`. Good for tests and quick prototyping. |
| **`ListMap`** | An ordered, immutable collection with O(1) lookup by both key and position, the backing store `RecordMap` needs. |

Dates and UUIDs are `kotlinx.datetime.Instant`/`LocalDate`/`LocalTime`/`LocalDateTime` and `kotlin.uuid.Uuid`, not `java.time`/`java.util.UUID`, so the whole module compiles and runs on JVM, Android, and iOS without any platform-specific branches.

## Usage

**Good fit if:**
1. You want the same typed-read shape across more than one source, HTTP inputs, CLI flags, config, DB rows, without hand-rolling parsing per source.
2. You're implementing a host adapter (a web framework binding, a CLI parser) and want a stable contract to expose values through.
3. You need position-and-name dual access to record-shaped data, not just name-based lookup.

**Probably not necessary if:**
1. You already get a fully-typed value from somewhere (a deserialized DTO, say) and there's no raw string-keyed layer underneath it to abstract.
2. You only ever touch one source and don't expect a second one to show up later. A direct, source-specific API is simpler in that case.

## Requirements

- Kotlin Multiplatform
- JVM, Android, iOS (arm64, simulator arm64, x64)
- Depends on `kotlinx-datetime` (transitively available to consumers via `api`)

## License

[Apache License 2.0](./LICENSE)

---

<div align="center">

**kiit-inputs** is one module of [Kiit](https://www.kiit.dev), a lightweight, modular
Kotlin toolkit for building server applications, APIs, CLIs, and jobs.

**Adopt one module at a time.**

</div>
