import { Anchor, Badge, Button, Group, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, DataTable, FormErrorSummary, StatusBanner } from "@cct/ui";
import { useApiMutation, useApiQuery } from "@cct/api-client";

import { apiClient, queryClient } from "../api";
import {
  LIFECYCLE_STATUS_LABEL,
  LIFECYCLE_STATUS_OPTIONS,
  addableComponentTypeOptions,
  catalogueProperties,
  productPropertyEntries,
  typeLabel,
  type LifecycleStatusCode,
} from "./catalogue-product-types";
import {
  EMPTY_PRODUCT_TYPE_FIELD_VALUES,
  ProductTypeFields,
  fieldValuesFromProperties,
  productTypeProperties,
  productTypeValidationErrors,
  type ProductTypeFieldValues,
} from "./product-type-fields";
import { ProductCreatePanel } from "./product-create-panel";

type ProductResponse = components["schemas"]["ProductResponse"];
type ProductMutationResponse = components["schemas"]["ProductMutationResponse"];
type ProductComponentResponse = components["schemas"]["ProductComponentResponse"];
type OrgaRoleResponse = components["schemas"]["OrgaRoleResponse"];
type OrganisationResponse = components["schemas"]["OrganisationResponse"];

function invalidateProduct(productId: string) {
  void queryClient.invalidateQueries({ queryKey: ["products", productId] });
  void queryClient.invalidateQueries({ queryKey: ["products"] });
}

/**
 * A real route link to another product. The list/detail route supplies an
 * href carrying its complete view state; the standalone route links to the
 * related product's detail route.
 */
function ProductCrossLink({
  to,
  children,
}: {
  readonly to: string;
  readonly children: ReactNode;
}) {
  return (
    <Anchor component={Link} to={to}>
      {children}
    </Anchor>
  );
}

/** A compact record link used for hierarchy navigation within the detail panel. */
function ProductChipLink({
  to,
  children,
}: {
  readonly to: string;
  readonly children: ReactNode;
}) {
  return (
    <Badge component={Link} to={to} variant="light" size="lg" tt="none">
      {children}
    </Badge>
  );
}

/**
 * S-003 detail (issue #31): a TouristicProductItem's type-specific fields,
 * lifecycle status (activate/retire -- WF-Q-014, no version history), its
 * recursive component tree, and its supplying OrgaRole. Used both as the
 * master-detail right pane on the products list and as the standalone
 * `/products/:id` route's content, mirroring `PersonDetailPanel` (#29) and
 * `OrganisationDetailPanel` (#30).
 *
 * `productHref`, when supplied, keeps parent/component cross-links in the
 * list/detail route with its filters, page, and selection represented in the
 * URL. The standalone route falls back to the related product's detail route.
 */
