import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";

import { signInMockActor, TestProviders } from "../test-utils";
import { CustomerShell } from "./shell";

function renderShell(breadcrumbs?: { label: string; to?: string }[]) {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <CustomerShell breadcrumbs={breadcrumbs}>
          <p>Page content</p>
        </CustomerShell>
      ),
    },
    { path: "/sign-in", Component: () => <p>Sign-in page</p> },
  ]);
  return render(
    <TestProviders>
      <Stub initialEntries={["/"]} />
    </TestProviders>
  );
}

describe("CustomerShell (DS-CMP-001 customer profile, issue #27 phase 2)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("provides skip link, header, main, and footer landmarks, and no sidebar navigation", () => {
    renderShell();

    const skipLink = screen.getByRole("link", { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute("href", "#shell-main-content");

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Page content");

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/imprint \(placeholder\)/i)).toBeInTheDocument();
    expect(within(footer).getByText(/fictitious company/i)).toBeInTheDocument();
  });

  it("omits the breadcrumb trail when none is given", () => {
    renderShell();
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
  });

  it("shows the breadcrumb trail and marks the current page when one is given", () => {
    renderShell([{ label: "Travel portal", to: "/" }, { label: "Order" }]);

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Travel portal" })).toHaveAttribute("href", "/");
    expect(within(breadcrumb).getByText("Order")).toHaveAttribute("aria-current", "page");
  });

  it("offers sign-in from the header user menu when no actor is signed in", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: /guest.*sign in/i }));
    await user.click(await screen.findByRole("menuitem", { name: "Sign in" }));

    expect(await screen.findByText("Sign-in page")).toBeInTheDocument();
  });

  it("shows the signed-in actor's name in the header once a mock actor is signed in, without implying real authentication", () => {
    signInMockActor("PER-001", "Ada Kern");
    renderShell();

    expect(screen.getByRole("button", { name: "Ada Kern" })).toBeInTheDocument();
    expect(screen.queryByText(/guest/i)).not.toBeInTheDocument();
  });
});
