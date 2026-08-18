import { defineConfig, devices } from "@playwright/test";

/**
 * Browser-level acceptance run for issue #22's Customer and Staff thin
 * slices, against the real dev servers of both apps. Requires the real
 * backend + seeded Neo4j already running separately (see
 * `docker compose up` / `--profile seed run seed`, DR-0014) -- Playwright
 * starts only the two frontend dev servers, never a mocked API, so these
 * specs prove genuine end-to-end behaviour rather than a fixture replay.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "customer",
      testMatch: /customer\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:4300" },
    },
    {
      name: "staff",
      testMatch: /staff\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:4301" },
    },
  ],
  webServer: [
    {
      command: "npm run dev -w frontend/apps/customer -- --port 4300 --strictPort",
      url: "http://127.0.0.1:4300",
      reuseExistingServer: !process.env.CI,
      cwd: "../..",
      timeout: 60_000,
    },
    {
      command: "npm run dev -w frontend/apps/staff -- --port 4301 --strictPort",
      url: "http://127.0.0.1:4301",
      reuseExistingServer: !process.env.CI,
      cwd: "../..",
      timeout: 60_000,
    },
  ],
});
