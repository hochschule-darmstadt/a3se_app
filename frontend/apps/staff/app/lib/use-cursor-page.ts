import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { toApiError, useApiQuery, type ApiError } from "@cct/api-client";

interface PageResult<T> {
  readonly items: T[];
  readonly nextCursor?: string | null;
}

export interface CursorPageState<T> {
  readonly items: T[];
  readonly status: "pending" | "error" | "success";
  readonly error: ApiError | null;
  readonly isFetching: boolean;
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly refetch: () => void;
}

/**
 * Client-tracked cursor stack over `GET` list endpoints that only expose a
 * forward `nextCursor` (the backend's `Page[T]` contract has no
 * `previousCursor`). Pushing/popping cursors locally is what makes the
 * `CursorPager` "Previous page" button possible without a server contract
 * change.
 */
export function useCursorPage<T>(
  queryKeyBase: readonly unknown[],
  fetchPage: (cursor: string | undefined) => Promise<{ data?: PageResult<T>; error?: unknown; response: Response }>
): CursorPageState<T> {
  const [cursorStack, setCursorStack] = useState<readonly (string | undefined)[]>([undefined]);
  const queryKeySignature = JSON.stringify(queryKeyBase);
  const previousQueryKeySignature = useRef(queryKeySignature);
  useEffect(() => {
    if (previousQueryKeySignature.current !== queryKeySignature) {
      previousQueryKeySignature.current = queryKeySignature;
      setCursorStack([undefined]);
    }
  }, [queryKeySignature]);
  const cursor = cursorStack[cursorStack.length - 1];

  const query = useApiQuery<PageResult<T>>([...queryKeyBase, cursor], () => fetchPage(cursor));
  const nextCursor = query.data?.nextCursor ?? null;

  return {
    items: query.data?.items ?? [],
    status: query.status,
    error: query.error ?? null,
    isFetching: query.isFetching,
    hasPrevious: cursorStack.length > 1,
    hasNext: Boolean(nextCursor),
    onPrevious: () => setCursorStack((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack)),
    onNext: () => {
      if (nextCursor) setCursorStack((stack) => [...stack, nextCursor]);
    },
    refetch: () => void query.refetch(),
  };
}

export interface AllItemsState<T> {
  readonly items: readonly T[];
  readonly status: "pending" | "error" | "success";
  readonly error: ApiError | null;
  readonly refetch: () => void;
}

/**
 * Fetches every page of a cursor-paginated list endpoint up front. Needed
 * whenever filtering/search must apply across the whole collection: these
 * list endpoints have no server-side search, so filtering only the
 * currently-fetched page silently hides matches sitting on other pages.
 * Bounded to 50 pages -- fine for this project's small synthetic datasets,
 * not a general-purpose solution for large collections.
 */
export function useAllPages<T>(
  queryKeyBase: readonly unknown[],
  fetchPage: (cursor: string | undefined) => Promise<{ data?: PageResult<T>; error?: unknown; response: Response }>
): AllItemsState<T> {
  const query = useQuery<T[], ApiError>({
    queryKey: [...queryKeyBase, "all"],
    queryFn: async () => {
      const items: T[] = [];
      let cursor: string | undefined = undefined;
      for (let page = 0; page < 50; page += 1) {
        const { data, error, response } = await fetchPage(cursor);
        if (error !== undefined || !response.ok) {
          throw toApiError(error as Parameters<typeof toApiError>[0], response);
        }
        items.push(...(data?.items ?? []));
        if (!data?.nextCursor) break;
        cursor = data.nextCursor;
      }
      return items;
    },
  });

  return {
    items: query.data ?? [],
    status: query.status,
    error: query.error ?? null,
    refetch: () => void query.refetch(),
  };
}
