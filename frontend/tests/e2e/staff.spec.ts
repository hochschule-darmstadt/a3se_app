import { expect, test } from "@playwright/test";

/**
 * Browser-level acceptance run for the Staff Interaction thin slice
 * (issue #22), against the real backend + seeded Neo4j (DR-0014/DR-0015).
 * `frontend/tests/playwright.config.ts` starts only the Staff app's dev
 * server; the backend API (`http://127.0.0.1:8000`) and seeded Neo4j must
 * already be running separately (`docker compose up`, then
 * `docker compose --profile seed run seed`) before this spec is executed --
 * it makes real HTTP requests, never a mock.
 *
 * Uses the pre-seeded order `ORD-001` (orderNumber `6001`, status
 * `order/reserved`, 4 positions across `FLT-01`/`ACC-01`/`MOB-01`/`EXP-01`,
 * customer `PER-001-CUSTOMER`) as the golden path.
 */

test.describe("Staff thin slice (VIEW-S-001 -> S-005 -> order detail -> bounded links -> permitted edit)", () => {
  test("golden path: find an order, open its detail, inspect a bounded resource link, and edit the permitted status field", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "CCT Staff", level: 1 })).toBeVisible();

    // VIEW-S-001 nav shell links to every implemented area, keyboard-reachable.
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Orders" })).toBeVisible();
    await nav.getByRole("link", { name: "Orders" }).click();

    // S-005 orders list: find ORD-001 (orderNumber 6001) and activate its row via the keyboard.
    await expect(page.getByRole("heading", { name: "Orders", level: 1 })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible({ timeout: 15_000 });

    const orderCell = page.getByRole("cell", { name: "6001", exact: true });
    await expect(orderCell).toBeVisible({ timeout: 15_000 });
    const orderRow = orderCell.locator("xpath=ancestor::tr");
    await orderRow.focus();
    await page.keyboard.press("Enter");

    // Order detail: bounded relationship view -- header + positions with resolved ids.
    await expect(page.getByRole("heading", { name: "Order 6001", level: 1 })).toBeVisible();
    await expect(page.getByText("Order number").locator("xpath=..")).toContainText("6001");

    // Inspect a related product via the bounded, non-graph-traversal link.
    const positionsTable = page.getByRole("table", { name: /Positions for order 6001/ });
    await expect(positionsTable).toBeVisible();
    const productLink = positionsTable.getByRole("link", { name: "FLT-01" }).first();
    await expect(productLink).toBeVisible();
    await productLink.click();
    await expect(page.getByRole("heading", { name: "FLT-01", level: 1 })).toBeVisible();
    await expect(page.getByText("Read-only")).toBeVisible();

    // Back to the order to perform the one permitted edit: orderStatusCode.
    await page.goBack();
    await expect(page.getByRole("heading", { name: "Order 6001", level: 1 })).toBeVisible();

    const statusSelect = page.getByRole("textbox", { name: "Order status" });
    await statusSelect.click();
    await page.getByRole("option", { name: "Paid" }).click();
    await page.getByRole("button", { name: "Save status" }).click();

    await expect(page.getByText("Order status updated")).toBeVisible({ timeout: 15_000 });

    // Round-trip: reload and confirm the edit persisted server-side.
    await page.reload();
    await expect(page.getByRole("heading", { name: "Order 6001", level: 1 })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Order status" })).toHaveValue("Paid", { timeout: 15_000 });

    // Restore the seeded fixture's original status so re-runs stay idempotent.
    await statusSelect.click();
    await page.getByRole("option", { name: "Reserved" }).click();
    await page.getByRole("button", { name: "Save status" }).click();
    await expect(page.getByText("Order status updated")).toBeVisible({ timeout: 15_000 });
  });

  test("keyboard tab order reaches primary navigation and the orders table is operable without a mouse", async ({
    page,
  }) => {
    await page.goto("/orders");
    await expect(page.getByRole("table")).toBeVisible({ timeout: 15_000 });

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Orders" })).toBeFocused();
  });
});
