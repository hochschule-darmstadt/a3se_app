import { useParams } from "react-router";

import { StatusBanner } from "@cct/ui";

import { StaffShell } from "../lib/shell";
import { StockDetailPanel } from "../lib/stock-detail-panel";

export function meta() { return [{ title: "Inventory detail — CCT Staff" }]; }

/** Backward-compatible direct link; the main Inventory route presents this panel inline. */
export default function StockItemDetailRoute() {
  const { stockItemId } = useParams();
  return <StaffShell breadcrumbs={[{ label: "Inventory", to: "/stock-items" }, { label: "Detail" }]}>
    {stockItemId ? <StockDetailPanel stockItemId={stockItemId} /> : <StatusBanner kind="error" title="No stock item specified" />}
  </StaffShell>;
}
