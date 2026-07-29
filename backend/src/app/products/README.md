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
- `products.controller.ts` — HTTP layer, injects `ProductsService`. No routes wired yet (added in a later phase).
- `products.service.ts` — business logic: filtering and pagination against the in-memory data source.
- `data/products.data.ts` — the in-memory `Product[]` acting as data source.
- `dto/product-query.dto.ts` — `ProductQueryDto`, validates the `GET /products` query parameters.
- `enums/stock-status.enum.ts` — `StockStatus` (`in_stock` / `low_stock` / `out_of_stock`).
- `interfaces/product.interface.ts` — the `Product` domain shape.
- `interfaces/paginated-products.interface.ts` — the paginated response envelope
  returned by the service.

## Business logic (ProductsService)

The service exposes a single public method:

```ts
findAll(query: ProductQueryDto): PaginatedProducts;
```

It performs three steps, in order:

1. **Filter** the in-memory `products` array:
   - by `category` (exact string match) when `query.category` is provided;
   - by `stock_status` (exact enum match) when `query.stock_status` is provided;
   - missing criteria are skipped, so no filter is applied for absent parameters.
2. **Paginate** the filtered list with `page` and `limit`, applying defaults
   `page = 1` and `limit = 10` when the DTO fields are absent.
   Offset is computed as `(page - 1) * limit` and the slice is
   `filtered.slice(offset, offset + limit)`.
3. **Return** a `PaginatedProducts` envelope: `{ data, total, page, limit, totalPages }`.
   `totalPages` is `Math.ceil(total / limit)`, or `0` when `total === 0`.

The source `products` array is never mutated: `filter` and `slice` both
return new arrays, and the `applyFilters` helper accepts the source as
`readonly Product[]`.

## Why filtering and pagination belong in the service layer

These are **business decisions**, not transport concerns:

- What "matches" a filter (exact match vs case-insensitive vs partial) is
  domain policy.
- What the default page size is, and the shape returned to callers, is
  also domain policy.
- Keeping them in the service means the behavior is reusable if another
  transport is added later (a second controller, a GraphQL resolver, a CLI,
  a scheduled job), and it keeps the controller thin per NestJS best
  practices: parse query, delegate to service, return the result.

## Files added in future phases

- Global `ValidationPipe` wiring in `main.ts` and the `GET /products`
  route in the controller to expose the service via HTTP.
- Cache integration (via `src/cache/`) so identical requests reuse a
  previous response.
- Global exception filter (via `src/common/filters/`) for consistent
  error responses.
- Unit tests for the service.

## Why this separation improves maintainability

Grouping every piece of a feature (controller, service, DTOs, interfaces,
data, enums) inside a single folder gives the module clear boundaries:
any change to the products domain stays local, imports stay short, and
adding a new feature (e.g. `orders/`) follows the exact same pattern
without touching this one. This is the standard NestJS feature-module
pattern and it scales cleanly as the API grows.
