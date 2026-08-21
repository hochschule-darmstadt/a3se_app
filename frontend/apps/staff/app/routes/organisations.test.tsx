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

const { default: OrganisationsRoute } = await import("./organisations");

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

function renderOrganisations(initialEntry = "/organisations") {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/organisations",
      Component: () => (
        <TestProviders client={client}>
          <OrganisationsRoute />
          <LocationProbe />
        </TestProviders>
      ),
    },
    { path: "/organisations/new", Component: () => <div>Create organisation page</div> },
    { path: "/organisations/:organisationId", Component: () => <div>Organisation detail page</div> },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

function organisationResponse(entityId: string, name: string, locality?: string) {
  return {
    entityId,
    entityKind: "Organisation",
    schemaVersion: 1,
    properties: { name, addressLocalityName: locality ?? null },
  };
}

function roleResponse(entityId: string, type: string, status: "role/active" | "role/inactive") {
  return {
    entityId,
    entityKind: "OrgaRole",
    type,
    schemaVersion: 1,
    properties: { roleStatusCode: status },
  };
}

function mockGetImplementation(
  organisationsResult: { data?: { items: ReturnType<typeof organisationResponse>[]; nextCursor: string | null }; response: unknown },
  rolesByOrganisation: Record<string, unknown>
) {
  const organisationsByEntityId = new Map((organisationsResult.data?.items ?? []).map((organisation) => [organisation.entityId, organisation]));
  getMock.mockImplementation((path: string, options?: { params?: { path?: { organisation_id?: string } } }) => {
    if (path === "/organisations") return Promise.resolve(organisationsResult);
    const organisationId = options?.params?.path?.organisation_id as string | undefined;
    if (path === "/organisations/{organisation_id}/roles") {
      return Promise.resolve(rolesByOrganisation[organisationId as string]);
    }
    if (path === "/organisations/{organisation_id}") {
      const organisation = organisationId ? organisationsByEntityId.get(organisationId) : undefined;
      return Promise.resolve({ data: organisation, response: { ok: true, status: 200 } });
    }
    throw new Error(`Unexpected GET path: ${path}`);
  });
}

afterEach(() => {
  cleanup();
  getMock.mockReset();
  postMock.mockReset();
});

