/**
 * jsdom does not implement `window.matchMedia` or `ResizeObserver`, both of
 * which Mantine components (`MantineProvider` color scheme resolution,
 * `ScrollArea` inside the shared `DataTable`) call on mount. Polyfilling
 * them here (app-local, additive only) keeps the shared
 * `frontend/vitest.setup.ts` untouched for other apps.
 */
if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof window.ResizeObserver;
}

if (typeof window !== "undefined" && !window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}

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
