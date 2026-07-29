# Products Module

## Purpose

Feature module that owns everything related to the **Products** domain of the API.

## Responsibility

- Expose the HTTP surface for products (`/products` endpoint family).
- Encapsulate the products business logic inside `ProductsService`.
- Keep the controller thin: routing and DTO validation only. Business rules
  live in the service.

## Current files

- `products.module.ts` — declares the module, registers the controller and the service.
- `products.controller.ts` — HTTP layer, injects `ProductsService`. No routes yet.
- `products.service.ts` — business logic layer. Empty placeholder for Phase 1.

## Files added in future phases

- `dto/` — request DTOs (query pagination, filters) validated with `class-validator`.
- `entities/` — the `Product` type/interface used by the in-memory store.
- `products.repository.ts` (or an in-file constant) — the in-memory array
  acting as data source, isolated from the service so it can evolve independently.
- Mock seed data for the in-memory store.
- Unit tests for the service and controller.

## Why this separation improves maintainability

Grouping every piece of a feature (controller, service, DTOs, entities, tests)
inside a single folder gives the module clear boundaries: any change to the
products domain stays local, imports stay short, and adding a new feature
(e.g. `orders/`) follows the exact same pattern without touching this one.
This is the standard NestJS feature-module pattern and it scales cleanly as
the API grows.
