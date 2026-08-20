import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoutesStub } from "react-router";

import { createTestQueryClient, TestProviders } from "../test-utils";

const postMock = vi.fn();

vi.mock("../api", () => ({
  apiClient: { POST: (...args: unknown[]) => postMock(...args) },
  queryClient: { invalidateQueries: vi.fn() },
}));

const { default: ProductCreateRoute } = await import("./products.new");

function renderCreate() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/products/new",
      Component: () => (
        <TestProviders client={client}>
          <ProductCreateRoute />
        </TestProviders>
      ),
    },
    { path: "/products/:productId", Component: () => <div>Product detail page</div> },
    { path: "/products", Component: () => <div>Products list page</div> },
  ]);
  return render(<Stub initialEntries={["/products/new"]} />);
}

afterEach(() => {
  cleanup();
  postMock.mockReset();
});

describe("ProductCreateRoute (VIEW-S-003 create flow, issue #31 phase 2)", () => {
  it("creates a draft with no extra fields for an empty-product type, defaulting to draft lifecycle", async () => {
    postMock.mockResolvedValue({
      data: { entityId: "PRD-new", entityKind: "TouristicProductItem", type: "product/mobility/transfer", schemaVersion: 1, properties: {} },
      response: { ok: true, status: 201 },
    });
    renderCreate();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /create draft/i }));

    expect(await screen.findByText("Product detail page")).toBeInTheDocument();
    expect(postMock).toHaveBeenCalledWith(
      "/products",
      expect.objectContaining({
        body: expect.objectContaining({
          parentProductId: null,
          product: { type: "product/mobility/transfer", properties: { displayName: null, lifecycleStatusCode: "product/draft" } },
        }),
      })
    );
  });

  it("requires flight-specific fields when the selected type is Flight", async () => {
    renderCreate();
    const user = userEvent.setup();

    await user.click(screen.getByRole("textbox", { name: /^type/i }));
    await user.click(await screen.findByRole("option", { name: "airline/flight", hidden: true }));
    await user.click(screen.getByRole("button", { name: /create draft/i }));

    expect(await screen.findByText(/enter a flight number/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a departure location code/i)).toBeInTheDocument();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("creates a flight with its type-specific fields", async () => {
    postMock.mockResolvedValue({
      data: { entityId: "PRD-flight", entityKind: "TouristicProductItem", type: "product/airline/flight", schemaVersion: 1, properties: {} },
      response: { ok: true, status: 201 },
    });
    renderCreate();
    const user = userEvent.setup();

    await user.click(screen.getByRole("textbox", { name: /^type/i }));
    await user.click(await screen.findByRole("option", { name: "airline/flight", hidden: true }));

    await user.type(screen.getByLabelText(/flight number/i), "500");
    await user.type(screen.getByLabelText(/departure location code/i), "fra");
    await user.type(screen.getByLabelText(/arrival location code/i), "gig");
    const [departureTime, arrivalTime] = screen.getAllByLabelText(/scheduled (departure|arrival)/i);
    await user.type(departureTime!, "1030");
    await user.type(arrivalTime!, "1845");
    await user.click(screen.getByRole("button", { name: /create draft/i }));

    expect(await screen.findByText("Product detail page")).toBeInTheDocument();
    expect(postMock).toHaveBeenCalledWith(
      "/products",
      expect.objectContaining({
        body: expect.objectContaining({
          product: {
            type: "product/airline/flight",
            properties: expect.objectContaining({
              flightNumber: "500",
              departureLocationCode: "FRA",
              arrivalLocationCode: "GIG",
              lifecycleStatusCode: "product/draft",
            }),
          },
        }),
      })
    );
  });

  it("shows an error banner when creation fails", async () => {
    postMock.mockResolvedValue({
      error: { type: "validation_failed", title: "Invalid product", detail: "properties are invalid." },
      response: { ok: false, status: 422 },
    });
    renderCreate();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /create draft/i }));

    expect(await screen.findByText("Invalid product")).toBeInTheDocument();
  });
});
