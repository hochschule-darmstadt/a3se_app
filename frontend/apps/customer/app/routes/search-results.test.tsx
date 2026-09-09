import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../api";
import { TestProviders } from "../test-utils";
import SearchResults from "./search-results";

vi.mock("../api", () => ({ apiClient: { GET: vi.fn(), POST: vi.fn(), PUT: vi.fn() } }));

function renderResults(initialEntry = "/search?destinationOrTheme=Peru&dateFrom=2027-04-01&dateTo=2027-04-06&travellers=2&budgetPerPerson=2000") {
  const Stub = createRoutesStub([{ path: "/search", Component: SearchResults }, { path: "/products/:productId", Component: () => <div>Product detail page</div> }]);
  return render(<TestProviders><Stub initialEntries={[initialEntry]} /></TestProviders>);
}

const getMock = vi.mocked(apiClient.GET);

describe("SearchResults (VIEW-C-009 product-level catalogue search)", () => {
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
    expect(screen.getByRole("link", { name: "Revise criteria" })).toBeVisible();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumb).toHaveTextContent("Travel portal");
    expect(breadcrumb).toHaveTextContent("Search results");
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

  it("renders a product with aggregated available dates", async () => {
    getMock.mockResolvedValue({ data: { items: [{
      productId: "FLT-01", productType: "product/airline/flight", productDisplayName: "CA501 BER–LIM",
      productDisplayNameChain: ["Condorleaf Air", "Airline", "CA501 BER–LIM"], availableDates: ["2027-04-06", "2027-04-13"],
      indicativeUnitPriceAmount: "1690", currencyCode: "EUR",
    }], nextCursor: null }, response: { ok: true, status: 200 } } as never);
    renderResults();
    expect(await screen.findByText("Condorleaf Air · Airline · CA501 BER–LIM")).toBeInTheDocument();
    expect(screen.getByText("1690 EUR")).toBeInTheDocument();
    expect(screen.queryByText("2027-04-06, 2027-04-13")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "CA501 BER–LIM date" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toBeInTheDocument();
  });
});
