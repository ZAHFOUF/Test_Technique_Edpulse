---
name: Phase 2 product model
overview: "Add the Products domain model: a Product interface, a StockStatus enum (string-valued), an empty in-memory data source typed as Product[], and one README per new subdirectory. No service/controller logic changes."
todos:
  - id: enum
    content: Create src/app/products/enums/stock-status.enum.ts with string-valued StockStatus enum
    status: pending
  - id: interface
    content: Create src/app/products/interfaces/product.interface.ts with the 5-field Product interface
    status: pending
  - id: data
    content: Create src/app/products/data/products.data.ts exporting an empty Product[] array
    status: pending
  - id: readmes
    content: Add README.md in data/, interfaces/, and enums/ explaining each directory's purpose
    status: pending
  - id: verify-build
    content: Run npm run build to confirm the project still compiles
    status: pending
isProject: false
---

## Scope

Phase 2 = **types + empty data source only**. No sample data, no service/controller changes, no wiring elsewhere.

The three subfolders `data/`, `enums/`, `interfaces/` already exist under [backend/src/app/products/](backend/src/app/products) but are empty — I only need to add files inside them.

## Files to create

### 1. `backend/src/app/products/enums/stock-status.enum.ts`

TypeScript enum members cannot start with an underscore-only lowercase identifier without a value, so I use an idiomatic **string-valued enum**: UPPER_SNAKE_CASE keys with the exact snake_case values required by the spec.

```ts
export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}
```

The **values** (`'in_stock'`, `'low_stock'`, `'out_of_stock'`) are what will be serialized over HTTP — matching the spec exactly.

### 2. `backend/src/app/products/interfaces/product.interface.ts`

Interface with exactly the 5 required fields, in the order given by the spec. Field name `stock_status` is kept in snake_case as specified (not renamed to camelCase).

```ts
import { StockStatus } from '../enums/stock-status.enum';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_status: StockStatus;
}
```

### 3. `backend/src/app/products/data/products.data.ts`

Empty in-memory source, strongly typed.

```ts
import { Product } from '../interfaces/product.interface';

export const products: Product[] = [];
```

Named export (`products`) rather than default — consistent with NestJS style and easier to refactor. `const` with typed empty array so any future push is type-checked.

### 4. Three READMEs

- `backend/src/app/products/enums/README.md` — purpose: hold **string-valued enums** for the Products domain; responsibility: define bounded sets of allowed values (e.g. `StockStatus`) used by DTOs, service, and payloads; belongs here: any enum specific to Products.
- `backend/src/app/products/interfaces/README.md` — purpose: hold **TypeScript interfaces** describing the shape of Products domain entities; responsibility: define the contract used by the service, the in-memory store, and future DTOs; belongs here: `Product` and any related interfaces (e.g. `ProductFilter` later).
- `backend/src/app/products/data/README.md` — purpose: host the **in-memory data source** for products (project rule: no DB, no ORM); responsibility: expose a typed `Product[]` acting as the single source of truth for the service; belongs here: seed/mock arrays only — no logic, no query helpers.

## Non-changes

- `products.module.ts`, `products.controller.ts`, `products.service.ts` — untouched. The service will start consuming `products.data.ts` in a later phase.
- Root `app.module.ts` and `main.ts` — untouched.

## Verification

`npm run build` should still succeed (no new runtime code paths, only types + one empty array).

## Deliverable summary (returned after execution)

- The `Product` interface: 5 fields (`id`, `name`, `category`, `price`, `stock_status`), no extras.
- The `StockStatus` enum: string values `in_stock`, `low_stock`, `out_of_stock`.
- The `products` in-memory source: empty typed array, ready to be populated in a later phase without touching the service.