import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub, useLocation, useNavigate } from "react-router";

import { createTestQueryClient, TestProviders } from "../test-utils";

const getMock = vi.fn();
const postMock = vi.fn();

vi.mock("../api", () => ({
  apiClient: {
    GET: (...args: unknown[]) => getMock(...args),
    POST: (...args: unknown[]) => postMock(...args),
  },
  queryClient: { invalidateQueries: vi.fn() },
}));

const { default: ProductsRoute } = await import("./products");

function LocationProbe() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output aria-label="Current URL">{`${location.pathname}${location.search}`}</output>
      <button type="button" onClick={() => navigate(-1)}>Browser back</button>
    </>
  );
}

function renderProducts(initialEntry = "/products") {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: () => (
        <TestProviders client={client}>
          <ProductsRoute />
          <LocationProbe />
        </TestProviders>
      ),
    },
    { path: "/products/new", Component: () => <div>Create product page</div> },
    { path: "/products/:productId", Component: () => <div>Product detail page</div> },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

function productResponse(entityId: string, type: string, displayName: string, lifecycleStatusCode: string, displayNameChain = [displayName]) {
  return {
    entityId,
    entityKind: "TouristicProductItem",
    type,
    schemaVersion: 1,
    properties: { name: displayName, lifecycleStatusCode },
    displayName,
    displayNameChain,
  };
}

interface Fixture {
  readonly products: unknown[];
  readonly ancestorsByProduct?: Record<string, unknown[]>;
  readonly componentsByProduct?: Record<string, unknown[]>;
  readonly supplierByRoot?: Record<string, unknown>;
  readonly organisationByRole?: Record<string, unknown>;
}

function mockGetImplementation({ products, ancestorsByProduct = {}, componentsByProduct = {}, supplierByRoot = {}, organisationByRole = {} }: Fixture) {
  const productById = new Map(products.map((product) => [(product as { entityId: string }).entityId, product]));
  getMock.mockImplementation((path: string, options?: { params?: { path?: Record<string, string> } }) => {
    if (path === "/products") return Promise.resolve({ data: { items: products, nextCursor: null }, response: { ok: true, status: 200 } });
    const productId = options?.params?.path?.product_id;
    const roleId = options?.params?.path?.role_id;
    if (path === "/products/{product_id}") {
      return Promise.resolve({ data: productById.get(productId as string), response: { ok: true, status: 200 } });
    }
    if (path === "/products/{product_id}/components") {
      return Promise.resolve({ data: componentsByProduct[productId as string] ?? [], response: { ok: true, status: 200 } });
    }
    if (path === "/products/{product_id}/ancestors") {
      return Promise.resolve({ data: ancestorsByProduct[productId as string] ?? [], response: { ok: true, status: 200 } });
    }
    if (path === "/products/{product_id}/supplier") {
      return Promise.resolve({ data: supplierByRoot[productId as string] ?? null, response: { ok: true, status: 200 } });
    }
    if (path === "/organisations/roles/{role_id}/organisation") {
      return Promise.resolve({ data: organisationByRole[roleId as string] ?? null, response: { ok: true, status: 200 } });
    }
    throw new Error(`Unexpected GET path: ${path}`);
  });
}

afterEach(() => {
  cleanup();
  getMock.mockReset();
  postMock.mockReset();
});

