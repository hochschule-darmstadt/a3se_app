/** Public configuration shared by generated API client adapters. */
export interface ApiClientConfig {
  readonly baseUrl: URL;
}

export { createApiClient } from "./client.js";
export type { ApiClient } from "./client.js";
export type { components, operations, paths } from "./generated/schema.js";
