import { Button, Container, Group, Select, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useApiQuery, type components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, ResourceCard, StatusBanner, useMockActor } from "@cct/ui";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";
import { findStockItem } from "../lib/availability";
import { useTravel } from "../lib/travel";

export function meta() { return [{ title: "Search results – Christopher Columbus Travel" }]; }
const PAGE_SIZE = 20;
type SearchResult = components["schemas"]["CatalogueSearchResult"];

/** VIEW-C-009: product-level search results with dates aggregated from matching StockItems. */
export default function SearchResults() {
  const t = useT();
  const { actor } = useMockActor();
  const travel = useTravel();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const destinationOrTheme = searchParams.get("destinationOrTheme") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const productType = searchParams.get("productType") ?? "all";
  const travellers = searchParams.get("travellers") ?? "";
  const budgetPerPerson = searchParams.get("budgetPerPerson") ?? "any";
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
  const query = useApiQuery(["catalogue-search", destinationOrTheme, dateFrom, dateTo, productType, cursor], () => apiClient.GET("/catalogue-search", {
    params: { query: { limit: PAGE_SIZE, cursor, search: destinationOrTheme, productType: productType === "all" ? undefined : productType, serviceDateFrom: dateFrom || undefined, serviceDateTo: dateTo || undefined } },
  }));

  const groups = useMemo(() => {
    const grouped = new Map<string, SearchResult[]>();
    for (const result of query.data?.items ?? []) grouped.set(result.productType, [...(grouped.get(result.productType) ?? []), result]);
    return [...grouped.entries()];
  }, [query.data]);

  function goNext() {
    if (!query.data?.nextCursor) return;
    setCursorStack((stack) => [...stack, cursor]);
    setCursor(query.data.nextCursor);
  }
  function goPrevious() {
    setCursorStack((stack) => {
      if (stack.length === 0) return stack;
      setCursor(stack[stack.length - 1]);
      return stack.slice(0, -1);
    });
  }
  function detailHref(productId: string) {
    const params = new URLSearchParams({ destinationOrTheme, dateFrom, dateTo, travellers, budgetPerPerson });
    if (productType !== "all") params.set("productType", productType);
    const date = selectedDates[productId];
    if (date) params.set("date", date);
    return `/products/${encodeURIComponent(productId)}?${params.toString()}`;
  }

  async function addToTravel(product: SearchResult) {
    const serviceDate = selectedDates[product.productId];
    if (!serviceDate) return;
    const stockItem = await findStockItem(apiClient, product.productId, serviceDate);
    if (!stockItem) return;
    travel.setPending({ stockItemId: stockItem.entityId, productId: stockItem.productId,
      displayNameChain: stockItem.productDisplayNameChain, serviceDate,
      unitPriceAmount: String(stockItem.properties.unitPriceAmount), currencyCode: stockItem.properties.currencyCode });
    const returnTo = `${location.pathname}${location.search}`;
    const selection = `/travel/add?${new URLSearchParams({ returnTo }).toString()}`;
    navigate(actor ? selection : `/sign-in?${new URLSearchParams({ returnTo: selection }).toString()}`);
  }

  return <CustomerShell breadcrumbs={[{ label: "Travel portal", to: "/" }, { label: t("results.heading") }]}><Container py="xl" size="lg"><Stack gap="lg">
    <Title order={1}>{t("results.heading")}</Title>
    <Stack gap="xs" component="section" aria-label={t("results.criteria.heading")}>
      <Group justify="space-between" align="center">
        <Title order={2}>{t("results.criteria.heading")}</Title>
        <Button component={Link} variant="light" to={`/?${searchParams.toString()}`}>{t("results.revise")}</Button>
      </Group>
      <Text size="sm">{t("results.criteria.destinationOrTheme")}: {destinationOrTheme || "–"} · {t("results.criteria.productType")}: {productType === "all" ? t("home.productType.all") : productType.replace(/^product\//, "")} · {t("results.criteria.dateFrom")}: {dateFrom || "–"} · {t("results.criteria.dateTo")}: {dateTo || "–"} · {t("results.criteria.travellers")}: {travellers || "–"} · {t("results.criteria.budget")}: {budgetPerPerson === "any" ? t("home.any") : `€${budgetPerPerson}`}</Text>
    </Stack>
    {query.isPending ? <StatusBanner kind="loading" title={t("results.loading")} /> : null}
    {query.isError ? <ApiErrorBanner error={query.error} onRetry={() => query.refetch()} /> : null}
    {query.isSuccess ? query.data.items.length === 0 ? <StatusBanner kind="empty" title={t("results.empty")} /> : <>
      {groups.map(([type, products]) => <Stack key={type} gap="sm"><Title order={2}>{type.replace(/^product\//, "").replaceAll("/", " · ")}</Title><SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {products.map((product) => <ResourceCard key={product.productId} title={product.productDisplayNameChain.join(" · ")} badge={type.replace(/^product\//, "")} details={[{ label: t("results.price"), value: `${product.indicativeUnitPriceAmount} ${product.currencyCode}` }]} action={<Stack gap="xs"><Select aria-label={`${product.productDisplayName} date`} placeholder={t("results.chooseDate")} data={product.availableDates} value={selectedDates[product.productId] ?? null} onChange={(value) => setSelectedDates((current) => ({ ...current, [product.productId]: value ?? "" }))} /><Group grow><Button component={Link} to={detailHref(product.productId)} variant="light" color="blue">{t("results.viewDetail")}</Button><Button color="orange" disabled={!selectedDates[product.productId]} onClick={() => addToTravel(product)}>{t("travel.add")}</Button></Group></Stack>} />)}
      </SimpleGrid></Stack>)}
      <CursorPager hasPrevious={cursorStack.length > 0} hasNext={Boolean(query.data.nextCursor)} onPrevious={goPrevious} onNext={goNext} loading={query.isFetching} />
    </> : null}
  </Stack></Container></CustomerShell>;
}