describe("ProductsRoute (VIEW-S-003 tree view, issue #31 follow-up)", () => {
  it("shows a loading state before data arrives", () => {
    getMock.mockReturnValue(new Promise(() => {}));
    renderProducts();
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it("shows an empty state when there are no products", async () => {
    mockGetImplementation({ products: [] });
    renderProducts();
    expect(await screen.findByText(/no products match these filters/i)).toBeInTheDocument();
  });

  it("shows an error banner when the request fails", async () => {
    getMock.mockResolvedValue({
      error: { type: "unknown", title: "Server error", detail: "Something went wrong." },
      response: { ok: false, status: 500 },
    });
    renderProducts();
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });

  it("shows a root product's breadcrumb up to its supplying organisation", async () => {
    mockGetImplementation({
      products: [
        productResponse(
          "ACC-01",
          "product/accommodation/room-type",
          "Single room",
          "product/active",
          ["Southlight Stays", "Accommodation", "Single room"]
        ),
      ],
      supplierByRoot: {
        "ACC-01": { entityId: "SUP-ACC-01-ROLE", entityKind: "OrgaRole", type: "organisation/accommodation", schemaVersion: 1, properties: { roleStatusCode: "role/active" } },
      },
      organisationByRole: {
        "SUP-ACC-01-ROLE": { entityId: "SUP-ACC-01", entityKind: "Organisation", schemaVersion: 1, properties: { name: "Southlight Stays", addressLocalityName: "Lima" } },
      },
    });
    renderProducts();

    expect(await screen.findByText("Southlight Stays · Accommodation · Single room")).toBeInTheDocument();
  });

  it("uses the backend-computed label without an entity-ID fallback", async () => {
    mockGetImplementation({ products: [productResponse("PRD-002", "product/mobility/transfer", "Airport transfer", "product/draft")] });
    renderProducts();

    expect(await screen.findByText("Airport transfer")).toBeInTheDocument();
  });

  it("filters rows client-side by search text against the breadcrumb", async () => {
    mockGetImplementation({
      products: [
        productResponse("ACC-01", "product/accommodation/room-type", "Single Room", "product/active"),
        productResponse("ACC-02", "product/accommodation/room-type", "Double Room", "product/active"),
      ],
    });
    renderProducts();
    await screen.findByText(/single room \(ACC-01\)|Single Room/i);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/search/i), "Double");

    await waitFor(() => expect(screen.queryByText(/Single Room/)).not.toBeInTheDocument());
    expect(screen.getByText(/Double Room/)).toBeInTheDocument();
  });

  it("expands a matched row's own children on demand", async () => {
    mockGetImplementation({
      products: [
        productResponse("ACC-01", "product/accommodation/room-type", "Single Room", "product/active"),
        {
          entityId: "ACC-01-R1",
          entityKind: "TouristicProductItem",
          type: "product/accommodation/room-type/room",
          schemaVersion: 1,
          properties: { roomNumber: "0101" },
          displayName: "0101",
          displayNameChain: ["Single Room", "0101"],
        },
      ],
      ancestorsByProduct: {
        "ACC-01-R1": [productResponse("ACC-01", "product/accommodation/room-type", "Single Room", "product/active")],
      },
    });
    renderProducts();
    await screen.findByText(/Single Room/);

    expect(screen.queryByText("Single Room · 0101")).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /expand/i }));

    expect(await screen.findByText("Single Room · 0101")).toBeInTheDocument();
  });

  it("shows the product's detail inline in the right pane when a row is activated, without navigating away", async () => {
    mockGetImplementation({ products: [productResponse("PRD-001", "product/mobility/transfer", "Airport shuttle", "product/active")] });
    renderProducts();
    const row = await screen.findByText("Airport shuttle");

    const user = userEvent.setup();
    await user.click(row);

    expect(await screen.findByRole("heading", { level: 1, name: "Touristic product catalogue" })).toBeInTheDocument();
    expect(screen.getByLabelText("Current URL")).toHaveTextContent("/products?detail=PRD-001");
  });

  it("restores URL state after following a related-record link and navigating back", async () => {
    const airport = productResponse("PRD-001", "product/mobility/transfer", "Airport shuttle", "product/active");
    const harbour = productResponse("PRD-002", "product/mobility/transfer", "Harbour shuttle", "product/active");
    mockGetImplementation({
      products: [airport, harbour],
      componentsByProduct: { "PRD-001": [harbour] },
    });
    renderProducts("/products?q=Airport&detail=PRD-001");

    expect(await screen.findByDisplayValue("Airport")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 1, name: "Airport shuttle" })).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(await screen.findByRole("link", { name: "Harbour shuttle" }));
    expect(screen.getByLabelText("Current URL")).toHaveTextContent("/products?q=Airport&detail=PRD-002");
    expect(await screen.findByRole("heading", { level: 1, name: "Harbour shuttle" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Browser back" }));
    await waitFor(() => expect(screen.getByLabelText("Current URL")).toHaveTextContent("/products?q=Airport&detail=PRD-001"));
    expect(await screen.findByRole("heading", { level: 1, name: "Airport shuttle" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Airport")).toBeInTheDocument();
  });

  it("shows ancestor chips parent-first and preserves URL state when navigating to one", async () => {
    const root = productResponse("PRD-ROOT", "product/package", "Brazil Explorer", "product/active", ["Brazil Explorer"]);
    const parent = productResponse("PRD-PARENT", "product/airline/flight", "Outbound flight", "product/active", ["Brazil Explorer", "Outbound flight"]);
    const leaf = productResponse("PRD-LEAF", "product/airline/flight/seat", "12A", "product/active", ["Brazil Explorer", "Outbound flight", "12A"]);
    mockGetImplementation({
      products: [root, parent, leaf],
      ancestorsByProduct: { "PRD-LEAF": [root, parent], "PRD-PARENT": [root] },
      supplierByRoot: {
        "PRD-ROOT": {
          entityId: "ROLE-001",
          entityKind: "OrgaRole",
          type: "organisation/accommodation",
          schemaVersion: 1,
          properties: { roleStatusCode: "role/active" },
          displayName: "Accommodation",
          displayNameChain: ["Southlight Stays", "Accommodation"],
        },
      },
      organisationByRole: {
        "ROLE-001": {
          entityId: "ORG-001",
          entityKind: "Organisation",
          schemaVersion: 1,
          properties: { name: "Southlight Stays", addressLocalityName: "Lima" },
        },
      },
    });
    renderProducts("/products?q=flight&page=1&detail=PRD-LEAF");

    const hierarchy = await screen.findByRole("group", { name: "Product hierarchy" });
    const links = within(hierarchy).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Brazil Explorer · Outbound flight",
      "Brazil Explorer",
      "Southlight Stays · Accommodation",
      "Southlight Stays",
    ]);
    expect(links.every((link) => link.classList.contains("mantine-Badge-root"))).toBe(true);
    expect(links[2]).toHaveAttribute("href", "/organisations?detail=ORG-001#role-ROLE-001");
    expect(links[3]).toHaveAttribute("href", "/organisations?detail=ORG-001");

    const user = userEvent.setup();
    await user.click(links[0]!);
    expect(screen.getByLabelText("Current URL")).toHaveTextContent("/products?q=flight&page=1&detail=PRD-PARENT");
  });

  it("renders component links with the hierarchy chip presentation", async () => {
    const parent = productResponse("PRD-001", "product/mobility/transfer", "Airport shuttle", "product/active");
    const component = productResponse(
      "PRD-002",
      "product/mobility/transfer/leg",
      "Terminal leg",
      "product/active",
      ["Airport shuttle", "Terminal leg"]
    );
    mockGetImplementation({ products: [parent, component], componentsByProduct: { "PRD-001": [component] } });
    renderProducts("/products?detail=PRD-001");

    const link = await screen.findByRole("link", { name: "Airport shuttle · Terminal leg" });
    expect(link).toHaveClass("mantine-Badge-root");
  });

  it("paginates the list instead of rendering every match at once", async () => {
    const products = Array.from({ length: 25 }, (_, index) =>
      productResponse(`PRD-${String(index + 1).padStart(3, "0")}`, "product/mobility/transfer", `Transfer ${index + 1}`, "product/active")
    );
    mockGetImplementation({ products });
    renderProducts();
    await screen.findByText("Transfer 1");

    expect(screen.getByText("Products · 1–20 of 25")).toBeInTheDocument();
    expect(screen.getByText("Transfer 20")).toBeInTheDocument();
    expect(screen.queryByText("Transfer 21")).not.toBeInTheDocument();
    const nextButton = screen.getByRole("button", { name: /next page/i });
    expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();

    const user = userEvent.setup();
    await user.click(nextButton);

    expect(await screen.findByText("Transfer 21")).toBeInTheDocument();
    expect(screen.queryByText("Transfer 1")).not.toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });

  it("shows the create-product form inline in the right pane", async () => {
    mockGetImplementation({ products: [] });
    renderProducts();
    await screen.findByText(/no products match these filters/i);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Create product" }));

    expect(screen.getByRole("heading", { level: 1, name: "Create product" })).toBeInTheDocument();
  });
});
