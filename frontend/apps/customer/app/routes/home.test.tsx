import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { TestProviders } from "../test-utils";
import CustomerHome from "./home";

function renderHome() {
  const Stub = createRoutesStub([
    { path: "/", Component: CustomerHome },
    { path: "/search", Component: () => <div>Search results page</div> },
  ]);
  return render(
    <TestProviders>
      <Stub initialEntries={["/"]} />
    </TestProviders>
  );
}

describe("CustomerHome (VIEW-C-001 structured search)", () => {
  it("shows validation errors and does not navigate when the form is submitted empty", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole("button", { name: "Search the catalogue" }));

    expect(
      screen.getByRole("alert", { name: "Please fix the following before continuing" })
    ).toBeInTheDocument();
    expect(screen.getByText("Enter an origin.")).toBeInTheDocument();
    expect(screen.getByText("Enter a destination or region.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid outbound date.")).toBeInTheDocument();
    expect(screen.queryByText("Search results page")).not.toBeInTheDocument();
  });

  it("navigates to the results route with criteria as search params once the form is valid", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.type(screen.getByLabelText("Origin"), "Berlin");
    await user.type(screen.getByLabelText("Destination or region"), "Peru");
    await user.type(screen.getByLabelText("Outbound date"), "2027-04-06");
    await user.click(screen.getByRole("button", { name: "Search the catalogue" }));

    expect(await screen.findByText("Search results page")).toBeInTheDocument();
  });
});
