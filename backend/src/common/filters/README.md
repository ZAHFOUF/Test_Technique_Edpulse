# Filters

## Purpose of the global ValidationPipe

The global `ValidationPipe` (wired in `main.ts`) sits **before every
controller handler** and automatically validates and transforms
incoming payloads against the DTO classes declared on route parameters.

Configuration used here:

- **`transform: true`** — instantiates the DTO class and applies
  `class-transformer` decorators. HTTP query strings arrive as `string`;
  `@Type(() => Number)` on `ProductQueryDto.page` / `limit` coerces them
  to real numbers before validation and before they reach the service.
- **`whitelist: true`** — strips any property that is not explicitly
  declared on the DTO. Prevents accidental leakage of unknown fields to
  the domain layer.
- **`forbidNonWhitelisted: true`** — upgrades the previous rule to a
  hard rejection: sending `?foo=1` on `GET /products` yields a
  `400 Bad Request` instead of being silently ignored. Makes the API
  contract explicit and helps catch typos on the client side.

When validation fails, the pipe throws a `BadRequestException` with a
`message: string[]` payload — one entry per violation. That exception is
then caught by the filter below and shaped into the standard envelope.

## Responsibility of the HttpExceptionFilter

`HttpExceptionFilter` is the **single, centralized place** that shapes
every error response leaving the API. Whatever is thrown — anywhere in
the pipeline, from validation to service code — is turned into the same
JSON body:

```json
{
  "statusCode": 400,
  "timestamp": "2026-07-29T04:24:00.000Z",
  "path": "/products?page=abc",
  "message": ["page must not be less than 1", "page must be an integer number"]
}
```

Two branches:

- **Known `HttpException`** (validation errors, 404s, custom domain
  exceptions, etc.) — uses the exception's own status and message.
  When the payload carries a `message` field (e.g. class-validator
  errors), it is preserved as-is, including arrays.
- **Any other thrown value** — mapped to `500 Internal Server Error`
  with the generic message `"Internal server error"`. The full stack
  trace is written to the server logs via NestJS' `Logger`, but is
  **never leaked to the client**, per the project rules.

`@Catch()` with no arguments covers both cases.

## Why exception handling is centralized

- **One response contract for clients** — every error, no matter its
  origin, has the same shape. Frontend code can rely on it.
- **No duplication** — controllers and services never write their own
  `try/catch` boilerplate. The controller in this project is a
  one-line delegator; the filter takes care of everything else.
- **Clean audit surface** — a single place to add logging, metrics, or
  correlation IDs to error responses without touching business code.
- **Safety by default** — turning any unexpected `throw` into a
  well-formed 500 means a bug in the service can never accidentally
  leak internals over the wire.

## Files

- `http-exception.filter.ts` — the global filter described above.
