import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";
import { createTestQueryClient, TestProviders } from "../test-utils";
const getMock = vi.fn(); const putMock = vi.fn();
vi.mock("../api", () => ({ apiClient: { GET: (...a: unknown[]) => getMock(...a), PUT: (...a: unknown[]) => putMock(...a) }, queryClient: { invalidateQueries: vi.fn() } }));
const { default: Route } = await import("./order-detail");
const order = { entityId: "ORD-001", entityKind: "OrderItem", schemaVersion: 1, type: "order/header", properties: { orderNumber: "6001", orderStatusCode: "order/reserved" } };
const detail = { order, customerRoleId: "PER-1-C", customerPersonId: "PER-1", customerDisplayName: "Ada Kern", positions: [{ positionId: "POS-1", productId: null, stockItemId: null, travellers: [{ roleId: "PER-2-T", personId: "PER-2", displayName: "Emil Brandt" }] }] };
function mount() { const Stub = createRoutesStub([{ path: "/orders/:orderId", Component: () => <TestProviders client={createTestQueryClient()}><Route/></TestProviders> }]); return render(<Stub initialEntries={["/orders/ORD-001"]}/>); }
afterEach(() => { cleanup(); getMock.mockReset(); putMock.mockReset(); });
describe("OrderDetailRoute", () => {
  it("renders header, types, and the three hierarchy rows", async () => { getMock.mockResolvedValue({ data: detail, response: { ok: true, status: 200 } }); mount(); expect(await screen.findByRole("heading", { name: /order 6001/i })).toBeInTheDocument(); expect(screen.getByText("order/header")).toBeInTheDocument(); expect(screen.getAllByText("Customer hierarchy")).toHaveLength(2); expect(screen.getByText("Service hierarchy")).toBeInTheDocument(); expect(screen.getByText("Traveller hierarchy")).toBeInTheDocument(); expect(screen.getByRole("link", { name: /emil brandt · traveller/i })).toHaveAttribute("href", "/persons?detail=PER-2&role=PER-2-T"); });
  it("edits status only after opening the edit form", async () => { getMock.mockResolvedValue({ data: detail, response: { ok: true, status: 200 } }); putMock.mockResolvedValue({ data: order, response: { ok: true, status: 200 } }); mount(); const user = userEvent.setup(); await user.click(await screen.findByRole("button", { name: "Edit order" })); await user.click(screen.getByRole("textbox", { name: "Order status" })); await user.click(await screen.findByRole("option", { name: "Paid", hidden: true })); await user.click(screen.getByRole("button", { name: "Save changes" })); expect(putMock).toHaveBeenCalledWith("/orders/{order_id}", expect.objectContaining({ body: { properties: { orderNumber: "6001", orderStatusCode: "order/paid" } } })); });
  it("gives each traveller on a position its own hierarchy row instead of crowding every chip into one row", async () => {
    const multiTravellerDetail = { ...detail, positions: [{ positionId: "POS-1", productId: null, stockItemId: null, travellers: [
      { roleId: "PER-2-T", personId: "PER-2", displayName: "Liv Vogel" },
      { roleId: "PER-3-T", personId: "PER-3", displayName: "Jan Vogel" },
      { roleId: "PER-4-T", personId: "PER-4", displayName: "Mia Vogel" },
      { roleId: "PER-5-T", personId: "PER-5", displayName: "Lin Vogel" },
    ] }] };
    getMock.mockResolvedValue({ data: multiTravellerDetail, response: { ok: true, status: 200 } });
    mount();
    expect(await screen.findByRole("link", { name: "Liv Vogel · traveller" })).toBeInTheDocument();
    const travellerRowLabels = await screen.findAllByText("Traveller hierarchy");
    expect(travellerRowLabels).toHaveLength(4);
    for (const name of ["Liv Vogel", "Jan Vogel", "Mia Vogel", "Lin Vogel"]) {
      expect(screen.getByRole("link", { name: `${name} · traveller` })).toBeInTheDocument();
    }
  });
});
