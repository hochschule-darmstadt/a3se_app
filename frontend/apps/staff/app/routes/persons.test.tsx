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

const { default: PersonsRoute } = await import("./persons");

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

function renderPersons(initialEntry = "/persons") {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/persons",
      Component: () => (
        <TestProviders client={client}>
          <PersonsRoute />
          <LocationProbe />
        </TestProviders>
      ),
    },
    { path: "/persons/new", Component: () => <div>Create person page</div> },
    { path: "/persons/:personId", Component: () => <div>Person detail page</div> },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

function personResponse(entityId: string, givenName: string, familyName: string, locality?: string) {
  return {
    entityId,
    entityKind: "Person",
    schemaVersion: 1,
    properties: { givenName, familyName, addressLocalityName: locality ?? null },
  };
}

function roleResponse(entityId: string, type: string, status: "role/active" | "role/inactive") {
  return {
    entityId,
    entityKind: "PersonRole",
    type,
    schemaVersion: 1,
    properties: { roleStatusCode: status },
  };
}

function mockGetImplementation(
  personsResult: { data?: { items: ReturnType<typeof personResponse>[]; nextCursor: string | null }; response: unknown },
  rolesByPerson: Record<string, unknown>
) {
  const personsByEntityId = new Map((personsResult.data?.items ?? []).map((person) => [person.entityId, person]));
  getMock.mockImplementation((path: string, options?: { params?: { path?: { person_id?: string } } }) => {
    if (path === "/persons") return Promise.resolve(personsResult);
    const personId = options?.params?.path?.person_id as string | undefined;
    if (path === "/persons/{person_id}/roles") {
      return Promise.resolve(rolesByPerson[personId as string]);
    }
    if (path === "/persons/{person_id}") {
      const person = personId ? personsByEntityId.get(personId) : undefined;
      return Promise.resolve({ data: person, response: { ok: true, status: 200 } });
    }
    throw new Error(`Unexpected GET path: ${path}`);
  });
}

afterEach(() => {
  cleanup();
  getMock.mockReset();
  postMock.mockReset();
});

