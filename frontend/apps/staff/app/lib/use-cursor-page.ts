import { useState } from "react";

import { useApiQuery, type ApiError } from "@cct/api-client";

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
