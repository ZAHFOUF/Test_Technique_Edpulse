# Data

## Purpose

Host the **in-memory data source** for the Products feature.

The project rules forbid databases and ORMs, so this folder is the
single source of truth from which the service reads its data.

## Responsibility

- Expose a strongly-typed `Product[]` array.
- Isolate the data from any business logic: nothing here queries,
  filters, paginates, or transforms — those responsibilities belong to
  the service.
- Make it trivial to swap the in-memory source for another
  implementation (e.g. a real repository) later without touching callers.

## What belongs here

- Seed/mock arrays typed against the domain interfaces.
- Current file: `products.data.ts` — exports `products: Product[]`,
  currently empty. It will be populated with mock data in a later phase.

Do not put here: service methods, filtering helpers, DTOs, or types
(those live in `../interfaces/` and `../enums/`).
