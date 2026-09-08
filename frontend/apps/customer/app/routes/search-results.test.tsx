import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../api";
import { TestProviders } from "../test-utils";
import SearchResults from "./search-results";

vi.mock("../api", () => ({ apiClient: { GET: vi.fn(), POST: vi.fn(), PUT: vi.fn() } }));

function renderResults(initialEntry = "/search?destinationOrTheme=Peru&dateFrom=2027-04-01&dateTo=2027-04-06&travellers=2&departureLocationCode=BER&budgetPerPerson=2000") {
  const Stub = createRoutesStub([{ path: "/search", Component: SearchResults }, { path: "/products/:productId", Component: () => <div>Product detail page</div> }]);
  return render(<TestProviders><Stub initialEntries={[initialEntry]} /></TestProviders>);
}

const getMock = vi.mocked(apiClient.GET);

describe("SearchResults (VIEW-C-009 stock-backed listing)", () => {
  beforeEach(() => getMock.mockReset());

  it("shows a loading state while matching stock is being fetched", async () => {
    getMock.mockReturnValue(new Promise((resolve) => setTimeout(() => resolve({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } }), 100)) as never);
    renderResults();
    expect(screen.getByText("Loading matching trips…")).toBeInTheDocument();
    await screen.findByText("No matching trips are available.");
  });

  it("shows the entered criteria while the API applies matching filters", async () => {
    getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } } as never);
    renderResults();
    expect(await screen.findByText(/Destination or theme: Peru/)).toBeInTheDocument();
  });

  it("shows an empty state when no stock matches", async () => {
    getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } } as never);
    renderResults();
    expect(await screen.findByText("No matching trips are available.")).toBeInTheDocument();
  });

  it("shows an API error", async () => {
    getMock.mockResolvedValue({ error: { type: "unknown", title: "Server error", detail: "boom" }, response: { ok: false, status: 500 } } as never);
    renderResults();
    expect(await screen.findByRole("alert")).toHaveTextContent("Server error");
  });

  it("renders one card per product with indicative stock details", async () => {
    getMock.mockResolvedValue({ data: { items: [{
      entityId: "STK-01", entityKind: "StockItem", type: "stock/airline/flight", schemaVersion: 1,
      productId: "FLT-01", productType: "product/airline/flight", productDisplayName: "0Q501 BER–LIM",
      productDisplayNameChain: ["Nordwind Airways", "Airline", "0Q501 BER–LIM"], productAncestors: [],
      supplierRole: null, supplierOrganisationId: null, supplierDisplayName: null, availableQuantity: 2,
      availabilityState: "available", properties: { serviceDate: "2027-04-06", unitPriceAmount: "1690", currencyCode: "EUR", capacityQuantity: 2, remainingCapacity: 2, inventoryStatusCode: "inventory/active" },
    }], nextCursor: null }, response: { ok: true, status: 200 } } as never);
    renderResults();
    expect(await screen.findByText("0Q501 BER–LIM")).toBeInTheDocument();
    expect(screen.getByText("1690 EUR")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toBeInTheDocument();
  });
});
