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
  properties: {
    flightNumber: "501",
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
    getMock.mockImplementation(((path: string, options: { params?: { path?: Record<string, string> } }) => {
      if (path === "/products/{product_id}") {
        return Promise.resolve({ data: FLIGHT_PRODUCT, response: { ok: true, status: 200 } });
      }
      if (path === "/products/{product_id}/components") {
        return Promise.resolve({ data: [], response: { ok: true, status: 200 } });
      }
      if (path === "/stock-items/{stock_item_id}") {
        const stockItemId = options.params?.path?.stock_item_id ?? "";
        if (stockItemId === "STK-FLT-01-2027-04-07-U1") {
          return Promise.resolve({
            data: {
              entityId: stockItemId,
              entityKind: "StockItem",
              type: "stock/flight/seat",
              schemaVersion: 1,
              properties: { serviceDate: "2027-04-07", unitPriceAmount: "199.00", currencyCode: "EUR" },
            },
            response: { ok: true, status: 200 },
          });
        }
        return Promise.resolve({
          error: { type: "not_found", title: "Not found", detail: "no stock" },
          response: { ok: false, status: 404 },
        });
      }
      throw new Error(`Unexpected path ${path}`);
    }) as never);

    renderDetail("/products/FLT-01?date=2027-04-06&travellers=1");

    expect(await screen.findByText("Not available on 2027-04-06")).toBeInTheDocument();
    expect(await screen.findByText("An alternative date is available: 2027-04-07.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Use 2027-04-07 instead" })).toBeInTheDocument();
  });

  it("shows a genuine unavailable state (no fabricated alternative) when no date in the window has stock", async () => {
    getMock.mockImplementation(((path: string) => {
      if (path === "/products/{product_id}") {
        return Promise.resolve({ data: FLIGHT_PRODUCT, response: { ok: true, status: 200 } });
      }
      if (path === "/products/{product_id}/components") {
        return Promise.resolve({ data: [], response: { ok: true, status: 200 } });
      }
      if (path === "/stock-items/{stock_item_id}") {
        return Promise.resolve({
          error: { type: "not_found", title: "Not found", detail: "no stock" },
          response: { ok: false, status: 404 },
        });
      }
      throw new Error(`Unexpected path ${path}`);
    }) as never);

    renderDetail("/products/FLT-01?date=2027-04-06&travellers=1");

    expect(await screen.findByText("Not available on 2027-04-06")).toBeInTheDocument();
    expect(await screen.findByText("No availability was found in the next 7 days either.")).toBeInTheDocument();
    expect(screen.queryByText(/An alternative date is available/)).not.toBeInTheDocument();
  });
});
