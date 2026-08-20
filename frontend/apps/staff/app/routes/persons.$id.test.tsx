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

const { default: PersonDetailRoute } = await import("./persons.$id");

const personData = {
  entityId: "PER-001",
  entityKind: "Person",
  schemaVersion: 1,
  properties: { givenName: "Casey", familyName: "Example", addressLocalityName: "Springfield" },
};

const customerRole = {
  entityId: "ROLE-1",
  entityKind: "PersonRole",
  type: "person/customer",
  schemaVersion: 1,
  properties: { roleStatusCode: "role/active", paymentMethodCode: "payment/paypal" },
};

function mockGetImplementation(personResult: unknown, rolesResult: unknown) {
  getMock.mockImplementation((path: string) => {
    if (path === "/persons/{person_id}") return Promise.resolve(personResult);
    if (path === "/persons/{person_id}/roles") return Promise.resolve(rolesResult);
    throw new Error(`Unexpected GET path: ${path}`);
  });
}

function renderDetail() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/persons/:personId",
      Component: () => (
        <TestProviders client={client}>
          <PersonDetailRoute />
        </TestProviders>
      ),
    },
  ]);
  return render(<Stub initialEntries={["/persons/PER-001"]} />);
}

afterEach(() => {
  cleanup();
  getMock.mockReset();
  putMock.mockReset();
  postMock.mockReset();
});

describe("PersonDetailRoute (VIEW-S-002, issue #29 phase 2)", () => {
  it("shows a loading state before data arrives", () => {
    getMock.mockReturnValue(new Promise(() => {}));
    renderDetail();
    expect(screen.getByText(/loading person/i)).toBeInTheDocument();
  });

  it("renders the person's shared fields and each role with its status", async () => {
    mockGetImplementation(
      { data: personData, response: { ok: true, status: 200 } },
      { data: [customerRole], response: { ok: true, status: 200 } }
    );
    renderDetail();

    expect(await screen.findByRole("heading", { level: 1, name: "Casey Example" })).toBeInTheDocument();
    expect(screen.getByText("Springfield")).toBeInTheDocument();
    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText(/payment method: paypal/i)).toBeInTheDocument();
  });

  it("edits the person's shared fields separately from role fields", async () => {
    mockGetImplementation(
      { data: personData, response: { ok: true, status: 200 } },
      { data: [customerRole], response: { ok: true, status: 200 } }
    );
    putMock.mockResolvedValue({
      data: { ...personData, properties: { ...personData.properties, familyName: "Updated" } },
      response: { ok: true, status: 200 },
    });
    renderDetail();
    await screen.findByRole("heading", { level: 1, name: "Casey Example" });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Edit person" }));
    const familyNameInput = screen.getByLabelText(/family name/i);
    await user.clear(familyNameInput);
    await user.type(familyNameInput, "Updated");
    await user.click(screen.getByRole("button", { name: /update person details/i }));

    expect(putMock).toHaveBeenCalledWith(
      "/persons/{person_id}",
      expect.objectContaining({
        params: { path: { person_id: "PER-001" } },
        body: { properties: { givenName: "Casey", familyName: "Updated", addressLocalityName: "Springfield" } },
      })
    );
  });

  it("deactivates a role via a status-changing PUT rather than deleting it", async () => {
    mockGetImplementation(
      { data: personData, response: { ok: true, status: 200 } },
      { data: [customerRole], response: { ok: true, status: 200 } }
    );
    putMock.mockResolvedValue({
      data: { ...customerRole, properties: { ...customerRole.properties, roleStatusCode: "role/inactive" } },
      response: { ok: true, status: 200 },
    });
    renderDetail();
    await screen.findByRole("heading", { level: 1, name: "Casey Example" });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /deactivate customer/i }));

    expect(putMock).toHaveBeenCalledWith(
      "/persons/{person_id}/roles/{role_id}",
      expect.objectContaining({
        params: { path: { person_id: "PER-001", role_id: "ROLE-1" } },
        body: { role: { type: "person/customer", properties: { paymentMethodCode: "payment/paypal", roleStatusCode: "role/inactive" } } },
      })
    );
  });

  it("offers to add a traveller role when the person does not already have one", async () => {
    mockGetImplementation(
      { data: personData, response: { ok: true, status: 200 } },
      { data: [customerRole], response: { ok: true, status: 200 } }
    );
    postMock.mockResolvedValue({ data: { entityId: "ROLE-2" }, response: { ok: true, status: 201 } });
    renderDetail();
    await screen.findByRole("heading", { level: 1, name: "Casey Example" });

    expect(screen.queryByRole("button", { name: /add customer role/i })).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add traveller role/i }));
    await user.click(screen.getByRole("button", { name: "Add role" }));

    expect(postMock).toHaveBeenCalledWith(
      "/persons/{person_id}/roles",
      expect.objectContaining({
        params: { path: { person_id: "PER-001" } },
        body: expect.objectContaining({ role: { type: "person/traveller", properties: { roleStatusCode: "role/active" } } }),
      })
    );
  });
});
