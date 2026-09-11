import { AdvisorConversation, type AdvisorReply } from "@cct/ui";

import { apiBaseUrl } from "./api";
import { useT } from "./i18n";

/** Global customer advisor surface for VIEW-C-007; #46 provides read-only grounded answers. */
export function CustomerAdvisor() {
  const t = useT();
  const initialMessages = [{ id: "welcome", speaker: "advisor" as const, text: t("advisor.welcome") }];

  async function askAdvisor(message: string, onChunk: (chunk: string) => void): Promise<AdvisorReply> {
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/advisor/answer/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, confirmedContext: [] }),
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
      onSend={askAdvisor}
    />
  );
}
