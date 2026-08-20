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

const { default: OrganisationCreateRoute } = await import("./organisations.new");

function renderCreate() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/organisations/new",
      Component: () => (
        <TestProviders client={client}>
          <OrganisationCreateRoute />
        </TestProviders>
      ),
    },
    { path: "/organisations/:organisationId", Component: () => <div>Organisation detail page</div> },
    { path: "/organisations", Component: () => <div>Organisations list page</div> },
  ]);
  return render(<Stub initialEntries={["/organisations/new"]} />);
}

afterEach(() => {
  cleanup();
  postMock.mockReset();
});

describe("OrganisationCreateRoute (VIEW-S-004 create flow, issue #30 phase 2)", () => {
  it("shows validation errors and does not submit when required fields are missing", async () => {
    renderCreate();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /create organisation/i }));

    expect(await screen.findByText(/enter a name/i)).toBeInTheDocument();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("creates the organisation and its initial role, then navigates to the organisation detail page", async () => {
    postMock.mockImplementation((path: string) => {
      if (path === "/organisations") {
        return Promise.resolve({ data: { entityId: "irrelevant" }, response: { ok: true, status: 201 } });
      }
      if (path === "/organisations/{organisation_id}/roles") {
        return Promise.resolve({ data: { entityId: "irrelevant-role" }, response: { ok: true, status: 201 } });
      }
      throw new Error(`Unexpected POST path: ${path}`);
    });
    renderCreate();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^name/i), "Example Garden Hotel");
    await user.click(screen.getByRole("button", { name: /create organisation/i }));

    expect(await screen.findByText("Organisation detail page")).toBeInTheDocument();
    expect(postMock).toHaveBeenCalledWith(
      "/organisations",
      expect.objectContaining({
        body: { entityId: expect.any(String), properties: { name: "Example Garden Hotel", addressLocalityName: null } },
      })
    );
    expect(postMock).toHaveBeenCalledWith(
      "/organisations/{organisation_id}/roles",
      expect.objectContaining({
        body: expect.objectContaining({ role: { type: "partner/supplier/hotel", properties: { roleStatusCode: "role/active" } } }),
      })
    );
  });

  it("requires an airline designator when the initial role is airline", async () => {
    renderCreate();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^name/i), "Condorleaf Air");
    await user.click(screen.getByRole("textbox", { name: /initial role/i }));
    await user.click(await screen.findByRole("option", { name: "Airline", hidden: true }));
    await user.click(screen.getByRole("button", { name: /create organisation/i }));

    expect(await screen.findByText(/enter an airline designator/i)).toBeInTheDocument();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("shows a retry option when the organisation is created but the initial role fails", async () => {
    postMock.mockImplementation((path: string) => {
      if (path === "/organisations") {
        return Promise.resolve({ data: { entityId: "irrelevant" }, response: { ok: true, status: 201 } });
      }
      return Promise.resolve({
        error: { type: "unknown", title: "Server error", detail: "Something went wrong." },
        response: { ok: false, status: 500 },
      });
    });
    renderCreate();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^name/i), "Example Garden Hotel");
    await user.click(screen.getByRole("button", { name: /create organisation/i }));

    expect(await screen.findByText(/organisation created, but the initial role could not be added/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry adding role/i })).toBeInTheDocument();
  });

  it("shows an error banner when creating the organisation itself fails", async () => {
    postMock.mockResolvedValue({
      error: { type: "validation_failed", title: "Invalid organisation", detail: "name is invalid." },
      response: { ok: false, status: 422 },
    });
    renderCreate();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^name/i), "Example Garden Hotel");
    await user.click(screen.getByRole("button", { name: /create organisation/i }));

    expect(await screen.findByText("Invalid organisation")).toBeInTheDocument();
  });
});
