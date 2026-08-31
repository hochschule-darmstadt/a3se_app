import { Badge, Button, Group, NumberInput, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";
import type { components } from "@cct/api-client";
import { useApiMutation, useApiQuery } from "@cct/api-client";
import { ApiErrorBanner, StatusBanner } from "@cct/ui";
import { apiClient, queryClient } from "../api";

type StockItem = components["schemas"]["StockItemResponse"];

export function StockDetailPanel({ stockItemId }: { readonly stockItemId: string }) {
  const query = useApiQuery(["stock-items", stockItemId], () => apiClient.GET("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: stockItemId } } }));
  if (query.status === "pending") return <StatusBanner kind="loading" title="Loading stock item…" />;
  if (query.status === "error") return <ApiErrorBanner error={query.error} onRetry={() => query.refetch()} />;
  return <StockDetail item={query.data} />;
}

function HierarchyLink({ to, children }: { readonly to: string; readonly children: string }) {
  return <Badge component={Link} to={to} variant="light" size="lg" tt="none">{children}</Badge>;
}

function DetailRow({ label, value }: { readonly label: string; readonly value: string }) {
  return <Group><Text fw={500} size="sm" w={200}>{label}</Text><Text size="sm">{value}</Text></Group>;
}

function StockDetail({ item }: { readonly item: StockItem }) {
  const [editing, setEditing] = useState(false);
  const [capacity, setCapacity] = useState<string | number>(item.properties.capacityQuantity);
  const [remaining, setRemaining] = useState<string | number>(item.properties.remainingCapacity);
  const [date, setDate] = useState(item.properties.serviceDate);
  const [price, setPrice] = useState<string | number>(item.properties.unitPriceAmount);
  const [lifecycle, setLifecycle] = useState(item.properties.inventoryStatusCode);
  const update = useApiMutation<StockItem, Record<string, never>>(() => apiClient.PUT("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: item.entityId } }, body: { type: item.type as never, properties: { serviceDate: date, unitPriceAmount: String(price), currencyCode: item.properties.currencyCode, capacityQuantity: Number(capacity), remainingCapacity: Number(remaining), inventoryStatusCode: lifecycle } } }));
  const refresh = () => { void queryClient.invalidateQueries({ queryKey: ["stock-items"] }); void queryClient.invalidateQueries({ queryKey: ["stock-items", item.entityId] }); };
  function save(event: FormEvent) { event.preventDefault(); update.mutate({}, { onSuccess: () => { refresh(); setEditing(false); } }); }
  function cancelEditing() {
    setEditing(false); setCapacity(item.properties.capacityQuantity); setRemaining(item.properties.remainingCapacity);
    setDate(item.properties.serviceDate); setPrice(item.properties.unitPriceAmount); setLifecycle(item.properties.inventoryStatusCode);
  }
  const displayName = `${item.productDisplayNameChain.join(" · ")} · ${item.properties.serviceDate}`;
  const statusColor = item.availabilityState === "available" ? "green" : item.availabilityState === "withdrawn" || item.availabilityState === "expired" ? "gray" : undefined;

  return <Stack gap="md">
    <Group justify="space-between" align="flex-start">
      <Title order={1}>{displayName}</Title>
      <Badge color={statusColor}>{item.availabilityState}</Badge>
    </Group>

    {editing ? (
      <form aria-label="Edit stock entry" onSubmit={save} noValidate>
        <Stack gap="xs">
          <TextInput type="date" label="Service date" value={date} onChange={(event) => setDate(event.currentTarget.value)} />
          <NumberInput min={0} label={`Unit sale price (${item.properties.currencyCode})`} value={price} onChange={setPrice} />
          <NumberInput min={0} label="Capacity" value={capacity} onChange={setCapacity} />
          <NumberInput min={0} label="Remaining capacity" value={remaining} onChange={setRemaining} />
          <Select label="Lifecycle status" data={[{ value: "inventory/active", label: "Active" }, { value: "inventory/withdrawn", label: "Withdrawn" }, { value: "inventory/expired", label: "Expired" }]} value={lifecycle} onChange={(value) => setLifecycle((value as typeof lifecycle) ?? "inventory/active")} allowDeselect={false} />
          <Group><Button type="submit" loading={update.isPending}>Save changes</Button><Button variant="default" onClick={cancelEditing}>Cancel changes</Button></Group>
          {update.isError ? <ApiErrorBanner error={update.error} /> : null}
        </Stack>
      </form>
    ) : (
      <Stack gap={6}>
        <DetailRow label="ID" value={item.entityId} />
        <DetailRow label="Type" value={item.type} />
        <Group align="flex-start" role="group" aria-label="Stock product hierarchy">
          <Text fw={500} size="sm" w={200}>Hierarchy</Text>
          <Group gap="xs">
            <HierarchyLink to={`/products?detail=${encodeURIComponent(item.productId)}`}>{item.productDisplayNameChain.join(" · ")}</HierarchyLink>
            {item.productAncestors.map((ancestor) => <HierarchyLink key={ancestor.entityId} to={`/products?detail=${encodeURIComponent(ancestor.entityId)}`}>{ancestor.displayNameChain.join(" · ")}</HierarchyLink>)}
            {item.supplierRole && item.supplierOrganisationId ? <HierarchyLink to={`/organisations?detail=${encodeURIComponent(item.supplierOrganisationId)}&role=${encodeURIComponent(item.supplierRole.entityId)}`}>{item.supplierRole.displayNameChain.join(" · ")}</HierarchyLink> : null}
            {item.supplierOrganisationId && item.supplierDisplayName ? <HierarchyLink to={`/organisations?detail=${encodeURIComponent(item.supplierOrganisationId)}`}>{item.supplierDisplayName}</HierarchyLink> : null}
          </Group>
        </Group>
        <DetailRow label="Service date" value={item.properties.serviceDate} />
        <DetailRow label="Unit sale price" value={`${item.properties.unitPriceAmount} ${item.properties.currencyCode}`} />
        <DetailRow label="Capacity" value={String(item.properties.capacityQuantity)} />
        <DetailRow label="Remaining capacity" value={String(item.properties.remainingCapacity)} />
        <DetailRow label="Lifecycle status" value={item.properties.inventoryStatusCode.replace("inventory/", "")} />
        <Group mt="xs"><Button onClick={() => setEditing(true)}>Edit stock entry</Button></Group>
        <Text size="sm" c="dimmed" mt="xs">Lifecycle status is changed from the edit form; withdrawal does not delete the stock entry.</Text>
      </Stack>
    )}
  </Stack>;
}
