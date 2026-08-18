import { CustomerUiProvider, MockAuthProvider } from "@cct/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { LocaleContext } from "./i18n";

/** Not a route -- shared test scaffolding for `routes/*.test.tsx` (colocated per `frontend/tests/README.md`). */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

export function TestProviders({ children }: { readonly children: ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerUiProvider>
        <MockAuthProvider>
          <LocaleContext.Provider value={{ locale: "en-GB", setLocale: () => {} }}>
            {children}
          </LocaleContext.Provider>
        </MockAuthProvider>
      </CustomerUiProvider>
    </QueryClientProvider>
  );
}

/** Pre-populates `MockAuthProvider`'s `localStorage` backing so a route under test sees a signed-in actor. */
export function signInMockActor(personId = "PER-001", displayName = "Ada Kern") {
  window.localStorage.setItem("cct.mockActor", JSON.stringify({ personId, displayName }));
}
