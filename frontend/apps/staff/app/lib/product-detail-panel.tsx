import { Badge, Button, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, DataTable, FormErrorSummary, StatusBanner } from "@cct/ui";
import { useApiMutation, useApiQuery } from "@cct/api-client";

import { apiClient, queryClient } from "../api";
import {
  CATALOGUE_ROOT_TYPE_OPTIONS,
  LIFECYCLE_STATUS_LABEL,
  catalogueProperties,
  typeLabel,
  type CatalogueRootType,
  type LifecycleStatusCode,
  productDisplayLabel,
} from "./catalogue-product-types";
import { breadcrumbLabel, type ProductTreeEntry } from "./catalogue-tree";
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
type ProductComponentResponse = components["schemas"]["ProductComponentResponse"];
type OrgaRoleResponse = components["schemas"]["OrgaRoleResponse"];

function invalidateProduct(productId: string) {
  void queryClient.invalidateQueries({ queryKey: ["products", productId] });
  void queryClient.invalidateQueries({ queryKey: ["products"] });
}

/**
 * S-003 detail (issue #31): a TouristicProductItem's type-specific fields,
 * lifecycle status (activate/retire -- WF-Q-014, no version history), its
 * recursive component tree, and its supplying OrgaRole. Used both as the
 * master-detail right pane on the products list and as the standalone
 * `/products/:id` route's content, mirroring `PersonDetailPanel` (#29) and
 * `OrganisationDetailPanel` (#30).
 */
export function ProductDetailPanel({ productId }: { readonly productId: string }) {
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
  const rootSupplierRoleId = rootSupplierQuery.data?.entityId;
  const organisationQuery = useApiQuery(
    ["organisations", "roles", rootSupplierRoleId, "organisation"],
    () => apiClient.GET("/organisations/roles/{role_id}/organisation", { params: { path: { role_id: rootSupplierRoleId as string } } }),
    { enabled: Boolean(rootSupplierRoleId) }
  );

  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<ProductTypeFieldValues>(EMPTY_PRODUCT_TYPE_FIELD_VALUES);
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
    }
  }, [productQuery.data]);

  const updateMutation = useApiMutation<ProductResponse, { type: string; properties: Record<string, unknown> }>(
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
      { type, properties: productTypeProperties(type, values, catalogueProperties(productQuery.data.properties).lifecycleStatusCode ?? "product/draft") },
      { onSuccess: () => { setEditing(false); invalidateProduct(productId); } }
    );
  }

  function handleLifecycleChange(lifecycleStatusCode: LifecycleStatusCode) {
    if (!productQuery.data) return;
    const type = productQuery.data.type;
    updateMutation.mutate(
      { type, properties: productTypeProperties(type, fieldValuesFromProperties(type, productQuery.data.properties as Record<string, unknown>), lifecycleStatusCode) },
      { onSuccess: () => invalidateProduct(productId) }
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
  const lifecycleStatusCode = catalogueProperties(product.properties).lifecycleStatusCode as LifecycleStatusCode;
  const isActive = lifecycleStatusCode === "product/active";
  const isRetired = lifecycleStatusCode === "product/retired";
  const ownLabel = productDisplayLabel(product.entityId, product.type, catalogueProperties(product.properties).displayName);
  const label = ancestorsQuery.data
    ? breadcrumbLabel(
        { product, ancestors: ancestorsQuery.data } as ProductTreeEntry,
        new Map([[rootId, rootSupplierQuery.data ?? null]]),
        new Map(rootSupplierRoleId ? [[rootSupplierRoleId, organisationQuery.data ?? null]] : [])
      )
    : ownLabel;
  const components = componentsQuery.data.filter((component) => component.entityId !== product.entityId);
  const supplier = supplierQuery.data as OrgaRoleResponse | null;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <Title order={1}>{label}</Title>
        <Badge color={isActive ? "green" : isRetired ? "gray" : undefined}>{LIFECYCLE_STATUS_LABEL[lifecycleStatusCode]}</Badge>
      </Group>

      {editing ? (
        <form onSubmit={handleEditSubmit} aria-label="Edit product" noValidate>
          <Stack gap="xs">
            <FormErrorSummary errors={validationErrors} />
            <ProductTypeFields type={product.type} values={values} onChange={setValues} />
            <Group>
              <Button type="submit" loading={updateMutation.isPending}>
                Update draft
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setEditing(false);
                  setValues(fieldValuesFromProperties(product.type, product.properties as Record<string, unknown>));
                }}
              >
                Cancel changes
              </Button>
            </Group>
            {updateMutation.isError ? <ApiErrorBanner error={updateMutation.error} /> : null}
          </Stack>
        </form>
      ) : (
        <Stack gap={4}>
          <Group>
            <Text fw={500}>ID</Text>
            <Text>{product.entityId}</Text>
          </Group>
          <Group>
            <Text fw={500}>Type</Text>
            <Text>{typeLabel(product.type)}</Text>
          </Group>
          <Group mt="xs">
            <Button onClick={() => setEditing(true)}>Edit draft</Button>
            <Button className="primary" disabled={isActive} loading={updateMutation.isPending} onClick={() => handleLifecycleChange("product/active")}>
              Activate
            </Button>
            <Button variant="default" disabled={isRetired} loading={updateMutation.isPending} onClick={() => handleLifecycleChange("product/retired")}>
              Retire from future sale
            </Button>
          </Group>
          <Text size="xs" c="dimmed" mt="xs">
            Activation and retirement change this record's lifecycle status; deletion is not assumed.
          </Text>
        </Stack>
      )}

      <div>
        <Title order={2}>Supplier</Title>
        {supplier ? (
          <Text size="sm">
            {supplier.type} · {supplier.entityId}
          </Text>
        ) : (
          <StatusBanner kind="empty" title="No supplier set." />
        )}
        <form onSubmit={handleSupplierSubmit} aria-label="Set supplier" style={{ marginTop: "var(--mantine-spacing-xs)" }}>
          <Group align="flex-end">
            <TextInput
              label="Supplier role ID"
              placeholder="e.g. SUP-AIR-01-ROLE"
              value={supplierRoleId}
              onChange={(event) => setSupplierRoleId(event.currentTarget.value)}
            />
            <Button type="submit" size="compact-sm" loading={supplierMutation.isPending}>
              Set supplier
            </Button>
          </Group>
          {supplierMutation.isError ? <ApiErrorBanner error={supplierMutation.error} /> : null}
        </form>
      </div>

      <div>
        <Group justify="space-between" align="center">
          <Title order={2}>Components</Title>
          <Button size="compact-sm" variant="default" onClick={() => setAddingComponent((open) => !open)}>
            {addingComponent ? "Cancel" : "Add component"}
          </Button>
        </Group>
        {components.length === 0 ? <StatusBanner kind="empty" title="This product has no components." /> : null}
        <DataTable<ProductComponentResponse>
          caption={`Components of ${label}`}
          rowKey={(row) => row.entityId}
          rows={components}
          emptyMessage="This product has no components."
          columns={[
            {
              key: "entityId",
              header: "Component",
              render: (row) => <Link to={`/products/${row.entityId}`}>{productDisplayLabel(row.entityId, row.type, catalogueProperties(row.properties).displayName)}</Link>,
            },
            { key: "type", header: "Type", render: (row) => typeLabel(row.type) },
          ]}
        />
        {addingComponent ? (
          <ProductCreatePanel
            parentProductId={productId}
            typeOptions={CATALOGUE_ROOT_TYPE_OPTIONS as { value: CatalogueRootType; label: string }[]}
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
