# API Client Source

- `generated/schema.ts`: `openapi-typescript` output (see its own README) -- identifiable by its "do not make direct changes" header, reproducible via `npm run api-client:generate`, never edited by hand.
- `client.ts`: the small hand-authored facade (`createApiClient`), wiring `ApiClientConfig` into `openapi-fetch`'s typed client over the generated `paths` type.
- `index.ts`: the package's public exports.
