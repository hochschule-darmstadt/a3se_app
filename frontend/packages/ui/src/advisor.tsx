import { ActionIcon, Button, Drawer, Group, Paper, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { CctIcon } from "./icons.js";

export interface AdvisorMessage {
  readonly id: string;
  readonly speaker: "customer" | "advisor";
  readonly text: string;
  readonly state?: "answered" | "uncertain" | "no-answer" | "handover" | "failed";
}

export interface AdvisorReply {
  readonly text: string;
  readonly state?: AdvisorMessage["state"];
  /** Operations are applied to the browser-owned My Travel draft only. */
  readonly actions?: readonly AdvisorAction[];
}

export interface AdvisorAction {
  readonly type: "add-traveller" | "add-position" | "remove-position" | "replace-position" | "reorder-positions";
  readonly stockItemId?: string;
  readonly productId?: string;
  readonly serviceDate?: string;
  readonly displayNameChain?: readonly string[];
  readonly unitPriceAmount?: string;
  readonly currencyCode?: string;
  readonly clientPositionId?: string;
  readonly clientTravellerIds?: readonly string[];
  readonly clientPositionIds?: readonly string[];
  readonly clientTravellerId?: string;
  readonly displayName?: string;
  readonly travellerKind?: "self" | "new";
  readonly givenName?: string;
  readonly familyName?: string;
}

export interface AdvisorConversationTurn {
  readonly role: "customer" | "advisor";
  readonly content: string;
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
  readonly failedReply: string;
}

export interface AdvisorConversationProps {
  readonly labels: AdvisorConversationLabels;
  readonly initialMessages?: readonly AdvisorMessage[];
  readonly sessionStorageKey?: string;
  /** Opens the drawer when the owning route requests the advisor surface. */
  readonly open?: boolean;
  readonly onSend?: (message: string, onChunk: (chunk: string) => void, conversation: readonly AdvisorConversationTurn[]) => Promise<string | AdvisorReply>;
}

/** DS-CMP-009/010: shared advisor conversation; actions affect only client draft state. */
export function AdvisorConversation({ labels, initialMessages = [], sessionStorageKey, open = false, onSend }: AdvisorConversationProps) {
  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AdvisorMessage[]>(() => {
    if (sessionStorageKey && typeof window !== "undefined") {
      try {
        const stored = JSON.parse(window.sessionStorage.getItem(sessionStorageKey) ?? "null");
        if (Array.isArray(stored)) return stored as AdvisorMessage[];
      } catch { /* discard malformed session memory */ }
    }
    return [...initialMessages];
  });
  const [submitting, setSubmitting] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setOpened(true);
  }, [open]);

  useEffect(() => {
    if (sessionStorageKey) window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(messages));
  }, [messages, sessionStorageKey]);

  useEffect(() => {
    if (!opened) return;
    const frame = requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (viewport) {
        if (typeof viewport.scrollTo === "function") {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
        } else {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, opened]);

  async function sendMessage() {
    const text = draft.trim();
    if (!text || submitting) return;
    const messageId = `${Date.now()}`;
    const advisorMessageId = `${messageId}-advisor`;
    const conversation = messages
      .filter((message) => message.id !== "welcome" && message.text.trim())
      .slice(-20)
      .map((message) => ({ role: message.speaker, content: message.text } satisfies AdvisorConversationTurn));
    setMessages((current) => [...current, { id: `${messageId}-customer`, speaker: "customer", text }]);
    setMessages((current) => [...current, { id: advisorMessageId, speaker: "advisor", text: "" }]);
    setDraft("");
    setSubmitting(true);
    try {
      const streamedText: string[] = [];
      const reply = onSend
        ? await onSend(text, (chunk) => {
          streamedText.push(chunk);
          setMessages((current) => current.map((message) => message.id === advisorMessageId
            ? { ...message, text: `${message.text}${chunk}` }
            : message));
        }, conversation)
        : labels.placeholderReply;
      const normalized = typeof reply === "string" ? { text: reply } : reply;
      setMessages((current) => current.map((message) => message.id === advisorMessageId
        ? { ...message, text: normalized.text || message.text || streamedText.join(""), state: normalized.state }
        : message));
    } catch {
      setMessages((current) => current.map((message) => message.id === advisorMessageId
        ? { ...message, text: labels.failedReply, state: "failed" }
        : message));
    } finally {
      setSubmitting(false);
    }
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
          <ScrollArea viewportRef={viewportRef} flex={1} type="auto" offsetScrollbars>
            <Stack gap="sm" aria-live="polite" aria-label={labels.title}>
              {messages.length === 0 ? <Text size="sm" c="dimmed">{labels.placeholder}</Text> : null}
              {messages.map((message) => (
                <Paper key={message.id} withBorder p="sm" radius="md" ml={message.speaker === "customer" ? "xl" : undefined} bg={message.speaker === "customer" ? "orange.0" : message.state === "uncertain" || message.state === "no-answer" ? "yellow.0" : message.state === "failed" ? "red.0" : "gray.0"}>
                  <Text size="xs" fw={700} mb={4}>{message.speaker === "customer" ? labels.customer : labels.advisor}</Text>
                  <Text size="sm">{message.text}</Text>
                </Paper>
              ))}
            </Stack>
          </ScrollArea>
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <Group align="end" gap="xs" wrap="nowrap">
              <TextInput style={{ flex: 1 }} label={labels.inputLabel} placeholder={labels.placeholder} value={draft} onChange={(event) => setDraft(event.currentTarget.value)} />
              <ActionIcon type="submit" color="actionSecondary" variant="filled" size="lg" aria-label={labels.send} disabled={!draft.trim() || submitting}>
                <IconSend size={18} aria-hidden />
              </ActionIcon>
            </Group>
          </form>
        </Stack>
      </Drawer>
    </>
  );
}
