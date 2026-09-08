import { Button, Container, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { FormErrorSummary } from "@cct/ui";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";

import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";

export function meta() {
  return [{ title: "Christopher Columbus Travel" }];
}

/** VIEW-C-001 structured-search MVP. Criteria are carried to C-009 in the URL. */
export default function CustomerHome() {
  const t = useT();
  const navigate = useNavigate();
  const [destinationOrTheme, setDestinationOrTheme] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [travellers, setTravellers] = useState("1");
  const [departureLocationCode, setDepartureLocationCode] = useState("any");
  const [budgetPerPerson, setBudgetPerPerson] = useState("any");
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

    const params = new URLSearchParams({ destinationOrTheme: destinationOrTheme.trim(), dateFrom, dateTo, travellers, departureLocationCode, budgetPerPerson });
    navigate(`/search?${params.toString()}`);
  }

  return (
    <CustomerShell>
      <Container py="xl" size="md">
        <Stack gap="lg">
          <Title order={1}>{t("home.heading")}</Title>
          <Text>{t("home.intro")}</Text>
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              <FormErrorSummary errors={errors} />
              <TextInput label={t("home.destinationOrTheme.label")} placeholder={t("home.destinationOrTheme.placeholder")} value={destinationOrTheme} onChange={(event) => setDestinationOrTheme(event.currentTarget.value)} />
              <TextInput type="date" label={t("home.dateFrom.label")} value={dateFrom} onChange={(event) => setDateFrom(event.currentTarget.value)} />
              <TextInput type="date" label={t("home.dateTo.label")} value={dateTo} onChange={(event) => setDateTo(event.currentTarget.value)} />
              <Select label={t("home.travellers.label")} data={["1", "2", "3", "4", "5+"]} value={travellers} onChange={(value) => setTravellers(value ?? "1")} />
              <Select label={t("home.departureLocation.label")} data={[{ value: "any", label: t("home.any") }, "BER", "FRA", "MUC", "LIM", "CUZ"]} value={departureLocationCode} onChange={(value) => setDepartureLocationCode(value ?? "any")} />
              <Select label={t("home.budget.label")} data={[{ value: "any", label: t("home.any") }, "1000", "2000", "3000"]} value={budgetPerPerson} onChange={(value) => setBudgetPerPerson(value ?? "any")} />
              <Button type="submit" color="orange">{t("home.submit")}</Button>
            </Stack>
          </form>
          <section aria-label={t("home.advisor.heading")}>
            <Title order={2}>{t("home.advisor.heading")}</Title>
            <Text size="sm">{t("home.advisor.note")}</Text>
            <Button mt="sm" variant="light" disabled aria-label={t("home.advisor.launch")}>{t("home.advisor.launch")}</Button>
          </section>
        </Stack>
      </Container>
    </CustomerShell>
  );
}
