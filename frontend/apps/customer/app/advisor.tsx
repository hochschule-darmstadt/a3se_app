import { AdvisorConversation, MOCK_AUTH_SIGNED_OUT_EVENT, useMockActor, type AdvisorConversationTurn, type AdvisorReply } from "@cct/ui";

import { apiBaseUrl } from "./api";
import { useT } from "./i18n";
import { useEffect, useRef, useState } from "react";
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

function isTravelPlanningRequest(message: string, conversation: readonly AdvisorConversationTurn[] = []) {
  // Terms such as “itinerary”, “travel”, and “accommodation” also occur in
  // ordinary glossary/RAG questions. Only explicit planning intent should
  // leave the streaming Q&A path, where the answer text is available as it is
  // generated.
  return /\b(book|booking|plan|planning|compose|add|propose|suggest|missing|plausib|reserve|build)\b/i.test(message)
    || /^[A-Z][a-z]+\s+[A-Z][a-z]+$/.test(message.trim())
    || (/^\S+\s+\S+$/.test(message.trim()) && conversation.some((turn) => turn.role === "advisor" && /name of your travel partner/i.test(turn.content)));
}

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
  // Composition is a multi-turn exchange: the answers to “which city do you
  // depart from?” or “how many days?” carry no planning keyword of their own.
  // Once planning has started every turn stays on the deterministic compose
  // endpoint until a draft is proposed, so the generative Q&A path can never
  // answer a planning question and claim a booking that did not happen.
  const planningActive = useRef(false);
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
      planningActive.current = false;
    };
    window.addEventListener(MOCK_AUTH_SIGNED_OUT_EVENT, reset);
    return () => window.removeEventListener(MOCK_AUTH_SIGNED_OUT_EVENT, reset);
  }, []);

  async function askAdvisor(message: string, onChunk: (chunk: string) => void, conversation: readonly AdvisorConversationTurn[]): Promise<AdvisorReply> {
    const requestBody = JSON.stringify({ message, confirmedContext, conversation });
    // Planning uses the typed response so client-side draft actions survive the
    // round trip. Ordinary RAG questions retain the existing NDJSON streaming UX.
    if (planningActive.current || isTravelPlanningRequest(message, conversation)) {
      if (!actor) {
        const returnTo = `${location.pathname}${location.search}`;
        navigate(`/sign-in?${new URLSearchParams({ returnTo }).toString()}`);
        return { text: t("advisor.signInRequired"), state: "no-answer" };
      }
      planningActive.current = true;
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/advisor/compose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
      if (!response.ok) throw new Error("advisor request failed");
      const payload = await response.json() as { answer?: string; state?: AdvisorReply["state"]; actions?: AdvisorReply["actions"]; uncertaintyReason?: string };
      const reply: AdvisorReply = {
        text: payload.answer || payload.uncertaintyReason || "I could not confirm an answer from the approved travel information.",
        state: payload.state,
        actions: payload.actions,
      };
      if (reply.text) onChunk(reply.text);
      if (reply.actions?.length) {
        // Positions are created per traveller, so the signed-in customer must
        // exist in the draft before the proposed components are applied.
        if (!travel.travellers.some((traveller) => traveller.clientTravellerId === "self")) {
          travel.addTraveller({ clientTravellerId: "self", kind: "self", displayName: actor.displayName });
        }
        travel.applyAdvisorActions(reply.actions);
        planningActive.current = false;
      }
      return reply;
    }
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/advisor/answer/stream`, {
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
        // Several network chunks can arrive in one reader turn. Yield so
        // React/browser rendering can paint each streamed update separately.
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
    if (completed.actions?.length) travel.applyAdvisorActions(completed.actions);
    return completed;
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
