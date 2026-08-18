import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../api";
import { signInMockActor, TestProviders } from "../test-utils";
import Order from "./order";

vi.mock("../api", () => ({
  apiClient: { GET: vi.fn(), POST: vi.fn(), PUT: vi.fn() },
}));

const getMock = vi.mocked(apiClient.GET);
const postMock = vi.mocked(apiClient.POST);
const putMock = vi.mocked(apiClient.PUT);

const ROLES = [
  { entityId: "PER-001-CUSTOMER", entityKind: "PersonRole", type: "person/customer", schemaVersion: 1, properties: {} },
  { entityId: "PER-001-TRAVELLER", entityKind: "PersonRole", type: "person/traveller", schemaVersion: 1, properties: {} },
];

function renderOrder() {
  const Stub = createRoutesStub([
    { path: "/order", Component: Order },
    { path: "/offer", Component: () => <div>Offer page</div> },
    { path: "/sign-in", Component: () => <div>Sign in page</div> },
    { path: "/", Component: () => <div>Home page</div> },
  ]);
  return render(
    <TestProviders>
      <Stub initialEntries={["/order?productId=FLT-01&date=2027-04-06&travellers=1"]} />
    </TestProviders>
  );
}

describe("Order (VIEW-C-004 submission)", () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    putMock.mockReset();
    window.localStorage.clear();
    signInMockActor();
    getMock.mockResolvedValue({ data: ROLES, response: { ok: true, status: 200 } } as never);
  });

  it("shows the real order id on success", async () => {
    postMock.mockResolvedValue({ data: {}, response: { ok: true, status: 201 } } as never);
    putMock.mockResolvedValue({ response: { ok: true, status: 204 } } as never);

    renderOrder();

    expect(await screen.findByText("Order confirmed")).toBeInTheDocument();
    expect(screen.getAllByText(/ORD-DRAFT-/).length).toBeGreaterThan(0);
  });

  it("shows a conflict state distinctly, with no blind retry action, when stock allocation conflicts", async () => {
    postMock.mockResolvedValue({ data: {}, response: { ok: true, status: 201 } } as never);
    putMock.mockImplementation(((path: string) => {
      if (path === "/orders/{order_id}/positions/{position_id}/stock") {
        return Promise.resolve({
          error: { type: "conflict", title: "Already allocated", detail: "stock taken" },
          response: { ok: false, status: 409 },
        });
      }
      return Promise.resolve({ response: { ok: true, status: 204 } });
    }) as never);

    renderOrder();

    expect(await screen.findByText("This stock item was just taken")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to offer" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();
  });

  it("offers a retry action for a retryable network failure, and succeeds after retrying", async () => {
    const user = userEvent.setup();
    let orderAttempts = 0;
    postMock.mockImplementation(((path: string) => {
      if (path === "/orders" && orderAttempts === 0) {
        orderAttempts += 1;
        return Promise.resolve({ error: undefined, response: { ok: false, status: 0 } });
      }
      return Promise.resolve({ data: {}, response: { ok: true, status: 201 } });
    }) as never);
    putMock.mockResolvedValue({ response: { ok: true, status: 204 } } as never);

    renderOrder();

    expect(await screen.findByText("A temporary problem occurred")).toBeInTheDocument();
    const retryButton = screen.getByRole("button", { name: "Try again" });
    await user.click(retryButton);

    expect(await screen.findByText("Order confirmed")).toBeInTheDocument();
  });
});
