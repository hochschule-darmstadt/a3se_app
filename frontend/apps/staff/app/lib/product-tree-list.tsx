import { Badge, Group, Table, Text, UnstyledButton } from "@mantine/core";
import { useState } from "react";

import type { components } from "@cct/api-client";
import { StatusBanner } from "@cct/ui";

import { catalogueProperties, typeLabel } from "./catalogue-product-types";
import { LIFECYCLE_STATUS_LABEL } from "./catalogue-product-types";

type ProductResponse = components["schemas"]["ProductResponse"];

export interface ProductTreeListProps {
  /** Top-level matches, already carrying their full "up to supplier" breadcrumb label -- one page's worth, per the caller's pagination. */
  readonly matches: readonly { readonly product: ProductResponse; readonly breadcrumb: string }[];
  readonly childrenByParentId: ReadonlyMap<string, ProductResponse[]>;
  readonly selectedId: string | null;
  readonly onSelect: (productId: string) => void;
  readonly emptyMessage: string;
  /** e.g. "Products · 1–20 of 35", matching `DataTable`'s caption convention (persons/organisations lists) so every list reads the same way. */
  readonly caption: string;
}

/**
 * S-003 tree view (VIEW-S-003 follow-up): each matched row shows its
 * breadcrumb "up to the supplier" as the title; a "+" reveals its own
 * children (lazily, recursively, to any depth), matching stakeholder
 * direction that only the upper hierarchy is named up front while lower
 * levels are opened on demand. Built on Mantine `Table` (DS-CMP-006, the
 * same primitive `@cct/ui`'s `DataTable` uses) so headers and row striping
 * match the rest of the app; the WAI-ARIA `treegrid` pattern (rather than
 * plain `table`/`grid`) layers the tree semantics (level, expand state)
 * onto that table. Column widths are fixed via `<colgroup>` (name gets the
 * remaining space, type/lifecycle stay narrow) -- without it, `table-layout:
 * auto` sizes the name column to its single longest breadcrumb across every
 * row, leaving a large gap before type/lifecycle on every shorter row. The
 * header row is sticky within this component's own scroll container (see
 * the products route, which owns that container so the search/filter bar
 * above it can stay pinned too).
 */
export function ProductTreeList({ matches, childrenByParentId, selectedId, onSelect, emptyMessage, caption }: ProductTreeListProps) {
  if (matches.length === 0) {
    return <StatusBanner kind="empty" title={emptyMessage} />;
  }

  return (
    <Table striped highlightOnHover captionSide="top" role="treegrid" aria-label="Product catalogue tree" style={{ tableLayout: "fixed" }}>
      <Table.Caption>{caption}</Table.Caption>
      <colgroup>
        <col style={{ width: "55%" }} />
        <col style={{ width: "27%" }} />
        <col style={{ width: "18%" }} />
      </colgroup>
      <Table.Thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "var(--mantine-color-body)" }}>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Lifecycle</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
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
      </Table.Tbody>
    </Table>
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
      <Table.Tr
        role="row"
        aria-level={depth + 1}
        aria-selected={selected}
        aria-expanded={hasChildren ? expanded : undefined}
        bg={selected ? "var(--mantine-color-blue-0)" : undefined}
        onClick={() => onSelect(product.entityId)}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(product.entityId);
          }
        }}
      >
        <Table.Td style={{ overflow: "hidden" }}>
          <Group gap="xs" wrap="nowrap" style={{ paddingLeft: depth * 20, minWidth: 0 }}>
            {hasChildren ? (
              <UnstyledButton
                aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setExpanded((value) => !value);
                }}
                w={16}
                ta="center"
                fw={700}
              >
                {expanded ? "−" : "+"}
              </UnstyledButton>
            ) : (
              <span style={{ display: "inline-block", width: 16, flexShrink: 0 }} />
            )}
            <Text size="sm" truncate style={{ minWidth: 0 }}>{label}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed" truncate>{typeLabel(product.type)}</Text>
        </Table.Td>
        <Table.Td>
          {lifecycleStatusCode ? (
            <Badge size="sm" color={lifecycleStatusCode === "product/active" ? "green" : lifecycleStatusCode === "product/retired" ? "gray" : undefined}>
              {LIFECYCLE_STATUS_LABEL[lifecycleStatusCode] ?? lifecycleStatusCode}
            </Badge>
          ) : null}
        </Table.Td>
      </Table.Tr>
      {expanded
        ? children.map((child) => (
            <ProductTreeRow
              key={child.entityId}
              product={child}
              label={child.displayNameChain.join(" · ")}
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
