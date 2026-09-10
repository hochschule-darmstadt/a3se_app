import { Badge, Button, Card, Container, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { CctIcon } from "@cct/ui";
import { Link } from "react-router";

import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";

export function meta() { return [{ title: "Travel assistance – Christopher Columbus Travel" }]; }

/** VIEW-C-007: confirmed context surface for the prototype advisor conversation. */
export default function Assistance() {
  const t = useT();
  return <CustomerShell breadcrumbs={[{ label: "Travel portal", to: "/" }, { label: t("assistance.heading") }]}>
    <Container size="lg" py="xl"><Stack gap="lg">
      <Group justify="space-between" align="flex-start"><div><Text size="sm" c="dimmed">VIEW-C-007</Text><Title order={1}>{t("assistance.heading")}</Title></div><Badge color="actionSecondary" leftSection={<CctIcon.assistance size={14} aria-hidden />}>{t("advisor.title")}</Badge></Group>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card withBorder padding="lg"><Stack gap="sm"><Title order={2}>{t("assistance.context.heading")}</Title><Detail label={t("assistance.context.order")} value="TO-2048 · Madeira walking week" /><Detail label={t("assistance.context.issueLabel")} value={t("assistance.context.issue")} /><Detail label={t("assistance.context.stateLabel")} value={t("assistance.context.state")} /><Text size="sm" c="dimmed">{t("assistance.context.note")}</Text></Stack></Card>
        <Card withBorder padding="lg"><Stack gap="sm"><Title order={2}>{t("assistance.handover.heading")}</Title><Text>{t("assistance.handover.body")}</Text><Button component={Link} to="/my-orders" variant="light" color="blue">{t("assistance.orders")}</Button></Stack></Card>
      </SimpleGrid>
      <Card withBorder padding="lg"><Stack gap="xs"><Title order={2}>{t("assistance.advisor.heading")}</Title><Text>{t("assistance.advisor.body")}</Text><Text size="sm" c="dimmed">{t("assistance.advisor.footer")}</Text></Stack></Card>
    </Stack></Container>
  </CustomerShell>;
}

function Detail({ label, value }: { readonly label: string; readonly value: string }) {
  return <div><Text size="xs" fw={700} tt="uppercase" c="dimmed">{label}</Text><Text>{value}</Text></div>;
}
