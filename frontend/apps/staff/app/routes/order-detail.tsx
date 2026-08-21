import { useParams } from "react-router";
import { StatusBanner } from "@cct/ui";
import { OrderDetailPanel } from "../lib/order-detail-panel";
import { StaffShell } from "../lib/shell";
export function meta() { return [{ title: "Order detail — CCT Staff" }]; }
export default function OrderDetailRoute() { const { orderId } = useParams(); return <StaffShell breadcrumbs={[{ label: "Orders", to: "/orders" }, { label: "Order detail" }]}>{orderId ? <OrderDetailPanel orderId={orderId}/> : <StatusBanner kind="error" title="No order specified"/>}</StaffShell>; }
