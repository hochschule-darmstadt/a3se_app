import { Container, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useApiQuery } from "@cct/api-client";
import { ApiErrorBanner, CursorPager, ResourceCard, StatusBanner } from "@cct/ui";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { productBadge, productTitle } from "../lib/product-display";
import { CustomerShell } from "../lib/shell";

export function meta() {
  return [{ title: "Search results – Christopher Columbus Travel" }];
}

const PAGE_SIZE = 20;

/**
 * VIEW-C-009: lists the full seeded product catalogue via real
 * server-side cursor pagination -- no client-side filtering (DR-0015). The
 * criteria entered on VIEW-C-001 are shown back as read-only context.
 */
export default function SearchResults() {
  const t = useT();
  const [searchParams] = useSearchParams();
  const origin = searchParams.get("origin") ?? "";
  const destination = searchParams.get("destination") ?? "";
  const date = searchParams.get("date") ?? "";
  const travellers = searchParams.get("travellers") ?? "";

  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const query = useApiQuery(["products", cursor], () =>
    apiClient.GET("/products", { params: { query: { limit: PAGE_SIZE, cursor } } })
  );

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
    const params = new URLSearchParams({ date, travellers, origin, destination });
    return `/products/${encodeURIComponent(productId)}?${params.toString()}`;
  }

  return (
    <CustomerShell>
      <Container py="xl" size="lg">
        <Stack gap="lg">
          <Title order={1}>{t("results.heading")}</Title>

          <Stack gap="xs" component="section" aria-label={t("results.criteria.heading")}>
            <Title order={2}>{t("results.criteria.heading")}</Title>
            <Text size="sm">
              {t("results.criteria.origin")}: {origin || "–"} · {t("results.criteria.destination")}:{" "}
              {destination || "–"} · {t("results.criteria.date")}: {date || "–"} ·{" "}
              {t("results.criteria.travellers")}: {travellers || "–"}
            </Text>
            <Text size="sm" c="dimmed">
              {t("results.criteria.note")}
            </Text>
          </Stack>

          {query.isPending ? <StatusBanner kind="loading" title={t("results.loading")} /> : null}

          {query.isError ? (
            <ApiErrorBanner error={query.error} onRetry={() => query.refetch()} />
          ) : null}

          {query.isSuccess ? (
            query.data.items.length === 0 ? (
              <StatusBanner kind="empty" title={t("results.empty")} />
            ) : (
              <>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                  {query.data.items.map((product) => (
                    <ResourceCard
                      key={product.entityId}
                      title={productTitle(product)}
                      subtitle={product.entityId}
                      badge={productBadge(product)}
                      action={
                        <Link to={detailHref(product.entityId)}>{t("results.viewDetail")}</Link>
                      }
                    />
                  ))}
                </SimpleGrid>
                <CursorPager
                  hasPrevious={cursorStack.length > 0}
                  hasNext={Boolean(query.data.nextCursor)}
                  onPrevious={goPrevious}
                  onNext={goNext}
                  loading={query.isFetching}
                />
              </>
            )
          ) : null}

          <Link to="/">{t("results.revise")}</Link>
        </Stack>
      </Container>
    </CustomerShell>
  );
}
