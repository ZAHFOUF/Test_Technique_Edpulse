# Tests

End-to-end (E2E) test suite for the Products API.

## Required development dependencies

All E2E dependencies are listed under `devDependencies` in
[package.json](../package.json):

| Package | Role |
| --- | --- |
| `@nestjs/testing` | Boots the real `AppModule` graph in-process via `Test.createTestingModule`. |
| `supertest` | HTTP client for assertions against `app.getHttpServer()`. |
| `@types/supertest` | TypeScript types for Supertest. |
| `jest` | Test runner. |
| `@types/jest` | TypeScript types for Jest matchers. |
| `ts-jest` | Compiles TypeScript spec files on the fly. |

No additional install step is needed after `npm install`.

## How to run

```bash
npm run test:e2e
```

No external setup is required — the API has no database, no cache
server, no filesystem dependency. The suite boots the real
`AppModule` in-process, mounts the same `ValidationPipe` and
`HttpExceptionFilter` as `main.ts`, and hits the actual Express server
via Supertest.

## Configuration

| File | Purpose |
| --- | --- |
| [test/jest-e2e.json](jest-e2e.json) | Jest config for E2E: `rootDir: "."`, matches `*.e2e-spec.ts`, uses `ts-jest` + `node` environment. |
| [test/products.e2e-spec.ts](products.e2e-spec.ts) | Full Products API E2E suite (31 tests). |
| `package.json` → `"test:e2e"` | Runs `jest --config ./test/jest-e2e.json`. |

The default unit-test Jest block in `package.json` (`rootDir: "src"`, `*.spec.ts`) is separate and unaffected.

## Test coverage

The suite lives in `products.e2e-spec.ts` and covers:

- **Retrieval** — `GET /products` returns 200, the paginated envelope
  is present, each product has the expected shape (`id`, `name`,
  `category`, `price`, `stock_status`), and the seed contains 20 items.
- **Pagination** — defaults (`page=1`, `limit=10`), explicit `page` and
  `limit`, correct slicing on page 2, and out-of-range pages returning
  empty data with accurate metadata.
- **Category filtering** — positive match (Electronics, Books),
  zero-hit case for an unknown category.
- **Stock status filtering** — every enum value (`in_stock`,
  `low_stock`, `out_of_stock`).
- **Name filtering** — partial, case-insensitive matching (`phone`,
  `PHONE`, `Pro`), plus the zero-hit case (`iphone`).
- **Combined filters** — the full 5-parameter combination from the
  spec, and a two-filter narrowing (`category` + `stock_status`).
- **Validation errors (400)** — `page=-1`, `page=0`, `page=abc`,
  `limit=0`, `stock_status=invalid`, oversized `name` (> 150 chars),
  unknown query parameter (`forbidNonWhitelisted`), plus a check that
  the error body matches the `{ statusCode, timestamp, path, message }`
  envelope from `HttpExceptionFilter`.
- **Cache verification** — two identical requests return the exact
  same body and envelope shape, confirming caching is transparent to
  the client (per the spec, the response format never changes).

## Libraries used

- **`@nestjs/testing`** — `Test.createTestingModule({ imports: [AppModule] })`
  spins up the real dependency graph without running `main.ts`.
- **`supertest`** — HTTP client that wraps `app.getHttpServer()` and
  provides expressive assertions (`.expect(200)`, `.query({...})`,
  chainable JSON body checks).
- **`jest`** — test runner. E2E config lives in
  [test/jest-e2e.json](jest-e2e.json).
- **`ts-jest`** — on-the-fly TypeScript compilation for the spec file.

## Testing strategy

- **Real app, no mocks** — `CacheService` is the real one, the
  in-memory data source is the real one, `ValidationPipe` and
  `HttpExceptionFilter` are re-applied with the exact production
  configuration. A passing test therefore proves the wired pipeline
  works end to end: from Express request parsing, through DTO
  transformation and validation, to the controller, service, cache,
  and error filter.
- **One `beforeAll` / one `afterAll`** — booting NestJS per test would
  cost seconds per case; a single boot keeps the suite fast (~2–3 s
  total). `afterAll` calls `app.close()` so `CacheService.onModuleDestroy`
  clears its `setInterval` and Jest exits cleanly.
- **Independence via disjoint queries** — the cache has a 5-minute TTL,
  longer than the suite. Tests never rely on "cache miss vs hit"
  observability at the HTTP layer (there is none by design); the
  explicit cache-verification tests instead run the same request twice
  and compare bodies, which is the client-visible contract.
- **Structural assertions over exact snapshots** — for arrays of
  products, tests use `data.every((p) => p.category === 'Electronics')`
  or field counts (`total`, `totalPages`) rather than pinning entire
  arrays. This keeps the suite stable if the seed grows or gets
  reordered.
- **Note on the "> 100 chars" validation** — the phase spec described
  the name limit as "longer than 100 characters"; the DTO enforces
  `@MaxLength(150)`. The test uses 151 characters to reliably trigger
  the 400 response.
