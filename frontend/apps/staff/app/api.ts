import { createApiClient } from "@cct/api-client";
import { QueryClient } from "@tanstack/react-query";

/**
 * One shared `ApiClient` and one shared react-query `QueryClient` for the
 * whole Staff app (issue #22). Every route imports `apiClient` to make typed
 * `client.GET/PUT(...)` calls (per DR-0013, there is no per-operation
 * generated method) and every mutation invalidates through `queryClient`.
 */
const baseUrl = new URL(
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000"
);

export const apiClient = createApiClient({ baseUrl });

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});
