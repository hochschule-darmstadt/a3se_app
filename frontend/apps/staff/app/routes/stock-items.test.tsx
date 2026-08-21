import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";

import { createTestQueryClient, TestProviders } from "../test-utils";

const getMock = vi.fn();
vi.mock("../api", () => ({ apiClient: { GET: (...args: unknown[]) => getMock(...args), POST: vi.fn() }, queryClient: { invalidateQueries: vi.fn() } }));
const { default: StockItemsRoute } = await import("./stock-items");
const { STOCK_TYPES, STOCK_TYPE_OPTIONS } = await import("../lib/stock-create-panel");

function item(id: string, name: string, state: "available" | "held") {
  return { entityId: id, entityKind: "StockItem", type: "stock/mobility/transfer", schemaVersion: 1, productId: `PRD-${id}`, productType: "product/mobility/transfer", productDisplayName: name, productDisplayNameChain: ["Example Mobility", "Mobility", name], productAncestors: [], supplierRole: null, supplierOrganisationId: "ORG-1", supplierDisplayName: "Example Mobility", availableQuantity: state === "available" ? 4 : 2, availabilityState: state, properties: { serviceDate: "2027-05-12", unitPriceAmount: "50.00", currencyCode: "EUR", capacityQuantity: 5, heldQuantity: state === "held" ? 1 : 0, allocatedQuantity: 1, inventoryStatusCode: "inventory/active" } };
}
function renderRoute() { const client = createTestQueryClient(); const Stub = createRoutesStub([{ path: "/stock-items", Component: () => <TestProviders client={client}><StockItemsRoute /></TestProviders> }, { path: "/stock-items/:id", Component: () => <div>Stock detail</div> }]); return render(<Stub initialEntries={["/stock-items"]} />); }
afterEach(() => { cleanup(); getMock.mockReset(); });

describe("StockItemsRoute", () => {
  it("offers only product-aligned stock types with slash-separated labels", () => {
    expect(STOCK_TYPES).toContain("stock/accommodation/room-type/room");
    expect(STOCK_TYPES).toContain("stock/airline/flight/seat");
    expect(STOCK_TYPES).toContain("stock/water-transport/day-boat");
    expect(STOCK_TYPE_OPTIONS.find(({ value }) => value === "stock/airline/flight/seat")?.label).toBe("airline/flight/seat");
  });
  it("renders availability and keeps procurement deferred", async () => { getMock.mockResolvedValue({ data: { items: [item("STK-1", "Airport transfer", "available")], nextCursor: null }, response: { ok: true, status: 200 } }); renderRoute(); expect(await screen.findByText(/airport transfer/i)).toBeInTheDocument(); expect(screen.getByRole("button", { name: /request supplier capacity/i })).toBeDisabled(); expect(screen.getByText("4")).toBeInTheDocument(); });
  it("sends search to the API instead of filtering the current page", async () => { getMock.mockImplementation((_path: string, options: { params: { query: { search?: string } } }) => Promise.resolve({ data: { items: options.params.query.search ? [item("STK-2", "Rail connection", "held")] : [item("STK-1", "Airport transfer", "available")], nextCursor: null }, response: { ok: true, status: 200 } })); renderRoute(); await screen.findByText(/airport transfer/i); await userEvent.type(screen.getByRole("textbox", { name: /^search$/i }), "rail"); await waitFor(() => expect(getMock).toHaveBeenLastCalledWith("/stock-items", expect.objectContaining({ params: { query: expect.objectContaining({ search: "rail" }) } }))); expect(await screen.findByText(/rail connection/i)).toBeInTheDocument(); });
  it("opens create functionality in the right pane", async () => { getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } }); renderRoute(); await userEvent.click(await screen.findByRole("button", { name: /add stock entry/i })); expect(screen.getByRole("form", { name: /add stock entry/i })).toBeInTheDocument(); expect(screen.getByRole("heading", { name: /inventory/i })).toBeInTheDocument(); });
  it("opens the root-to-leaf display-name chain with date last", async () => { const stock = item("STK-1", "Airport transfer", "available"); getMock.mockImplementation((path: string) => Promise.resolve({ data: path.includes("{stock_item_id}") ? stock : { items: [stock], nextCursor: null }, response: { ok: true, status: 200 } })); renderRoute(); const chain = await screen.findByText("Example Mobility · Mobility · Airport transfer · 2027-05-12"); await userEvent.click(chain); expect(await screen.findByRole("heading", { level: 2, name: "Example Mobility · Mobility · Airport transfer · 2027-05-12" })).toBeInTheDocument(); expect(screen.getByText("stock/mobility/transfer")).toBeInTheDocument(); expect(screen.queryByText(/^Product$/)).not.toBeInTheDocument(); expect(screen.queryByText(/^Supplier$/)).not.toBeInTheDocument(); expect(screen.getByRole("button", { name: /edit stock entry/i })).toBeInTheDocument(); expect(screen.queryByRole("button", { name: /allocate to order/i })).not.toBeInTheDocument(); expect(screen.queryByRole("button", { name: /withdraw capacity/i })).not.toBeInTheDocument(); });
  it("shows loading and empty states", async () => { getMock.mockResolvedValue({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } }); renderRoute(); expect(await screen.findByText(/no stock entries match/i)).toBeInTheDocument(); });
});
