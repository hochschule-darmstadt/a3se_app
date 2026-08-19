import { Button, Container, NumberInput, Stack, TextInput, Title } from "@mantine/core";
import { FormErrorSummary } from "@cct/ui";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";

import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";

export function meta() {
  return [{ title: "Christopher Columbus Travel" }];
}

/**
 * VIEW-C-001 (structured-search half only; the Automated Travel Advisor
 * chat side of this view is out of scope for issue #22's thin slice).
 * Captures travel criteria and hands off to the results route (C-009) via
 * URL search params -- see DR-0015: these criteria are context only, the
 * results route performs no client-side filtering.
 */
export default function CustomerHome() {
  const t = useT();
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [travellers, setTravellers] = useState<number | string>(1);
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: string[] = [];
    if (!origin.trim()) nextErrors.push(t("home.error.origin"));
    if (!destination.trim()) nextErrors.push(t("home.error.destination"));
    if (!date || Number.isNaN(Date.parse(date))) nextErrors.push(t("home.error.date"));
    const travellerCount = Number(travellers);
    if (!Number.isFinite(travellerCount) || travellerCount < 1) nextErrors.push(t("home.error.travellers"));

    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    const params = new URLSearchParams({
      origin: origin.trim(),
      destination: destination.trim(),
      date,
      travellers: String(travellerCount),
    });
    navigate(`/search?${params.toString()}`);
  }

  return (
    <CustomerShell>
      <Container py="xl" size="md">
        <Stack gap="lg">
          <Title order={1}>{t("home.heading")}</Title>
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              <FormErrorSummary errors={errors} />
              <TextInput
                label={t("home.origin.label")}
                placeholder={t("home.origin.placeholder")}
                value={origin}
                onChange={(event) => setOrigin(event.currentTarget.value)}
              />
              <TextInput
                label={t("home.destination.label")}
                placeholder={t("home.destination.placeholder")}
                value={destination}
                onChange={(event) => setDestination(event.currentTarget.value)}
              />
              <TextInput
                type="date"
                label={t("home.date.label")}
                value={date}
                onChange={(event) => setDate(event.currentTarget.value)}
              />
              <NumberInput
                label={t("home.travellers.label")}
                min={1}
                value={travellers}
                onChange={setTravellers}
              />
              <Button type="submit" color="orange">
                {t("home.submit")}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </CustomerShell>
  );
}
