import { defineConfig, mergeConfig } from "vitest/config";

import { cctViteBase } from "../../vite.base";

/**
 * Deliberately does not load the `@react-router/dev` Vite plugin: route
 * component tests render via `react-router`'s own `createRoutesStub` (see
 * `app/routes/*.test.tsx`), which needs plain esbuild JSX handling, not a
 * full framework-mode route-type generation pass.
 */
export default mergeConfig(
  cctViteBase,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["../../vitest.setup.ts", "./test-setup.ts"],
      globals: false,
      include: ["app/**/*.test.{ts,tsx}"],
    },
  })
);
