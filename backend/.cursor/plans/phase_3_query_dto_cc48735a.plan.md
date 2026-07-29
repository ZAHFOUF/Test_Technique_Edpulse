---
name: Phase 4 query DTO
overview: Add the ProductQueryDto that validates and transforms the query parameters of GET /products (page, limit, category, stock_status), plus the dto/ README. Install class-validator/class-transformer (mandated by PROJECT_RULES) since they are not yet in package.json.
todos:
  - id: install-deps
    content: Install class-validator and class-transformer via npm
    status: completed
  - id: dto
    content: Create src/app/products/dto/product-query.dto.ts with optional page, limit, category, stock_status fields and their validators
    status: completed
  - id: readme
    content: Add src/app/products/dto/README.md explaining DTOs and query validation
    status: completed
  - id: verify-build
    content: Run npm run build to confirm the project still compiles
    status: completed
isProject: false
---

## Scope

Phase 3 = **DTO only**. No controller wiring, no service change, no `main.ts` ValidationPipe (that will be wired in a later phase together with the controller route). All four fields are optional.

## Pre-step: install validation libraries

Currently missing from [backend/package.json](backend/package.json) — checked lines 22-28, only `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs` are present.

Project rules mandate them:

```91:95:backend/.cursor/PROJECT_RULES.md
Use:

- class-validator
- class-transformer
```

Install (production deps):

```
npm install class-validator class-transformer
```

Nothing else added — respects "Do not add unnecessary dependencies".

## Files to create

### 1. `backend/src/app/products/dto/product-query.dto.ts`

```ts
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { StockStatus } from '../enums/stock-status.enum';

export class ProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(StockStatus)
  stock_status?: StockStatus;
}
```

Key decisions:

- **All fields optional** via `@IsOptional()` — matches the spec.
- `**page` / `limit` typed as `number**` — HTTP query strings are always strings, so `@Type(() => Number)` from `class-transformer` coerces them before validation, then `@IsInt()` + `@Min(1)` enforce "positive integer" (integer >= 1). Using `@Min(1)` rather than `@IsPositive()` because `@IsPositive()` allows non-integer positives; the spec says "positive integer".
- **No default values** in the DTO — defaults (e.g. `page=1`, `limit=10`) belong to the service, not the transport layer. Keeps the DTO strictly about validation.
- `**stock_status` uses `@IsEnum(StockStatus)**` — accepts only `'in_stock' | 'low_stock' | 'out_of_stock'` (the enum's string values), single source of truth with the enum from Phase 2. Field name stays snake_case to match the query parameter name exactly (no `@Expose`/aliasing needed).
- **No `@Transform` toLowerCase or trim** on `category` — the spec only requires "must be a string"; over-normalizing is out of scope.

### 2. `backend/src/app/products/dto/README.md`

Explains:

- **Purpose of DTOs** — decouple external HTTP payload shape from internal domain shape; declarative validation and type coercion at the transport boundary.
- **Why query validation matters** — HTTP query strings are always strings and always untrusted; validating early gives consistent 400 responses via NestJS, prevents malformed values from ever reaching the service, and documents the contract in one place.
- **Directory responsibility** — hosts request DTOs specific to the Products feature (currently `ProductQueryDto`; future candidates: `CreateProductDto`, `UpdateProductDto` if the API grows).
- **Note** — DTOs must not carry business logic; they only describe and validate the payload.

## Non-changes (Phase 4 scope)

- [backend/src/app/products/products.controller.ts](backend/src/app/products/products.controller.ts) — untouched (no route yet).
- [backend/src/app/products/products.service.ts](backend/src/app/products/products.service.ts) — untouched.
- [backend/src/main.ts](backend/src/main.ts) — untouched. Global `ValidationPipe` will be enabled in the phase that adds the actual `GET /products` route, since it only takes effect at request-handling time.

## Verification

- `npm install` succeeds and adds the two packages.
- `npm run build` compiles cleanly with the new DTO (decorators use `emitDecoratorMetadata`, already enabled via NestJS' default `tsconfig.json`).

## Deliverable summary (returned after execution)

- **DTO generated**: `ProductQueryDto` at [backend/src/app/products/dto/product-query.dto.ts](backend/src/app/products/dto/product-query.dto.ts).
- **Validated query parameters**:
  - `page` — optional, coerced to int >= 1.
  - `limit` — optional, coerced to int >= 1.
  - `category` — optional string.
  - `stock_status` — optional, must be one of the `StockStatus` enum values.
- **Future usage** — a later phase will (a) bind it to the controller via `@Get() findAll(@Query() query: ProductQueryDto)` and (b) enable a global `ValidationPipe({ transform: true, whitelist: true })` in `main.ts` so the transforms and validations run automatically before the handler executes.

