import createClient from "openapi-fetch";

import type { ApiClientConfig } from "./index.js";
import type { paths } from "./generated/schema.js";

/**
 * Typed API client, wiring {@link ApiClientConfig} into `openapi-fetch`'s
 * client factory. Every operation is available as a fully typed
 * `client.GET/POST/PUT/DELETE(path, options)` call inferred from the
 * generated `paths` type -- there is deliberately no per-operation generated
 * method surface (see DR-0013): consumers call the path directly, e.g.
 * `client.GET("/persons/{person_id}", { params: { path: { person_id } } })`.
 */
export function createApiClient(config: ApiClientConfig) {
  return createClient<paths>({ baseUrl: config.baseUrl.toString() });
}

export type ApiClient = ReturnType<typeof createApiClient>;