describe("PersonsRoute (VIEW-S-002, issue #29 phase 2)", () => {
  it("shows a loading state before data arrives", () => {
    getMock.mockReturnValue(new Promise(() => {}));
    renderPersons();
    expect(screen.getByText(/loading persons/i)).toBeInTheDocument();
  });

  it("shows an empty state when there are no persons", async () => {
    mockGetImplementation({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } }, {});
    renderPersons();
    expect(await screen.findByText(/no persons match these filters/i)).toBeInTheDocument();
  });

  it("shows an error banner when the request fails", async () => {
    getMock.mockResolvedValue({
      error: { type: "unknown", title: "Server error", detail: "Something went wrong." },
      response: { ok: false, status: 500 },
    });
    renderPersons();
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });

  it("renders persons with role badges", async () => {
    mockGetImplementation(
      {
        data: { items: [personResponse("PER-001", "Casey", "Example", "Springfield")], nextCursor: null },
        response: { ok: true, status: 200 },
      },
      {
        "PER-001": {
          data: [roleResponse("ROLE-1", "person/customer", "role/active")],
          response: { ok: true, status: 200 },
        },
      }
    );
    renderPersons();

    expect(await screen.findByText("Casey Example")).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(await within(table).findByText("Customer")).toBeInTheDocument();
  });

  it("filters rows client-side by search text", async () => {
    mockGetImplementation(
      {
        data: {
          items: [personResponse("PER-001", "Casey", "Example"), personResponse("PER-002", "Morgan", "Sample")],
          nextCursor: null,
        },
        response: { ok: true, status: 200 },
      },
      {
        "PER-001": { data: [], response: { ok: true, status: 200 } },
        "PER-002": { data: [], response: { ok: true, status: 200 } },
      }
    );
    renderPersons();
    await screen.findByText("Casey Example");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/search/i), "Morgan");

    await waitFor(() => expect(screen.queryByText("Casey Example")).not.toBeInTheDocument());
    expect(screen.getByText("Morgan Sample")).toBeInTheDocument();
  });

  it("filters rows client-side by role type", async () => {
    mockGetImplementation(
      {
        data: {
          items: [personResponse("PER-001", "Casey", "Example"), personResponse("PER-002", "Morgan", "Sample")],
          nextCursor: null,
        },
        response: { ok: true, status: 200 },
      },
      {
        "PER-001": { data: [roleResponse("ROLE-1", "person/customer", "role/active")], response: { ok: true, status: 200 } },
        "PER-002": { data: [roleResponse("ROLE-2", "person/traveller", "role/active")], response: { ok: true, status: 200 } },
      }
    );
    renderPersons();
    await screen.findByText("Casey Example");
    await screen.findByText("Morgan Sample");

    const user = userEvent.setup();
    await user.click(screen.getByRole("textbox", { name: /role type/i }));
    await user.click(await screen.findByRole("option", { name: "Traveller", hidden: true }));

    await waitFor(() => expect(screen.queryByText("Casey Example")).not.toBeInTheDocument());
    expect(screen.getByText("Morgan Sample")).toBeInTheDocument();
  });

  it("shows the person's detail inline in the right pane when a row is activated, without navigating away", async () => {
    mockGetImplementation(
      { data: { items: [personResponse("PER-001", "Casey", "Example")], nextCursor: null }, response: { ok: true, status: 200 } },
      { "PER-001": { data: [], response: { ok: true, status: 200 } } }
    );
    renderPersons();
    const cell = await screen.findByText("Casey Example");

    const user = userEvent.setup();
    await user.click(cell);

    expect(await screen.findByRole("heading", { level: 1, name: "Casey Example" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Customers and travellers" })).toBeInTheDocument();
    expect(screen.getByLabelText("Current URL")).toHaveTextContent("/persons?detail=PER-001");
  });

  it("restores filters and detail selection from the URL and browser history", async () => {
    mockGetImplementation(
      {
        data: {
          items: [personResponse("PER-001", "Casey", "Example"), personResponse("PER-002", "Morgan", "Sample")],
          nextCursor: null,
        },
        response: { ok: true, status: 200 },
      },
      {
        "PER-001": { data: [], response: { ok: true, status: 200 } },
        "PER-002": { data: [], response: { ok: true, status: 200 } },
      }
    );
    renderPersons("/persons?q=a&detail=PER-002");

    expect(await screen.findByDisplayValue("a")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 1, name: "Morgan Sample" })).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByText("Casey Example"));
    expect(screen.getByLabelText("Current URL")).toHaveTextContent("/persons?q=a&detail=PER-001");

    await user.click(screen.getByRole("button", { name: "Browser back" }));
    await waitFor(() => expect(screen.getByLabelText("Current URL")).toHaveTextContent("/persons?q=a&detail=PER-002"));
    expect(await screen.findByRole("heading", { level: 1, name: "Morgan Sample" })).toBeInTheDocument();
  });

  it("shows the create-person form inline in the right pane, and switches to the new person's detail on success", async () => {
    getMock.mockImplementation((path: string) => {
      if (path === "/persons") return Promise.resolve({ data: { items: [], nextCursor: null }, response: { ok: true, status: 200 } });
      if (path === "/persons/{person_id}") {
        return Promise.resolve({ data: personResponse("PER-new", "Casey", "Example"), response: { ok: true, status: 200 } });
      }
      if (path === "/persons/{person_id}/roles") return Promise.resolve({ data: [], response: { ok: true, status: 200 } });
      throw new Error(`Unexpected GET path: ${path}`);
    });
    postMock.mockImplementation((path: string) => {
      if (path === "/persons") return Promise.resolve({ data: { entityId: "irrelevant" }, response: { ok: true, status: 201 } });
      if (path === "/persons/{person_id}/roles") {
        return Promise.resolve({ data: { entityId: "irrelevant-role" }, response: { ok: true, status: 201 } });
      }
      throw new Error(`Unexpected POST path: ${path}`);
    });
    renderPersons();
    await screen.findByText(/no persons match these filters/i);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Create person" }));

    expect(screen.getByRole("heading", { level: 1, name: "Create person" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Customers and travellers" })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/given name/i), "Casey");
    await user.type(screen.getByLabelText(/family name/i), "Example");
    await user.click(screen.getAllByRole("button", { name: "Create person" })[1]!);

    expect(await screen.findByRole("heading", { level: 1, name: "Casey Example" })).toBeInTheDocument();
  });
});
