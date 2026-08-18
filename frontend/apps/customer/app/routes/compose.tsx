import { Button, Container, NumberInput, Stack, Text, Title } from "@mantine/core";
import { useApiQuery } from "@cct/api-client";
import { ApiErrorBanner, StatusBanner } from "@cct/ui";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { productTitle } from "../lib/product-display";

export function meta() {
  return [{ title: "Compose your travel – Christopher Columbus Travel" }];
}

/**
 * VIEW-C-002: reviews the selected product + confirmed date and captures a
 * simple traveller composition. Per the issue's own scope note, only the
 * single seeded traveller role (`PER-001-TRAVELLER`) is actually assigned to
 * the order later (see `routes/order.tsx`); party size beyond 1 is captured
 * for display only -- this thin slice does not model individually addressed
 * co-travellers.
 */
export default function Compose() {
  const t = useT();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId") ?? "";
  const date = searchParams.get("date") ?? "";
  const origin = searchParams.get("origin") ?? "";
  const destination = searchParams.get("destination") ?? "";
  const [travellers, setTravellers] = useState<number | string>(
    Number(searchParams.get("travellers")) || 1
  );

  const productQuery = useApiQuery(["product", productId], () =>
    apiClient.GET("/products/{product_id}", { params: { path: { product_id: productId } } })
  );

  function handleContinue() {
    const params = new URLSearchParams({
      productId,
      date,
      travellers: String(Number(travellers) || 1),
      origin,
      destination,
    });
    navigate(`/sign-in?${params.toString()}`);
  }

  return (
    <Container component="main" py="xl" size="md">
      <Stack gap="lg">
        <Title order={1}>{t("compose.heading")}</Title>

        {productQuery.isPending ? <StatusBanner kind="loading" title={t("detail.loading")} /> : null}
        {productQuery.isError ? (
          <ApiErrorBanner error={productQuery.error} onRetry={() => productQuery.refetch()} />
        ) : null}

        {productQuery.isSuccess ? (
          <Stack gap="md">
            <Text>
              {t("compose.summary.product")}: {productTitle(productQuery.data)}
            </Text>
            <Text>
              {t("compose.summary.date")}: {date}
            </Text>
            <NumberInput
              label={t("compose.travellers.label")}
              min={1}
              value={travellers}
              onChange={setTravellers}
            />
            <Text size="sm" c="dimmed">
              {t("compose.travellers.note")}
            </Text>
            <Button color="orange" onClick={handleContinue}>
              {t("compose.continue")}
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
