import { Button, Container, Group, List, Stack, Text, Title } from "@mantine/core";
import { useApiQuery, type ApiError } from "@cct/api-client";
import { ApiErrorBanner, StatusBanner, useMockActor } from "@cct/ui";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { checkAvailability, findAvailableDates, findStockItem, type AvailabilityResult } from "../lib/availability";
import { productTitle } from "../lib/product-display";
import { CustomerShell } from "../lib/shell";
import { useTravel } from "../lib/travel";
import { DateTravellerPicker } from "../lib/date-traveller-picker";

export function meta() {
  return [{ title: "Travel product – Christopher Columbus Travel" }];
}

/**
 * VIEW-C-010: product itinerary/services and the requested-date
 * availability check. Availability is proven only by probing the
 * deterministic seeded `StockItem` id directly -- never
 * fabricated from the product record alone.
 */
export default function ProductDetail() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const { actor } = useMockActor();
  const travel = useTravel();
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const requestedDate = searchParams.get("date") ?? "";
  const resultsParams = new URLSearchParams(searchParams);
  resultsParams.delete("date");
  const backToResultsHref = resultsParams.get("destinationOrTheme")
    ? `/search?${resultsParams.toString()}`
    : "/";

  const productQuery = useApiQuery(["product", productId], () =>
    apiClient.GET("/products/{product_id}", { params: { path: { product_id: productId ?? "" } } })
  );

  const componentsQuery = useApiQuery(
    ["product-components", productId],
    () => apiClient.GET("/products/{product_id}/components", { params: { path: { product_id: productId ?? "" } } }),
    { enabled: productQuery.isSuccess }
  );

  const supplierQuery = useApiQuery(
    ["product-supplier", productId],
    () => apiClient.GET("/products/{product_id}/supplier", { params: { path: { product_id: productId ?? "" } } }),
    { enabled: productQuery.isSuccess }
  );

  const availabilityQuery = useQuery<AvailabilityResult, any>({
    queryKey: ["availability", productId, requestedDate],
    queryFn: () => checkAvailability(apiClient, productId ?? "", requestedDate),
    enabled: Boolean(productId) && Boolean(requestedDate) && productQuery.isSuccess,
    retry: false,
  });
  const dateFrom = searchParams.get("dateFrom") || requestedDate;
  const dateTo = searchParams.get("dateTo") || requestedDate;
  const datesQuery = useQuery({
    queryKey: ["detail-dates", productId, dateFrom, dateTo],
    queryFn: () => findAvailableDates(apiClient, productId ?? "", dateFrom, dateTo),
    enabled: Boolean(productId) && Boolean(dateFrom) && Boolean(dateTo) && productQuery.isSuccess,
    retry: false,
  });
  const pickerDates = datesQuery.data ?? (requestedDate ? [requestedDate] : []);

  return (
    <CustomerShell
      breadcrumbs={[
        { label: "Travel portal", to: "/" },
        { label: "Search results", to: backToResultsHref },
        { label: productQuery.isSuccess ? productQuery.data.displayNameChain.join(" · ") : t("detail.heading") },
      ]}
    >
      <Container py="xl" size="md">
        <Stack gap="lg">
          {productQuery.isPending ? <StatusBanner kind="loading" title={t("detail.loading")} /> : null}
          {productQuery.isError ? (
            <ApiErrorBanner error={productQuery.error} onRetry={() => productQuery.refetch()} />
          ) : null}

          {productQuery.isSuccess ? (
            <Stack gap="md">
              <Title order={2}>{productQuery.data.displayNameChain.join(" · ")}</Title>
              {productQuery.data.properties.description ? <Text size="lg">{productQuery.data.properties.description}</Text> : null}
              <Group><Text fw={500} size="sm" w={120}>ID</Text><Text size="sm">{productQuery.data.entityId}</Text></Group>
              <Group><Text fw={500} size="sm" w={120}>Type</Text><Text size="sm">{productQuery.data.type.replace(/^product\//, "").replaceAll("/", " · ")}</Text></Group>
              {Object.entries(productQuery.data.properties)
                .filter(([key, value]) => !["description", "lifecycleStatusCode", "name"].includes(key) && value !== null && value !== "")
                .map(([key, value]) => <Group key={key}><Text fw={500} size="sm" w={120}>{key.replace(/Code$/, "").replace(/([a-z])([A-Z])/g, "$1 $2")}</Text><Text size="sm">{String(value)}</Text></Group>)}
              {supplierQuery.isSuccess && supplierQuery.data ? <Group><Text fw={500} size="sm" w={120}>Supplier</Text><Text size="sm">{supplierQuery.data.displayNameChain.join(" · ")}</Text></Group> : null}
              {requestedDate ? <Text size="sm">{t("detail.requestedDate")}: {requestedDate}</Text> : null}

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

                  {availabilityQuery.isSuccess ? renderAvailabilitySummary(availabilityQuery.data) : null}
                </Stack>
              ) : null}

              {datesQuery.isError ? <ApiErrorBanner error={datesQuery.error as unknown as ApiError} onRetry={() => void datesQuery.refetch()} /> : null}
              <DateTravellerPicker dates={pickerDates.map((date) => ({ date, position: { stockItemId: "", productId: productId ?? "", displayNameChain: productQuery.data.displayNameChain, serviceDate: date, unitPriceAmount: "0", currencyCode: "EUR" } }))} onAdded={async (positions) => {
                const resolved = await Promise.all(positions.map(async (position) => { const stock = await findStockItem(apiClient, position.productId, position.serviceDate); return stock ? { ...position, stockItemId: stock.entityId, unitPriceAmount: String(stock.properties.unitPriceAmount), currencyCode: stock.properties.currencyCode } : null; }));
                const valid = resolved.filter((position): position is NonNullable<typeof position> => Boolean(position));
                if (valid.length) travel.addPositions(valid);
                if (valid.length && !actor) navigate(`/sign-in?${new URLSearchParams({ returnTo: "/travel" }).toString()}`);
              }} />

              <Button component={Link} to={backToResultsHref} variant="light">
                {t("detail.back")}
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </CustomerShell>
  );

  function renderAvailabilitySummary(result: AvailabilityResult) {
    if (result.status === "unavailable") return <><StatusBanner kind="empty" title={t("detail.unavailable", { date: requestedDate })} description={t("detail.unavailable.description")} /><Text size="sm">{t("detail.alternative.none")}</Text></>;
    const label = result.status === "alternative" ? t("travel.addAlternative", { date: result.date }) : t("travel.add");
    return <><StatusBanner kind={result.status === "available" ? "success" : "info"} title={result.status === "available" ? t("detail.available", { date: result.date }) : t("detail.unavailable", { date: requestedDate })} />{result.status === "alternative" ? <Text size="sm">{t("detail.alternative.found", { date: result.date })}</Text> : null}<Text size="sm">{t("detail.available.price")}: {result.stockItem.properties.unitPriceAmount} {result.stockItem.properties.currencyCode}</Text><Button color="orange" onClick={() => { travel.addPositions([{ stockItemId: result.stockItem.entityId, productId: result.stockItem.productId, displayNameChain: result.stockItem.productDisplayNameChain, serviceDate: result.date, unitPriceAmount: String(result.stockItem.properties.unitPriceAmount), currencyCode: result.stockItem.properties.currencyCode, clientTravellerId: "self" }]); if (!actor) navigate(`/sign-in?${new URLSearchParams({ returnTo: `${location.pathname}${location.search}` }).toString()}`); }}>{label}</Button></>;
  }

}
