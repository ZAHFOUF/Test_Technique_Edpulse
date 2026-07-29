---
name: Phase 9 E2E tests
overview: Add a comprehensive Products E2E test suite (test/products.e2e-spec.ts) that boots the full app with the real ValidationPipe + HttpExceptionFilter + CacheService, exercises every route behavior (retrieval, pagination, filtering, combined filters, validation errors, cache), and documents the strategy in test/README.md. Also delete the stale test/app.e2e-spec.ts which targets the removed "Hello World" route.
todos:
  - id: delete-stale
    content: Delete test/app.e2e-spec.ts (targets removed Hello World endpoint)
    status: completed
  - id: e2e-spec
    content: Create test/products.e2e-spec.ts with retrieval, pagination, filtering, combined, validation, and cache tests
    status: in_progress
  - id: e2e-readme
    content: Create test/README.md documenting how to run, coverage, libraries, and strategy
    status: pending
  - id: verify-tests
    content: Run npm run test:e2e and confirm all tests pass
    status: pending
  - id: verify-build
    content: Run npm run build to confirm the project still compiles
    status: pending
isProject: false
---

## Scope

### Create

- [backend/test/products.e2e-spec.ts](backend/test/products.e2e-spec.ts) — the full E2E suite.
- [backend/test/README.md](backend/test/README.md) — how to run, coverage, strategy.

### Delete

- [backend/test/app.e2e-spec.ts](backend/test/app.e2e-spec.ts) — targets `GET /` returning `"Hello World!"`; that endpoint was removed in Phase 1, so this file currently fails. Deleting it is the cleanest option and matches the spec's "Update any necessary testing configuration if required".

### Untouched

- [backend/test/jest-e2e.json](backend/test/jest-e2e.json) — already matches `*.e2e-spec.ts` and uses `ts-jest`. No change needed.
- `src/` — no source change. E2E tests must exercise the real app.

## Data fixtures the tests will rely on

Read once from [backend/src/app/products/data/products.data.ts](backend/src/app/products/data/products.data.ts). Stable counts I'll assert against:

