# Cache

## Purpose

Hosts the **in-memory cache** layer required by the project.

The cache is a cross-cutting concern: it must not live inside a feature module,
so any feature (products today, others tomorrow) can consume it the same way.

## Responsibility

- Provide a simple, dependency-free in-memory store (no Redis, no filesystem,
  no database) as mandated by the project rules.
- Generate deterministic cache keys from request parameters.
- Offer a NestJS-friendly integration point (module + service, optionally an
  interceptor) so controllers stay clean.

## Files added in future phases

- `cache.module.ts` — exports the cache service so any feature module can import it.
- `cache.service.ts` — thin wrapper around a `Map<string, { value, expiresAt }>`
  with `get`, `set`, and TTL handling.
- `cache.interceptor.ts` — optional interceptor to cache GET responses transparently.
- `cache-key.util.ts` — pure function that builds a stable cache key from
  the request query (sorted keys, normalized values).

## Why this separation improves maintainability

Isolating the cache from the features keeps it **reusable and swappable**:
if the constraint on "in-memory only" is lifted later, only the internals of
`cache.service.ts` change — the callers do not. It also makes the cache
independently testable and prevents feature modules from re-implementing their
own ad-hoc caching.
