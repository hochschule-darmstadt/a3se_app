import { Button, Group, NumberInput, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useState } from "react";

import type { components } from "@cct/api-client";
import { useApiMutation } from "@cct/api-client";
import { ApiErrorBanner, FormErrorSummary } from "@cct/ui";

import { apiClient, queryClient } from "../api";

type StockItem = components["schemas"]["StockItemResponse"];
export const STOCK_TYPES = ["stock/accommodation/room-type", "stock/experience/activity", "stock/experience/guided-tour", "stock/airline/flight", "stock/mobility/coach", "stock/mobility/rail", "stock/mobility/transfer", "stock/mobility/vehicle-rental", "stock/protection/travel", "stock/water-transport/cruise", "stock/water-transport/day-boat"] as const;
export const STOCK_TYPE_OPTIONS = STOCK_TYPES.map((value) => ({ value, label: value.replace("stock/", "") }));

export function StockCreatePanel({ onCancel, onCreated }: { readonly onCancel: () => void; readonly onCreated: (id: string) => void }) {
  const [productId, setProductId] = useState(""); const [type, setType] = useState<(typeof STOCK_TYPES)[number]>(STOCK_TYPES[0]);
  const [serviceDate, setServiceDate] = useState(""); const [price, setPrice] = useState<string | number>(0); const [capacity, setCapacity] = useState<string | number>(1); const [errors, setErrors] = useState<string[]>([]);
  const mutation = useApiMutation<StockItem, void>(() => apiClient.POST("/stock-items", { body: { entityId: `STK-${crypto.randomUUID()}`, productId: productId.trim(), type, properties: { serviceDate, unitPriceAmount: String(price), currencyCode: "EUR", capacityQuantity: Number(capacity), remainingCapacity: Number(capacity), inventoryStatusCode: "inventory/active" } } }));
  function submit(event: FormEvent) { event.preventDefault(); const next = [...(!productId.trim() ? ["Enter an existing product ID."] : []), ...(!serviceDate ? ["Choose a service date."] : []), ...(Number(capacity) < 0 ? ["Capacity cannot be negative."] : [])]; setErrors(next); if (next.length) return; mutation.mutate(undefined, { onSuccess: (item) => { void queryClient.invalidateQueries({ queryKey: ["stock-items"] }); onCreated(item.entityId); } }); }
  return <form aria-label="Add stock entry" onSubmit={submit} noValidate><Stack gap="xs"><Title order={2}>Add stock entry</Title><Text size="sm" c="dimmed">Records capacity already agreed with a supplier; it does not negotiate new capacity.</Text><FormErrorSummary errors={errors} /><TextInput required label="Product ID" value={productId} onChange={(e) => setProductId(e.currentTarget.value)} /><Select required label="Stock type" data={STOCK_TYPE_OPTIONS} value={type} onChange={(value) => setType((value as typeof type) ?? STOCK_TYPES[0])} /><TextInput required type="date" label="Service date" value={serviceDate} onChange={(e) => setServiceDate(e.currentTarget.value)} /><NumberInput required min={0} decimalScale={2} label="Unit sale price (EUR)" value={price} onChange={setPrice} /><NumberInput required min={0} label="Capacity" value={capacity} onChange={setCapacity} /><Group><Button type="submit" loading={mutation.isPending}>Create stock entry</Button><Button variant="default" onClick={onCancel}>Cancel</Button></Group>{mutation.isError ? <ApiErrorBanner error={mutation.error} /> : null}</Stack></form>;
}