describe("OrganisationsRoute (VIEW-S-004, issue #30 phase 2)", () => {
  it("shows a loading state before data arrives", () => {
    getMock.mockReturnValue(new Promise(() => {}));
    renderOrganisations();
    expect(screen.getByText(/loading organisations/i)).toBeInTheDocument();
  });

  it("shows an empty state when there are no organisations", async () => {
    mockGetImplementation({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } }, {});
    renderOrganisations();
    expect(await screen.findByText(/no organisations match these filters/i)).toBeInTheDocument();
  });

  it("shows an error banner when the request fails", async () => {
    getMock.mockResolvedValue({
      error: { type: "unknown", title: "Server error", detail: "Something went wrong." },
      response: { ok: false, status: 500 },
    });
    renderOrganisations();
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });

  it("renders organisations with role badges", async () => {
    mockGetImplementation(
      {
        data: { items: [organisationResponse("ORG-001", "Example Garden Hotel", "Funchal")], nextCursor: null },
        response: { ok: true, status: 200 },
      },
      {
        "ORG-001": {
          data: [roleResponse("ROLE-1", "organisation/accommodation", "role/active")],
          response: { ok: true, status: 200 },
        },
      }
    );
    renderOrganisations();

    expect(await screen.findByText("Example Garden Hotel")).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(await within(table).findByText("Accommodation")).toBeInTheDocument();
  });

  it("filters rows client-side by search text", async () => {
    mockGetImplementation(
      {
        data: {
          items: [organisationResponse("ORG-001", "Example Garden Hotel"), organisationResponse("ORG-002", "Sample Island Transfers")],
          nextCursor: null,
        },
        response: { ok: true, status: 200 },
      },
      {
        "ORG-001": { data: [], response: { ok: true, status: 200 } },
        "ORG-002": { data: [], response: { ok: true, status: 200 } },
      }
    );
    renderOrganisations();
    await screen.findByText("Example Garden Hotel");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/search/i), "Sample");

    await waitFor(() => expect(screen.queryByText("Example Garden Hotel")).not.toBeInTheDocument());
    expect(screen.getByText("Sample Island Transfers")).toBeInTheDocument();
  });

  it("filters rows client-side by role type", async () => {
    mockGetImplementation(
      {
        data: {
          items: [organisationResponse("ORG-001", "Example Garden Hotel"), organisationResponse("ORG-002", "Sample Island Transfers")],
          nextCursor: null,
        },
        response: { ok: true, status: 200 },
      },
      {
        "ORG-001": { data: [roleResponse("ROLE-1", "organisation/accommodation", "role/active")], response: { ok: true, status: 200 } },
        "ORG-002": { data: [roleResponse("ROLE-2", "organisation/mobility", "role/active")], response: { ok: true, status: 200 } },
      }
    );
    renderOrganisations();
    await screen.findByText("Example Garden Hotel");
    await screen.findByText("Sample Island Transfers");

    const user = userEvent.setup();
    await user.click(screen.getByRole("textbox", { name: /role type/i }));
    await user.click(await screen.findByRole("option", { name: "Mobility", hidden: true }));

    await waitFor(() => expect(screen.queryByText("Example Garden Hotel")).not.toBeInTheDocument());
    expect(screen.getByText("Sample Island Transfers")).toBeInTheDocument();
  });

  it("shows the organisation's detail inline in the right pane when a row is activated, without navigating away", async () => {
    mockGetImplementation(
      { data: { items: [organisationResponse("ORG-001", "Example Garden Hotel")], nextCursor: null }, response: { ok: true, status: 200 } },
      { "ORG-001": { data: [], response: { ok: true, status: 200 } } }
    );
    renderOrganisations();
    const cell = await screen.findByText("Example Garden Hotel");

    const user = userEvent.setup();
    await user.click(cell);

    expect(await screen.findByRole("heading", { level: 1, name: "Example Garden Hotel" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Suppliers and partners" })).toBeInTheDocument();
    expect(screen.getByLabelText("Current URL")).toHaveTextContent("/organisations?detail=ORG-001");
  });

  it("restores filters and detail selection from the URL and browser history", async () => {
    mockGetImplementation(
      {
        data: {
          items: [organisationResponse("ORG-001", "Example Garden Hotel"), organisationResponse("ORG-002", "Sample Island Transfers")],
          nextCursor: null,
        },
        response: { ok: true, status: 200 },
      },
      {
        "ORG-001": { data: [], response: { ok: true, status: 200 } },
        "ORG-002": { data: [], response: { ok: true, status: 200 } },
      }
    );
    renderOrganisations("/organisations?q=a&detail=ORG-002");

    expect(await screen.findByDisplayValue("a")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 1, name: "Sample Island Transfers" })).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByText("Example Garden Hotel"));
    expect(screen.getByLabelText("Current URL")).toHaveTextContent("/organisations?q=a&detail=ORG-001");

    await user.click(screen.getByRole("button", { name: "Browser back" }));
    await waitFor(() => expect(screen.getByLabelText("Current URL")).toHaveTextContent("/organisations?q=a&detail=ORG-002"));
    expect(await screen.findByRole("heading", { level: 1, name: "Sample Island Transfers" })).toBeInTheDocument();
  });

  it("shows the create-organisation form inline in the right pane, and switches to the new organisation's detail on success", async () => {
    getMock.mockImplementation((path: string) => {
      if (path === "/organisations") return Promise.resolve({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } });
      if (path === "/organisations/{organisation_id}") {
        return Promise.resolve({ data: organisationResponse("ORG-new", "Example Garden Hotel"), response: { ok: true, status: 200 } });
      }
      if (path === "/organisations/{organisation_id}/roles") return Promise.resolve({ data: [], response: { ok: true, status: 200 } });
      throw new Error(`Unexpected GET path: ${path}`);
    });
    postMock.mockImplementation((path: string) => {
      if (path === "/organisations") return Promise.resolve({ data: { entityId: "irrelevant" }, response: { ok: true, status: 201 } });
      if (path === "/organisations/{organisation_id}/roles") {
        return Promise.resolve({ data: { entityId: "irrelevant-role" }, response: { ok: true, status: 201 } });
      }
      throw new Error(`Unexpected POST path: ${path}`);
    });
    renderOrganisations();
    await screen.findByText(/no organisations match these filters/i);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Create organisation" }));

    expect(screen.getByRole("heading", { level: 1, name: "Create organisation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Suppliers and partners" })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^name/i), "Example Garden Hotel");
    await user.click(screen.getAllByRole("button", { name: "Create organisation" })[1]!);

    expect(await screen.findByRole("heading", { level: 1, name: "Example Garden Hotel" })).toBeInTheDocument();
  });
});
