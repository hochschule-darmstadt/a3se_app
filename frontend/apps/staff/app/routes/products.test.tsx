import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";

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

function renderProducts() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: () => (
        <TestProviders client={client}>
          <ProductsRoute />
        </TestProviders>
      ),
    },
    { path: "/products/new", Component: () => <div>Create product page</div> },
    { path: "/products/:productId", Component: () => <div>Product detail page</div> },
  ]);
  return render(<Stub initialEntries={["/products"]} />);
}

function productResponse(entityId: string, type: string, displayName: string | null, lifecycleStatusCode: string) {
  return {
    entityId,
    entityKind: "TouristicProductItem",
    type,
    schemaVersion: 1,
    properties: { displayName, lifecycleStatusCode },
  };
}

function mockGetImplementation(
  productsResult: { data?: { items: ReturnType<typeof productResponse>[]; nextCursor: string | null }; response: unknown },
  supplierByProduct: Record<string, unknown> = {}
) {
  getMock.mockImplementation((path: string, options?: { params?: { path?: { product_id?: string } } }) => {
    if (path === "/products") return Promise.resolve(productsResult);
    const productId = options?.params?.path?.product_id as string | undefined;
    if (path === "/products/{product_id}/supplier") {
      return Promise.resolve(supplierByProduct[productId as string] ?? { data: null, response: { ok: true, status: 200 } });
    }
    if (path === "/products/{product_id}") {
      const product = (productsResult.data?.items ?? []).find((item) => item.entityId === productId);
      return Promise.resolve({ data: product, response: { ok: true, status: 200 } });
    }
    if (path === "/products/{product_id}/components") {
      return Promise.resolve({ data: [], response: { ok: true, status: 200 } });
    }
    throw new Error(`Unexpected GET path: ${path}`);
  });
}

afterEach(() => {
  cleanup();
  getMock.mockReset();
  postMock.mockReset();
});

describe("ProductsRoute (VIEW-S-003, issue #31 phase 2)", () => {
  it("shows a loading state before data arrives", () => {
    getMock.mockReturnValue(new Promise(() => {}));
    renderProducts();
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it("shows an empty state when there are no products", async () => {
    mockGetImplementation({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } });
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

  it("renders products with a display-name label and lifecycle badge", async () => {
    mockGetImplementation({
      data: { items: [productResponse("PRD-001", "product/hotel/room-category", "Madeira walking week", "product/active")], nextCursor: null },
      response: { ok: true, status: 200 },
    });
    renderProducts();

    expect(await screen.findByText("Madeira walking week")).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(await within(table).findByText("Active")).toBeInTheDocument();
  });

  it("falls back to a type-derived label when displayName is unset", async () => {
    mockGetImplementation({
      data: { items: [productResponse("PRD-002", "product/mobility/transfer", null, "product/draft")], nextCursor: null },
      response: { ok: true, status: 200 },
    });
    renderProducts();

    expect(await screen.findByText("Mobility transfer (PRD-002)")).toBeInTheDocument();
  });

  it("filters rows client-side by search text", async () => {
    mockGetImplementation({
      data: {
        items: [
          productResponse("PRD-001", "product/hotel/room-category", "Madeira walking week", "product/active"),
          productResponse("PRD-002", "product/hotel/room-category", "Alpine ski week", "product/draft"),
        ],
        nextCursor: null,
      },
      response: { ok: true, status: 200 },
    });
    renderProducts();
    await screen.findByText("Madeira walking week");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/search/i), "Alpine");

    await waitFor(() => expect(screen.queryByText("Madeira walking week")).not.toBeInTheDocument());
    expect(screen.getByText("Alpine ski week")).toBeInTheDocument();
  });

  it("filters rows client-side by lifecycle status", async () => {
    mockGetImplementation({
      data: {
        items: [
          productResponse("PRD-001", "product/hotel/room-category", "Madeira walking week", "product/active"),
          productResponse("PRD-002", "product/hotel/room-category", "Alpine ski week", "product/draft"),
        ],
        nextCursor: null,
      },
      response: { ok: true, status: 200 },
    });
    renderProducts();
    await screen.findByText("Madeira walking week");
    await screen.findByText("Alpine ski week");

    const user = userEvent.setup();
    await user.click(screen.getByRole("textbox", { name: /lifecycle/i }));
    await user.click(await screen.findByRole("option", { name: "Draft", hidden: true }));

    await waitFor(() => expect(screen.queryByText("Madeira walking week")).not.toBeInTheDocument());
    expect(screen.getByText("Alpine ski week")).toBeInTheDocument();
  });

  it("shows the product's detail inline in the right pane when a row is activated, without navigating away", async () => {
    mockGetImplementation({
      data: { items: [productResponse("PRD-001", "product/hotel/room-category", "Madeira walking week", "product/active")], nextCursor: null },
      response: { ok: true, status: 200 },
    });
    renderProducts();
    const cell = await screen.findByText("Madeira walking week");

    const user = userEvent.setup();
    await user.click(cell);

    expect(await screen.findByRole("heading", { level: 1, name: "Madeira walking week" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Touristic product catalogue" })).toBeInTheDocument();
  });

  it("shows the create-product form inline in the right pane", async () => {
    mockGetImplementation({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } });
    renderProducts();
    await screen.findByText(/no products match these filters/i);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Create product draft" }));

    expect(screen.getByRole("heading", { level: 1, name: "Create product draft" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Touristic product catalogue" })).toBeInTheDocument();
  });
});
