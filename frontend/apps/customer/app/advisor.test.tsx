import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("./api", () => ({ apiBaseUrl: "http://127.0.0.1:8000" }));

import { CustomerAdvisor } from "./advisor";
import { TestProviders } from "./test-utils";

function renderAdvisor(initialEntry = "/") {
  const Stub = createRoutesStub([{ path: "*", Component: CustomerAdvisor }]);
  return render(<TestProviders><Stub initialEntries={[initialEntry]} /></TestProviders>);
}

describe("CustomerAdvisor (VIEW-C-007 / DS-CMP-009)", () => {
  it("opens from the persistent launcher and returns a reply", async () => {
    const user = userEvent.setup();
    window.sessionStorage.clear();
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
  });
});
