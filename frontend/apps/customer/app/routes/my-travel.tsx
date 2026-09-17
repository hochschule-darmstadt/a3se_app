import { Button, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { toApiError, type ApiError } from "@cct/api-client";
import { ApiErrorBanner, StatusBanner, useMockActor } from "@cct/ui";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";
import { useTravel } from "../lib/travel";
import type { TravelPosition } from "../lib/travel";

export default function MyTravel() {
  const t = useT();
  const { actor } = useMockActor();
  const travel = useTravel();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  useEffect(() => { if (!actor) navigate(`/sign-in?${new URLSearchParams({ returnTo: "/travel" })}`, { replace: true }); }, [actor, navigate]);
  const groups = useMemo(() => [...travel.positions.reduce((map, position) => {
    const key = position.productId;
    const group = map.get(key) ?? { productId: key, displayNameChain: position.displayNameChain, positions: [] as TravelPosition[] };
    group.positions.push(position); map.set(key, group); return map;
  }, new Map<string, { productId: string; displayNameChain: readonly string[]; positions: TravelPosition[] }>()).values()], [travel.positions]);
  const total = useMemo(() => travel.positions.reduce((sum, item) => sum + Number(item.unitPriceAmount), 0), [travel.positions]);
  if (!actor) return null;
  const customerPersonId = actor.personId;

  async function placeOrder() {
    setSubmitting(true); setError(null);
    const referencedIds = new Set(travel.positions.map((item) => item.clientTravellerId));
    const knownTravellers = travel.travellers.some((item) => item.clientTravellerId === "self") ? travel.travellers : [...travel.travellers, { clientTravellerId: "self", kind: "self" as const, displayName: actor?.displayName ?? "Myself" }];
    const travellers = knownTravellers.filter((item) => referencedIds.has(item.clientTravellerId)).map((item) => {
      // Migrate older browser drafts created before AI traveller actions
      // carried structured names. The API intentionally remains strict.
      if (item.kind === "new" && (!item.givenName || !item.familyName)) {
        const parts = item.displayName.trim().split(/\s+/);
        const [givenName, ...familyParts] = parts;
        return { clientTravellerId: item.clientTravellerId, kind: item.kind, givenName, familyName: familyParts.join(" ") };
      }
      return { clientTravellerId: item.clientTravellerId, kind: item.kind, givenName: item.givenName, familyName: item.familyName };
    });
    const { data, response, error: apiError } = await apiClient.POST("/orders/place", { body: {
      customerPersonId, travellers,
      positions: travel.positions.map((item) => ({ stockItemId: item.stockItemId, clientTravellerId: item.clientTravellerId })),
    } });
    setSubmitting(false);
    if (!response.ok || !data) { setError(toApiError(apiError, response)); return; }
    travel.clear();
    navigate(`/my-orders?${new URLSearchParams({ detail: data.entityId, placed: data.entityId })}`);
  }

  return <CustomerShell breadcrumbs={[{ label: "Travel portal", to: "/" }, { label: t("travel.heading") }]}>
    <Container size="md" py="xl"><Stack gap="lg">
      <Title order={1}>{t("travel.heading")}</Title>
      <Text>{actor.displayName}</Text>
      {error ? <ApiErrorBanner error={error} onRetry={placeOrder} /> : null}
      {travel.positions.length === 0 ? <StatusBanner kind="empty" title={t("travel.empty")} /> : <>
        {groups.map((group) => (<Card key={group.productId} withBorder><Stack gap="xs">
            <Title order={2}>{group.displayNameChain.join(" · ")}</Title>
            <Text>{group.positions.length} {t("travel.picker.combinations")}</Text>
            {group.positions.map((position) => { const traveller = travel.travellers.find((item) => item.clientTravellerId === position.clientTravellerId); return <Group key={position.clientPositionId} justify="space-between"><Text>{position.serviceDate} · {traveller?.displayName ?? position.clientTravellerId}</Text><Button variant="subtle" color="red" onClick={() => travel.removePosition(position.clientPositionId)}>{t("travel.remove")}</Button></Group>; })}
            <Text>{(group.positions.reduce((sum, item) => sum + Number(item.unitPriceAmount), 0)).toFixed(2)} {group.positions[0]?.currencyCode}</Text>
            <Button variant="light" color="red" onClick={() => group.positions.forEach((position) => travel.removePosition(position.clientPositionId))}>{t("travel.removeProduct")}</Button>
          </Stack></Card>))}
        <Group justify="space-between"><Title order={2}>{t("travel.total")}: {total.toFixed(2)} EUR</Title>
          <Button color="orange" loading={submitting} onClick={placeOrder}>{t("travel.order")}</Button></Group>
      </>}
      <Button component={Link} to="/" variant="light">{t("nav.home")}</Button>
    </Stack></Container>
  </CustomerShell>;
}
