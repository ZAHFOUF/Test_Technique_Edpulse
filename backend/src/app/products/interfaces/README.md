# Interfaces

## Purpose

Hold the **TypeScript interfaces** describing the shape of the Products
domain entities.

## Responsibility

- Define the contract used by the service, the in-memory data source,
  the controller, and future DTOs.
- Keep the domain shape decoupled from any transport-specific concern
  (validation, serialization) — those live in DTOs.

## What belongs here

- Any interface scoped to the Products domain.
- Current file: `product.interface.ts` — the `Product` interface with the
  five fields required by the spec (`id`, `name`, `category`, `price`,
  `stock_status`).
- Future candidates: `product-filter.interface.ts`, `paginated-result.interface.ts`,
  or any other domain shape used internally by the module.
