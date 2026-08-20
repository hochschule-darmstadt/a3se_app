import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";

import { createTestQueryClient, TestProviders } from "../test-utils";

const getMock = vi.fn();
const putMock = vi.fn();
const postMock = vi.fn();

vi.mock("../api", () => ({
  apiClient: {
    GET: (...args: unknown[]) => getMock(...args),
    PUT: (...args: unknown[]) => putMock(...args),
    POST: (...args: unknown[]) => postMock(...args),
  },
  queryClient: { invalidateQueries: vi.fn() },
}));

const { default: ProductDetailRoute } = await import("./products.$id");

const flightProduct = {
  entityId: "PRD-001",
  entityKind: "TouristicProductItem",
  type: "product/airline/flight",
  schemaVersion: 1,
  properties: {
    displayName: "Return flight",
    lifecycleStatusCode: "product/draft",
    flightNumber: "500",
    departureLocationCode: "FRA",
    arrivalLocationCode: "GIG",
    scheduledDepartureLocalTime: "10:30:00",
    scheduledArrivalLocalTime: "18:45:00",
    aircraftTypeDesignator: null,
  },
};

function mockGetImplementation(productResult: unknown, componentsResult: unknown, supplierResult: unknown) {
  const emptyOk = { data: [], response: { ok: true, status: 200 } };
  const nullOk = { data: null, response: { ok: true, status: 200 } };
  getMock.mockImplementation((path: string) => {
    if (path === "/products/{product_id}") return Promise.resolve(productResult);
    if (path === "/products/{product_id}/components") return Promise.resolve(componentsResult);
    if (path === "/products/{product_id}/supplier") return Promise.resolve(supplierResult);
    if (path === "/products/{product_id}/ancestors") return Promise.resolve(emptyOk);
    if (path === "/organisations/roles/{role_id}/organisation") return Promise.resolve(nullOk);
    throw new Error(`Unexpected GET path: ${path}`);
  });
}

function renderDetail() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/products/:productId",
      Component: () => (
        <TestProviders client={client}>
          <ProductDetailRoute />
        </TestProviders>
      ),
    },
  ]);
  return render(<Stub initialEntries={["/products/PRD-001"]} />);
}

afterEach(() => {
  cleanup();
  getMock.mockReset();
  putMock.mockReset();
  postMock.mockReset();
});

describe("ProductDetailRoute (VIEW-S-003, issue #31 phase 2)", () => {
  it("shows a loading state before data arrives", () => {
    getMock.mockReturnValue(new Promise(() => {}));
    renderDetail();
    expect(screen.getByText(/loading product/i)).toBeInTheDocument();
  });

  it("renders the product's type-specific fields and lifecycle status", async () => {
    mockGetImplementation(
      { data: flightProduct, response: { ok: true, status: 200 } },
      { data: [flightProduct], response: { ok: true, status: 200 } },
      { data: null, response: { ok: true, status: 200 } }
    );
    renderDetail();

    expect(await screen.findByRole("heading", { level: 1, name: "Return flight" })).toBeInTheDocument();
    expect(screen.getByText("airline/flight")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText(/no supplier set/i)).toBeInTheDocument();
  });

  it("activates a draft via a status-changing PUT rather than a version bump", async () => {
    mockGetImplementation(
      { data: flightProduct, response: { ok: true, status: 200 } },
      { data: [flightProduct], response: { ok: true, status: 200 } },
      { data: null, response: { ok: true, status: 200 } }
    );
    putMock.mockResolvedValue({
      data: { ...flightProduct, properties: { ...flightProduct.properties, lifecycleStatusCode: "product/active" } },
      response: { ok: true, status: 200 },
    });
    renderDetail();
    await screen.findByRole("heading", { level: 1, name: "Return flight" });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Activate" }));

    expect(putMock).toHaveBeenCalledWith(
      "/products/{product_id}",
      expect.objectContaining({
        params: { path: { product_id: "PRD-001" } },
        body: {
          product: {
            type: "product/airline/flight",
            properties: expect.objectContaining({ lifecycleStatusCode: "product/active", flightNumber: "500" }),
          },
        },
      })
    );
  });

  it("shows the supplying role when one is set", async () => {
    mockGetImplementation(
      { data: flightProduct, response: { ok: true, status: 200 } },
      { data: [flightProduct], response: { ok: true, status: 200 } },
      {
        data: { entityId: "SUP-AIR-01-ROLE", entityKind: "OrgaRole", type: "organisation/airline", schemaVersion: 1, properties: { airlineDesignator: "0Q", roleStatusCode: "role/active" } },
        response: { ok: true, status: 200 },
      }
    );
    renderDetail();

    expect(await screen.findByText(/organisation\/airline · SUP-AIR-01-ROLE/)).toBeInTheDocument();
  });

  it("sets a supplier by ID", async () => {
    mockGetImplementation(
      { data: flightProduct, response: { ok: true, status: 200 } },
      { data: [flightProduct], response: { ok: true, status: 200 } },
      { data: null, response: { ok: true, status: 200 } }
    );
    putMock.mockResolvedValue({ response: { ok: true, status: 204 } });
    renderDetail();
    await screen.findByRole("heading", { level: 1, name: "Return flight" });

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/supplier role id/i), "SUP-AIR-01-ROLE");
    await user.click(screen.getByRole("button", { name: "Set supplier" }));

    expect(putMock).toHaveBeenCalledWith(
      "/products/{product_id}/supplier",
      expect.objectContaining({
        params: { path: { product_id: "PRD-001" } },
        body: { supplierRoleId: "SUP-AIR-01-ROLE" },
      })
    );
  });
});
