import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { TestProviders } from "../test-utils";
import SignIn from "./sign-in";

function renderSignIn() {
  const Stub = createRoutesStub([
    { path: "/sign-in", Component: SignIn },
    { path: "/offer", Component: () => <div>Offer page</div> },
  ]);
  return render(
    <TestProviders>
      <Stub initialEntries={["/sign-in?productId=FLT-01&date=2027-04-06&travellers=1"]} />
    </TestProviders>
  );
}

describe("SignIn (VIEW-C-011/C-012 mock identity)", () => {
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
    expect(screen.getByText("Enter a display name.")).toBeInTheDocument();
  });

  it("signs in and continues to the offer step, preserving the booking params", async () => {
    const user = userEvent.setup();
    renderSignIn();
    await user.type(screen.getByLabelText("Display name"), "Ada Kern");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Offer page")).toBeInTheDocument();
  });

  it("toggles into the registration variant", async () => {
    const user = userEvent.setup();
    renderSignIn();
    await user.click(screen.getByRole("button", { name: "New customer? Register instead" }));
    expect(screen.getByRole("button", { name: "Register and continue" })).toBeInTheDocument();
  });
});