- Total: 20 products
- By category: `Electronics` 5, `Clothing` 5, `Home & Garden` 5, `Sports` 4, `Books` 1
- By `stock_status`: `in_stock` 12, `low_stock` 4, `out_of_stock` 4
- Case-insensitive name matches (used by tests):
  - `"phone"` → 1 (`"Sony WH-1000XM5 Wireless Headphones"`)
  - `"pro"` → 1 (`"Wilson Pro Staff Tennis Racket"`)
  - `"apple"` → 1 (`"Apple MacBook Air 13\" M3\"`)
  - `"iphone"` → 0 (spec example uses `iphone` — I'll assert `total: 0` for it since the seed has no iPhone; still valid as a "0-hits" scenario)

## Test boot strategy

```ts
beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();
  httpServer = app.getHttpServer();
});

afterAll(async () => {
  await app.close();
});
```

Key decisions:

- **Re-wire `ValidationPipe` + `HttpExceptionFilter` in the test setup** — `Test.createTestingModule` only builds the `AppModule` graph; it does not run `main.ts`. Without this, validation would not trigger and error responses would not match production. Using the same options as `main.ts` guarantees the tests exercise the exact runtime behavior.
- **`beforeAll` / `afterAll`, not `beforeEach`** — booting NestJS per-test costs ~1-2 s each and would slow the suite by ~30x. Tests remain independent because each one uses distinct URLs / assertions and does not mutate state. The only shared state is the cache, which is handled below.
- **`app.close()` in `afterAll`** — triggers `onModuleDestroy` on `CacheService`, which clears the `setInterval`. Without it, Jest can hang for the interval duration.

## Independence + cache strategy

Cache TTL is 5 min, longer than the whole suite. So an earlier test that hits `?page=1` populates a cache entry that a later test would find. Approach:

- Tests **assert on shape and content**, not "cache miss vs hit" — both must succeed identically because the cache is invisible to the client. This matches the spec: "Cache integration should not affect the response format".
- The **explicit cache-verification test** uses a **unique** query (`?category=Books` with a specific pattern) that no other test touches, then runs it twice and checks the second body equals the first. Any pipeline that returns identical objects for identical inputs passes — the cache is the mechanism, not the contract being tested.

## Test file structure

```ts
describe('Products (e2e)', () => {
  // beforeAll / afterAll as above

  describe('GET /products - retrieval', () => {
    it('returns 200 with paginated envelope', ...);
    it('has data, total, page, limit, totalPages fields', ...);
    it('each item has id, name, category, price, stock_status', ...);
    it('total equals 20 with no filters', ...);
  });

  describe('pagination', () => {
    it('defaults to page=1 limit=10', ...);
    it('?page=1 -> first 10 items', ...);
    it('?limit=5 -> 5 items on page 1', ...);
    it('?page=2&limit=5 -> next 5 items', ...);
    it('out-of-range page returns empty data with correct total', ...);
  });

  describe('category filtering', () => {
    it('?category=Electronics -> only Electronics', ...);
    it('?category=Books -> 1 result', ...);
    it('?category=DoesNotExist -> empty data, total 0, totalPages 0', ...);
  });

  describe('stock_status filtering', () => {
    it('?stock_status=in_stock -> only in-stock items', ...);
    it('?stock_status=low_stock -> 4 items', ...);
    it('?stock_status=out_of_stock -> 4 items', ...);
  });

  describe('name filtering (partial, case-insensitive)', () => {
    it('?name=phone -> matches Headphones (lowercase input)', ...);
    it('?name=PHONE -> same result (case-insensitive)', ...);
    it('?name=Pro -> matches Wilson Pro Staff', ...);
    it('?name=iphone -> 0 results (empty data, total 0)', ...);
  });

  describe('combined filters', () => {
    it('?page=1&limit=5&category=Electronics&stock_status=in_stock&name=phone -> Sony headphones only', ...);
    it('?category=Sports&stock_status=low_stock -> Peloton Bike+ only', ...);
  });

  describe('validation errors (400)', () => {
    it('?page=-1 -> 400 with error envelope', ...);
    it('?page=0 -> 400', ...);
    it('?page=abc -> 400', ...);
    it('?limit=0 -> 400', ...);
    it('?stock_status=invalid -> 400 mentioning enum values', ...);
    it('?name=<151+ chars> -> 400 (name MaxLength is 150)', ...);
    it('?foo=1 -> 400 (forbidNonWhitelisted)', ...);
    it('error body has statusCode, timestamp, path, message', ...);
  });

  describe('cache verification', () => {
    it('two identical requests return the same body shape and content', ...);
    it('cached response is indistinguishable from a fresh response', ...);
  });
});
```

Notes:

- I assert `expect(body.data.every((p) => p.category === 'Electronics')).toBe(true)` rather than `toEqual(exactArray)` — the former is stable against reordering/adding items to the seed; the latter would be brittle.
- I use `.expect(200)` / `.expect(400)` for status, then `expect(body).toMatchObject({...})` or targeted field assertions for the payload.
- For the name-too-long test, I generate a 151-char string in the test (`'a'.repeat(151)`); spec text says "longer than 100" but the actual DTO enforces `@MaxLength(150)`, so 151+ is the correct threshold — I'll add a code comment explaining this.
- The error-envelope assertion validates the exact shape from Phase 7: `statusCode`, `timestamp` (ISO string), `path` (with query string), `message` (string or array).

## `test/README.md` outline

- **How to run** — `npm run test:e2e` (already defined in [backend/package.json](backend/package.json) line 20). No extra setup: the API has no DB, no external service.
- **Test coverage** — bulleted list of scenario families (retrieval, pagination, category / stock_status / name filters, combined, validation, cache).
- **Libraries used**:
  - `@nestjs/testing` (`Test.createTestingModule`) to spin up the real Nest module graph.
  - `supertest` for HTTP client assertions against `app.getHttpServer()`.
  - `jest` as the runner (config in `test/jest-e2e.json`).
  - `ts-jest` for TypeScript compilation.
- **Testing strategy** — real app boot (one `beforeAll`), same `ValidationPipe` + `HttpExceptionFilter` wiring as production, no mocking of `CacheService` (per spec), assertions on structure + content (stable), cache-verification via repeated identical requests, tests kept independent by using disjoint URLs.

## Verification

- `npm run test:e2e` — every test passes.
- `npm run build` — still compiles (no source changes, but confirms the deletion of `app.e2e-spec.ts` did not break anything else).

## Deliverable summary (returned after execution)

- **Scenarios covered** — retrieval + envelope shape, pagination (defaults, page/limit, out-of-range), category filtering (positive + empty), stock_status filtering (three enum values), name filtering (case-insensitive partial + zero-hit), combined filters, six validation-error cases including `forbidNonWhitelisted`, error-envelope shape, cache verification via repeated identical requests.
- **Application initialization** — one `beforeAll` boots `AppModule` via `Test.createTestingModule`, re-applies the production `ValidationPipe({ transform, whitelist, forbidNonWhitelisted })` and `HttpExceptionFilter` (since `main.ts` is not executed by the test harness), calls `app.init()`. `afterAll` closes the app, triggering `CacheService.onModuleDestroy` so the cleanup interval stops and Jest exits cleanly.
- **End-to-end validation** — every request goes through the real Express server via `supertest` (`app.getHttpServer()`), so the DTO transform/validation runs, the controller thin-delegates to the service, the service filters + paginates + caches, and the filter shapes error responses. No mocks: `CacheService` is the real one, the in-memory data source is the real one, so passing tests prove the wired pipeline works from HTTP to business logic to response body.