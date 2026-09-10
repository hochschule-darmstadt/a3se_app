import { ActionIcon, Button, Drawer, Group, Paper, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";

import { CctIcon } from "./icons.js";

export interface AdvisorMessage {
  readonly id: string;
  readonly speaker: "customer" | "advisor";
  readonly text: string;
}

export interface AdvisorConversationLabels {
  readonly launcher: string;
  readonly title: string;
  readonly inputLabel: string;
  readonly placeholder: string;
  readonly send: string;
  readonly close: string;
  readonly customer: string;
  readonly advisor: string;
  readonly placeholderReply: string;
}

export interface AdvisorConversationProps {
  readonly labels: AdvisorConversationLabels;
  readonly initialMessages?: readonly AdvisorMessage[];
}

/** DS-CMP-009/010: the visual advisor boundary used before live Q&A and actions exist. */
export function AdvisorConversation({ labels, initialMessages = [] }: AdvisorConversationProps) {
  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AdvisorMessage[]>(() => [...initialMessages]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const messageId = `${Date.now()}`;
    setMessages((current) => [
      ...current,
      { id: `${messageId}-customer`, speaker: "customer", text },
      { id: `${messageId}-advisor`, speaker: "advisor", text: labels.placeholderReply },
    ]);
    setDraft("");
  }

  return (
    <>
      <Button
        type="button"
        color="actionSecondary"
        aria-label={labels.launcher}
        title={labels.launcher}
        onClick={() => setOpened(true)}
        style={{ position: "fixed", right: "1.25rem", bottom: "1.25rem", zIndex: 100, width: 58, height: 58, padding: 0, borderRadius: "50%" }}
      >
        <CctIcon.assistance size={24} aria-hidden />
        <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>{labels.launcher}</span>
      </Button>

      <Drawer opened={opened} onClose={() => setOpened(false)} position="right" size={420} title={labels.title} closeButtonProps={{ "aria-label": labels.close }}>
        <Stack gap="md" h="calc(100vh - 7rem)">
          <ScrollArea flex={1} type="auto" offsetScrollbars>
            <Stack gap="sm" aria-live="polite" aria-label={labels.title}>
              {messages.length === 0 ? <Text size="sm" c="dimmed">{labels.placeholder}</Text> : null}
              {messages.map((message) => (
                <Paper key={message.id} withBorder p="sm" radius="md" ml={message.speaker === "customer" ? "xl" : undefined} bg={message.speaker === "customer" ? "orange.0" : "gray.0"}>
                  <Text size="xs" fw={700} mb={4}>{message.speaker === "customer" ? labels.customer : labels.advisor}</Text>
                  <Text size="sm">{message.text}</Text>
                </Paper>
              ))}
            </Stack>
          </ScrollArea>
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <Group align="end" gap="xs" wrap="nowrap">
              <TextInput style={{ flex: 1 }} label={labels.inputLabel} placeholder={labels.placeholder} value={draft} onChange={(event) => setDraft(event.currentTarget.value)} />
              <ActionIcon type="submit" color="actionSecondary" variant="filled" size="lg" aria-label={labels.send} disabled={!draft.trim()}>
                <IconSend size={18} aria-hidden />
              </ActionIcon>
            </Group>
          </form>
        </Stack>
      </Drawer>
    </>
  );
}
