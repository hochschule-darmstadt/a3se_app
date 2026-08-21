import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../api";
import { TestProviders } from "../test-utils";
import SearchResults from "./search-results";

vi.mock("../api", () => ({
  apiClient: { GET: vi.fn(), POST: vi.fn(), PUT: vi.fn() },
}));

function renderResults(initialEntry = "/search?origin=Berlin&destination=Peru&date=2027-04-06&travellers=2") {
  const Stub = createRoutesStub([
    { path: "/search", Component: SearchResults },
    { path: "/products/:productId", Component: () => <div>Product detail page</div> },
  ]);
  return render(
    <TestProviders>
      <Stub initialEntries={[initialEntry]} />
    </TestProviders>
  );
}

const getMock = vi.mocked(apiClient.GET);

describe("SearchResults (VIEW-C-009 catalogue listing)", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it("shows a loading state while the catalogue is being fetched", () => {
    getMock.mockReturnValue(new Promise(() => {}) as never);
    renderResults();
    expect(screen.getByText("Loading the product catalogue…")).toBeInTheDocument();
  });

  it("shows the entered criteria as context, not as an applied filter", async () => {
    getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } } as never);
    renderResults();
    expect(await screen.findByText(/Origin: Berlin/)).toBeInTheDocument();
    expect(screen.getByText(/DR-0015/)).toBeInTheDocument();
  });

  it("shows an empty state when the catalogue has no products", async () => {
    getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } } as never);
    renderResults();
    expect(await screen.findByText("No products are in the catalogue.")).toBeInTheDocument();
  });

  it("shows an error banner when the catalogue fails to load", async () => {
    getMock.mockResolvedValue({
      error: { type: "unknown", title: "Server error", detail: "boom" },
      response: { ok: false, status: 500 },
    } as never);
    renderResults();
    expect(await screen.findByRole("alert")).toHaveTextContent("Server error");
  });

  it("renders each product as a card linking to its detail page", async () => {
    getMock.mockResolvedValue({
      data: {
        items: [
          {
            entityId: "FLT-01",
            entityKind: "TouristicProductItem",
            type: "product/airline/flight",
            schemaVersion: 1,
            displayName: "0Q501 BER–LIM",
            displayNameChain: ["Nordwind Airways", "Airline", "0Q501 BER–LIM"],
            properties: {
              flightNumber: "501",
              departureLocationCode: "BER",
              arrivalLocationCode: "LIM",
              scheduledDepartureLocalTime: "08:15:00",
              scheduledArrivalLocalTime: "18:40:00",
            },
          },
        ],
        nextCursor: null,
      },
      response: { ok: true, status: 200 },
    } as never);
    renderResults();

    expect(await screen.findByText("0Q501 BER–LIM")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toBeInTheDocument();
  });
});
