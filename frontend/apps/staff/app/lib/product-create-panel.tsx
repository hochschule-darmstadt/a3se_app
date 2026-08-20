import { Button, Group, Select, Stack, Text, Title } from "@mantine/core";
import { type FormEvent, useState } from "react";

import type { components } from "@cct/api-client";
import { ApiErrorBanner, FormErrorSummary } from "@cct/ui";
import { useApiMutation } from "@cct/api-client";

import { apiClient, queryClient } from "../api";
import { CATALOGUE_ROOT_TYPE_OPTIONS, type CatalogueRootType } from "./catalogue-product-types";
import {
  EMPTY_PRODUCT_TYPE_FIELD_VALUES,
  ProductTypeFields,
  productTypeProperties,
  productTypeValidationErrors,
  type ProductTypeFieldValues,
} from "./product-type-fields";

type ProductResponse = components["schemas"]["ProductResponse"];

function generateEntityId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export interface ProductCreatePanelProps {
  readonly onCreated: (productId: string) => void;
  readonly onCancel: () => void;
  /** When set, the new product is created as a component of this product (issue #31: any product with components is a package -- no dedicated package type). */
  readonly parentProductId?: string;
  readonly typeOptions?: { value: CatalogueRootType; label: string }[];
}

/**
 * S-003 create flow (issue #31): a type-selected draft, defaulting to
 * lifecycle status product/draft. Reused both for top-level catalogue
 * creation and, with `parentProductId` set, for adding a component from a
 * product's detail view -- the same recursive CONTAINS mechanism resolves
 * UC-004's package-bundling question (stakeholder decision, #31 phase 1).
 */
export function ProductCreatePanel({ onCreated, onCancel, parentProductId, typeOptions }: ProductCreatePanelProps) {
  const [type, setType] = useState<CatalogueRootType>("product/mobility/transfer");
  const [values, setValues] = useState<ProductTypeFieldValues>(EMPTY_PRODUCT_TYPE_FIELD_VALUES);
  const [validationErrors, setValidationErrors] = useState<readonly string[]>([]);

  const createMutation = useApiMutation<ProductResponse, void>(() => {
    const entityId = generateEntityId("PRD");
    return apiClient.POST("/products", {
      body: {
        entityId,
        parentProductId: parentProductId ?? null,
        product: { type, properties: productTypeProperties(type, values, "product/draft") } as never,
      },
    });
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = productTypeValidationErrors(type, values);
    setValidationErrors(errors);
    if (errors.length > 0) return;

    createMutation.mutate(undefined, {
      onSuccess: (entity) => {
        void queryClient.invalidateQueries({ queryKey: ["products"] });
        onCreated(entity.entityId);
      },
    });
  }

  return (
    <Stack gap="md">
      <Title order={parentProductId ? 3 : 1}>{parentProductId ? "Add component" : "Create product draft"}</Title>
      <Text size="sm" c="dimmed">
        Creates a new draft TouristicProductItem{parentProductId ? " contained by this product" : ""}. Its type selects
        the property schema (entity-model TERM-002).
      </Text>

      <form onSubmit={handleSubmit} aria-label={parentProductId ? "Add component" : "Create product draft"} noValidate>
        <Stack gap="xs">
          <FormErrorSummary errors={validationErrors} />
          <Select
            label="Type"
            required
            data={typeOptions ?? CATALOGUE_ROOT_TYPE_OPTIONS}
            value={type}
            onChange={(value) => setType((value as CatalogueRootType) ?? "product/mobility/transfer")}
            allowDeselect={false}
          />
          <ProductTypeFields type={type} values={values} onChange={setValues} />

          <Group>
            <Button type="submit" loading={createMutation.isPending}>
              {parentProductId ? "Add component" : "Create draft"}
            </Button>
            <Button variant="default" onClick={onCancel}>
              Cancel
            </Button>
          </Group>

          {createMutation.isError ? <ApiErrorBanner error={createMutation.error} /> : null}
        </Stack>
      </form>
    </Stack>
  );
}
