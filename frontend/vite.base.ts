import { defineConfig } from "vite";

/** Shared build behavior for both browser-only interaction applications. */
export const cctViteBase = defineConfig({
  build: { target: "es2022" },
  resolve: { dedupe: ["react", "react-dom", "react-router"] },
});
