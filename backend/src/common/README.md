# Common

## Purpose

Groups the **shared, cross-cutting building blocks** used across the whole
application: pieces that do not belong to any single feature.

## Responsibility

- Host reusable NestJS primitives: exception filters, interceptors, pipes,
  guards, and decorators.
- Keep them **feature-agnostic**: nothing here should import from `app/`.

## Current subdirectories

- `filters/` — reserved for exception filters (see below). Empty for Phase 1
  because no filter file has been requested yet.

## Files added in future phases

- `filters/http-exception.filter.ts` — a global `@Catch()` filter that
  produces consistent HTTP error responses without leaking internals, as
  required by the project rules.
- Optionally later: `interceptors/`, `pipes/`, `decorators/` if the API grows
  and shared primitives emerge.

## Why this separation improves maintainability

Concentrating cross-cutting code under `common/` avoids duplication
(the same filter would otherwise be re-declared in every module) and
clarifies architectural boundaries: **features live under `app/`, shared
plumbing lives under `common/`, infrastructure like the cache has its own
top-level folder**. New contributors can locate a shared concern in seconds.
