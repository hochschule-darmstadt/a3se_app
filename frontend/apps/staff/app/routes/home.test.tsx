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
  it("shows one tile per managed-data area, with a heading and a Manage link to its route", () => {
    renderHome();

    const main = screen.getByRole("main");
    const areaLinks = NAV_LINKS.filter((link) => link.to !== "/");

    for (const link of areaLinks) {
      expect(within(main).getByRole("heading", { name: link.label })).toBeInTheDocument();
    }

    const manageLinks = within(main).getAllByRole("link", { name: "Manage" });
    expect(manageLinks.map((link) => link.getAttribute("href")).sort()).toEqual(
      areaLinks.map((link) => link.to).sort(),
    );
  });

  it("does not show a work queue or other dashboard content (deferred, issue #28 phase 1)", () => {
    renderHome();

    expect(screen.queryByText(/work queue/i)).not.toBeInTheDocument();
  });
});
