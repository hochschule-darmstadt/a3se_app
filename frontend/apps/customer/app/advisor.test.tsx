import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./api", () => ({ apiBaseUrl: "http://127.0.0.1:8000" }));

import { CustomerAdvisor } from "./advisor";
import { signInMockActor, TestProviders } from "./test-utils";

function renderAdvisor(initialEntry = "/") {
  const Stub = createRoutesStub([{ path: "*", Component: CustomerAdvisor }]);
  return render(<TestProviders><Stub initialEntries={[initialEntry]} /></TestProviders>);
}

function streamedResponse(answer: string, state: "answered" | "no-answer" = "answered", actions: unknown[] = []) {
  let delivered = false;
  return {
    ok: true,
    body: {
      getReader: () => ({
        read: async () => delivered
          ? { done: true, value: undefined }
          : (delivered = true, { done: false, value: new TextEncoder().encode(`${JSON.stringify({ type: "complete", state, answer, actions })}\n`) }),
      }),
    },
  };
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
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(streamedResponse("The catalogue has a coastal walking option.")));
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
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(streamedResponse(
      "Please sign in before I can propose or compose travel. Your conversation will be kept so you can continue afterwards.", "no-answer",
    )));
    vi.stubGlobal("fetch", fetchMock);
    const Stub = createRoutesStub([
      { path: "/assistance", Component: CustomerAdvisor },
      { path: "/sign-in", Component: () => <div>Sign in page</div> },
    ]);

    render(<TestProviders><Stub initialEntries={["/assistance"]} /></TestProviders>);
    await user.type(screen.getByRole("textbox", { name: "Message the advisor" }), "Please propose a trip to Lima");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("Sign in page")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/advisor/respond/stream",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("sends a narrative trip request to composition rather than grounded Q&A", async () => {
    const user = userEvent.setup();
    signInMockActor("PER-001", "Ada Kern");
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(streamedResponse("What is the name of your travel partner?")));
    vi.stubGlobal("fetch", fetchMock);
    renderAdvisor("/assistance");

    await user.type(
      screen.getByRole("textbox", { name: "Message the advisor" }),
      "I will travel to Peru in June 2027. Together with my husband, we want to stay 3 weeks and go from Frankfurt to Lima.",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText("What is the name of your travel partner?")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/advisor/respond/stream",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("sends every follow-up through the unified endpoint and applies draft actions", async () => {
    const user = userEvent.setup();
    signInMockActor("PER-001", "Ada Kern");
    const composeReplies = [
      { state: "answered", answer: "Which city would you like to depart from?", actions: [] },
      {
        state: "answered",
        answer: "I added a draft for Lima, 2027-01-04 to 2027-01-09, for 2 traveller(s) to My Travel.",
        actions: [{
          type: "add-position", stockItemId: "STK-000042", productId: "PRD-000001", serviceDate: "2027-01-04",
          displayNameChain: ["Flight", "CA501 BER-LIM"], unitPriceAmount: "500.00", currencyCode: "EUR",
        }],
      },
    ];
    const fetchMock = vi.fn().mockImplementation(() => {
      const reply = composeReplies.shift()!;
      return Promise.resolve(streamedResponse(reply.answer, "answered", reply.actions));
    });
    vi.stubGlobal("fetch", fetchMock);
    renderAdvisor("/assistance");

    const input = screen.getByRole("textbox", { name: "Message the advisor" });
    await user.type(input, "book a 5 day trip to lima, 2 persons");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText("Which city would you like to depart from?")).toBeInTheDocument();

    // The backend sees the full transcript and classifies this short answer.
    await user.type(input, "Berlin");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText(/I added a draft for Lima/)).toBeInTheDocument();

    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      "http://127.0.0.1:8000/advisor/respond/stream",
      "http://127.0.0.1:8000/advisor/respond/stream",
    ]);
    const draft = JSON.parse(window.sessionStorage.getItem("cct.customer.travel.v1") ?? "null") as {
      travellers: Array<{ clientTravellerId: string }>;
      positions: Array<{ stockItemId: string; clientTravellerId: string }>;
    };
    expect(draft.travellers.map((traveller) => traveller.clientTravellerId)).toEqual(["self"]);
    expect(draft.positions).toHaveLength(1);
    expect(draft.positions[0]).toMatchObject({ stockItemId: "STK-000042", clientTravellerId: "self" });
  });

  it("resets the transcript and confirmed context when another tab signs out", async () => {
    const user = userEvent.setup();
    signInMockActor("PER-001", "Ada Kern");
    window.sessionStorage.setItem("cct.customer.advisor.confirmed-context.v1", JSON.stringify([
      { key: "orderReference", value: "TO-2048" },
    ]));
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(streamedResponse("Ada-specific answer.")));
    vi.stubGlobal("fetch", fetchMock);
    renderAdvisor("/assistance");
    await user.click(screen.getByRole("button", { name: "Open AI Travel Advisor" }));
    await user.type(screen.getByRole("textbox", { name: "Message the advisor" }), "What about my documents?");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText("Ada-specific answer.")).toBeInTheDocument();

    const oldValue = window.localStorage.getItem("cct.mockActor");
    window.localStorage.removeItem("cct.mockActor");
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "cct.mockActor", oldValue, newValue: null }));
    });

    expect(screen.queryByText("What about my documents?")).not.toBeInTheDocument();
    expect(screen.queryByText("Ada-specific answer.")).not.toBeInTheDocument();
    expect(screen.getByText(/I am ready to receive your travel question/)).toBeInTheDocument();
    expect(window.sessionStorage.getItem("cct.customer.advisor.confirmed-context.v1")).toBeNull();

    await user.type(screen.getByRole("textbox", { name: "Message the advisor" }), "Hello");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByText("Hello");
    const request = JSON.parse(fetchMock.mock.calls[1]![1]!.body as string) as { confirmedContext: unknown[]; conversation: unknown[] };
    expect(request.confirmedContext).toEqual([]);
    expect(request.conversation).toEqual([]);
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
