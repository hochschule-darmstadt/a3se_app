import { Button, Group, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { type FormEvent, useState } from "react";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, FormErrorSummary, StatusBanner } from "@cct/ui";
import { useApiMutation } from "@cct/api-client";

import { apiClient, queryClient } from "../api";
import {
  CATALOGUE_ROOT_TYPE_OPTIONS,
  CREATABLE_TYPE_OPTIONS,
  LIFECYCLE_STATUS_OPTIONS,
  type LifecycleStatusCode,
  type ProductType,
} from "./catalogue-product-types";
import {
  EMPTY_PRODUCT_TYPE_FIELD_VALUES,
  ProductTypeFields,
  productTypeProperties,
  productTypeValidationErrors,
  type ProductTypeFieldValues,
} from "./product-type-fields";

type ProductMutationResponse = components["schemas"]["ProductMutationResponse"];

export interface ProductCreatePanelProps {
  readonly onCreated: (productId: string) => void;
  readonly onCancel: () => void;
  /** When set, the new product is created as a component of this product (issue #31: any product with components is a package -- no dedicated package type). Also switches this panel into "add component" mode: no supplier/parent-ID linking field, type choices limited to whatever `typeOptions` the caller supplies. */
  readonly parentProductId?: string;
  readonly typeOptions?: { value: ProductType; label: string }[];
}

/**
 * S-003 create flow (issue #31, product create/edit consistency pass): a
 * type-selected product, with a selectable lifecycle status (defaulting to
 * product/draft), plus its one type-determined link -- mirroring
 * PersonCreatePanel (#29) and
 * OrganisationCreatePanel (#30)'s "parent entity plus its initial link in
 * one guided form" pattern. Which link a type takes is not a user choice:
 * catalogue-root types may optionally link a supplier OrgaRole (by ID);
 * the two structural-child types (seat, room) require a parent product ID
 * of one specific matching type, validated server-side.
 *
 * Reused both for top-level catalogue creation (this component's own
 * linking field) and, with `parentProductId` set, for adding a component
 * from a product's detail view (no linking field -- the parent is already
 * fixed by the prop).
 */
export function ProductCreatePanel({ onCreated, onCancel, parentProductId, typeOptions }: ProductCreatePanelProps) {
  const isAddComponent = parentProductId !== undefined;
  const defaultTypeOptions = typeOptions ?? (isAddComponent ? CATALOGUE_ROOT_TYPE_OPTIONS : CREATABLE_TYPE_OPTIONS);
  const [type, setType] = useState<ProductType>(defaultTypeOptions[0]?.value ?? "product/mobility/transfer");
  const [values, setValues] = useState<ProductTypeFieldValues>(EMPTY_PRODUCT_TYPE_FIELD_VALUES);
  const [lifecycleStatusCode, setLifecycleStatusCode] = useState<LifecycleStatusCode>("product/draft");
  const [validationErrors, setValidationErrors] = useState<readonly string[]>([]);
  const [supplierRoleId, setSupplierRoleId] = useState("");
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  const createMutation = useApiMutation<ProductMutationResponse, void>(() => {
    const effectiveParentId = isAddComponent ? parentProductId : null;
    return apiClient.POST("/products", {
      body: {
        parentProductId: effectiveParentId,
        product: { type, properties: productTypeProperties(type, values, lifecycleStatusCode) } as never,
      },
    });
  });

  const supplierMutation = useApiMutation<void, { productId: string }>(({ productId }) =>
    apiClient.PUT("/products/{product_id}/supplier", {
      params: { path: { product_id: productId } },
      body: { supplierRoleId: supplierRoleId.trim() },
    })
  );

  function submitSupplierLink(productId: string) {
    supplierMutation.mutate(
      { productId },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["products"] });
          onCreated(productId);
        },
      }
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = productTypeValidationErrors(type, values);
    setValidationErrors(errors);
    if (errors.length > 0) return;

    createMutation.mutate(undefined, {
      onSuccess: (entity) => {
        void queryClient.invalidateQueries({ queryKey: ["products"] });
        if (!isAddComponent && supplierRoleId.trim()) {
          setCreatedProductId(entity.entityId);
          submitSupplierLink(entity.entityId);
          return;
        }
        onCreated(entity.entityId);
      },
    });
  }

  return (
    <Stack gap="md">
      <Title order={parentProductId ? 3 : 1}>{isAddComponent ? "Add component" : "Create product"}</Title>
      <Text size="sm" c="dimmed">
        Creates a new draft TouristicProductItem{isAddComponent ? " contained by this product" : ""}. Its type selects
        the property schema (entity-model TERM-002).
      </Text>

      <form onSubmit={handleSubmit} aria-label={isAddComponent ? "Add component" : "Create product"} noValidate>
        <Stack gap="xs">
          <FormErrorSummary errors={validationErrors} />
          <Select
            label="Type"
            required
            data={defaultTypeOptions}
            value={type}
            onChange={(value) => setType((value as ProductType) ?? defaultTypeOptions[0]?.value ?? "product/mobility/transfer")}
            allowDeselect={false}
          />
          <ProductTypeFields type={type} values={values} onChange={setValues} />

          {
            <Select
              label="Lifecycle status"
              data={LIFECYCLE_STATUS_OPTIONS}
              value={lifecycleStatusCode}
              onChange={(value) => setLifecycleStatusCode((value as LifecycleStatusCode) ?? "product/draft")}
              allowDeselect={false}
            />
          }

          {!isAddComponent ? (
            <TextInput
              label="Supplier role ID"
              placeholder="e.g. SUP-AIR-01-ROLE"
              description="Optional. Link this product to an existing organisation's supplier role now, or set one later from the product's detail view."
              value={supplierRoleId}
              onChange={(event) => setSupplierRoleId(event.currentTarget.value)}
            />
          ) : null}

          <Group>
            <Button type="submit" loading={createMutation.isPending || supplierMutation.isPending}>
              {isAddComponent ? "Add component" : "Create product"}
            </Button>
            <Button variant="default" onClick={onCancel}>
              Cancel
            </Button>
          </Group>

          {createMutation.isError ? <ApiErrorBanner error={createMutation.error} /> : null}
          {createdProductId && supplierMutation.isError ? (
            <Stack gap="xs">
              <StatusBanner
                kind="conflict"
                title="Product created, but the supplier link could not be added"
                description="The product record was saved. Retry adding the supplier, or open the product to add it from there."
              />
              <Group>
                <Button variant="light" loading={supplierMutation.isPending} onClick={() => submitSupplierLink(createdProductId)}>
                  Retry adding supplier
                </Button>
                <Button variant="subtle" onClick={() => onCreated(createdProductId)}>
                  Open product
                </Button>
              </Group>
            </Stack>
          ) : null}
        </Stack>
      </form>
    </Stack>
  );
}
