# Cache

## Cache architecture

An **in-memory cache** exposed as a standard NestJS module + service:

- `CacheModule` — a plain feature module (not `@Global()`) that provides
  and exports `CacheService`. Any feature module opts in by adding
  `CacheModule` to its own `imports: []`.
- `CacheService` — an `@Injectable()` that owns a private
  `Map<string, CacheEntry<unknown>>`. It exposes a generic API
  (`get<T>`, `set<T>`, `delete`) and manages its own TTL lifecycle.
- `interfaces/cache-entry.interface.ts` — the `CacheEntry<T>` shape:
  `{ value: T; expiresAt: number }`, where `expiresAt` is a millisecond
  timestamp.

No external dependency, no `Redis`, no filesystem, no database — as
required by the project rules.

## Cache key generation

The **caller owns the key**. Keeping the cache domain-agnostic makes it
reusable by any future feature: the cache does not need to know that
"a product query" means anything special.

Convention used by `ProductsService` for its `findAll` cache:

```
products:findAll:{"page":1,"limit":10,"category":null,"stock_status":"in_stock"}
```

Rules applied when building this key:

- A **stable prefix** (`products:findAll`) namespaces the entries and
  prevents accidental collisions with other consumers.
- The four query fields are serialized in a **fixed order** so
  `?category=A&page=1` and `?page=1&category=A` produce the exact same
  key.
- **Defaults are folded into the key**: `page ?? 1`, `limit ?? 10`.
  `GET /products` and `GET /products?page=1&limit=10` share the same
  cache entry.
- **`undefined` is normalized to `null`** so an absent filter collapses
  to a single key rather than a distinct entry per omission pattern.
- `JSON.stringify` on that normalized object gives a deterministic
  string — trivial to compare, easy to log, no hashing needed.

## TTL

- Default: **5 minutes** (`CACHE_DEFAULT_TTL_MS = 5 * 60 * 1000`).
- Applied on every `set` as `expiresAt = Date.now() + defaultTtlMs`.
- Exposed as an exported constant so the policy lives in one place.

## Cleanup interval

- Default: **60 seconds** (`CACHE_CLEANUP_INTERVAL_MS = 60 * 1000`).
- Driven by `setInterval`, started on `onModuleInit`, cleared on
  `onModuleDestroy`. Prevents Jest and CI shutdowns from hanging on a
  live timer.
- The timer is `unref()`-ed so it never keeps the Node.js event loop
  alive on its own.
- Each tick scans the store and drops entries whose `expiresAt` is in
  the past. When at least one entry was removed, the service logs
  `Cleanup: removed N expired entrie(s)`.

## Cache lifecycle

The service emits structured log lines via NestJS `Logger` for every
lifecycle event:

| Event | When | Log level |
| --- | --- | --- |
| `SET`     | `set<T>(key, value)` stores a fresh entry.               | debug |
| `HIT`     | `get<T>(key)` finds a non-expired entry.                 | debug |
| `MISS`    | `get<T>(key)` is called with a key that does not exist.  | debug |
| `EXPIRED` | `get<T>(key)` finds an entry whose TTL has passed; the entry is removed inline. | debug |
| `Cleanup: removed N` | Periodic sweep removed one or more expired entries. | log |

Per-key events are at `debug` level so they do not spam production logs
by default; the cleanup summary is at `log` level because it is
low-frequency and useful for monitoring.

## Integration with `ProductsService`

Read-through caching:

1. `ProductsService.findAll(query)` builds the deterministic cache key
   from the four query fields.
2. It calls `cacheService.get<PaginatedProducts>(key)`.
3. **HIT** — the cached `PaginatedProducts` envelope is returned
   immediately. No filtering, no pagination, no recomputation.
4. **MISS / EXPIRED** — the service runs its existing filter + paginate
   pipeline (unchanged from Phase 5), builds the response, calls
   `cacheService.set(key, result)`, and returns.

`ProductsModule` declares its dependency on the cache with a plain
`imports: [CacheModule]`. The controller is untouched.

## Why this separation improves maintainability

Concentrating the cache under a single top-level folder means:

- **Feature-agnostic** — any future feature module can import
  `CacheModule` and use the same primitives.
- **Swappable** — replacing the in-memory `Map` with Redis, memcached,
  or an interceptor variant is a change local to this folder; callers
  keep their exact same code.
- **Independently testable** — the service has no external collaborator
  besides `Logger`, so unit tests can cover TTL and cleanup behavior in
  isolation.
- **Explicit boundaries** — no ad-hoc caching inside feature services.
