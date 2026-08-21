import { useNavigate } from "react-router";

import { ProductCreatePanel } from "../lib/product-create-panel";
import { StaffShell } from "../lib/shell";

export function meta() {
  return [{ title: "Create product — CCT Staff" }];
}

/**
 * Standalone direct-link create route. The products list (`products.tsx`)
 * shows the same `ProductCreatePanel` inline as the right pane's create
 * mode instead of navigating here, mirroring `PersonCreateRoute`/
 * `OrganisationCreateRoute`.
 */
export default function ProductCreateRoute() {
  const navigate = useNavigate();

  return (
    <StaffShell breadcrumbs={[{ label: "Touristic product catalogue", to: "/products" }, { label: "Create product" }]}>
      <ProductCreatePanel
        onCreated={(productId) => navigate(`/products/${productId}`)}
        onCancel={() => navigate("/products")}
      />
    </StaffShell>
  );
}
