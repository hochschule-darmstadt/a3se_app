import { AdvisorConversation, type AdvisorConversationTurn, type AdvisorReply } from "@cct/ui";

import { apiBaseUrl } from "./api";
import { useT } from "./i18n";
import { useState } from "react";

interface AdvisorContextItem {
  readonly key: string;
  readonly value: string;
}

const CONFIRMED_CONTEXT_KEY = "cct.customer.advisor.confirmed-context.v1";

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
  const [confirmedContext] = useState(readConfirmedContext);
  const initialMessages = [{ id: "welcome", speaker: "advisor" as const, text: t("advisor.welcome") }];

  async function askAdvisor(message: string, onChunk: (chunk: string) => void, conversation: readonly AdvisorConversationTurn[]): Promise<AdvisorReply> {
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/advisor/answer/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, confirmedContext, conversation }),
    });
    if (!response.ok || !response.body) throw new Error("advisor request failed");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let completed: AdvisorReply | undefined;
    const processLine = async (line: string) => {
      if (!line.trim()) return;
      const event = JSON.parse(line) as { type: string; text?: string; answer?: string; state?: AdvisorReply["state"] };
      if (event.type === "chunk" && event.text) {
        onChunk(event.text);
        // Several network chunks can arrive in one reader turn. Yield so
        // React/browser rendering can paint each streamed update separately.
        await new Promise((resolve) => window.setTimeout(resolve, 0));
      }
      if (event.type === "complete") completed = { text: event.answer ?? "", state: event.state };
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
    return completed;
  }

  return (
    <AdvisorConversation
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
      sessionStorageKey="cct.customer.advisor.conversation.v1"
      onSend={askAdvisor}
    />
  );
}
