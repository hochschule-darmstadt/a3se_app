import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";

import { createTestQueryClient, TestProviders } from "../test-utils";

const getMock = vi.fn();
vi.mock("../api", () => ({ apiClient: { GET: (...args: unknown[]) => getMock(...args), POST: vi.fn() }, queryClient: { invalidateQueries: vi.fn() } }));
const { default: StockItemsRoute } = await import("./stock-items");

function item(id: string, name: string, state: "available" | "held") {
  return { entityId: id, entityKind: "StockItem", type: "stock/mobility/transfer", schemaVersion: 1, productId: `PRD-${id}`, productType: "product/mobility/transfer", productDisplayName: name, productDisplayNameChain: ["Example Mobility", "Mobility", name], supplierOrganisationId: "ORG-1", supplierDisplayName: "Example Mobility", availableQuantity: state === "available" ? 4 : 2, availabilityState: state, properties: { serviceDate: "2027-05-12", unitPriceAmount: "50.00", currencyCode: "EUR", capacityQuantity: 5, heldQuantity: state === "held" ? 1 : 0, allocatedQuantity: 1, inventoryStatusCode: "inventory/active" } };
}
function renderRoute() { const client = createTestQueryClient(); const Stub = createRoutesStub([{ path: "/stock-items", Component: () => <TestProviders client={client}><StockItemsRoute /></TestProviders> }, { path: "/stock-items/:id", Component: () => <div>Stock detail</div> }]); return render(<Stub initialEntries={["/stock-items"]} />); }
afterEach(() => { cleanup(); getMock.mockReset(); });

describe("StockItemsRoute", () => {
  it("renders availability and keeps procurement deferred", async () => { getMock.mockResolvedValue({ data: { items: [item("STK-1", "Airport transfer", "available")], nextCursor: null }, response: { ok: true, status: 200 } }); renderRoute(); expect(await screen.findByText(/airport transfer/i)).toBeInTheDocument(); expect(screen.getByRole("button", { name: /request supplier capacity/i })).toBeDisabled(); expect(screen.getByText("4")).toBeInTheDocument(); });
  it("filters by product or supplier text", async () => { getMock.mockResolvedValue({ data: { items: [item("STK-1", "Airport transfer", "available"), item("STK-2", "Rail connection", "held")], nextCursor: null }, response: { ok: true, status: 200 } }); renderRoute(); await screen.findByText(/airport transfer/i); await userEvent.type(screen.getByRole("textbox", { name: /product or supplier/i }), "rail"); await waitFor(() => expect(screen.queryByText(/airport transfer/i)).not.toBeInTheDocument()); expect(screen.getByText(/rail connection/i)).toBeInTheDocument(); });
  it("shows loading and empty states", async () => { getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } }); renderRoute(); expect(await screen.findByText(/no stock entries match/i)).toBeInTheDocument(); });
});
