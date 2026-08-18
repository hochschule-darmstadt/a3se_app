import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";

import { createTestQueryClient, TestProviders } from "../test-utils";

const getMock = vi.fn();
const putMock = vi.fn();

vi.mock("../api", () => ({
  apiClient: {
    GET: (...args: unknown[]) => getMock(...args),
    PUT: (...args: unknown[]) => putMock(...args),
  },
  queryClient: { invalidateQueries: vi.fn() },
}));

const { default: OrderDetailRoute } = await import("./order-detail");

const orderData = {
  entityId: "ORD-001",
  entityKind: "OrderItem",
  schemaVersion: 1,
  type: "order/header",
  properties: { orderNumber: "6001", orderStatusCode: "order/reserved" },
};

const detailData = {
  order: orderData,
  positions: [
    {
      positionId: "POS-1",
      productId: "FLT-01",
      stockItemId: "STK-1",
      supplierOrganisationId: "SUP-AIR-01",
      travellerPersonId: "PER-001",
    },
  ],
};

function mockGetImplementation(orderResult: unknown, detailResult: unknown) {
  getMock.mockImplementation((path: string) => {
    if (path === "/orders/{order_id}/detail") return Promise.resolve(detailResult);
    if (path === "/orders/{order_id}") return Promise.resolve(orderResult);
    throw new Error(`Unexpected GET path: ${path}`);
  });
}

function renderOrderDetail() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/orders/:orderId",
      Component: () => (
        <TestProviders client={client}>
          <OrderDetailRoute />
        </TestProviders>
      ),
    },
  ]);
  return render(<Stub initialEntries={["/orders/ORD-001"]} />);
}

afterEach(() => {
  cleanup();
  getMock.mockReset();
  putMock.mockReset();
});

describe("OrderDetailRoute", () => {
  it("shows a loading state before data arrives", () => {
    getMock.mockReturnValue(new Promise(() => {}));
    renderOrderDetail();
    expect(screen.getByText(/loading order/i)).toBeInTheDocument();
  });

  it("shows a not-found error banner when the order does not exist", async () => {
    mockGetImplementation(
      { error: { type: "not_found", title: "Order not found", detail: "No order ORD-001." }, response: { ok: false, status: 404 } },
      { data: detailData, response: { ok: true, status: 200 } }
    );
    renderOrderDetail();
    expect(await screen.findByText("Order not found")).toBeInTheDocument();
  });

  it("renders order header and positions with links to bounded resources", async () => {
    mockGetImplementation(
      { data: orderData, response: { ok: true, status: 200 } },
      { data: detailData, response: { ok: true, status: 200 } }
    );
    renderOrderDetail();

    expect(await screen.findByRole("heading", { level: 1, name: /order 6001/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FLT-01" })).toHaveAttribute("href", "/products/FLT-01");
    expect(screen.getByRole("link", { name: "STK-1" })).toHaveAttribute("href", "/stock-items/STK-1");
    expect(screen.getByRole("link", { name: "SUP-AIR-01" })).toHaveAttribute("href", "/organisations/SUP-AIR-01");
    expect(screen.getByRole("link", { name: "PER-001" })).toHaveAttribute("href", "/persons/PER-001");
  });

  it("submits a permitted status edit and shows a success banner", async () => {
    mockGetImplementation(
      { data: orderData, response: { ok: true, status: 200 } },
      { data: detailData, response: { ok: true, status: 200 } }
    );
    putMock.mockResolvedValue({
      data: { ...orderData, properties: { orderNumber: "6001", orderStatusCode: "order/paid" } },
      response: { ok: true, status: 200 },
    });
    renderOrderDetail();
    await screen.findByRole("heading", { level: 1, name: /order 6001/i });

    const user = userEvent.setup();
    await user.click(screen.getByRole("textbox", { name: "Order status" }));
    await user.click(await screen.findByRole("option", { name: "Paid", hidden: true }));
    await user.click(screen.getByRole("button", { name: /save status/i }));

    expect(await screen.findByText(/order status updated/i)).toBeInTheDocument();
    expect(putMock).toHaveBeenCalledWith(
      "/orders/{order_id}",
      expect.objectContaining({
        params: { path: { order_id: "ORD-001" } },
        body: { properties: { orderNumber: "6001", orderStatusCode: "order/paid" } },
      })
    );
  });

  it("shows a validation error banner when the status update fails validation", async () => {
    mockGetImplementation(
      { data: orderData, response: { ok: true, status: 200 } },
      { data: detailData, response: { ok: true, status: 200 } }
    );
    putMock.mockResolvedValue({
      error: { type: "validation_failed", title: "Invalid status", detail: "orderStatusCode is invalid." },
      response: { ok: false, status: 422 },
    });
    renderOrderDetail();
    await screen.findByRole("heading", { level: 1, name: /order 6001/i });

    const user = userEvent.setup();
    await user.click(screen.getByRole("textbox", { name: "Order status" }));
    await user.click(await screen.findByRole("option", { name: "Cancelled", hidden: true }));
    await user.click(screen.getByRole("button", { name: /save status/i }));

    expect(await screen.findByText("Invalid status")).toBeInTheDocument();
  });

  it("shows a conflict error banner when the status update conflicts", async () => {
    mockGetImplementation(
      { data: orderData, response: { ok: true, status: 200 } },
      { data: detailData, response: { ok: true, status: 200 } }
    );
    putMock.mockResolvedValue({
      error: { type: "conflict", title: "Order changed", detail: "The order was modified concurrently." },
      response: { ok: false, status: 409 },
    });
    renderOrderDetail();
    await screen.findByRole("heading", { level: 1, name: /order 6001/i });

    const user = userEvent.setup();
    await user.click(screen.getByRole("textbox", { name: "Order status" }));
    await user.click(await screen.findByRole("option", { name: "Fulfilled", hidden: true }));
    await user.click(screen.getByRole("button", { name: /save status/i }));

    expect(await screen.findByText("Order changed")).toBeInTheDocument();
  });
});
