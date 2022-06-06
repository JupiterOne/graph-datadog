# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Add `missing account` handling

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
