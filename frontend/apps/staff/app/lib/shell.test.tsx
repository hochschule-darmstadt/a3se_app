import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { createTestQueryClient, TestProviders } from "../test-utils";
import { NAV_LINKS, StaffShell } from "./shell";

afterEach(() => {
  cleanup();
});

function renderShell(breadcrumbs?: { label: string; to?: string }[]) {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/orders",
      Component: () => (
        <TestProviders client={client}>
          <StaffShell breadcrumbs={breadcrumbs}>
            <p>Page content</p>
          </StaffShell>
        </TestProviders>
      ),
    },
  ]);
  return render(<Stub initialEntries={["/orders"]} />);
}

describe("StaffShell (DS-CMP-001 staff profile, issue #27 phase 2)", () => {
  it("provides skip link, header, persistent sidebar, and main landmarks, and no footer", () => {
    renderShell();

    const skipLink = screen.getByRole("link", { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute("href", "#shell-main-content");

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Page content");
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();

    const sidebar = screen.getByRole("navigation", { name: "Staff areas" });
    for (const link of NAV_LINKS) {
      expect(within(sidebar).getByRole("link", { name: link.label })).toHaveAttribute("href", link.to);
    }
  });

  it("shows the staff user icon as a non-interactive mocked placeholder (no staff login exists yet)", () => {
    renderShell();

    expect(screen.getByText("Staff user (mocked)")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Staff user (mocked)" })).not.toBeInTheDocument();
  });

  it("omits the breadcrumb trail when none is given", () => {
    renderShell();
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
  });

  it("shows the breadcrumb trail and marks the current page when one is given", () => {
    renderShell([{ label: "Orders", to: "/orders" }, { label: "Order 6001" }]);

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Orders" })).toHaveAttribute("href", "/orders");
    expect(within(breadcrumb).getByText("Order 6001")).toHaveAttribute("aria-current", "page");
  });

  it("toggles the sidebar with the mobile burger control", async () => {
    const user = userEvent.setup();
    renderShell();

    const burger = screen.getByRole("button", { name: /toggle staff areas navigation/i });
    expect(burger).toHaveAttribute("aria-expanded", "false");
    await user.click(burger);
    expect(burger).toHaveAttribute("aria-expanded", "true");
  });
});
