# Common

## Purpose

Groups the **shared, cross-cutting building blocks** used across the whole
application: pieces that do not belong to any single feature.

## Responsibility

- Host reusable NestJS primitives: exception filters, interceptors, pipes,
  guards, and decorators.
- Keep them **feature-agnostic**: nothing here should import from `app/`.

## Current subdirectories

- `filters/` — hosts `HttpExceptionFilter`, the global filter that turns
  every thrown exception (validation errors, `HttpException`s, unexpected
  runtime failures) into a consistent JSON envelope. See `filters/README.md`.

## Files added in future phases

- Optionally later: `interceptors/`, `pipes/`, `decorators/` if the API grows
  and shared primitives emerge.

## Why this separation improves maintainability

Concentrating cross-cutting code under `common/` avoids duplication
(the same filter would otherwise be re-declared in every module) and
clarifies architectural boundaries: **features live under `app/`, shared
plumbing lives under `common/`, infrastructure like the cache has its own
top-level folder**. New contributors can locate a shared concern in seconds.
