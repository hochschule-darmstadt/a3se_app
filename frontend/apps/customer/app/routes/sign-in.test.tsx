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
    expect(screen.getByText("Enter an email address.")).toBeInTheDocument();
    expect(screen.getByText("Enter a password.")).toBeInTheDocument();
  });

  it("signs in and continues to the offer step, preserving the booking params", async () => {
    const user = userEvent.setup();
    renderSignIn();
    await user.type(screen.getByLabelText("Email address"), "ada@example.test");
    await user.type(screen.getByLabelText("Password"), "demo-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Offer page")).toBeInTheDocument();
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
    const Stub = createRoutesStub([{ path: "/sign-in", Component: SignIn }, { path: "/offer", Component: () => <div>Offer page</div> }]);
    render(<TestProviders><Stub initialEntries={["/sign-in?productId=FLT-01&date=2027-04-06&travellers=1"]} /></TestProviders>);
    await userEvent.setup().click(screen.getByRole("button", { name: "New customer? Register instead" }));
    expect(screen.getByLabelText("Given name")).toBeInTheDocument();
    expect(screen.getByLabelText("Family name")).toBeInTheDocument();
    expect(screen.getByLabelText(/privacy information/i)).toBeInTheDocument();
  });
});
