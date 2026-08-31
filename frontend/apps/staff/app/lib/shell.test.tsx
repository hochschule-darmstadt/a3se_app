import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createTestQueryClient, TestProviders } from "../test-utils";
import { NAV_LINKS, StaffShell } from "./shell";

afterEach(() => {
  cleanup();
});

function renderShell() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/orders",
      Component: () => (
        <TestProviders client={client}>
          <StaffShell>
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

  it("shows the user icon as a non-interactive placeholder (no staff login exists yet)", () => {
    renderShell();

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "User" })).not.toBeInTheDocument();
  });

  it("offers portal history controls that use the browser history stack", async () => {
    const user = userEvent.setup();
    const back = vi.spyOn(window.history, "back").mockImplementation(() => undefined);
    const forward = vi.spyOn(window.history, "forward").mockImplementation(() => undefined);

    renderShell();
    await user.click(screen.getByRole("button", { name: "Go back" }));
    await user.click(screen.getByRole("button", { name: "Go forward" }));

    expect(back).toHaveBeenCalledOnce();
    expect(forward).toHaveBeenCalledOnce();
    back.mockRestore();
    forward.mockRestore();
  });

  it("does not render a breadcrumb trail", () => {
    renderShell();
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
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
