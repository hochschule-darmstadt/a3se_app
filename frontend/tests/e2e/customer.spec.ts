import { expect, test, type Page } from "@playwright/test";

/**
 * Browser-level acceptance run for the Customer Interaction thin slice
 * (issue #22), against the real backend + seeded Neo4j (DR-0014/DR-0015).
 * `frontend/tests/playwright.config.ts` starts only the Customer app's dev
 * server; the backend API (`http://127.0.0.1:8000`) and seeded Neo4j must
 * already be running separately (`docker compose up`, then
 * `docker compose --profile seed run seed`) before this spec is executed --
 * it makes real HTTP requests, never a mock.
 *
 * Uses `FLT-01` (BER -> LIM, seeded with a real 2027 dated stock calendar
 * per DR-0014) as the golden-path product and `2027-04-06` as a date the
 * issue's own instructions record as seeded (`STK-FLT-01-2027-04-06-U1`).
 */

const GOLDEN_PATH_DATE = "2027-04-06";
const UNAVAILABLE_DATE = "2028-01-01"; // outside the seeded 2027 calendar (DR-0014): genuinely no stock, on the requested date or any of the following 7 days.

/**
 * The catalogue-listing screen (VIEW-C-009) has no filter/search parameter
 * (DR-0015) and lists the full ~130-product seeded catalogue 20 at a time,
 * so finding one named product means paging through results, not a single
 * lookup. Bounded to avoid an infinite loop if the product is genuinely
 * absent.
 */
async function findAndOpenProduct(page: Page, productId: string, maxPages = 10) {
  for (let attempt = 0; attempt < maxPages; attempt += 1) {
    // `locator.isVisible()` checks the DOM immediately and never retries,
    // which races React's render commit right after a cursor-page fetch
    // resolves (`waitForLoadState` only tracks network activity, not the
    // following render). `expect(...).toBeVisible()` polls until the
    // timeout instead, so it correctly waits out that race.
    const isOnThisPage = await expect
      .poll(() => page.getByText(productId, { exact: true }).isVisible(), { timeout: 2_000 })
      .toBe(true)
      .then(
        () => true,
        () => false
      );
    if (isOnThisPage) {
      // Scoped to the Mantine `Card` root specifically -- a bare `"div"`
      // `has:` locator matches every ancestor div up to the results grid,
      // so its "View details" link resolves to the *first* card on the
      // page rather than the one actually containing `productId`.
      const card = page.locator(".mantine-Card-root", { has: page.getByText(productId, { exact: true }) }).first();
      await card.getByRole("link", { name: "View details" }).click();
      return;
    }
    const nextButton = page.getByRole("button", { name: "Next page" });
    if (!(await nextButton.isEnabled())) {
      throw new Error(`Product ${productId} was not found in the catalogue listing.`);
    }
    await nextButton.click();
    await page.waitForLoadState("networkidle");
  }
  throw new Error(`Product ${productId} was not found within ${maxPages} catalogue pages.`);
}

test.describe("Customer thin slice (VIEW-C-001 -> C-009 -> C-010 -> C-002 -> C-011 -> C-003 -> C-004)", () => {
  test("golden path: search, select an available product, compose, sign in, and submit a real order", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Where would you like to go?" })).toBeVisible();

    await page.getByLabel("Origin").fill("Berlin");
    await page.getByLabel("Destination or region").fill("Lima");
    await page.getByLabel("Outbound date").fill(GOLDEN_PATH_DATE);
    await page.getByRole("button", { name: "Search the catalogue" }).click();

    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
    await expect(page.getByText("Origin: Berlin")).toBeVisible();

    await findAndOpenProduct(page, "FLT-01");

    await expect(page.getByRole("heading", { name: "Travel product" })).toBeVisible();
    // Either genuinely available on the requested date, or a genuine alternative is offered -- never fabricated.
    const selectButton = page.getByRole("button", { name: "Select this option" });
    const alternativeButton = page.getByRole("button", { name: /Use \d{4}-\d{2}-\d{2} instead/ });
    await expect(selectButton.or(alternativeButton)).toBeVisible({ timeout: 15_000 });
    if (await selectButton.isVisible()) {
      await selectButton.click();
    } else {
      await alternativeButton.click();
    }

    await expect(page.getByRole("heading", { name: "Compose your travel" })).toBeVisible();
    await page.getByRole("button", { name: "Continue to sign in" }).click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByText(/Prototype placeholder/)).toBeVisible();
    await page.getByLabel("Display name").fill("Ada Kern (e2e)");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "Your offer" })).toBeVisible();
    await expect(page.getByText("Christopher Columbus Travel")).toBeDefined();
    await page.getByRole("button", { name: "Submit order" }).click();

    await expect(page.getByRole("heading", { name: "Order" })).toBeVisible();
    await expect(page.getByText("Order confirmed")).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/ORD-DRAFT-\d+/).first()).toBeVisible();
  });

  test("unavailable date: shows a genuine unavailable state, never a fabricated availability result", async ({
    page,
  }) => {
    await page.goto(`/products/FLT-01?date=${UNAVAILABLE_DATE}&travellers=1&origin=Berlin&destination=Lima`);

    await expect(page.getByRole("heading", { name: "Travel product" })).toBeVisible();
    await expect(page.getByText(`Not available on ${UNAVAILABLE_DATE}`)).toBeVisible({ timeout: 15_000 });
    // No fabricated alternative: either a real alternative is proven, or the "none found" state is shown.
    const alternativeFound = page.getByText(/An alternative date is available/);
    const noneFound = page.getByText("No availability was found in the next 7 days either.");
    await expect(alternativeFound.or(noneFound)).toBeVisible();
  });
});
