import { AdvisorConversation } from "@cct/ui";

import { useT } from "./i18n";

/** Global customer advisor surface for VIEW-C-007; live Q&A and actions remain deferred to #46/#47. */
export function CustomerAdvisor() {
  const t = useT();
  const initialMessages = [{ id: "welcome", speaker: "advisor" as const, text: t("advisor.welcome") }];

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
      }}
      initialMessages={initialMessages}
    />
  );
}
