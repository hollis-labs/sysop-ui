# Deprecation of `@hollis-labs/sysop-ui`

**Status:** deprecated, pending removal.
**Replacement:** [`@hollis-labs/kit-dashboard`](https://github.com/hollis-labs/design-kit/tree/main/packages/kit-dashboard), in [design-kit](https://github.com/hollis-labs/design-kit).
**Removal:** once GUI vNext is ready. There is no date.

## Replacement

`@hollis-labs/kit-dashboard` is the dashboard kit that replaces this package. By
its own README it was forked from `@hollis-labs/sysop-ui` 0.9.0 and then rebased
onto the extracted `@hollis-labs/design-components`,
`@hollis-labs/design-app-runtime` and `@hollis-labs/design-tokens` packages. It
is a fork, not a rename: this package is left as it is. Read the kit-dashboard
README before migrating, because the code is now layered differently.

## Status

Checked on 2026-10-03:

- **npm.** Every published version of `@hollis-labs/sysop-ui` (0.7.2, 0.8.0 and
  0.9.0) carries a deprecation notice that points to `@hollis-labs/kit-dashboard`.
  `latest` is 0.9.0. The notice says existing installs keep working until
  removal.
- **This repository.** It stays public. The last release is v0.9.0 (see the
  changelog). The change that added this document is documentation only: no code,
  version, tag or publish action.

## What stays available until removal

Only what can be checked today:

- The published npm versions stay installable.
- The git tags in this repository stay. Some consumers depend on a `github:` tag
  (see the table below), so this repository has to remain available until they
  have moved.
- The scripts in `package.json` (`typecheck`, `lint`, `test:run`, `build`) keep
  working as described in `AGENTS.md`.

Nothing in this repository promises new features, fixes or a support period.

## Removal plan

1. **Now.** Deprecated on npm, and marked deprecated in this repository's README
   and docs.
2. **Consumer migration.** Each consumer below moves to `@hollis-labs/kit-dashboard`.
   This is tracked outside this repository and is not part of this change.
3. **Removal.** The package and this repository are removed once GUI vNext is
   ready. No date is set, and how removal is carried out is decided at that time.

Removing the package or the repository breaks the installs listed below, so those
consumers have to be migrated first.

## Remaining consumers

Nine applications still depend on this package. They were found on 2026-10-03 by
searching the package manifests of the Hollis Labs application and library
checkouts for the package name, on each repository's default branch.

| Consumer | Location in the repository | Depends on |
| --- | --- | --- |
| cerberus | `web` | npm `0.9.0` |
| fragments-engine | `apps/sysop` | `github:hollis-labs/sysop-ui#v0.6.5` |
| hadron | `cmd/hadron-app/frontend` | npm `0.9.0` |
| loom | `frontend` | `github:hollis-labs/sysop-ui#v0.9.0` |
| sigil | `sysop/frontend` | `github:hollis-labs/sysop-ui#v0.4.0` |
| tesseract | `frontend` | npm `^0.9.0` |
| tether | `apps/sysop/frontend` | npm `0.9.0` |
| torque | `apps/gui` | npm `0.9.0` |
| one private application | `frontend` | `github:hollis-labs/sysop-ui#v0.4.0` |

The private application is counted but not named, because its repository is
private. `@hollis-labs/kit-dashboard` mentions this package only as the project it
was forked from and does not depend on it.
