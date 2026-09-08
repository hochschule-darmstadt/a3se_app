import { Container, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useApiQuery, type components } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, ResourceCard, StatusBanner } from "@cct/ui";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";

export function meta() { return [{ title: "Search results – Christopher Columbus Travel" }]; }
const PAGE_SIZE = 20;

type StockResult = components["schemas"]["StockItemResponse"];

/** VIEW-C-009: server-filtered indicative catalogue results backed by StockItems. */
export default function SearchResults() {
  const t = useT();
  const [searchParams] = useSearchParams();
  const destinationOrTheme = searchParams.get("destinationOrTheme") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const travellers = searchParams.get("travellers") ?? "";
  const departureLocationCode = searchParams.get("departureLocationCode") ?? "any";
  const budgetPerPerson = searchParams.get("budgetPerPerson") ?? "any";
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const query = useApiQuery(["stock-items", destinationOrTheme, dateFrom, dateTo, cursor], () => apiClient.GET("/stock-items", {
    params: { query: {
      limit: PAGE_SIZE, cursor,
      search: destinationOrTheme || undefined,
      serviceDateFrom: dateFrom || undefined,
      serviceDateTo: dateTo || undefined,
    } },
  }));

  const products = useMemo(() => {
    if (!query.data) return [];
    const grouped = new Map<string, StockResult>();
    for (const stock of query.data.items as StockResult[]) {
      const current = grouped.get(stock.productId);
      const currentPrice = current ? Number(current.properties.unitPriceAmount) : Number.POSITIVE_INFINITY;
      if (!current || Number(stock.properties.unitPriceAmount) < currentPrice) grouped.set(stock.productId, stock);
    }
    return [...grouped.values()].filter((stock) => {
      if (departureLocationCode !== "any" && !stock.productDisplayNameChain.some((part) => part.includes(departureLocationCode))) return false;
      if (budgetPerPerson !== "any" && Number(stock.properties.unitPriceAmount) > Number(budgetPerPerson)) return false;
      return true;
    });
  }, [query.data, departureLocationCode, budgetPerPerson]);

  function goNext() {
    if (!query.data?.nextCursor) return;
    setCursorStack((stack) => [...stack, cursor]);
    setCursor(query.data.nextCursor);
  }
  function goPrevious() {
    setCursorStack((stack) => {
      if (stack.length === 0) return stack;
      const next = stack.slice(0, -1);
      setCursor(stack[stack.length - 1]);
      return next;
    });
  }
  function detailHref(productId: string) {
    const params = new URLSearchParams({ destinationOrTheme, dateFrom, dateTo, travellers, departureLocationCode, budgetPerPerson });
    return `/products/${encodeURIComponent(productId)}?${params.toString()}`;
  }

  return (
    <CustomerShell>
      <Container py="xl" size="lg">
        <Stack gap="lg">
          <Title order={1}>{t("results.heading")}</Title>
          <Stack gap="xs" component="section" aria-label={t("results.criteria.heading")}>
            <Title order={2}>{t("results.criteria.heading")}</Title>
            <Text size="sm">{t("results.criteria.destinationOrTheme")}: {destinationOrTheme || "–"} · {t("results.criteria.dateFrom")}: {dateFrom || "–"} · {t("results.criteria.dateTo")}: {dateTo || "–"} · {t("results.criteria.travellers")}: {travellers || "–"} · {t("results.criteria.departureLocation")}: {departureLocationCode === "any" ? t("home.any") : departureLocationCode} · {t("results.criteria.budget")}: {budgetPerPerson === "any" ? t("home.any") : `€${budgetPerPerson}`}</Text>
          </Stack>
          {query.isPending ? <StatusBanner kind="loading" title={t("results.loading")} /> : null}
          {query.isError ? <ApiErrorBanner error={query.error} onRetry={() => query.refetch()} /> : null}
          {query.isSuccess ? products.length === 0 ? <StatusBanner kind="empty" title={t("results.empty")} /> : <>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {products.map((stock) => <ResourceCard key={stock.productId} title={stock.productDisplayName} subtitle={stock.productId} badge={stock.availabilityState} details={[{ label: t("results.price"), value: `${stock.properties.unitPriceAmount} ${stock.properties.currencyCode}` }, { label: t("results.available"), value: String(stock.availableQuantity) }]} action={<Link to={detailHref(stock.productId)}>{t("results.viewDetail")}</Link>} />)}
            </SimpleGrid>
            <CursorPager hasPrevious={cursorStack.length > 0} hasNext={Boolean(query.data.nextCursor)} onPrevious={goPrevious} onNext={goNext} loading={query.isFetching} />
          </> : null}
          <Link to="/">{t("results.revise")}</Link>
        </Stack>
      </Container>
    </CustomerShell>
  );
}
