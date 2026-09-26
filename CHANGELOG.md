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

### Changed
- `InputsUpdateable` renamed to `InputsUpdatable` (spelling fix).
