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

const { default: PersonCreateRoute } = await import("./persons.new");

function renderCreate() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/persons/new",
      Component: () => (
        <TestProviders client={client}>
          <PersonCreateRoute />
        </TestProviders>
      ),
    },
    { path: "/persons/:personId", Component: () => <div>Person detail page</div> },
    { path: "/persons", Component: () => <div>Persons list page</div> },
  ]);
  return render(<Stub initialEntries={["/persons/new"]} />);
}

afterEach(() => {
  cleanup();
  postMock.mockReset();
});

describe("PersonCreateRoute (VIEW-S-002 create flow, issue #29 phase 2)", () => {
  it("shows validation errors and does not submit when required fields are missing", async () => {
    renderCreate();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /create person/i }));

    expect(await screen.findByText(/enter a given name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a family name/i)).toBeInTheDocument();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("creates the person and its initial role, then navigates to the person detail page", async () => {
    postMock.mockImplementation((path: string) => {
      if (path === "/persons") {
        return Promise.resolve({ data: { entityId: "irrelevant" }, response: { ok: true, status: 201 } });
      }
      if (path === "/persons/{person_id}/roles") {
        return Promise.resolve({ data: { entityId: "irrelevant-role" }, response: { ok: true, status: 201 } });
      }
      throw new Error(`Unexpected POST path: ${path}`);
    });
    renderCreate();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/given name/i), "Casey");
    await user.type(screen.getByLabelText(/family name/i), "Example");
    await user.click(screen.getByRole("button", { name: /create person/i }));

    expect(await screen.findByText("Person detail page")).toBeInTheDocument();
    expect(postMock).toHaveBeenCalledWith(
      "/persons",
      expect.objectContaining({
        body: { entityId: expect.any(String), properties: { givenName: "Casey", familyName: "Example", addressLocalityName: null } },
      })
    );
    expect(postMock).toHaveBeenCalledWith(
      "/persons/{person_id}/roles",
      expect.objectContaining({
        body: expect.objectContaining({ role: { type: "person/customer", properties: { paymentMethodCode: null, roleStatusCode: "role/active" } } }),
      })
    );
  });

  it("shows a retry option when the person is created but the initial role fails", async () => {
    postMock.mockImplementation((path: string) => {
      if (path === "/persons") {
        return Promise.resolve({ data: { entityId: "irrelevant" }, response: { ok: true, status: 201 } });
      }
      return Promise.resolve({
        error: { type: "unknown", title: "Server error", detail: "Something went wrong." },
        response: { ok: false, status: 500 },
      });
    });
    renderCreate();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/given name/i), "Casey");
    await user.type(screen.getByLabelText(/family name/i), "Example");
    await user.click(screen.getByRole("button", { name: /create person/i }));

    expect(await screen.findByText(/person created, but the initial role could not be added/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry adding role/i })).toBeInTheDocument();
  });

  it("shows an error banner when creating the person itself fails", async () => {
    postMock.mockResolvedValue({
      error: { type: "validation_failed", title: "Invalid person", detail: "givenName is invalid." },
      response: { ok: false, status: 422 },
    });
    renderCreate();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/given name/i), "Casey");
    await user.type(screen.getByLabelText(/family name/i), "Example");
    await user.click(screen.getByRole("button", { name: /create person/i }));

    expect(await screen.findByText("Invalid person")).toBeInTheDocument();
  });
});
