import { AdvisorConversation, type AdvisorReply } from "@cct/ui";

import { apiClient } from "./api";
import { useT } from "./i18n";

/** Global customer advisor surface for VIEW-C-007; #46 provides read-only grounded answers. */
export function CustomerAdvisor() {
  const t = useT();
  const initialMessages = [{ id: "welcome", speaker: "advisor" as const, text: t("advisor.welcome") }];

  async function askAdvisor(message: string): Promise<AdvisorReply> {
    const result = await apiClient.POST("/advisor/answer", { body: { message, confirmedContext: [] } });
    if (!result.response.ok || !result.data) throw new Error("advisor request failed");
    return { text: result.data.answer, state: result.data.state };
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
