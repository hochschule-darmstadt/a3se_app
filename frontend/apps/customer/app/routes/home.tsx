import { Button, Card, Container, Group, Paper, Select, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { FormErrorSummary } from "@cct/ui";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";

export function meta() {
  return [{ title: "Christopher Columbus Travel" }];
}

const QUICK_LINKS = [
  { key: "coastal", query: "BER", accent: "linear-gradient(135deg, #0b7285, #74c0fc)" },
  { key: "southAmerica", query: "LIM", accent: "linear-gradient(135deg, #2b8a3e, #b2f2bb)" },
  { key: "city", query: "FRA", accent: "linear-gradient(135deg, #7048e8, #d0bfff)" },
];

/** VIEW-C-001: visual discovery home and structured search entry point. */
export default function CustomerHome() {
  const t = useT();
  const navigate = useNavigate();
  const [destinationOrTheme, setDestinationOrTheme] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [travellers, setTravellers] = useState("1");
  const [departureLocationCode, setDepartureLocationCode] = useState("any");
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: string[] = [];
    if (!destinationOrTheme.trim()) nextErrors.push(t("home.error.destinationOrTheme"));
    if (!dateFrom || Number.isNaN(Date.parse(dateFrom))) nextErrors.push(t("home.error.dateFrom"));
    if (!dateTo || Number.isNaN(Date.parse(dateTo))) nextErrors.push(t("home.error.dateTo"));
    if (dateFrom && dateTo && dateFrom > dateTo) nextErrors.push(t("home.error.dateOrder"));
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    const params = new URLSearchParams({ destinationOrTheme: destinationOrTheme.trim(), dateFrom, dateTo, travellers, departureLocationCode, budgetPerPerson: "any" });
    navigate(`/search?${params.toString()}`);
  }

  function quickLinkHref(query: string) {
    return `/search?${new URLSearchParams({ destinationOrTheme: query, dateFrom: "", dateTo: "", travellers: "2", departureLocationCode: "any", budgetPerPerson: "any" })}`;
  }

  return (
    <CustomerShell>
      <Stack gap={0}>
        <div style={{ minHeight: 360, display: "flex", alignItems: "flex-end", padding: "clamp(2rem, 8vw, 6rem) 0 3rem", background: "linear-gradient(120deg, rgba(8, 38, 66, .92), rgba(21, 101, 133, .58)), linear-gradient(135deg, #164e63, #f59e0b)" }}>
          <Container size="lg" w="100%">
            <Stack gap="xs" c="white">
              <Text fw={700} tt="uppercase" size="sm" style={{ letterSpacing: "0.12em" }}>{t("home.hero.eyebrow")}</Text>
              <Title order={1} c="white" maw={680}>{t("home.hero.heading")}</Title>
              <Text size="lg" maw={620}>{t("home.hero.note")}</Text>
            </Stack>
          </Container>
        </div>

        <Container size="lg" w="100%" mt={-34} pos="relative" style={{ zIndex: 1 }}>
          <Paper withBorder shadow="md" radius="lg" p="md">
            <form onSubmit={handleSubmit} noValidate>
              <Stack gap="sm">
                <FormErrorSummary errors={errors} />
                <Group align="end" gap="sm" wrap="wrap">
                  <TextInput style={{ flex: "2 1 220px" }} label={t("home.destinationOrTheme.label")} placeholder={t("home.destinationOrTheme.placeholder")} value={destinationOrTheme} onChange={(event) => setDestinationOrTheme(event.currentTarget.value)} />
                  <Select style={{ flex: "1 1 170px" }} label={t("home.departureLocation.label")} data={[{ value: "any", label: t("home.any") }, "BER", "FRA", "MUC", "LIM", "CUZ"]} value={departureLocationCode} onChange={(value) => setDepartureLocationCode(value ?? "any")} />
                  <TextInput style={{ flex: "1 1 150px" }} type="date" label={t("home.dateFrom.label")} value={dateFrom} onChange={(event) => setDateFrom(event.currentTarget.value)} />
                  <TextInput style={{ flex: "1 1 150px" }} type="date" label={t("home.dateTo.label")} value={dateTo} onChange={(event) => setDateTo(event.currentTarget.value)} />
                  <Select style={{ flex: "0 1 130px" }} label={t("home.travellers.label")} data={["1", "2", "3", "4", "5+"]} value={travellers} onChange={(value) => setTravellers(value ?? "1")} />
                  <Button type="submit" color="orange" size="md">{t("home.submit")}</Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Container>

        <Container size="lg" w="100%" py="xl">
          <Stack gap="lg">
            <div><Title order={2}>{t("home.quickLinks.heading")}</Title><Text c="dimmed">{t("home.quickLinks.note")}</Text></div>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
              {QUICK_LINKS.map((item) => <Card key={item.key} component={Link} to={quickLinkHref(item.query)} withBorder padding={0} radius="lg" style={{ overflow: "hidden", textDecoration: "none" }}>
                <div style={{ height: 150, background: item.accent, display: "flex", alignItems: "flex-end", padding: "1rem" }}><Title order={3} c="white">{t(`home.quickLinks.${item.key}`)}</Title></div>
                <Text p="md" c="dark">{t("home.quickLinks.explore")}</Text>
              </Card>)}
            </SimpleGrid>
          </Stack>
        </Container>
      </Stack>
    </CustomerShell>
  );
}
