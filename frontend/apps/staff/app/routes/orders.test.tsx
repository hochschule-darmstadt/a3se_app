import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";

import { createTestQueryClient, TestProviders } from "../test-utils";

const getMock = vi.fn();

vi.mock("../api", () => ({
  apiClient: { GET: (...args: unknown[]) => getMock(...args) },
  queryClient: undefined,
}));

const { default: OrdersRoute } = await import("./orders");

function renderOrders() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/orders",
      Component: () => (
        <TestProviders client={client}>
          <OrdersRoute />
        </TestProviders>
      ),
    },
    { path: "/orders/:orderId", Component: () => <div>Order detail page</div> },
  ]);
  return render(<Stub initialEntries={["/orders"]} />);
}

function orderResponse(entityId: string, orderNumber: string, orderStatusCode: string) {
  return {
    entityId,
    entityKind: "OrderItem",
    schemaVersion: 1,
    type: "order/header",
    properties: { orderNumber, orderStatusCode },
  };
}

afterEach(() => {
  cleanup();
  getMock.mockReset();
});

describe("OrdersRoute", () => {
  it("shows a loading state before data arrives", () => {
    getMock.mockReturnValue(new Promise(() => {}));
    renderOrders();
    expect(screen.getByText(/loading orders/i)).toBeInTheDocument();
  });

  it("shows an empty state when there are no orders", async () => {
    getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } });
    renderOrders();
    expect(await screen.findByText(/no orders to display/i)).toBeInTheDocument();
  });

  it("shows an error banner and allows retry when the request fails", async () => {
    getMock.mockResolvedValue({
      error: { type: "unknown", title: "Server error", detail: "Something went wrong." },
      response: { ok: false, status: 500 },
    });
    renderOrders();
    expect(await screen.findByText("Server error")).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("renders a populated table with order number and status columns", async () => {
    getMock.mockResolvedValue({
      data: {
        items: [
          orderResponse("ORD-001", "6001", "order/reserved"),
          orderResponse("ORD-002", "6002", "order/paid"),
        ],
        nextCursor: null,
      },
      response: { ok: true, status: 200 },
    });
    renderOrders();
    expect(await screen.findByText("6001")).toBeInTheDocument();
    expect(screen.getByText("6002")).toBeInTheDocument();
    expect(screen.getByText("order/reserved")).toBeInTheDocument();
    expect(screen.getByText("order/paid")).toBeInTheDocument();
  });

  it("sorts rows client-side over the currently-fetched page when a sortable header is activated", async () => {
    getMock.mockResolvedValue({
      data: {
        items: [
          orderResponse("ORD-002", "6002", "order/paid"),
          orderResponse("ORD-001", "6001", "order/reserved"),
        ],
        nextCursor: null,
      },
      response: { ok: true, status: 200 },
    });
    renderOrders();
    await screen.findByText("6002");

    const user = userEvent.setup();
    const table = screen.getByRole("table");
    await user.click(within(table).getByRole("button", { name: /order number/i }));

    const [firstRow, secondRow] = within(table).getAllByRole("row").slice(1);
    expect(within(firstRow!).getByText("6001")).toBeInTheDocument();
    expect(within(secondRow!).getByText("6002")).toBeInTheDocument();
  });

  it("filters rows client-side by status", async () => {
    getMock.mockResolvedValue({
      data: {
        items: [
          orderResponse("ORD-001", "6001", "order/reserved"),
          orderResponse("ORD-002", "6002", "order/paid"),
        ],
        nextCursor: null,
      },
      response: { ok: true, status: 200 },
    });
    renderOrders();
    await screen.findByText("6001");

    const user = userEvent.setup();
    await user.click(screen.getByRole("textbox", { name: /filter by status/i }));
    await user.click(await screen.findByRole("option", { name: "Paid", hidden: true }));

    await waitFor(() => expect(screen.queryByText("6001")).not.toBeInTheDocument());
    expect(screen.getByText("6002")).toBeInTheDocument();
  });

  it("navigates to order detail when a row is activated via the keyboard", async () => {
    getMock.mockResolvedValue({
      data: { items: [orderResponse("ORD-001", "6001", "order/reserved")], nextCursor: null },
      response: { ok: true, status: 200 },
    });
    renderOrders();
    const row = await screen.findByText("6001").then((cell) => cell.closest("tr") as HTMLTableRowElement);

    const user = userEvent.setup();
    row.focus();
    await user.keyboard("{Enter}");

    expect(await screen.findByText("Order detail page")).toBeInTheDocument();
  });
});
