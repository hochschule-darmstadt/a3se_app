import { QueryClient } from "@tanstack/react-query";

import { createApiClient } from "@cct/api-client";

/**
 * One shared `ApiClient` instance for the whole customer app (issue #22).
 * Base URL is configurable via `VITE_API_BASE_URL` (Vite env, build-time
 * substituted) so the app can point at a different backend without a code
 * change; defaults to the backend's documented localhost port (8000).
 */
export const apiClient = createApiClient({
  baseUrl: new URL(import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000"),
});

/**
 * One shared `QueryClient` instance, per DR-0015's `@tanstack/react-query`
 * decision. Defaults are used largely as-is for this thin slice (DR-0015's
 * own recorded limitation): no bespoke stale-time/retry tuning here.
 */
export const queryClient = new QueryClient();
