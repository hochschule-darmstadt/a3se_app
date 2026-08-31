import { Button, Container, Stack, Title } from "@mantine/core";
import { useApiQuery } from "@cct/api-client";
import { ApiErrorBanner, OfferSummary, StatusBanner, useMockActor } from "@cct/ui";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { stockItemId } from "../lib/availability";
import { productTitle } from "../lib/product-display";
import { CustomerShell } from "../lib/shell";

export function meta() {
  return [{ title: "Your offer – Christopher Columbus Travel" }];
}

/**
 * VIEW-C-003: draft offer review before the real order submission
 * (`routes/order.tsx`). The "submit order" action here does not itself call
 * the backend -- it only navigates to `/order` with the same params, which
 * performs the actual `POST /orders`/positions/allocation sequence on
 * entry. This keeps the multi-call submission sequence, its retry, and its
 * distinct failure states (validation/conflict/retryable) in one place
 * (`order.tsx`) instead of splitting them across two routes. The button
 * still guards against a double click triggering a duplicate navigation by
 * disabling itself once pressed.
 */
export default function Offer() {
  const t = useT();
  const navigate = useNavigate();
  const { actor } = useMockActor();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId") ?? "";
  const date = searchParams.get("date") ?? "";
  const travellers = searchParams.get("travellers") ?? "1";
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!actor) {
      navigate(`/sign-in?${searchParams.toString()}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor]);

  const productQuery = useApiQuery(["product", productId], () =>
    apiClient.GET("/products/{product_id}", { params: { path: { product_id: productId } } })
  );

  const stockId = stockItemId(productId, date);
  const stockQuery = useApiQuery(
    ["stock-item", stockId],
    () => apiClient.GET("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: stockId } } }),
    { enabled: Boolean(productId) && Boolean(date) }
  );

  if (!actor) {
    return null;
  }

  function handleSubmit() {
    setSubmitting(true);
    navigate(`/order?${searchParams.toString()}`);
  }

  return (
    <CustomerShell
      breadcrumbs={[
        { label: "Travel portal", to: "/" },
        { label: "Trip composition", to: "/compose" },
        { label: "Sales Offer" },
      ]}
    >
      <Container py="xl" size="md">
        <Stack gap="lg">
          <Title order={1}>{t("offer.heading")}</Title>

          {productQuery.isPending || stockQuery.isPending ? (
            <StatusBanner kind="loading" title={t("detail.loading")} />
          ) : null}
          {productQuery.isError ? (
            <ApiErrorBanner error={productQuery.error} onRetry={() => productQuery.refetch()} />
          ) : null}
          {stockQuery.isError ? (
            <ApiErrorBanner error={stockQuery.error} onRetry={() => stockQuery.refetch()} />
          ) : null}

          {productQuery.isSuccess && stockQuery.isSuccess ? (
            <Stack gap="md">
              <OfferSummary
                orderLabel={t("offer.status.draft")}
                statusLabel={t("offer.status.draft")}
                positions={[
                  {
                    label: productTitle(productQuery.data),
                    detail: `${date} · ${travellers}`,
                    amount: stockQuery.data.properties.unitPriceAmount,
                  },
                ]}
                totalAmount={stockQuery.data.properties.unitPriceAmount}
                currencyCode={stockQuery.data.properties.currencyCode}
                pendingNote={t("offer.pendingNote")}
              />
              <Button color="orange" disabled={submitting} onClick={handleSubmit}>
                {submitting ? t("offer.submitting") : t("offer.submit")}
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </CustomerShell>
  );
}
