import { Button, Container, List, Stack, Text, Title } from "@mantine/core";
import { useApiQuery, type ApiError } from "@cct/api-client";
import { ApiErrorBanner, StatusBanner } from "@cct/ui";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { checkAvailability, type AvailabilityResult } from "../lib/availability";
import { productTitle } from "../lib/product-display";

export function meta() {
  return [{ title: "Travel product – Christopher Columbus Travel" }];
}

/**
 * VIEW-C-010: product itinerary/services and the requested-date
 * availability check. Availability is proven only by probing the
 * deterministic seeded `StockItem` id directly (DR-0015) -- never
 * fabricated from the product record alone.
 */
export default function ProductDetail() {
  const t = useT();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const requestedDate = searchParams.get("date") ?? "";
  const travellers = searchParams.get("travellers") ?? "";
  const origin = searchParams.get("origin") ?? "";
  const destination = searchParams.get("destination") ?? "";

  const productQuery = useApiQuery(["product", productId], () =>
    apiClient.GET("/products/{product_id}", { params: { path: { product_id: productId ?? "" } } })
  );

  const componentsQuery = useApiQuery(
    ["product-components", productId],
    () => apiClient.GET("/products/{product_id}/components", { params: { path: { product_id: productId ?? "" } } }),
    { enabled: productQuery.isSuccess }
  );

  const availabilityQuery = useQuery<AvailabilityResult, ApiError>({
    queryKey: ["availability", productId, requestedDate],
    queryFn: () => checkAvailability(apiClient, productId ?? "", requestedDate),
    enabled: Boolean(productId) && Boolean(requestedDate) && productQuery.isSuccess,
    retry: false,
  });

  function selectHref(confirmedDate: string) {
    const params = new URLSearchParams({
      productId: productId ?? "",
      date: confirmedDate,
      travellers,
      origin,
      destination,
    });
    return `/compose?${params.toString()}`;
  }

  return (
    <Container component="main" py="xl" size="md">
      <Stack gap="lg">
        <Title order={1}>{t("detail.heading")}</Title>

        {productQuery.isPending ? <StatusBanner kind="loading" title={t("detail.loading")} /> : null}
        {productQuery.isError ? (
          <ApiErrorBanner error={productQuery.error} onRetry={() => productQuery.refetch()} />
        ) : null}

        {productQuery.isSuccess ? (
          <Stack gap="md">
            <Title order={2}>{productTitle(productQuery.data)}</Title>
            <Text c="dimmed">{productQuery.data.entityId}</Text>
            <Text size="sm">
              {t("detail.requestedDate")}: {requestedDate || "–"}
            </Text>

            {componentsQuery.isSuccess && componentsQuery.data.length > 0 ? (
              <Stack gap="xs">
                <Title order={3}>{t("detail.components.heading")}</Title>
                <List>
                  {componentsQuery.data.map((component) => (
                    <List.Item key={component.entityId}>{productTitle(component)}</List.Item>
                  ))}
                </List>
              </Stack>
            ) : null}

            {requestedDate ? (
              <Stack gap="sm">
                {availabilityQuery.isPending ? (
                  <StatusBanner
                    kind="loading"
                    title={t("detail.checkingAvailability", { date: requestedDate })}
                  />
                ) : null}

                {availabilityQuery.isError ? (
                  <ApiErrorBanner error={availabilityQuery.error} onRetry={() => availabilityQuery.refetch()} />
                ) : null}

                {availabilityQuery.isSuccess ? renderAvailability(availabilityQuery.data) : null}
              </Stack>
            ) : null}

            <Link to="/search">{t("detail.back")}</Link>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );

  function renderAvailability(result: AvailabilityResult) {
    if (result.status === "available") {
      return (
        <Stack gap="xs">
          <StatusBanner kind="success" title={t("detail.available", { date: result.date })} />
          <Text size="sm">
            {t("detail.available.price")}: {result.stockItem.properties.unitPriceAmount}{" "}
            {result.stockItem.properties.currencyCode}
          </Text>
          <Button color="orange" onClick={() => navigate(selectHref(result.date))}>
            {t("detail.select")}
          </Button>
        </Stack>
      );
    }
    if (result.status === "alternative") {
      return (
        <Stack gap="xs">
          <StatusBanner kind="info" title={t("detail.unavailable", { date: requestedDate })} />
          <Text size="sm">{t("detail.alternative.found", { date: result.date })}</Text>
          <Text size="sm">
            {t("detail.available.price")}: {result.stockItem.properties.unitPriceAmount}{" "}
            {result.stockItem.properties.currencyCode}
          </Text>
          <Button color="orange" onClick={() => navigate(selectHref(result.date))}>
            {t("detail.alternative.select", { date: result.date })}
          </Button>
        </Stack>
      );
    }
    return (
      <Stack gap="xs">
        <StatusBanner
          kind="empty"
          title={t("detail.unavailable", { date: requestedDate })}
          description={t("detail.unavailable.description")}
        />
        <Text size="sm">{t("detail.alternative.none")}</Text>
      </Stack>
    );
  }
}
