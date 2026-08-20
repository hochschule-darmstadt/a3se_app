import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../api";
import { TestProviders } from "../test-utils";
import Compose from "./compose";

vi.mock("../api", () => ({
  apiClient: { GET: vi.fn(), POST: vi.fn(), PUT: vi.fn() },
}));

const getMock = vi.mocked(apiClient.GET);

function renderCompose() {
  const Stub = createRoutesStub([
    { path: "/compose", Component: Compose },
    { path: "/sign-in", Component: () => <div>Sign in page</div> },
  ]);
  return render(
    <TestProviders>
      <Stub initialEntries={["/compose?productId=FLT-01&date=2027-04-06&travellers=1"]} />
    </TestProviders>
  );
}

describe("Compose (VIEW-C-002 traveller composition)", () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue({
      data: {
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
      },
      response: { ok: true, status: 200 },
    } as never);
  });

  it("shows the selected product and date, and continues to sign in", async () => {
    const user = userEvent.setup();
    renderCompose();

    expect(await screen.findByText(/Flight 501: BER → LIM/)).toBeInTheDocument();
    expect(screen.getByText(/2027-04-06/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continue to sign in" }));
    expect(await screen.findByText("Sign in page")).toBeInTheDocument();
  });
});
