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

const { default: OrganisationDetailRoute } = await import("./organisations.$id");

const organisationData = {
  entityId: "ORG-001",
  entityKind: "Organisation",
  schemaVersion: 1,
  properties: { name: "Example Garden Hotel", addressLocalityName: "Funchal" },
};

const airlineRole = {
  entityId: "ROLE-1",
  entityKind: "OrgaRole",
  type: "organisation/airline",
  schemaVersion: 1,
  properties: { roleStatusCode: "role/active", airlineDesignator: "0Q" },
};

function mockGetImplementation(organisationResult: unknown, rolesResult: unknown) {
  getMock.mockImplementation((path: string) => {
    if (path === "/organisations/{organisation_id}") return Promise.resolve(organisationResult);
    if (path === "/organisations/{organisation_id}/roles") return Promise.resolve(rolesResult);
    throw new Error(`Unexpected GET path: ${path}`);
  });
}

function renderDetail() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/organisations/:organisationId",
      Component: () => (
        <TestProviders client={client}>
          <OrganisationDetailRoute />
        </TestProviders>
      ),
    },
  ]);
  return render(<Stub initialEntries={["/organisations/ORG-001"]} />);
}

afterEach(() => {
  cleanup();
  getMock.mockReset();
  putMock.mockReset();
  postMock.mockReset();
});

describe("OrganisationDetailRoute (VIEW-S-004, issue #30 phase 2)", () => {
  it("shows a loading state before data arrives", () => {
    getMock.mockReturnValue(new Promise(() => {}));
    renderDetail();
    expect(screen.getByText(/loading organisation/i)).toBeInTheDocument();
  });

  it("renders the organisation's shared fields and each role with its status", async () => {
    mockGetImplementation(
      { data: organisationData, response: { ok: true, status: 200 } },
      { data: [airlineRole], response: { ok: true, status: 200 } }
    );
    renderDetail();

    expect(await screen.findByRole("heading", { level: 1, name: "Example Garden Hotel" })).toBeInTheDocument();
    expect(screen.getByText("Funchal")).toBeInTheDocument();
    expect(screen.getByText("Airline")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText(/airline designator: 0Q/i)).toBeInTheDocument();
  });

  it("edits the organisation's shared fields separately from role fields", async () => {
    mockGetImplementation(
      { data: organisationData, response: { ok: true, status: 200 } },
      { data: [airlineRole], response: { ok: true, status: 200 } }
    );
    putMock.mockResolvedValue({
      data: { ...organisationData, properties: { ...organisationData.properties, name: "Updated Hotel" } },
      response: { ok: true, status: 200 },
    });
    renderDetail();
    await screen.findByRole("heading", { level: 1, name: "Example Garden Hotel" });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Edit organisation" }));
    const nameInput = screen.getByLabelText(/^name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Hotel");
    await user.click(screen.getByRole("button", { name: /update organisation details/i }));

    expect(putMock).toHaveBeenCalledWith(
      "/organisations/{organisation_id}",
      expect.objectContaining({
        params: { path: { organisation_id: "ORG-001" } },
        body: { properties: { name: "Updated Hotel", addressLocalityName: "Funchal" } },
      })
    );
  });

  it("deactivates a role via a status-changing PUT rather than deleting it", async () => {
    mockGetImplementation(
      { data: organisationData, response: { ok: true, status: 200 } },
      { data: [airlineRole], response: { ok: true, status: 200 } }
    );
    putMock.mockResolvedValue({
      data: { ...airlineRole, properties: { ...airlineRole.properties, roleStatusCode: "role/inactive" } },
      response: { ok: true, status: 200 },
    });
    renderDetail();
    await screen.findByRole("heading", { level: 1, name: "Example Garden Hotel" });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /deactivate airline/i }));

    expect(putMock).toHaveBeenCalledWith(
      "/organisations/{organisation_id}/roles/{role_id}",
      expect.objectContaining({
        params: { path: { organisation_id: "ORG-001", role_id: "ROLE-1" } },
        body: { role: { type: "organisation/airline", properties: { airlineDesignator: "0Q", roleStatusCode: "role/inactive" } } },
      })
    );
  });

  it("offers to add an accommodation role when the organisation does not already have one", async () => {
    mockGetImplementation(
      { data: organisationData, response: { ok: true, status: 200 } },
      { data: [airlineRole], response: { ok: true, status: 200 } }
    );
    postMock.mockResolvedValue({ data: { entityId: "ROLE-2" }, response: { ok: true, status: 201 } });
    renderDetail();
    await screen.findByRole("heading", { level: 1, name: "Example Garden Hotel" });

    expect(screen.queryByRole("button", { name: /add airline role/i })).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add accommodation role/i }));
    await user.click(screen.getByRole("button", { name: "Add role" }));

    expect(postMock).toHaveBeenCalledWith(
      "/organisations/{organisation_id}/roles",
      expect.objectContaining({
        params: { path: { organisation_id: "ORG-001" } },
        body: expect.objectContaining({ role: { type: "organisation/accommodation", properties: { roleStatusCode: "role/active" } } }),
      })
    );
  });
});
