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

function StockDetail({ item }: { readonly item: StockItem }) {
  const [editing, setEditing] = useState(false); const [capacity, setCapacity] = useState<string | number>(item.properties.capacityQuantity); const [held, setHeld] = useState<string | number>(item.properties.heldQuantity); const [date, setDate] = useState(item.properties.serviceDate); const [price, setPrice] = useState<string | number>(item.properties.unitPriceAmount); const [lifecycle, setLifecycle] = useState(item.properties.inventoryStatusCode);
  const [orderId, setOrderId] = useState(""); const [positionId, setPositionId] = useState(""); const [actionMessage, setActionMessage] = useState("");
  const update = useApiMutation<StockItem, Record<string, never>>(() => apiClient.PUT("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: item.entityId } }, body: { type: item.type as never, properties: { serviceDate: date, unitPriceAmount: String(price), currencyCode: "EUR", capacityQuantity: Number(capacity), heldQuantity: Number(held), allocatedQuantity: item.properties.allocatedQuantity, inventoryStatusCode: lifecycle } } }));
  const allocate = useApiMutation<void, void>(() => apiClient.PUT("/orders/{order_id}/positions/{position_id}/stock", { params: { path: { order_id: orderId.trim(), position_id: positionId.trim() } }, body: { stockItemId: item.entityId } }));
  const release = useApiMutation<void, void>(() => apiClient.DELETE("/orders/{order_id}/positions/{position_id}/stock/{stock_item_id}", { params: { path: { order_id: orderId.trim(), position_id: positionId.trim(), stock_item_id: item.entityId } } }));
  const withdraw = useApiMutation<void, void>(() => apiClient.DELETE("/stock-items/{stock_item_id}", { params: { path: { stock_item_id: item.entityId } } }));
  const refresh = () => { void queryClient.invalidateQueries({ queryKey: ["stock-items"] }); void queryClient.invalidateQueries({ queryKey: ["stock-items", item.entityId] }); };
  function save(event: FormEvent) { event.preventDefault(); update.mutate({}, { onSuccess: () => { refresh(); setEditing(false); } }); }
  function allocationAction(kind: "allocate" | "release") { setActionMessage(""); const mutation = kind === "allocate" ? allocate : release; mutation.mutate(undefined, { onSuccess: () => { setActionMessage(kind === "allocate" ? "Allocation recorded on the order position." : "Allocation released from the order position."); refresh(); } }); }
  const allocationError = allocate.error ?? release.error;
  return <Stack gap="md"><Group justify="space-between"><div><Title order={2}>{item.productDisplayNameChain.join(" · ")}</Title><Text c="dimmed">{item.entityId} · {item.availabilityState}</Text></div><Group><Button variant="default" onClick={() => setEditing((value) => !value)}>{editing ? "Cancel editing" : "Edit stock entry"}</Button><Button color="red" variant="light" disabled={item.properties.inventoryStatusCode === "inventory/withdrawn"} loading={withdraw.isPending} onClick={() => withdraw.mutate(undefined, { onSuccess: refresh })}>Withdraw capacity</Button></Group></Group>
    <ResourceCard title={item.productDisplayName} subtitle={`${item.properties.serviceDate} · ${item.type}`} badge={item.availabilityState} details={[{ label: "Product", value: item.productDisplayName }, { label: "Supplier", value: item.supplierDisplayName ?? "Not linked" }, { label: "Capacity", value: String(item.properties.capacityQuantity) }, { label: "Available", value: String(item.availableQuantity) }, { label: "Held", value: String(item.properties.heldQuantity) }, { label: "Allocated", value: String(item.properties.allocatedQuantity) }, { label: "Unit sale price", value: `${item.properties.unitPriceAmount} ${item.properties.currencyCode}` }]} />
    <Group><Anchor component={Link} to={`/products?detail=${encodeURIComponent(item.productId)}`}>Open product</Anchor>{item.supplierOrganisationId ? <Anchor component={Link} to={`/organisations?detail=${encodeURIComponent(item.supplierOrganisationId)}`}>Open supplier</Anchor> : null}</Group>
    {editing ? <form aria-label="Edit stock entry" onSubmit={save}><Stack gap="xs"><Title order={3}>Adjust capacity</Title><TextInput type="date" label="Service date" value={date} onChange={(e) => setDate(e.currentTarget.value)} /><NumberInput min={0} label="Unit sale price (EUR)" value={price} onChange={setPrice} /><NumberInput min={0} label="Capacity" value={capacity} onChange={setCapacity} /><NumberInput min={0} label="Held" value={held} onChange={setHeld} /><Select label="Lifecycle" data={[{ value: "inventory/active", label: "Active" }, { value: "inventory/withdrawn", label: "Withdrawn" }, { value: "inventory/expired", label: "Expired" }]} value={lifecycle} onChange={(value) => setLifecycle((value as typeof lifecycle) ?? "inventory/active")} /><Button type="submit" loading={update.isPending}>Save changes</Button>{update.isError ? <ApiErrorBanner error={update.error} /> : null}</Stack></form> : null}
    <Stack gap="xs"><Title order={3}>Order allocation</Title><Text size="sm" c="dimmed">Link or release this stock entry for one existing order position. Quantity is one per position in the current order model.</Text><TextInput label="Order ID" value={orderId} onChange={(e) => setOrderId(e.currentTarget.value)} /><TextInput label="Order position ID" value={positionId} onChange={(e) => setPositionId(e.currentTarget.value)} /><Group><Button disabled={!orderId.trim() || !positionId.trim() || item.availableQuantity <= 0 || item.availabilityState === "withdrawn"} loading={allocate.isPending} onClick={() => allocationAction("allocate")}>Allocate to order</Button><Button variant="default" disabled={!orderId.trim() || !positionId.trim()} loading={release.isPending} onClick={() => allocationAction("release")}>Release allocation</Button>{orderId.trim() ? <Button component={Link} variant="subtle" to={`/orders?detail=${encodeURIComponent(orderId.trim())}`}>Open order</Button> : null}</Group>{actionMessage ? <StatusBanner kind="success" title={actionMessage} /> : null}{allocationError ? <ApiErrorBanner error={allocationError} /> : null}</Stack>
    {withdraw.isError ? <ApiErrorBanner error={withdraw.error} /> : null}
  </Stack>;
}
