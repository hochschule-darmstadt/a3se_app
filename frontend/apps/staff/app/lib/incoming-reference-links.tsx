import { Button, Group, Text } from "@mantine/core";
import { Link, useLocation } from "react-router";
import type { components } from "@cct/api-client";
import { CctIcon, StatusBanner } from "@cct/ui";
import { apiClient } from "../api";
import { useApiQuery } from "@cct/api-client";

type ReferenceKind = "person-role" | "orga-role" | "organisation" | "product" | "stock-item";
type Counts = components["schemas"]["IncomingReferenceResponse"];

const labels: Record<string, string> = {
  customerOrders: "orders",
  travellerOrders: "orders",
  products: "products",
  stockItems: "inventory records",
  orders: "travel orders",
};

const referenceIcons = {
  "/products": CctIcon.catalogue,
  "/stock-items": CctIcon.inventory,
  "/orders": CctIcon.order,
  "/organisations": CctIcon.supplier,
} as const;

export function IncomingReferenceLinks({ kind, entityId, countKeys, targetPath, targetParam }: {
  readonly kind: ReferenceKind;
  readonly entityId: string;
  readonly countKeys: readonly string[];
  readonly targetPath: string;
  readonly targetParam: string;
}) {
  const location = useLocation();
  const query = useApiQuery(["incoming-references", kind, entityId], () => apiClient.GET("/incoming-references/{reference_kind}/{entity_id}", { params: { path: { reference_kind: kind, entity_id: entityId } } }));
  if (query.status === "pending") return <Text size="sm" c="dimmed">Loading related records…</Text>;
  if (query.status === "error") return <StatusBanner kind="error" title="Related-record count unavailable" />;
  const counts = { counts: (query.data as Counts | undefined)?.counts ?? {} };
  return <Group gap="xs" aria-label="Incoming references">
    {countKeys.map((key) => {
      const count = counts.counts[key] ?? 0;
      const label = labels[key] ?? key;
      if (count === 0) return <Text size="sm" key={key}>0 {label}</Text>;
      const params = new URLSearchParams({ [targetParam]: entityId, returnTo: `${location.pathname}${location.search}` });
      const Icon = referenceIcons[targetPath as keyof typeof referenceIcons];
      return <Button key={key} component={Link} to={`${targetPath}?${params.toString()}`} variant="subtle" size="compact-sm" leftSection={Icon ? <Icon size={16} aria-hidden /> : undefined}>{count} {label}</Button>;
    })}
  </Group>;
}
