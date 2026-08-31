import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";
import { createTestQueryClient, TestProviders } from "../test-utils";

const getMock = vi.fn();
const putMock = vi.fn();
vi.mock("../api", () => ({ apiClient: { GET: (...a: unknown[]) => getMock(...a), PUT: (...a: unknown[]) => putMock(...a) }, queryClient: { invalidateQueries: vi.fn() } }));
const { default: Route } = await import("./order-detail");
const { OrderPositionDetailPanel } = await import("../lib/order-position-detail-panel");
const order = { entityId: "ORD-001", entityKind: "OrderItem", schemaVersion: 1, type: "order/header", properties: { orderNumber: "6001", orderStatusCode: "order/reserved" } };
const stock = { entityId: "STOCK-1", productId: "PROD-1", productDisplayNameChain: ["Andes & Atlantic Guides", "Experience", "Hiking Activity"], productAncestors: [], supplierRole: null, supplierOrganisationId: null, supplierDisplayName: null, properties: { serviceDate: "2027-08-03" } };
const detail = { order, customerRoleId: "PER-1-C", customerPersonId: "PER-1", customerDisplayName: "Ada Kern", positions: [{ positionId: "POS-1", productId: null, stockItemId: "STOCK-1", travellers: [{ roleId: "PER-2-T", personId: "PER-2", displayName: "Emil Brandt" }] }] };
function mount() { const Stub = createRoutesStub([{ path: "/orders/:orderId", Component: () => <TestProviders client={createTestQueryClient()}><Route/></TestProviders> }]); return render(<Stub initialEntries={["/orders/ORD-001"]}/>); }
function mountPosition() { const Stub = createRoutesStub([{ path: "/orders/:orderId/positions/:positionId", Component: () => <TestProviders client={createTestQueryClient()}><OrderPositionDetailPanel orderId="ORD-001" positionId="POS-1"/></TestProviders> }]); return render(<Stub initialEntries={["/orders/ORD-001/positions/POS-1"]}/>); }
function mockDetailAndStock() { getMock.mockImplementation((path: string) => path === "/orders/{order_id}/detail" ? { data: detail, response: { ok: true, status: 200 } } : { data: stock, response: { ok: true, status: 200 } }); }
afterEach(() => { cleanup(); getMock.mockReset(); putMock.mockReset(); });

describe("OrderDetailRoute", () => {
  it("renders each position as a display-name chip on its own row", async () => { mockDetailAndStock(); mount(); expect(await screen.findByRole("link", { name: "Andes & Atlantic Guides · Experience · Hiking Activity · 2027-08-03" })).toHaveAttribute("href", "/orders?detail=ORD-001&position=POS-1"); });
  it("edits status only after opening the edit form", async () => { mockDetailAndStock(); putMock.mockResolvedValue({ data: order, response: { ok: true, status: 200 } }); mount(); const user = userEvent.setup(); await user.click(await screen.findByRole("button", { name: "Edit order" })); await user.click(screen.getByRole("textbox", { name: "Order status" })); await user.click(await screen.findByRole("option", { name: "Paid", hidden: true })); await user.click(screen.getByRole("button", { name: "Save changes" })); expect(putMock).toHaveBeenCalledWith("/orders/{order_id}", expect.objectContaining({ body: { properties: { orderNumber: "6001", orderStatusCode: "order/paid" } } })); });
  it("keeps traveller hierarchy details in the standalone position view", async () => { mockDetailAndStock(); mountPosition(); expect(await screen.findByRole("link", { name: /emil brandt.*traveller/i })).toBeInTheDocument(); });
});
