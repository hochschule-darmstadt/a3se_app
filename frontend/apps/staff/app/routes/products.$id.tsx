import { useParams } from "react-router";

import { useApiQuery } from "@cct/api-client";
import { StatusBanner } from "@cct/ui";

import { apiClient } from "../api";
import { catalogueProperties, productDisplayLabel } from "../lib/catalogue-product-types";
import { ProductDetailPanel } from "../lib/product-detail-panel";
import { StaffShell } from "../lib/shell";

export function meta() {
  return [{ title: "Product detail — CCT Staff" }];
}

/**
 * Standalone direct-link route for one product (e.g. linked from an order's
 * product column). The products list (`products.tsx`) shows the same
 * `ProductDetailPanel` inline as a master-detail right pane instead of
 * navigating here, mirroring `PersonDetailRoute`/`OrganisationDetailRoute`.
 */
export default function ProductDetailRoute() {
  const { productId } = useParams();

  const productQuery = useApiQuery(
    ["products", productId],
    () => apiClient.GET("/products/{product_id}", { params: { path: { product_id: productId as string } } }),
    { enabled: Boolean(productId) }
  );

  if (!productId) {
    return (
      <StaffShell breadcrumbs={[{ label: "Touristic product catalogue", to: "/products" }, { label: "Product detail" }]}>
        <StatusBanner kind="error" title="No product specified" />
      </StaffShell>
    );
  }

  const label = productQuery.data
    ? productDisplayLabel(productQuery.data.entityId, productQuery.data.type, catalogueProperties(productQuery.data.properties).displayName)
    : "Product detail";

  return (
    <StaffShell breadcrumbs={[{ label: "Touristic product catalogue", to: "/products" }, { label }]}>
      <ProductDetailPanel productId={productId} />
    </StaffShell>
  );
}
