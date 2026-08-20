import type { components } from "@cct/api-client";

import { SUPPLIER_ROLE_TYPE_LABEL } from "./supplier-roles";
import { catalogueProperties, productDisplayLabel } from "./catalogue-product-types";

type ProductResponse = components["schemas"]["ProductResponse"];
type OrgaRoleResponse = components["schemas"]["OrgaRoleResponse"];
type OrganisationResponse = components["schemas"]["OrganisationResponse"];

export interface ProductTreeEntry {
  readonly product: ProductResponse;
  /** Root-first ancestor chain (immediate parent last), excluding the product itself. */
  readonly ancestors: readonly ProductResponse[];
}

/** The topmost ancestor, or the product itself when it has none (i.e. it is already a root). */
export function rootOf(entry: ProductTreeEntry): ProductResponse {
  return entry.ancestors[0] ?? entry.product;
}

/** Immediate parent's entityId, or null for a root. */
export function parentIdOf(entry: ProductTreeEntry): string | null {
  return entry.ancestors.length > 0 ? entry.ancestors[entry.ancestors.length - 1]!.entityId : null;
}

export function buildChildrenIndex(entries: readonly ProductTreeEntry[]): Map<string, ProductResponse[]> {
  const index = new Map<string, ProductResponse[]>();
  for (const entry of entries) {
    const parentId = parentIdOf(entry);
    if (parentId === null) continue;
    const siblings = index.get(parentId) ?? [];
    siblings.push(entry.product);
    index.set(parentId, siblings);
  }
  return index;
}

/**
 * The breadcrumb segments "up to the supplier" (issue #31 follow-up):
 * [organisation name, supplier role type, ...intermediate ancestor labels, this product's own label].
 * Falls back gracefully when a root has no supplier set yet.
 */
export function breadcrumbSegments(
  entry: ProductTreeEntry,
  supplierByRootId: ReadonlyMap<string, OrgaRoleResponse | null>,
  organisationByRoleId: ReadonlyMap<string, OrganisationResponse | null>
): string[] {
  const segments: string[] = [];
  const root = rootOf(entry);
  const supplier = supplierByRootId.get(root.entityId);
  if (supplier) {
    const organisation = organisationByRoleId.get(supplier.entityId);
    if (organisation) segments.push(organisation.properties.name);
    segments.push(SUPPLIER_ROLE_TYPE_LABEL[supplier.type] ?? supplier.type);
  }
  for (const ancestor of entry.ancestors) {
    segments.push(productDisplayLabel(ancestor.entityId, ancestor.type, catalogueProperties(ancestor.properties).displayName));
  }
  segments.push(productDisplayLabel(entry.product.entityId, entry.product.type, catalogueProperties(entry.product.properties).displayName));
  return segments;
}

export function breadcrumbLabel(
  entry: ProductTreeEntry,
  supplierByRootId: ReadonlyMap<string, OrgaRoleResponse | null>,
  organisationByRoleId: ReadonlyMap<string, OrganisationResponse | null>
): string {
  return breadcrumbSegments(entry, supplierByRootId, organisationByRoleId).join(" - ");
}

/** Whether `term` (already lowercased, trimmed) appears anywhere in the breadcrumb text or any segment's entityId. */
export function matchesSearchTerm(entry: ProductTreeEntry, term: string, breadcrumb: string): boolean {
  if (breadcrumb.toLowerCase().includes(term)) return true;
  if (entry.product.entityId.toLowerCase().includes(term)) return true;
  return entry.ancestors.some((ancestor) => ancestor.entityId.toLowerCase().includes(term));
}
