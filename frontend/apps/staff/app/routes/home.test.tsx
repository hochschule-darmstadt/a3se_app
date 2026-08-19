import { cleanup, render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { createTestQueryClient, TestProviders } from "../test-utils";
import { NAV_LINKS } from "../lib/shell";

const { default: StaffHome } = await import("./home");

function renderHome() {
  const client = createTestQueryClient();
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <TestProviders client={client}>
          <StaffHome />
        </TestProviders>
      ),
    },
  ]);
  return render(<Stub initialEntries={["/"]} />);
}

afterEach(() => {
  cleanup();
});

describe("StaffHome (VIEW-S-001, issue #28 phase 2)", () => {
  it("shows the portal headline and a Staff Portal Home breadcrumb", () => {
    renderHome();

    expect(screen.getByRole("heading", { level: 1, name: "CCT Staff Portal" })).toBeInTheDocument();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByText("Staff Portal Home")).toHaveAttribute("aria-current", "page");
  });

  it("shows one tile per managed-data area, each with an icon, a heading and a Manage link to its route", () => {
    renderHome();

    const main = screen.getByRole("main");
    const areaLinks = NAV_LINKS.filter((link) => link.to !== "/");

    for (const link of areaLinks) {
      expect(within(main).getByRole("heading", { name: link.label })).toBeInTheDocument();
    }

    expect(main.querySelectorAll("svg[aria-hidden]").length).toBeGreaterThanOrEqual(areaLinks.length);

    const manageLinks = within(main).getAllByRole("link", { name: "Manage" });
    expect(manageLinks.map((link) => link.getAttribute("href")).sort()).toEqual(
      areaLinks.map((link) => link.to).sort(),
    );
  });

  it("does not show the deleted intro text, a work queue, or other dashboard content (issue #28 phase 1)", () => {
    renderHome();

    expect(screen.queryByText("Choose a managed-data area to continue.")).not.toBeInTheDocument();
    expect(screen.queryByText(/work queue/i)).not.toBeInTheDocument();
  });
});
