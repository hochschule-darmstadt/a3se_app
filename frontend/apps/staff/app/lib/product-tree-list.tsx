import { Badge, Box, Group, Text, UnstyledButton } from "@mantine/core";
import { useState } from "react";

import type { components } from "@cct/api-client";
import { StatusBanner } from "@cct/ui";

import { catalogueProperties, productDisplayLabel, typeLabel } from "./catalogue-product-types";
import { LIFECYCLE_STATUS_LABEL } from "./catalogue-product-types";

type ProductResponse = components["schemas"]["ProductResponse"];

export interface ProductTreeListProps {
  /** Top-level matches, already carrying their full "up to supplier" breadcrumb label. */
  readonly matches: readonly { readonly product: ProductResponse; readonly breadcrumb: string }[];
  readonly childrenByParentId: ReadonlyMap<string, ProductResponse[]>;
  readonly selectedId: string | null;
  readonly onSelect: (productId: string) => void;
  readonly emptyMessage: string;
}

/**
 * S-003 tree view (VIEW-S-003 follow-up): each matched row shows its
 * breadcrumb "up to the supplier" as the title; a "+" reveals its own
 * children (lazily, recursively, to any depth), matching stakeholder
 * direction that only the upper hierarchy is named up front while lower
 * levels are opened on demand.
 */
export function ProductTreeList({ matches, childrenByParentId, selectedId, onSelect, emptyMessage }: ProductTreeListProps) {
  if (matches.length === 0) {
    return <StatusBanner kind="empty" title={emptyMessage} />;
  }

  return (
    <Box role="tree" aria-label="Product catalogue tree">
      {matches.map(({ product, breadcrumb }) => (
        <ProductTreeRow
          key={product.entityId}
          product={product}
          label={breadcrumb}
          depth={0}
          childrenByParentId={childrenByParentId}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </Box>
  );
}

function ProductTreeRow({
  product,
  label,
  depth,
  childrenByParentId,
  selectedId,
  onSelect,
}: {
  readonly product: ProductResponse;
  readonly label: string;
  readonly depth: number;
  readonly childrenByParentId: ReadonlyMap<string, ProductResponse[]>;
  readonly selectedId: string | null;
  readonly onSelect: (productId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const children = childrenByParentId.get(product.entityId) ?? [];
  const hasChildren = children.length > 0;
  const lifecycleStatusCode = catalogueProperties(product.properties).lifecycleStatusCode;
  const selected = selectedId === product.entityId;

  return (
    <>
      <Group
        role="treeitem"
        aria-selected={selected}
        aria-expanded={hasChildren ? expanded : undefined}
        wrap="nowrap"
        gap="xs"
        pl={depth * 20}
        py={4}
        bg={selected ? "var(--mantine-color-blue-0)" : undefined}
        style={{ borderRadius: 4 }}
      >
        {hasChildren ? (
          <UnstyledButton
            aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((value) => !value);
            }}
            w={20}
            ta="center"
            fw={700}
          >
            {expanded ? "−" : "+"}
          </UnstyledButton>
        ) : (
          <Box w={20} />
        )}
        <UnstyledButton onClick={() => onSelect(product.entityId)} style={{ flex: 1, textAlign: "left" }}>
          <Text size="sm">{label}</Text>
        </UnstyledButton>
        {lifecycleStatusCode ? (
          <Badge size="sm" color={lifecycleStatusCode === "product/active" ? "green" : lifecycleStatusCode === "product/retired" ? "gray" : undefined}>
            {LIFECYCLE_STATUS_LABEL[lifecycleStatusCode] ?? lifecycleStatusCode}
          </Badge>
        ) : null}
        <Text size="xs" c="dimmed" w={170} ta="right">
          {typeLabel(product.type)}
        </Text>
      </Group>
      {expanded
        ? children.map((child) => (
            <ProductTreeRow
              key={child.entityId}
              product={child}
              label={productDisplayLabel(child.entityId, child.type, catalogueProperties(child.properties).displayName)}
              depth={depth + 1}
              childrenByParentId={childrenByParentId}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))
        : null}
    </>
  );
}
