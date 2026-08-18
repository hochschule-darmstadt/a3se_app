import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";

import { toApiError, type ApiError } from "./errors.js";

/**
 * Thin wrapper around `@tanstack/react-query`'s `useQuery` for an
 * `openapi-fetch` call shaped `{ data, error, response }`. Keeps every route
 * using the same loading/error/empty discrimination instead of each screen
 * re-deriving it from the raw `openapi-fetch` result.
 */
export function useApiQuery<TData>(
  queryKey: readonly unknown[],
  fetcher: () => Promise<{ data?: TData; error?: unknown; response: Response }>,
  options?: { enabled?: boolean }
): UseQueryResult<TData, ApiError> {
  return useQuery<TData, ApiError>({
    queryKey,
    enabled: options?.enabled,
    queryFn: async () => {
      const { data, error, response } = await fetcher();
      if (error !== undefined || !response.ok) {
        throw toApiError(error as Parameters<typeof toApiError>[0], response);
      }
      return data as TData;
    },
  });
}

/** Same normalization as {@link useApiQuery}, for mutating calls. */
export function useApiMutation<TData, TVariables>(
  mutator: (variables: TVariables) => Promise<{ data?: TData; error?: unknown; response: Response }>
): UseMutationResult<TData, ApiError, TVariables> {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const { data, error, response } = await mutator(variables);
      if (error !== undefined || !response.ok) {
        throw toApiError(error as Parameters<typeof toApiError>[0], response);
      }
      return data as TData;
    },
  });
}
