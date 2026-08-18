import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * Customer-app-local test setup, additive to the shared
 * `frontend/vitest.setup.ts` (not edited here -- that file is shared with
 * the Staff app, out of this issue's scope). `vitest.config.ts` sets
 * `globals: false`, so `@testing-library/react`'s automatic
 * afterEach-cleanup detection (which relies on a *global* `afterEach`)
 * never fires; without this, unmounted trees from a previous test in the
 * same file accumulate in the jsdom document and later `getByText`/
 * `findByText` calls fail with "found multiple elements".
 */
afterEach(() => {
  cleanup();
});

/**
 * Mantine's `MantineProvider` calls `window.matchMedia` (colour-scheme
 * detection) on mount; jsdom does not implement it, so every route test
 * wrapped in `CustomerUiProvider` would otherwise fail before rendering
 * anything route-specific.
 */
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
