import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { TestProviders } from "../test-utils";
import Assistance from "./assistance";

describe("Assistance (VIEW-C-007)", () => {
  it("shows the related order, issue, and confirmed state", () => {
    const Stub = createRoutesStub([{ path: "/assistance", Component: Assistance }]);
    render(<TestProviders><Stub initialEntries={["/assistance"]} /></TestProviders>);

    expect(screen.getByRole("heading", { name: "Travel assistance" })).toBeInTheDocument();
    expect(screen.getByText("TO-2048 · Madeira walking week")).toBeInTheDocument();
    expect(screen.getByText("Flight-document timing")).toBeInTheDocument();
    expect(screen.getByText("One document released; two preparing")).toBeInTheDocument();
  });
});
