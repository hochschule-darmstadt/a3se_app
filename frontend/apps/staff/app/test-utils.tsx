import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { StaffUiProvider } from "@cct/ui";

/** Fresh, retry-disabled `QueryClient` per test so failures resolve immediately instead of retrying. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

/** Wraps a route element with the same providers `root.tsx` supplies in the real app. */
export function TestProviders({ children, client }: { readonly children: ReactNode; readonly client: QueryClient }) {
  return (
    <StaffUiProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </StaffUiProvider>
  );
}
