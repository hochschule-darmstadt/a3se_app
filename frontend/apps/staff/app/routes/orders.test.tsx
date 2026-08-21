import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";
import { createTestQueryClient, TestProviders } from "../test-utils";
const getMock = vi.fn();
vi.mock("../api", () => ({ apiClient: { GET: (...a: unknown[]) => getMock(...a) }, queryClient: { invalidateQueries: vi.fn() } }));
const { default: Route } = await import("./orders");
const summary = { entityId: "ORD-001", entityKind: "OrderItem", schemaVersion: 1, type: "order/header", properties: { orderNumber: "6001", orderStatusCode: "order/reserved" }, customerPersonId: "PER-1", customerDisplayName: "Ada Kern", positionCount: 2, unresolvedPositionCount: 1, serviceDateFrom: "2027-01-08", serviceDateTo: "2027-01-10" };
function mount() { const Stub = createRoutesStub([{ path: "/orders", Component: () => <TestProviders client={createTestQueryClient()}><Route/></TestProviders> }]); return render(<Stub initialEntries={["/orders"]}/>); }
afterEach(() => { cleanup(); getMock.mockReset(); });
describe("OrdersRoute", () => {
  it("renders server summaries in a split pane", async () => { getMock.mockResolvedValue({ data: { items: [summary], nextCursor: null }, response: { ok: true, status: 200 } }); mount(); expect(await screen.findByText("Order 6001")).toBeInTheDocument(); expect(screen.getByText("Ada Kern")).toBeInTheDocument(); expect(screen.getByText("2 (1 unresolved)")).toBeInTheDocument(); expect(screen.getByText("No order selected")).toBeInTheDocument(); });
  it("sends status filtering to the API", async () => { getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } }); mount(); const user = userEvent.setup(); await user.click(screen.getByRole("textbox", { name: "Status" })); await user.click(await screen.findByRole("option", { name: "Paid", hidden: true })); await waitFor(() => expect(getMock).toHaveBeenLastCalledWith("/orders", expect.objectContaining({ params: { query: expect.objectContaining({ status: "order/paid" }) } }))); });
  it("opens add functionality in the right pane", async () => { getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } }); mount(); await userEvent.setup().click(await screen.findByRole("button", { name: "Add order" })); expect(screen.getByRole("heading", { name: "Add order" })).toBeInTheDocument(); expect(screen.getByRole("textbox", { name: "Customer role ID" })).toBeInTheDocument(); });
  it("sends product-type filtering to the API", async () => { getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } }); mount(); const user = userEvent.setup(); await user.click(await screen.findByRole("textbox", { name: "Product type" })); await user.click(await screen.findByRole("option", { name: "accommodation/room-type", hidden: true })); await waitFor(() => expect(getMock).toHaveBeenLastCalledWith("/orders", expect.objectContaining({ params: { query: expect.objectContaining({ productType: "product/accommodation/room-type" }) } }))); });
  it("expands an order to reveal its positions, showing an unresolved one distinctly", async () => {
    getMock.mockImplementation((path: string) => {
      if (path === "/orders") return Promise.resolve({ data: { items: [summary], nextCursor: null }, response: { ok: true, status: 200 } });
      if (path === "/orders/{order_id}/detail") return Promise.resolve({ data: { order: { entityId: "ORD-001", entityKind: "OrderItem", type: "order/header", schemaVersion: 1, properties: summary.properties }, customerRoleId: "PER-1-CUSTOMER", customerPersonId: "PER-1", customerDisplayName: "Ada Kern", positions: [{ positionId: "ORD-001-P1", stockItemId: "STK-1", productId: "FLT-01", travellers: [] }, { positionId: "ORD-001-P2", stockItemId: null, productId: null, travellers: [] }] }, response: { ok: true, status: 200 } });
      if (path === "/stock-items/{stock_item_id}") return Promise.resolve({ data: { entityId: "STK-1", entityKind: "StockItem", schemaVersion: 1, availabilityState: "available", availableQuantity: 1, productId: "FLT-01", productType: "product/airline/flight", productDisplayName: "Flight 01", productDisplayNameChain: ["Flight 01"], productAncestors: [], properties: { serviceDate: "2027-01-08" } }, response: { ok: true, status: 200 } });
      throw new Error(`Unexpected GET path: ${path}`);
    });
    mount();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /expand order 6001/i }));
    expect(await screen.findByText("Flight 01 · 2027-01-08")).toBeInTheDocument();
    expect(await screen.findByText("Unresolved")).toBeInTheDocument();
  });
  it("opens a position's own detail in the right pane when its tree row is selected", async () => {
    getMock.mockImplementation((path: string) => {
      if (path === "/orders") return Promise.resolve({ data: { items: [summary], nextCursor: null }, response: { ok: true, status: 200 } });
      if (path === "/orders/{order_id}/detail") return Promise.resolve({ data: { order: { entityId: "ORD-001", entityKind: "OrderItem", type: "order/header", schemaVersion: 1, properties: summary.properties }, customerRoleId: "PER-1-CUSTOMER", customerPersonId: "PER-1", customerDisplayName: "Ada Kern", positions: [{ positionId: "ORD-001-P1", stockItemId: "STK-1", productId: "FLT-01", travellers: [] }, { positionId: "ORD-001-P2", stockItemId: null, productId: null, travellers: [] }] }, response: { ok: true, status: 200 } });
      if (path === "/stock-items/{stock_item_id}") return Promise.resolve({ data: { entityId: "STK-1", entityKind: "StockItem", schemaVersion: 1, availabilityState: "available", availableQuantity: 1, productId: "FLT-01", productType: "product/airline/flight", productDisplayName: "Flight 01", productDisplayNameChain: ["Flight 01"], productAncestors: [], properties: { serviceDate: "2027-01-08" } }, response: { ok: true, status: 200 } });
      throw new Error(`Unexpected GET path: ${path}`);
    });
    mount();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /expand order 6001/i }));
    await user.click(await screen.findByText("Flight 01 · 2027-01-08"));
    expect(await screen.findByRole("heading", { level: 1, name: "Flight 01 · 2027-01-08" })).toBeInTheDocument();
  });
});
