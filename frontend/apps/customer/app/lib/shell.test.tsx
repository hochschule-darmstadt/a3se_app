import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";

import { signInMockActor, TestProviders } from "../test-utils";
import { CustomerShell } from "./shell";

/** Simulates another tab writing the mock actor: `storage` events fire only in the other tabs. */
function changeActorInOtherTab(next: { personId: string; displayName: string } | null) {
  const oldValue = window.localStorage.getItem("cct.mockActor");
  const newValue = next ? JSON.stringify(next) : null;
  if (newValue) window.localStorage.setItem("cct.mockActor", newValue);
  else window.localStorage.removeItem("cct.mockActor");
  act(() => {
    window.dispatchEvent(new StorageEvent("storage", { key: "cct.mockActor", oldValue, newValue }));
  });
}

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
    expect(screen.getByRole("link", { name: "Christopher Columbus Travel" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("main")).toHaveTextContent("Page content");

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveStyle({ position: "static" });
    expect(within(footer).getByText("Imprint")).toBeInTheDocument();
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
    const signInItem = await screen.findByRole("menuitem", { name: "Sign in" });
    fireEvent.click(signInItem);

    expect(await screen.findByText("Sign-in page")).toBeInTheDocument();
  });

  it("shows the signed-in actor's name in the header once a mock actor is signed in, without implying real authentication", () => {
    signInMockActor("PER-001", "Ada Kern");
    renderShell();

    expect(screen.getByRole("button", { name: "Ada Kern" })).toBeInTheDocument();
    expect(screen.queryByText(/guest/i)).not.toBeInTheDocument();
  });

  it("clears customer client state on sign out", async () => {
    const user = userEvent.setup();
    signInMockActor("PER-001", "Ada Kern");
    window.sessionStorage.setItem("cct.customer.advisor.conversation.v1", JSON.stringify([{ id: "old" }]));
    window.sessionStorage.setItem("cct.customer.advisor.conversation.v2", JSON.stringify([{ id: "newer" }]));
    window.sessionStorage.setItem("cct.customer.advisor.confirmed-context.v1", JSON.stringify([{ key: "order", value: "TO-1" }]));
    window.sessionStorage.setItem("cct.customer.travel.v1", JSON.stringify({ travellers: [], positions: [{ clientPositionId: "P-1" }], pending: null }));
    renderShell();

    await user.click(screen.getByRole("button", { name: "Ada Kern" }));
    await user.click(await screen.findByText("Sign out"));

    expect(window.localStorage.getItem("cct.mockActor")).toBeNull();
    expect(window.sessionStorage.getItem("cct.customer.advisor.conversation.v1")).toBeNull();
    expect(window.sessionStorage.getItem("cct.customer.advisor.conversation.v2")).toBeNull();
    expect(window.sessionStorage.getItem("cct.customer.advisor.confirmed-context.v1")).toBeNull();
    expect(window.sessionStorage.getItem("cct.customer.travel.v1")).toBeNull();
  });

  it("follows a sign-out made in another tab and clears this tab's draft", () => {
    signInMockActor("PER-001", "Ada Kern");
    window.sessionStorage.setItem("cct.customer.travel.v1", JSON.stringify({ travellers: [], positions: [{ clientPositionId: "P-1" }], pending: null }));
    renderShell();
    expect(screen.getByRole("link", { name: /my travel \(1\)/i })).toBeInTheDocument();

    changeActorInOtherTab(null);

    expect(screen.getByRole("button", { name: /guest.*sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /my travel \(0\)/i })).toBeInTheDocument();
    expect(window.sessionStorage.getItem("cct.customer.travel.v1")).toBeNull();
  });

  it("clears this tab's draft when another tab switches to a different actor", () => {
    signInMockActor("PER-001", "Ada Kern");
    window.sessionStorage.setItem("cct.customer.travel.v1", JSON.stringify({ travellers: [], positions: [{ clientPositionId: "P-1" }], pending: null }));
    renderShell();

    changeActorInOtherTab({ personId: "PER-002", displayName: "Ben Ortiz" });

    expect(screen.getByRole("button", { name: "Ben Ortiz" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /my travel \(0\)/i })).toBeInTheDocument();
  });

  it("adopts a sign-in made in another tab and keeps the guest draft", () => {
    window.sessionStorage.setItem("cct.customer.travel.v1", JSON.stringify({ travellers: [], positions: [{ clientPositionId: "P-1" }], pending: null }));
    renderShell();

    changeActorInOtherTab({ personId: "PER-001", displayName: "Ada Kern" });

    expect(screen.getByRole("button", { name: "Ada Kern" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /my travel \(1\)/i })).toBeInTheDocument();
  });
});
