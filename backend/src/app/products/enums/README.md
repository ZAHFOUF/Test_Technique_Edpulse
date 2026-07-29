# Enums

## Purpose

Hold the **TypeScript enums** specific to the Products domain.

## Responsibility

- Define bounded, closed sets of allowed values used across the feature
  (interface fields, DTO validation, service logic, HTTP payloads).
- Provide a single source of truth for these values so they are never
  duplicated as raw string literals in the codebase.

## What belongs here

- Any enum scoped to the Products domain.
- Current file: `stock-status.enum.ts` — the `StockStatus` enum with the
  string values `in_stock`, `low_stock`, `out_of_stock`.

Enums shared across multiple features should live under a more general
location (e.g. `src/common/`), not here.
