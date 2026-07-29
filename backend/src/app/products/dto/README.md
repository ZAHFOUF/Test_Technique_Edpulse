# DTO

## Purpose of DTOs

A **Data Transfer Object** describes the shape of a payload that crosses
the boundary between the outside world (HTTP) and the application.

Its job is to:

- Decouple the external contract (query strings, request bodies) from the
  internal domain (`Product` interface, service arguments).
- Declaratively validate and coerce incoming data using
  `class-validator` and `class-transformer` decorators.
- Give NestJS a single object it can pipe through a `ValidationPipe`,
  producing consistent `400 Bad Request` responses on invalid input.

## Why query validation is important

HTTP query strings are:

- **Always strings** — even numeric parameters arrive as `"1"`, not `1`.
  Without transformation, `page + 1` would concatenate strings instead
  of doing arithmetic.
- **Always untrusted** — clients can send anything (negative numbers,
  huge integers, unknown enum values, missing required fields).
- **Loosely typed at runtime** — TypeScript alone offers no runtime
  guarantee; validation decorators are what actually enforce the rules
  once the code is compiled.

Validating at the transport boundary means the service can assume its
inputs are already clean and correctly typed. Malformed requests are
rejected early with a clear 400 response and never reach business logic.

## Responsibility of this directory

Hosts every **request DTO specific to the Products feature**.

Current file:

- `product-query.dto.ts` — `ProductQueryDto`, validating the query
  parameters of `GET /products` (`page`, `limit`, `category`,
  `stock_status`). Every field is optional.

Future candidates (if the API grows): `create-product.dto.ts`,
`update-product.dto.ts`, response DTOs, etc.

## Important note

DTOs must not contain business logic. They only **describe and validate**
the payload. Filtering, pagination, defaults, and any transformation
that depends on domain rules belong to the service.
