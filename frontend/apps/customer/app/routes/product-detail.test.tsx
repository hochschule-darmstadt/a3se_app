import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../api";
import { TestProviders } from "../test-utils";
import ProductDetail from "./product-detail";

vi.mock("../api", () => ({
  apiClient: { GET: vi.fn(), POST: vi.fn(), PUT: vi.fn() },
}));

const getMock = vi.mocked(apiClient.GET);

const FLIGHT_PRODUCT = {
  entityId: "FLT-01",
  entityKind: "TouristicProductItem",
  type: "product/airline/flight",
  schemaVersion: 1,
  displayName: "0Q501 BER–LIM",
  displayNameChain: ["Nordwind Airways", "Airline", "0Q501 BER–LIM"],
  properties: {
    description: "A comfortable synthetic flight for exploring the region.",
    flightNumber: "CA501",
    departureLocationCode: "BER",
    arrivalLocationCode: "LIM",
    scheduledDepartureLocalTime: "08:15:00",
    scheduledArrivalLocalTime: "18:40:00",
  },
};

function renderDetail(initialEntry: string) {
  const Stub = createRoutesStub([
    { path: "/products/:productId", Component: ProductDetail },
    { path: "/compose", Component: () => <div>Compose page</div> },
  ]);
  return render(
    <TestProviders>
      <Stub initialEntries={[initialEntry]} />
    </TestProviders>
  );
}

describe("ProductDetail (VIEW-C-010 availability check)", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it("offers a real alternative date when the requested date has no stock but a later day does", async () => {
    getMock.mockImplementation(((path: string, options: { params?: { query?: { serviceDateFrom?: string } } }) => {
      if (path === "/products/{product_id}") {
        return Promise.resolve({ data: FLIGHT_PRODUCT, response: { ok: true, status: 200 } });
      }
      if (path === "/products/{product_id}/components") {
        return Promise.resolve({ data: [], response: { ok: true, status: 200 } });
      }
      if (path === "/stock-items") {
        if (options.params?.query?.serviceDateFrom === "2027-04-07") {
          return Promise.resolve({
            data: {
              items: [{
              entityId: "STK-000005",
              entityKind: "StockItem",
              type: "stock/airline/flight/seat",
              schemaVersion: 1,
              productId: "FLT-01", productType: "product/airline/flight", productDisplayName: "Flight", productDisplayNameChain: ["Flight"], productAncestors: [], supplierRole: null, supplierOrganisationId: null, supplierDisplayName: null, availableQuantity: 3, availabilityState: "available", properties: { serviceDate: "2027-04-07", unitPriceAmount: "199.00", currencyCode: "EUR", capacityQuantity: 3, remainingCapacity: 3, inventoryStatusCode: "inventory/active", searchText: "" },
              }], nextCursor: null },
            response: { ok: true, status: 200 },
          });
        }
        return Promise.resolve({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } });
      }
      throw new Error(`Unexpected path ${path}`);
    }) as never);

    renderDetail("/products/FLT-01?date=2027-04-06&travellers=1");

    expect(await screen.findByText("Not available on 2027-04-06")).toBeInTheDocument();
    expect(screen.getByText("A comfortable synthetic flight for exploring the region.")).toBeInTheDocument();
    expect(await screen.findByText("An alternative date is available: 2027-04-07.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add 2027-04-07 to travel" })).toBeInTheDocument();
  });

  it("shows a genuine unavailable state (no fabricated alternative) when no date in the window has stock", async () => {
    getMock.mockImplementation(((path: string) => {
      if (path === "/products/{product_id}") {
        return Promise.resolve({ data: FLIGHT_PRODUCT, response: { ok: true, status: 200 } });
      }
      if (path === "/products/{product_id}/components") {
        return Promise.resolve({ data: [], response: { ok: true, status: 200 } });
      }
      if (path === "/stock-items") {
        return Promise.resolve({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } });
      }
      throw new Error(`Unexpected path ${path}`);
    }) as never);

    renderDetail("/products/FLT-01?date=2027-04-06&travellers=1");

    expect(await screen.findByText("Not available on 2027-04-06")).toBeInTheDocument();
    expect(await screen.findByText("No availability was found in the next 7 days either.")).toBeInTheDocument();
    expect(screen.queryByText(/An alternative date is available/)).not.toBeInTheDocument();
  });

  it("returns to the originating search with its criteria preserved", async () => {
    getMock.mockImplementation(((path: string) => {
      if (path === "/products/{product_id}") return Promise.resolve({ data: FLIGHT_PRODUCT, response: { ok: true, status: 200 } });
      if (path === "/products/{product_id}/components") return Promise.resolve({ data: [], response: { ok: true, status: 200 } });
      throw new Error(`Unexpected path ${path}`);
    }) as never);

    renderDetail("/products/FLT-01?destinationOrTheme=Lima&dateFrom=2027-01-01&dateTo=2027-12-31&travellers=1&date=2027-04-06");

    const backLink = await screen.findByRole("link", { name: "Back to results" });
    expect(backLink).toHaveAttribute("href", "/search?destinationOrTheme=Lima&dateFrom=2027-01-01&dateTo=2027-12-31&travellers=1");
  });
});
