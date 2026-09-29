# Changelog

All notable changes to kiit-inputs are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/), versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Extracted from the Kiit monorepo as its own standalone module.
- `Args`: same shape as `Meta` (`Inputs` + `Repeatable` + `toMap()`), for query/call arguments.
  Kept as its own type, not a typealias, so the two aren't interchangeable by accident.
- `ArgsMap`: concrete `Args` implementation, sharing its whole read implementation with `MetaMap`
  via a new shared base, `ListMapReads`.
- `@kiitdev/inputs` `0.8.0`: native TypeScript port of the whole module, in `ports/kiit-inputs-ts`.
  Dates use `Temporal`, `Record` is named `DataRecord`, and the defaults on the Kotlin interfaces
  live in `GetsBase`, `SettingsBase` and `DataRecordBase`. Published to npm by the new
  `release-npm.yml` workflow, on its own version and `npm-v` tags, separate from the Kotlin release.
- `samples/sample-ts`, mirroring `samples/sample-kotlin`.

### Changed
- `InputsUpdateable` renamed to `InputsUpdatable` (spelling fix).
