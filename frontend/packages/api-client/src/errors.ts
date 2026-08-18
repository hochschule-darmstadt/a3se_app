import type { components } from "./generated/schema.js";

type ErrorResponse = components["schemas"]["ErrorResponse"];

/**
 * Normalized failure shape both apps render through one shared
 * {@link ../../ui/src/index.tsx StatusBanner}, instead of each route
 * re-deriving HTTP status/body handling on its own.
 */
export type ApiError =
  | { kind: "validation"; title: string; detail: string }
  | { kind: "notFound"; title: string; detail: string }
  | { kind: "conflict"; title: string; detail: string }
  | { kind: "network"; title: string; detail: string }
  | { kind: "unknown"; title: string; detail: string };

/**
 * Maps an `openapi-fetch` failure (`{ error, response }`) to an {@link ApiError}.
 * `error` is `undefined` when the request never reached the server (offline,
 * DNS failure, CORS) -- that case is reported as `network`, everything else
 * is classified from the backend's own `ErrorResponse.type`/HTTP status
 * (`backend/src/cct/api/errors.py`), never from a guess.
 */
export function toApiError(error: ErrorResponse | undefined, response?: Response): ApiError {
  if (!error) {
    return { kind: "network", title: "Connection problem", detail: "The request could not reach the server." };
  }
  const status = response?.status;
  if (status === 404 || error.type === "not_found") {
    return { kind: "notFound", title: error.title, detail: error.detail };
  }
  if (status === 409 || error.type === "duplicate" || error.type === "conflict") {
    return { kind: "conflict", title: error.title, detail: error.detail };
  }
  if (status === 422 || error.type === "validation_failed" || error.type === "invalid_reference") {
    return { kind: "validation", title: error.title, detail: error.detail };
  }
  return { kind: "unknown", title: error.title ?? "Unexpected error", detail: error.detail ?? "An unexpected error occurred." };
}

/** Whether retrying the same request unmodified could plausibly succeed. */
export function isRetryable(error: ApiError): boolean {
  return error.kind === "network" || error.kind === "unknown";
}
