# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 2.2.3 - 2024-01-25

### Changed

- INT-10265: update user key to avoid duplicates

## 2.2.1 - 2023-02-09

### Changed

- Upgrades sdk-\* dependencies
- Updated date parsing precision
- Fixed vulnerable packages

## 2.2.0 - 2023-02-09

### Changed

- Upgrade `@datadog/datadog-api-client` to 1.9.0 to fix host parsing issue
- Added `createdOn` and `updatedOn` to `datadog_user` entity
- Updated host osVersion logic

## 2.1.1 - 2023-01-25

### Added

- Added more details to the error (including the `err` object as `cause`) which
  helps when `err` doesn't contain `code` or `body` property.

## 2.1.0 - 2023-01-05

### Added

- Updated `iterateApi` to handle both V1 and V2 of Datadog API Client
- The following entities are **now** created:

| Resources | Entity `_type` | Entity `_class` |
| --------- | -------------- | --------------- |
| Host      | `datadog_host` | `Host`          |

- The following relationships are **now** created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `datadog_account`     | **HAS**               | `datadog_host`        |

## 2.0.0 - 2022-08-17

### Added

- Added optional environment field `DATADOG_ORG_PUBLIC_ID` allowing users to
  enter their organization's public ID resulting in integration being able to
  fetch details about it. If not provided, a default `Account` entity will be
  created instead.

### Changed

- Bumped `@jupiterone/integration-sdk-core` to `^8.22.0`
- Bumped `@jupiterone/integration-sdk-dev-tools` to `^8.22.0`
- Bumped `@jupiterone/integration-sdk-testing` to `^8.22.0`

## 1.1.0 - 2022-08-03

### Added

- Added optional host config field. The Datadog US host is `datadoghq.us` and
  the EU host is `datadoghq.eu`

## [1.0.1] - 2022-01-28

### Fixed

- Use `await` for `iterateApi` callback function to properly create all the user
  roles relationships

## [1.0.0] - 2022-01-14

### Added

- Ingest new entity `datadog_user`
- Ingest new entity `datadog_account`
- Ingest new entity `datadog_role`
- Build new relationship `datadog_account_has_user`
- Build new relationship `datadog_account_has_role`
- Build new relationship `datadog_user_assigned_role`
