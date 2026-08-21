import { Anchor, Button, Group, NumberInput, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";
import type { components } from "@cct/api-client";
import { useApiMutation, useApiQuery } from "@cct/api-client";
import { ApiErrorBanner, ResourceCard, StatusBanner } from "@cct/ui";
import { apiClient, queryClient } from "../api";

type StockItem = components["schemas"]["StockItemResponse"];
export function StockDetailPanel({ stockItemId }: { readonly stockItemId: string }) {
  const query = useApiQuery(["stock-items", stockItemId], () => apiClient.GET("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: stockItemId } } }));
  if (query.status === "pending") return <StatusBanner kind="loading" title="Loading stock item…" />;
  if (query.status === "error") return <ApiErrorBanner error={query.error} onRetry={() => query.refetch()} />;
  return <StockDetail item={query.data} />;
}
function HierarchyLink({ to, children }: { readonly to: string; readonly children: string }) {
  return <Anchor component={Link} to={to} size="sm" px="xs" py={4} style={{ border: "1px solid var(--mantine-color-default-border)", borderRadius: "var(--mantine-radius-sm)" }}>{children}</Anchor>;
}
function StockDetail({ item }: { readonly item: StockItem }) {
  const [editing, setEditing] = useState(false);
  const [capacity, setCapacity] = useState<string | number>(item.properties.capacityQuantity);
  const [held, setHeld] = useState<string | number>(item.properties.heldQuantity);
  const [date, setDate] = useState(item.properties.serviceDate);
  const [price, setPrice] = useState<string | number>(item.properties.unitPriceAmount);
  const [lifecycle, setLifecycle] = useState(item.properties.inventoryStatusCode);
  const update = useApiMutation<StockItem, Record<string, never>>(() => apiClient.PUT("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: item.entityId } }, body: { type: item.type as never, properties: { serviceDate: date, unitPriceAmount: String(price), currencyCode: "EUR", capacityQuantity: Number(capacity), heldQuantity: Number(held), allocatedQuantity: item.properties.allocatedQuantity, inventoryStatusCode: lifecycle } } }));
  const refresh = () => { void queryClient.invalidateQueries({ queryKey: ["stock-items"] }); void queryClient.invalidateQueries({ queryKey: ["stock-items", item.entityId] }); };
  function save(event: FormEvent) { event.preventDefault(); update.mutate({}, { onSuccess: () => { refresh(); setEditing(false); } }); }
  const displayName = `${item.properties.serviceDate} · ${item.productDisplayNameChain.join(" · ")}`;
  return <Stack gap="md">
    <Group justify="space-between"><div><Title order={2}>{displayName}</Title><Text c="dimmed">{item.entityId} · {item.availabilityState}</Text></div><Button variant="default" onClick={() => setEditing((value) => !value)}>{editing ? "Cancel editing" : "Edit stock entry"}</Button></Group>
    <ResourceCard title={displayName} subtitle={item.type} badge={item.availabilityState} details={[{ label: "Product", value: item.productDisplayName }, { label: "Supplier", value: item.supplierDisplayName ?? "Not linked" }, { label: "Capacity", value: String(item.properties.capacityQuantity) }, { label: "Available", value: String(item.availableQuantity) }, { label: "Held", value: String(item.properties.heldQuantity) }, { label: "Allocated", value: String(item.properties.allocatedQuantity) }, { label: "Unit sale price", value: `${item.properties.unitPriceAmount} ${item.properties.currencyCode}` }]} />
    <Group align="flex-start" role="group" aria-label="Stock product hierarchy"><Text fw={500} size="sm" w={200}>Hierarchy</Text><Group gap="xs"><HierarchyLink to={`/products?detail=${encodeURIComponent(item.productId)}`}>{item.productDisplayNameChain.join(" · ")}</HierarchyLink>{item.productAncestors.map((ancestor) => <HierarchyLink key={ancestor.entityId} to={`/products?detail=${encodeURIComponent(ancestor.entityId)}`}>{ancestor.displayNameChain.join(" · ")}</HierarchyLink>)}{item.supplierRole && item.supplierOrganisationId ? <HierarchyLink to={`/organisations?detail=${encodeURIComponent(item.supplierOrganisationId)}&role=${encodeURIComponent(item.supplierRole.entityId)}`}>{item.supplierRole.displayNameChain.join(" · ")}</HierarchyLink> : null}{item.supplierOrganisationId && item.supplierDisplayName ? <HierarchyLink to={`/organisations?detail=${encodeURIComponent(item.supplierOrganisationId)}`}>{item.supplierDisplayName}</HierarchyLink> : null}</Group></Group>
    {editing ? <form aria-label="Edit stock entry" onSubmit={save}><Stack gap="xs"><Title order={3}>Adjust capacity</Title><TextInput type="date" label="Service date" value={date} onChange={(e) => setDate(e.currentTarget.value)} /><NumberInput min={0} label="Unit sale price (EUR)" value={price} onChange={setPrice} /><NumberInput min={0} label="Capacity" value={capacity} onChange={setCapacity} /><NumberInput min={0} label="Held" value={held} onChange={setHeld} /><Select label="Lifecycle" description="Choose Withdrawn here to withdraw this capacity." data={[{ value: "inventory/active", label: "Active" }, { value: "inventory/withdrawn", label: "Withdrawn" }, { value: "inventory/expired", label: "Expired" }]} value={lifecycle} onChange={(value) => setLifecycle((value as typeof lifecycle) ?? "inventory/active")} /><Button type="submit" loading={update.isPending}>Save changes</Button>{update.isError ? <ApiErrorBanner error={update.error} /> : null}</Stack></form> : null}
  </Stack>;
}
