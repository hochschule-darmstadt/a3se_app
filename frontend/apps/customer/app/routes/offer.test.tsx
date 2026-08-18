import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../api";
import { signInMockActor, TestProviders } from "../test-utils";
import Offer from "./offer";

vi.mock("../api", () => ({
  apiClient: { GET: vi.fn(), POST: vi.fn(), PUT: vi.fn() },
}));

const getMock = vi.mocked(apiClient.GET);

function renderOffer() {
  const Stub = createRoutesStub([
    { path: "/offer", Component: Offer },
    { path: "/order", Component: () => <div>Order page</div> },
    { path: "/sign-in", Component: () => <div>Sign in page</div> },
  ]);
  return render(
    <TestProviders>
      <Stub initialEntries={["/offer?productId=FLT-01&date=2027-04-06&travellers=1"]} />
    </TestProviders>
  );
}

describe("Offer (VIEW-C-003 draft offer review)", () => {
  beforeEach(() => {
    getMock.mockReset();
    window.localStorage.clear();
  });

  it("redirects to sign-in when no actor is signed in", async () => {
    renderOffer();
    expect(await screen.findByText("Sign in page")).toBeInTheDocument();
  });

  it("shows the draft offer and moves to the order step on submit", async () => {
    signInMockActor();
    getMock.mockImplementation(((path: string) => {
      if (path === "/products/{product_id}") {
        return Promise.resolve({
          data: {
            entityId: "FLT-01",
            entityKind: "TouristicProductItem",
            type: "product/flight",
            schemaVersion: 1,
            properties: {
              flightNumber: "501",
              departureLocationCode: "BER",
              arrivalLocationCode: "LIM",
              scheduledDepartureLocalTime: "08:15:00",
              scheduledArrivalLocalTime: "18:40:00",
            },
          },
          response: { ok: true, status: 200 },
        });
      }
      if (path === "/stock-items/{stock_item_id}") {
        return Promise.resolve({
          data: {
            entityId: "STK-FLT-01-2027-04-06-U1",
            entityKind: "StockItem",
            type: "stock/flight/seat",
            schemaVersion: 1,
            properties: { serviceDate: "2027-04-06", unitPriceAmount: "199.00", currencyCode: "EUR" },
          },
          response: { ok: true, status: 200 },
        });
      }
      throw new Error(`Unexpected path ${path}`);
    }) as never);

    const user = userEvent.setup();
    renderOffer();

    expect(await screen.findByText(/Flight 501: BER → LIM/)).toBeInTheDocument();
    expect(screen.getByText(/199.00 EUR/)).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "Submit order" });
    await user.click(submitButton);

    expect(await screen.findByText("Order page")).toBeInTheDocument();
  });
});
