---
name: Phase 6 products controller
overview: "Wire GET /products in ProductsController: accept ProductQueryDto via @Query(), delegate directly to ProductsService.findAll, return its result. Update the module README. No ValidationPipe wiring in this phase (user choice — will be handled later)."
todos:
  - id: controller
    content: Implement GET /products in src/app/products/products.controller.ts, binding ProductQueryDto and delegating to ProductsService.findAll
    status: in_progress
  - id: readme
    content: Update src/app/products/README.md with controller responsibility, thin-controller rationale, and controller/service collaboration
    status: pending
  - id: verify-build
    content: Run npm run build to confirm the project still compiles
    status: pending
isProject: false
---

## Scope

Strict: only [backend/src/app/products/products.controller.ts](backend/src/app/products/products.controller.ts) and [backend/src/app/products/README.md](backend/src/app/products/README.md) are modified.

Explicitly out of scope:

- `main.ts` — no global `ValidationPipe` (user chose to defer). The DTO will not yet coerce `page`/`limit` from string to number or reject unknown enum values at runtime; the controller still uses the DTO for typing and structure, ready to become active once the pipe is enabled.
- No caching, no `try/catch`, no exception filter, no logic beyond delegation.

## Changes

### 1. [backend/src/app/products/products.controller.ts](backend/src/app/products/products.controller.ts)

Replace the current empty body:

```1:8:backend/src/app/products/products.controller.ts
import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
}
```

with:

```ts
import { Controller, Get, Query } from '@nestjs/common';
import { ProductQueryDto } from './dto/product-query.dto';
import { PaginatedProducts } from './interfaces/paginated-products.interface';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ProductQueryDto): PaginatedProducts {
    return this.productsService.findAll(query);
  }
}
```

Key decisions:

- **Single expression body** — one line delegating to the service. No transformation, no orchestration, no error handling. This is exactly what "thin controller" means in NestJS.
- **`@Query() query: ProductQueryDto`** — binds the whole query object to the DTO. Once a global `ValidationPipe({ transform: true })` is enabled in a later step, the DTO's `@Type`/`@IsInt`/`@IsEnum` decorators will run automatically; no controller change will be needed.
- **Return type annotated `PaginatedProducts`** — makes the HTTP contract explicit and lets the compiler catch any drift between service signature and controller.
- **No `try/catch`** — NestJS' built-in exception layer already turns thrown errors into proper HTTP responses. Wrapping would only hide stack traces (project rule: "Do not expose internal implementation details" is orthogonal — it's handled by the future global filter).
- **Constructor DI** already in place from Phase 1 (`private readonly productsService`) — reused as-is; no field addition or manual instantiation.

Route table after this phase:

- `GET /products` -> `ProductsController#findAll` -> `ProductsService#findAll` -> `PaginatedProducts`.

### 2. [backend/src/app/products/README.md](backend/src/app/products/README.md)

Small targeted update:

- In "Current files": change the `products.controller.ts` line from "No routes wired yet" to "Exposes `GET /products`, delegates to `ProductsService.findAll`".
- Add a new section **Controller responsibility** covering:
  - **Role** — HTTP surface only: route declaration, binding of the request payload to a DTO, delegation to the service, and returning the result untouched.
  - **Why thin controllers** — separation of concerns (transport vs domain), testability (service is easy to test in isolation, controller has almost nothing to test), reusability (same service can back another transport like a CLI or a GraphQL resolver), and adherence to SRP.
  - **Collaboration with the service** — the controller does not know how filtering, pagination, or default values work. It hands `ProductQueryDto` to `productsService.findAll(query)` and forwards the returned `PaginatedProducts` envelope. Any change to filtering or pagination policy will happen inside the service without touching the controller.
- Refresh "Files added in future phases": remove "GET /products route" (now delivered), keep global `ValidationPipe` in `main.ts`, cache integration, exception filter, and unit tests.

## Non-changes

- [backend/src/main.ts](backend/src/main.ts) — untouched (per user's explicit decision to defer `ValidationPipe`).
- [backend/src/app/products/products.service.ts](backend/src/app/products/products.service.ts) — untouched (already complete from Phase 5).
- [backend/src/app/products/dto/product-query.dto.ts](backend/src/app/products/dto/product-query.dto.ts), enums, interfaces, data — untouched.

## Verification

- `npm run build` compiles cleanly.
- The route is visible in NestJS' startup logs (`Mapped {/products, GET}`) when running `npm run start`.
- Manual smoke check: `GET /products` returns the paginated envelope from the service (first 10 products, `total`, `page: 1`, `limit: 10`, `totalPages`).

## Deliverable summary (returned after execution)

- **Endpoint implemented**: `GET /products` on [backend/src/app/products/products.controller.ts](backend/src/app/products/products.controller.ts).
- **DTO usage**: `@Query() query: ProductQueryDto` binds the whole query string into the DTO instance; the four optional fields (`page`, `limit`, `category`, `stock_status`) flow through as-is to the service. Runtime validation/coercion will activate the moment a global `ValidationPipe` is enabled (deferred).
- **Delegation**: the handler body is a single `return this.productsService.findAll(query);`. Zero business logic in the controller — filtering, pagination, defaults, and the response envelope are all decided by the service. This keeps the controller thin, testable, and reusable behind any future transport.