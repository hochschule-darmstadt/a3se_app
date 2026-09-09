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

function renderHomeWithCriteria() {
  const Stub = createRoutesStub([{ path: "/", Component: CustomerHome }]);
  return render(<TestProviders><Stub initialEntries={["/?destinationOrTheme=Peru&dateFrom=2027-04-01&dateTo=2027-04-06&travellers=2"]} /></TestProviders>);
}

describe("CustomerHome (VIEW-C-001 structured search)", () => {
  it("shows validation errors and does not navigate when the form is submitted empty", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole("button", { name: "Search the catalogue" }));

    expect(
      screen.getByRole("alert", { name: "Please fix the following before continuing" })
    ).toBeInTheDocument();
    expect(screen.getByText("Enter a destination or theme.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid earliest departure date.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid latest return date.")).toBeInTheDocument();
    expect(screen.queryByText("Search results page")).not.toBeInTheDocument();
  });

  it("navigates to the results route with criteria as search params once the form is valid", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.type(screen.getByLabelText("Destination or theme"), "Peru");
    await user.type(screen.getByLabelText("Earliest departure"), "2027-04-01");
    expect(screen.getByLabelText("Latest return")).toHaveValue("2027-04-02");
    await user.type(screen.getByLabelText("Latest return"), "2027-04-06");
    await user.click(screen.getByRole("button", { name: "Search the catalogue" }));

    expect(await screen.findByText("Search results page")).toBeInTheDocument();
  });

  it("defaults the latest return to the day after the earliest departure", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.type(screen.getByLabelText("Earliest departure"), "2027-04-01");

    expect(screen.getByLabelText("Latest return")).toHaveValue("2027-04-02");
  });

  it("updates the latest return when the user selects a different earliest departure", async () => {
    const user = userEvent.setup();
    renderHomeWithCriteria();

    const earliestDeparture = screen.getByLabelText("Earliest departure");
    await user.clear(earliestDeparture);
    await user.type(earliestDeparture, "2027-05-10");

    expect(screen.getByLabelText("Latest return")).toHaveValue("2027-05-11");
  });

  it("restores criteria when opened with the revise-criteria URL", () => {
    renderHomeWithCriteria();

    expect(screen.getByLabelText("Destination or theme")).toHaveValue("Peru");
    expect(screen.getByLabelText("Earliest departure")).toHaveValue("2027-04-01");
    expect(screen.getByLabelText("Latest return")).toHaveValue("2027-04-06");
    expect(screen.getAllByLabelText("Number of travellers").find((element) => element.tagName === "INPUT")).toHaveValue("2");
  });
});
