/** Public configuration shared by generated API client adapters. */
export interface ApiClientConfig {
  readonly baseUrl: URL;
}

export { createApiClient } from "./client.js";
export type { ApiClient } from "./client.js";
export type { components, operations, paths } from "./generated/schema.js";
export { toApiError, isRetryable } from "./errors.js";
export type { ApiError } from "./errors.js";
export { useApiQuery, useApiMutation } from "./hooks.js";
