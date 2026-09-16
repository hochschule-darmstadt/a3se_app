import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./api", () => ({ apiBaseUrl: "http://127.0.0.1:8000" }));

import { CustomerAdvisor } from "./advisor";
import { TestProviders } from "./test-utils";

function renderAdvisor(initialEntry = "/") {
  const Stub = createRoutesStub([{ path: "*", Component: CustomerAdvisor }]);
  return render(<TestProviders><Stub initialEntries={[initialEntry]} /></TestProviders>);
}

describe("CustomerAdvisor (VIEW-C-007 / DS-CMP-009)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("opens from the persistent launcher and returns a reply", async () => {
    const user = userEvent.setup();
    window.sessionStorage.setItem("cct.customer.advisor.confirmed-context.v1", JSON.stringify([
      { key: "orderReference", value: "TO-2048" },
    ]));
    const fetchMock = vi.fn().mockImplementation(() => {
      let delivered = false;
      return Promise.resolve({
        ok: true,
        body: {
          getReader: () => ({
            read: async () => delivered
              ? { done: true, value: undefined }
              : (delivered = true, { done: false, value: new TextEncoder().encode('{"type":"chunk","text":"The catalogue has a coastal walking option."}\n{"type":"complete","state":"answered","answer":""}\n') }),
          }),
        },
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    renderAdvisor("/assistance");

    await user.click(screen.getByRole("button", { name: "Open AI Travel Advisor" }));
    expect(screen.queryByText("Current confirmed context")).not.toBeInTheDocument();
    expect(await screen.findByText(/I am ready to receive your travel question/)).toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: "Message the advisor" });
    await user.type(input, "What is happening with my documents?");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    const firstRequest = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string) as { confirmedContext: Array<{ key: string; value: string }> };
    expect(firstRequest.confirmedContext).toEqual([{ key: "orderReference", value: "TO-2048" }]);

    expect(screen.getByText("What is happening with my documents?")).toBeInTheDocument();
    expect(await screen.findByText("The catalogue has a coastal walking option.")).toBeInTheDocument();

    await user.type(input, "And what should I do next?");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByText("And what should I do next?");
    const secondRequest = JSON.parse(fetchMock.mock.calls[1]![1]!.body as string) as { conversation: Array<{ role: string; content: string }> };
    expect(secondRequest.conversation).toEqual([
      { role: "customer", content: "What is happening with my documents?" },
      { role: "advisor", content: "The catalogue has a coastal walking option." },
    ]);
    expect(window.sessionStorage.getItem("cct.customer.advisor.conversation.v1")).toBeNull();
    expect(window.sessionStorage.getItem("cct.customer.advisor.conversation.v2")).toBeNull();
  });

  it("asks an unsigned customer to sign in before invoking composition", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const Stub = createRoutesStub([
      { path: "/assistance", Component: CustomerAdvisor },
      { path: "/sign-in", Component: () => <div>Sign in page</div> },
    ]);

    render(<TestProviders><Stub initialEntries={["/assistance"]} /></TestProviders>);
    await user.type(screen.getByRole("textbox", { name: "Message the advisor" }), "Please propose a trip to Lima");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Sign in page")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("removes conversations saved before the sign-in gate", async () => {
    window.sessionStorage.setItem("cct.customer.advisor.conversation.v1", JSON.stringify([
      { id: "old", speaker: "advisor", text: "I composed a client-side draft for None" },
    ]));
    window.sessionStorage.setItem("cct.customer.advisor.conversation.v2", JSON.stringify([
      { id: "newer", speaker: "advisor", text: "I composed another stale draft" },
    ]));
    renderAdvisor("/assistance");

    expect(window.sessionStorage.getItem("cct.customer.advisor.conversation.v1")).toBeNull();
    expect(window.sessionStorage.getItem("cct.customer.advisor.conversation.v2")).toBeNull();
    expect(screen.queryByText(/client-side draft for None/)).not.toBeInTheDocument();
    expect(screen.queryByText(/another stale draft/)).not.toBeInTheDocument();
  });
});