export function ProductDetailPanel({
  productId,
  productHref,
  organisationHref,
}: {
  readonly productId: string;
  readonly productHref?: (productId: string) => string;
  readonly organisationHref?: (organisationId: string, roleId?: string) => string;
}) {
  const productQuery = useApiQuery(
    ["products", productId],
    () => apiClient.GET("/products/{product_id}", { params: { path: { product_id: productId } } }),
    { enabled: Boolean(productId) }
  );
  const componentsQuery = useApiQuery(
    ["products", productId, "components"],
    () => apiClient.GET("/products/{product_id}/components", { params: { path: { product_id: productId } } }),
    { enabled: Boolean(productId) }
  );
  const supplierQuery = useApiQuery(
    ["products", productId, "supplier"],
    () => apiClient.GET("/products/{product_id}/supplier", { params: { path: { product_id: productId } } }),
    { enabled: Boolean(productId) }
  );
  const ancestorsQuery = useApiQuery(
    ["products", productId, "ancestors"],
    () => apiClient.GET("/products/{product_id}/ancestors", { params: { path: { product_id: productId } } }),
    { enabled: Boolean(productId) }
  );
  const rootId = ancestorsQuery.data && ancestorsQuery.data.length > 0 ? ancestorsQuery.data[0]!.entityId : productId;
  const rootSupplierQuery = useApiQuery(
    ["products", rootId, "supplier"],
    () => apiClient.GET("/products/{product_id}/supplier", { params: { path: { product_id: rootId } } }),
    { enabled: Boolean(ancestorsQuery.data) }
  );
  const hierarchySupplier = (supplierQuery.data ?? rootSupplierQuery.data) as OrgaRoleResponse | null | undefined;
  const supplierOrganisationQuery = useApiQuery(
    ["organisations", "roles", hierarchySupplier?.entityId, "organisation"],
    () => apiClient.GET("/organisations/roles/{role_id}/organisation", { params: { path: { role_id: hierarchySupplier!.entityId } } }),
    { enabled: Boolean(hierarchySupplier?.entityId) }
  );

  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<ProductTypeFieldValues>(EMPTY_PRODUCT_TYPE_FIELD_VALUES);
  const [editLifecycleStatusCode, setEditLifecycleStatusCode] = useState<LifecycleStatusCode>("product/draft");
  const [validationErrors, setValidationErrors] = useState<readonly string[]>([]);
  const [addingComponent, setAddingComponent] = useState(false);
  const [supplierRoleId, setSupplierRoleId] = useState("");

  useEffect(() => {
    setEditing(false);
    setAddingComponent(false);
  }, [productId]);

  useEffect(() => {
    if (productQuery.data) {
      setValues(fieldValuesFromProperties(productQuery.data.type, productQuery.data.properties as Record<string, unknown>));
      const currentLifecycleStatusCode = catalogueProperties(productQuery.data.properties).lifecycleStatusCode;
      if (currentLifecycleStatusCode) setEditLifecycleStatusCode(currentLifecycleStatusCode);
    }
  }, [productQuery.data]);

  const updateMutation = useApiMutation<ProductMutationResponse, { type: string; properties: Record<string, unknown> }>(
    ({ type, properties }) =>
      apiClient.PUT("/products/{product_id}", { params: { path: { product_id: productId } }, body: { product: { type, properties } as never } })
  );

  const supplierMutation = useApiMutation<void, { supplierRoleId: string }>(({ supplierRoleId: roleId }) =>
    apiClient.PUT("/products/{product_id}/supplier", { params: { path: { product_id: productId } }, body: { supplierRoleId: roleId } })
  );

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!productQuery.data) return;
    const type = productQuery.data.type;
    const errors = productTypeValidationErrors(type, values);
    setValidationErrors(errors);
    if (errors.length > 0) return;

    updateMutation.mutate(
      { type, properties: productTypeProperties(type, values, editLifecycleStatusCode) },
      { onSuccess: () => { setEditing(false); invalidateProduct(productId); } }
    );
  }

  function handleSupplierSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supplierRoleId.trim()) return;
    supplierMutation.mutate(
      { supplierRoleId: supplierRoleId.trim() },
      { onSuccess: () => { setSupplierRoleId(""); void queryClient.invalidateQueries({ queryKey: ["products", productId, "supplier"] }); } }
    );
  }

  if (productQuery.status === "pending" || componentsQuery.status === "pending" || supplierQuery.status === "pending") {
    return <StatusBanner kind="loading" title="Loading product…" />;
  }

  if (productQuery.status === "error") {
    return <ApiErrorBanner error={productQuery.error} onRetry={() => productQuery.refetch()} />;
  }

  if (componentsQuery.status === "error") {
    return <ApiErrorBanner error={componentsQuery.error} onRetry={() => componentsQuery.refetch()} />;
  }

  if (supplierQuery.status === "error") {
    return <ApiErrorBanner error={supplierQuery.error} onRetry={() => supplierQuery.refetch()} />;
  }

  const product = productQuery.data;
  const lifecycleStatusCode = catalogueProperties(product.properties).lifecycleStatusCode as LifecycleStatusCode | undefined;
  const hasLifecycleStatus = Boolean(lifecycleStatusCode);
  const isActive = lifecycleStatusCode === "product/active";
  const isRetired = lifecycleStatusCode === "product/retired";
  const ownLabel = product.displayName;
  const label = product.displayNameChain.join(" · ");
  const components = componentsQuery.data.filter((component) => component.entityId !== product.entityId);
  const supplier = supplierQuery.data as OrgaRoleResponse | null;
  const isRoot = product.entityId === rootId;
  // Only the root of a component tree carries a supplier (stakeholder decision, see catalogue-tree.ts);
  // a nested item shows the same supplier, inherited from its root, rather than "No supplier set."
  const displaySupplier = supplier ?? (rootSupplierQuery.data as OrgaRoleResponse | null) ?? null;
  const rootAncestor = ancestorsQuery.data && ancestorsQuery.data.length > 0 ? ancestorsQuery.data[0]! : null;
  const ancestorsParentFirst = ancestorsQuery.data ? [...ancestorsQuery.data].reverse() : [];
  const supplierOrganisation = supplierOrganisationQuery.data as OrganisationResponse | null | undefined;
  const hasHierarchy = ancestorsParentFirst.length > 0 || Boolean(hierarchySupplier) || Boolean(supplierOrganisation);
  const rootLabel = rootAncestor
    ? rootAncestor.displayName
    : ownLabel;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <Title order={1}>{label}</Title>
        {hasLifecycleStatus ? (
          <Badge color={isActive ? "green" : isRetired ? "gray" : undefined}>{LIFECYCLE_STATUS_LABEL[lifecycleStatusCode as LifecycleStatusCode]}</Badge>
        ) : null}
      </Group>

      {editing ? (
        <form onSubmit={handleEditSubmit} aria-label="Edit product" noValidate>
          <Stack gap="xs">
            <FormErrorSummary errors={validationErrors} />
            <ProductTypeFields type={product.type} values={values} onChange={setValues} />
            {hasLifecycleStatus ? (
              <Select
                label="Lifecycle status"
                data={LIFECYCLE_STATUS_OPTIONS}
                value={editLifecycleStatusCode}
                onChange={(value) => setEditLifecycleStatusCode((value as LifecycleStatusCode) ?? "product/draft")}
                allowDeselect={false}
              />
            ) : null}
            <Group>
              <Button type="submit" loading={updateMutation.isPending}>
                Save changes
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setEditing(false);
                  setValues(fieldValuesFromProperties(product.type, product.properties as Record<string, unknown>));
                  const currentLifecycleStatusCode = catalogueProperties(product.properties).lifecycleStatusCode;
                  if (currentLifecycleStatusCode) setEditLifecycleStatusCode(currentLifecycleStatusCode);
                }}
              >
                Cancel changes
              </Button>
            </Group>
            {updateMutation.isError ? <ApiErrorBanner error={updateMutation.error} /> : null}
          </Stack>
        </form>
      ) : (
        <Stack gap={6}>
          <Group>
            <Text fw={500} size="sm" w={200}>ID</Text>
            <Text size="sm">{product.entityId}</Text>
          </Group>
          <Group>
            <Text fw={500} size="sm" w={200}>Type</Text>
            <Text size="sm">{typeLabel(product.type)}</Text>
          </Group>
          {hasHierarchy ? (
            <Group align="flex-start" role="group" aria-label="Product hierarchy">
              <Text fw={500} size="sm" w={200}>Hierarchy</Text>
              <Group gap="xs">
                {ancestorsParentFirst.map((ancestor) => (
                  <ProductChipLink
                    key={ancestor.entityId}
                    to={productHref?.(ancestor.entityId) ?? `/products/${ancestor.entityId}`}
                  >
                    {ancestor.displayNameChain.join(" · ")}
                  </ProductChipLink>
                ))}
                {hierarchySupplier && supplierOrganisation ? (
                  <ProductChipLink
                    to={organisationHref?.(supplierOrganisation.entityId, hierarchySupplier.entityId)
                      ?? `/organisations/${supplierOrganisation.entityId}#role-${hierarchySupplier.entityId}`}
                  >
                    {hierarchySupplier.displayNameChain.join(" · ")}
                  </ProductChipLink>
                ) : null}
                {supplierOrganisation ? (
                  <ProductChipLink
                    to={organisationHref?.(supplierOrganisation.entityId)
                      ?? `/organisations/${supplierOrganisation.entityId}`}
                  >
                    {supplierOrganisation.properties.name}
                  </ProductChipLink>
                ) : null}
              </Group>
            </Group>
          ) : null}
          {productPropertyEntries(product.properties).map(({ key, label, value }) => (
            <Group key={key}>
              <Text fw={500} size="sm" w={200}>{label}</Text>
              <Text size="sm">{value}</Text>
            </Group>
          ))}
          <Group mt="xs">
            <Button onClick={() => setEditing(true)}>Edit product</Button>
          </Group>
          {hasLifecycleStatus ? (
            <Text size="sm" c="dimmed" mt="xs">
              Lifecycle status (draft, active, or retired) is changed from the edit form; deletion is not assumed.
            </Text>
          ) : null}
        </Stack>
      )}

      <div>
        <Title order={2}>Supplier</Title>
        {displaySupplier ? (
          <Text size="sm">
            {[...displaySupplier.displayNameChain, displaySupplier.entityId]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        ) : (
          <StatusBanner kind="empty" title="No supplier set." />
        )}
        {!isRoot && displaySupplier ? (
          <Text size="sm" c="dimmed" mt={2}>
            Set on the root product{" "}
            <ProductCrossLink to={productHref?.(rootId) ?? `/products/${rootId}`}>
              {rootLabel}
            </ProductCrossLink>
            ; it supplies every component beneath it.
          </Text>
        ) : null}
        {isRoot ? (
          <form onSubmit={handleSupplierSubmit} aria-label="Set supplier" style={{ marginTop: "var(--mantine-spacing-xs)" }}>
            <Group align="flex-end">
              <TextInput
                label="Supplier role ID"
                placeholder="e.g. ORG-000001-AIRLINE"
                value={supplierRoleId}
                onChange={(event) => setSupplierRoleId(event.currentTarget.value)}
              />
              <Button type="submit" size="compact-sm" loading={supplierMutation.isPending}>
                Set supplier
              </Button>
            </Group>
            {supplierMutation.isError ? <ApiErrorBanner error={supplierMutation.error} /> : null}
          </form>
        ) : null}
      </div>

      <div>
        <Group justify="space-between" align="center">
          <Title order={2}>Components</Title>
          <Button size="compact-sm" variant="default" onClick={() => setAddingComponent((open) => !open)}>
            {addingComponent ? "Cancel" : "Add component"}
          </Button>
        </Group>
        <DataTable<ProductComponentResponse>
          caption={`Components of ${label}`}
          rowKey={(row) => row.entityId}
          rows={components}
          emptyMessage="This product has no components."
          columns={[
            {
              key: "entityId",
              header: "Component",
              render: (row) => (
                <ProductChipLink to={productHref?.(row.entityId) ?? `/products/${row.entityId}`}>
                  {row.displayNameChain.join(" · ")}
                </ProductChipLink>
              ),
            },
            { key: "type", header: "Type", render: (row) => typeLabel(row.type) },
          ]}
        />
        {addingComponent ? (
          <ProductCreatePanel
            parentProductId={productId}
            typeOptions={addableComponentTypeOptions(product.type)}
            onCreated={() => {
              setAddingComponent(false);
              void queryClient.invalidateQueries({ queryKey: ["products", productId, "components"] });
            }}
            onCancel={() => setAddingComponent(false)}
          />
        ) : null}
      </div>
    </Stack>
  );
}
