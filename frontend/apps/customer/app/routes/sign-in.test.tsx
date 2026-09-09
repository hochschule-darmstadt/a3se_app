import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../api";
import { TestProviders } from "../test-utils";
import SignIn from "./sign-in";

vi.mock("../api", () => ({ apiClient: { GET: vi.fn(), POST: vi.fn() } }));
const getMock = vi.mocked(apiClient.GET);
const postMock = vi.mocked(apiClient.POST);

function renderSignIn() {
  const Stub = createRoutesStub([
    { path: "/sign-in", Component: SignIn },
    { path: "/", Component: () => <div>Travel portal page</div> },
  ]);
  return render(
    <TestProviders>
      <Stub initialEntries={["/sign-in?productId=FLT-01&date=2027-04-06&travellers=1"]} />
    </TestProviders>
  );
}

describe("SignIn (VIEW-C-011/C-012 mock identity)", () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    getMock.mockResolvedValue({ data: { entityId: "PER-000123", entityKind: "Person", schemaVersion: 1, properties: { givenName: "Ada", familyName: "Kern", emailAddress: "ada@example.test" }, displayName: "Ada Kern", displayNameChain: ["Ada Kern"] }, response: { ok: true, status: 200 } } as never);
  });
  it("shows the prototype-placeholder notice", () => {
    renderSignIn();
    expect(
      screen.getByText(/Prototype placeholder: this is a mock identity for demonstration only/)
    ).toBeInTheDocument();
  });

  it("requires a display name before continuing", async () => {
    const user = userEvent.setup();
    renderSignIn();
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByText("Enter an email address.")).toBeInTheDocument();
    expect(screen.getByText("Enter a password.")).toBeInTheDocument();
  });

  it("signs in and returns to the portal when there is no explicit return destination", async () => {
    const user = userEvent.setup();
    renderSignIn();
    await user.type(screen.getByLabelText("Email address"), "ada@example.test");
    await user.type(screen.getByLabelText("Password"), "demo-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Travel portal page")).toBeInTheDocument();
  });

  it("returns to the originating page when sign-in was opened from the header", async () => {
    const Stub = createRoutesStub([
      { path: "/sign-in", Component: SignIn },
      { path: "/products/PRD-1", Component: () => <div>Product page</div> },
    ]);
    render(<TestProviders><Stub initialEntries={["/sign-in?returnTo=%2Fproducts%2FPRD-1"]} /></TestProviders>);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email address"), "ada@example.test");
    await user.type(screen.getByLabelText("Password"), "demo-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Product page")).toBeInTheDocument();
  });

  it("switches to the registration variant on the same account page", async () => {
    const user = userEvent.setup();
    renderSignIn();
    await user.click(screen.getByRole("button", { name: "New customer? Register instead" }));
    expect(screen.getByRole("button", { name: "Register and continue" })).toBeInTheDocument();
  });

  it("shows the registration fields and preserves the booking context", async () => {
    const Stub = createRoutesStub([{ path: "/sign-in", Component: SignIn }, { path: "/", Component: () => <div>Travel portal page</div> }]);
    render(<TestProviders><Stub initialEntries={["/sign-in?productId=FLT-01&date=2027-04-06&travellers=1"]} /></TestProviders>);
    await userEvent.setup().click(screen.getByRole("button", { name: "New customer? Register instead" }));
    expect(screen.getByLabelText("Given name")).toBeInTheDocument();
    expect(screen.getByLabelText("Family name")).toBeInTheDocument();
    expect(screen.getByLabelText(/privacy information/i)).toBeInTheDocument();
  });

  it("persists a new Person and customer role before continuing", async () => {
    postMock
      .mockResolvedValueOnce({ data: { entityId: "PER-000123", entityKind: "Person", schemaVersion: 1, properties: { givenName: "Ada", familyName: "Kern", emailAddress: "ada@example.test" }, displayName: "Ada Kern", displayNameChain: ["Ada Kern"] }, response: { ok: true, status: 201 } } as never)
      .mockResolvedValueOnce({ data: { entityId: "PRO-000123", entityKind: "PersonRole", type: "person/customer", schemaVersion: 1, properties: { roleStatusCode: "role/active" }, displayName: "Customer", displayNameChain: ["Ada Kern", "Customer"] }, response: { ok: true, status: 201 } } as never);
    renderSignIn();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "New customer? Register instead" }));
    await user.type(screen.getByLabelText("Given name"), "Ada");
    await user.type(screen.getByLabelText("Family name"), "Kern");
    await user.type(screen.getByLabelText("Email address"), "ada@example.test");
    await user.type(screen.getByLabelText("Password"), "demo-password");
    await user.click(screen.getByLabelText(/privacy information/i));
    await user.click(screen.getByRole("button", { name: "Register and continue" }));

    await waitFor(() => expect(postMock).toHaveBeenCalledTimes(2));
    expect(postMock.mock.calls[0]?.[0]).toBe("/persons");
    expect(postMock.mock.calls[1]?.[0]).toBe("/persons/{person_id}/roles");
    expect(await screen.findByText("Travel portal page")).toBeInTheDocument();
  });
});
