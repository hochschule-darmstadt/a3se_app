import { AdvisorConversation, MOCK_AUTH_SIGNED_OUT_EVENT, useMockActor, type AdvisorConversationTurn, type AdvisorReply } from "@cct/ui";

import { apiBaseUrl } from "./api";
import { useT } from "./i18n";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTravel } from "./lib/travel";

interface AdvisorContextItem {
  readonly key: string;
  readonly value: string;
}

const CONFIRMED_CONTEXT_KEY = "cct.customer.advisor.confirmed-context.v1";
const LEGACY_ADVISOR_CONVERSATION_KEYS = [
  "cct.customer.advisor.conversation.v1",
  "cct.customer.advisor.conversation.v2",
] as const;

function readConfirmedContext(): AdvisorContextItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(CONFIRMED_CONTEXT_KEY) ?? "null");
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is AdvisorContextItem =>
      typeof item?.key === "string" && item.key.length > 0 && item.key.length <= 100
      && typeof item?.value === "string" && item.value.length > 0 && item.value.length <= 500,
    );
  } catch {
    return [];
  }
}

/** Global customer advisor surface for VIEW-C-007; #46 provides read-only grounded answers. */
export function CustomerAdvisor() {
  const t = useT();
  const location = useLocation();
  const navigate = useNavigate();
  const { actor } = useMockActor();
  const [confirmedContext, setConfirmedContext] = useState(readConfirmedContext);
  const travel = useTravel();
  const initialMessages = [{ id: "welcome", speaker: "advisor" as const, text: t("advisor.welcome") }];

  useEffect(() => {
    // The transcript is intentionally memory-only. Remove values written by
    // earlier builds so pre-sign-in-gate proposals cannot be rehydrated.
    for (const key of LEGACY_ADVISOR_CONVERSATION_KEYS) window.sessionStorage.removeItem(key);
  }, []);

  useEffect(() => {
    // Confirmed facts and an unfinished planning exchange belong to the actor
    // who established them, including when another tab ends that actor.
    const reset = () => {
      window.sessionStorage.removeItem(CONFIRMED_CONTEXT_KEY);
      setConfirmedContext([]);
    };
    window.addEventListener(MOCK_AUTH_SIGNED_OUT_EVENT, reset);
    return () => window.removeEventListener(MOCK_AUTH_SIGNED_OUT_EVENT, reset);
  }, []);

  async function askAdvisor(message: string, onChunk: (chunk: string) => void, conversation: readonly AdvisorConversationTurn[]): Promise<AdvisorReply> {
    // Every message reaches the same LangGraph entry point. The server-side
    // LLM classifies the whole conversation before choosing RAG or draft
    // composition; the browser has no intent-keyword routing responsibility.
    const requestBody = JSON.stringify({ message, isAuthenticated: Boolean(actor), confirmedContext, conversation });
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/advisor/respond/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });
    if (!response.ok || !response.body) throw new Error("advisor request failed");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let completed: AdvisorReply | undefined;
    const processLine = async (line: string) => {
      if (!line.trim()) return;
      const event = JSON.parse(line) as { type: string; text?: string; answer?: string; state?: AdvisorReply["state"]; actions?: AdvisorReply["actions"] };
      if (event.type === "chunk" && event.text) {
        onChunk(event.text);
        await new Promise((resolve) => window.setTimeout(resolve, 0));
      }
      if (event.type === "complete") completed = { text: event.answer ?? "", state: event.state, actions: event.actions };
    };
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) await processLine(line);
      if (done) await processLine(buffer);
      if (done) break;
    }
    if (!completed) throw new Error("advisor stream ended without a completion event");
    const reply = completed;
    if (!actor && reply.text === "Please sign in before I can propose or compose travel. Your conversation will be kept so you can continue afterwards.") {
      const returnTo = `${location.pathname}${location.search}`;
      navigate(`/sign-in?${new URLSearchParams({ returnTo }).toString()}`);
    }
    if (reply.actions?.length && actor) {
      // Positions are created per traveller, so the signed-in customer must
      // exist in the draft before the proposed components are applied.
      if (!travel.travellers.some((traveller) => traveller.clientTravellerId === "self")) {
        travel.addTraveller({ clientTravellerId: "self", kind: "self", displayName: actor.displayName });
      }
      travel.applyAdvisorActions(reply.actions);
    }
    return reply;
  }

  return (
    <AdvisorConversation
      key="customer-advisor-memory-v1"
      labels={{
        launcher: t("advisor.launcher"),
        title: t("advisor.title"),
        inputLabel: t("advisor.input.label"),
        placeholder: t("advisor.input.placeholder"),
        send: t("advisor.send"),
        close: t("advisor.close"),
        customer: t("advisor.customer"),
        advisor: t("advisor.speaker"),
        placeholderReply: t("advisor.placeholderReply"),
        failedReply: t("advisor.failedReply"),
      }}
      initialMessages={initialMessages}
      open={location.pathname === "/assistance"}
      onSend={askAdvisor}
    />
  );
}
