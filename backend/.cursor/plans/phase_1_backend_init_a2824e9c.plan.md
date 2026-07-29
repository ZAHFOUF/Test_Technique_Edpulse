---
name: Phase 1 backend init
overview: Bootstrap the NestJS backend architecture by introducing the target folder layout (app/products, cache, common/filters), a minimal ProductsModule/Controller/Service, and per-directory READMEs — while removing the default Nest scaffolding that is not part of the target structure.
todos:
  - id: cleanup
    content: "Delete default scaffolding: src/app.controller.ts, src/app.service.ts, src/app.controller.spec.ts"
    status: pending
  - id: products-module
    content: Create src/app/products/ with products.module.ts, products.controller.ts, products.service.ts (minimal, bootable)
    status: pending
  - id: products-readme
    content: Add src/app/products/README.md documenting the feature module
    status: pending
  - id: cache-readme
    content: Create src/cache/ with README.md describing the future in-memory cache layer
    status: pending
  - id: common-readme
    content: Create src/common/ with filters/ subfolder and README.md describing shared cross-cutting code
    status: pending
  - id: root-module
    content: Rewrite src/app.module.ts to import only ProductsModule
    status: pending
  - id: verify-build
    content: Run npm run build to confirm the project compiles
    status: pending
isProject: false
---

## Scope

Phase 1 = architecture + minimal bootable Products feature only. No DTOs, no filters, no cache logic, no data — those come in later phases and are only *documented* in READMEs.

## Target structure after this phase

```
backend/src/
├── app/
│   └── products/
│       ├── products.module.ts
│       ├── products.controller.ts
│       ├── products.service.ts
│       └── README.md
├── cache/
│   └── README.md
├── common/
│   ├── filters/            (empty directory, kept via README)
│   └── README.md
├── app.module.ts
└── main.ts
```

## Changes

### 1. Remove default scaffolding (confirmed)
- Delete [backend/src/app.controller.ts](backend/src/app.controller.ts)
- Delete [backend/src/app.service.ts](backend/src/app.service.ts)
- Delete [backend/src/app.controller.spec.ts](backend/src/app.controller.spec.ts)

Reason: not part of the target layout and would leave a dead `GET /` "Hello World" route.

### 2. Create the Products feature module — `backend/src/app/products/`

- `products.service.ts` — `@Injectable()` class `ProductsService` with an empty body (placeholder for Phase 2 in-memory logic). No methods yet; keeps the module bootable.
- `products.controller.ts` — `@Controller('products')` class `ProductsController` with constructor DI on `ProductsService`. No routes yet (added in Phase 2).
- `products.module.ts` — `@Module({ controllers: [ProductsController], providers: [ProductsService] })` exporting `ProductsModule`.
- `README.md` — explains: feature module for Products; owns controller/service/DTOs/entities; upcoming files (dto/, entities/, products.repository.ts, mock data); why colocating a feature improves maintainability.

### 3. Create `backend/src/cache/`

- `README.md` only — explains: houses the in-memory cache abstraction (cache service, interceptor, key builder); why isolating cross-cutting concerns from features keeps them reusable and swappable.

### 4. Create `backend/src/common/`

- `filters/` — empty directory reserved for `HttpExceptionFilter` (Phase to come). Kept in git via the README one level up (or via a placeholder if needed — see note).
- `README.md` — explains: shared cross-cutting building blocks (filters, interceptors, pipes, decorators); why grouping reusable pieces under `common/` avoids duplication and clarifies boundaries.

Note: Windows/Git does not track empty directories. Since PROJECT_RULES forbids creating unrequested files, I will leave `filters/` empty — the parent `common/README.md` will document it. If you prefer, I can add a `.gitkeep`.

### 5. Update `backend/src/app.module.ts`

Replace the current content:

```1:10:backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

with a root module that imports only `ProductsModule` — no controllers, no providers.

### 6. `backend/src/main.ts`

Keep as-is (already bootstraps `AppModule` on `PORT ?? 3000`). No changes needed for Phase 1.

## Verification

- `npm run build` compiles successfully (no unused imports left behind after deletions).
- `npm run start` boots without errors; `ProductsModule` is registered even though no routes are exposed yet.

## Deliverable summary (included in final response after execution)

Short recap covering:
- The generated tree and role of each folder (`app/` = feature modules, `cache/` = in-memory cache concern, `common/` = shared cross-cutting code).
- Why this separation scales: features stay self-contained, shared code is reusable, and each future phase (DTOs, cache, exception filter) has an obvious home without touching unrelated files.