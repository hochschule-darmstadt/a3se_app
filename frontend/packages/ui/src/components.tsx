import {
  AppShell,
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { type ReactNode, useEffect, useRef } from "react";

import type { ApiError } from "@cct/api-client";

/**
 * Renders the loading/empty/error/conflict/success states every list or
 * mutation route needs (DS-CMP-003), from one shared implementation instead
 * of each route re-deriving its own markup.
 */
export type StatusBannerKind = "loading" | "empty" | "error" | "conflict" | "success" | "info";

export interface StatusBannerProps {
  readonly kind: StatusBannerKind;
  readonly title: string;
  readonly description?: string;
  readonly onRetry?: () => void;
}

const BANNER_COLOR: Record<StatusBannerKind, string> = {
  loading: "gray",
  empty: "gray",
  error: "red",
  conflict: "orange",
  success: "green",
  info: "blue",
};

export function StatusBanner({ kind, title, description, onRetry }: StatusBannerProps) {
  if (kind === "loading") {
    return (
      <Group gap="sm" role="status" aria-live="polite">
        <Loader size="sm" />
        <Text>{title}</Text>
      </Group>
    );
  }
  return (
    <Alert
      color={BANNER_COLOR[kind]}
      title={title}
      role={kind === "error" || kind === "conflict" ? "alert" : "status"}
    >
      {description ? <Text size="sm">{description}</Text> : null}
      {onRetry ? (
        <Button mt="sm" size="xs" variant="light" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Alert>
  );
}

/** Maps a normalized {@link ApiError} to a {@link StatusBanner}. */
export function ApiErrorBanner({ error, onRetry }: { error: ApiError; onRetry?: () => void }) {
  const kind: StatusBannerKind = error.kind === "conflict" ? "conflict" : "error";
  return <StatusBanner kind={kind} title={error.title} description={error.detail} onRetry={onRetry} />;
}

/**
 * Accessible cross-field error summary (WCAG "Error Summary" pattern): lists
 * every message and moves focus to itself on appearance so screen-reader
 * users are told validation failed without hunting for individual fields.
 */
export function FormErrorSummary({ errors }: { errors: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errors.length > 0) {
      ref.current?.focus();
    }
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <Alert color="red" title="Please fix the following before continuing" role="alert" tabIndex={-1} ref={ref}>
      <ul>
        {errors.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </Alert>
  );
}

export interface DataTableColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  readonly columns: readonly DataTableColumn<T>[];
  readonly rows: readonly T[];
  readonly rowKey: (row: T) => string;
  readonly caption: string;
  readonly sortKey?: string;
  readonly sortDirection?: "asc" | "desc";
  readonly onSortChange?: (key: string) => void;
  readonly onRowActivate?: (row: T) => void;
  readonly emptyMessage?: string;
}

/**
 * DS-CMP-006 data table: Mantine `Table` + `ScrollArea`, keyboard-operable
 * sort headers (buttons, not bare clickable text) and activatable rows.
 * Sorting/filtering/paging over already-fetched rows is the caller's
 * responsibility (kept out of this component per DS-Q-003's PoC-scoped
 * answer: no enterprise grid dependency, only this thin wrapper).
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  sortKey,
  sortDirection,
  onSortChange,
  onRowActivate,
  emptyMessage = "No records to display.",
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <StatusBanner kind="empty" title={emptyMessage} />;
  }

  return (
    <ScrollArea>
      <Table striped highlightOnHover captionSide="top">
        <Table.Caption>{caption}</Table.Caption>
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th key={column.key} aria-sort={sortKey === column.key ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}>
                {column.sortable && onSortChange ? (
                  <Button variant="subtle" size="compact-sm" onClick={() => onSortChange(column.key)}>
                    {column.header}
                    {sortKey === column.key ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
                  </Button>
                ) : (
                  column.header
                )}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr
              key={rowKey(row)}
              onClick={onRowActivate ? () => onRowActivate(row) : undefined}
              style={onRowActivate ? { cursor: "pointer" } : undefined}
              tabIndex={onRowActivate ? 0 : undefined}
              onKeyDown={
                onRowActivate
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRowActivate(row);
                      }
                    }
                  : undefined
              }
            >
              {columns.map((column) => (
                <Table.Td key={column.key}>{column.render(row)}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

export function CursorPager({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  loading,
}: {
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly loading?: boolean;
}) {
  return (
    <Group justify="space-between" mt="sm">
      <Button variant="default" disabled={!hasPrevious || loading} onClick={onPrevious}>
        Previous page
      </Button>
      <Button variant="default" disabled={!hasNext || loading} onClick={onNext}>
        Next page
      </Button>
    </Group>
  );
}

export interface ResourceCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly badge?: string;
  readonly details?: readonly { label: string; value: string }[];
  readonly action?: ReactNode;
}

/** DS-CMP-005 card: a titled, badge-labelled summary with optional detail rows and one action. */
export function ResourceCard({ title, subtitle, badge, details, action }: ResourceCardProps) {
  return (
    <Card withBorder padding="lg" radius="lg">
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={3}>{title}</Title>
            {subtitle ? <Text c="dimmed">{subtitle}</Text> : null}
          </div>
          {badge ? <Badge>{badge}</Badge> : null}
        </Group>
        {details?.length ? (
          <Stack gap={4}>
            {details.map((detail) => (
              <Group key={detail.label} justify="space-between">
                <Text size="sm" c="dimmed">
                  {detail.label}
                </Text>
                <Text size="sm">{detail.value}</Text>
              </Group>
            ))}
          </Stack>
        ) : null}
        {action}
      </Stack>
    </Card>
  );
}

export interface OfferSummaryProps {
  readonly orderNumber: string;
  readonly statusLabel: string;
  readonly positions: readonly { label: string; detail: string; amount?: string }[];
  readonly totalAmount?: string;
  readonly currencyCode?: string;
  readonly pendingNote?: string;
}

/** DS-CMP-008 offer/order summary: identifier, positions, price, status, pending-data labelling. */
export function OfferSummary({ orderNumber, statusLabel, positions, totalAmount, currencyCode, pendingNote }: OfferSummaryProps) {
  return (
    <Card withBorder padding="lg" radius="lg">
      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={2}>Order {orderNumber}</Title>
          <Badge>{statusLabel}</Badge>
        </Group>
        <Stack gap={4}>
          {positions.map((position) => (
            <Group key={position.label} justify="space-between">
              <div>
                <Text fw={500}>{position.label}</Text>
                <Text size="sm" c="dimmed">
                  {position.detail}
                </Text>
              </div>
              {position.amount ? <Text>{position.amount}</Text> : null}
            </Group>
          ))}
        </Stack>
        {totalAmount ? (
          <Group justify="space-between">
            <Text fw={700}>Total</Text>
            <Text fw={700}>
              {totalAmount} {currencyCode}
            </Text>
          </Group>
        ) : null}
        {pendingNote ? (
          <Text size="sm" c="dimmed">
            {pendingNote}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}

export interface AppShellLayoutProps {
  readonly title: string;
  readonly navLinks: readonly { label: string; to: string }[];
  readonly linkComponent: (props: { to: string; children: ReactNode }) => ReactNode;
  readonly headerRight?: ReactNode;
  readonly children: ReactNode;
}

/** DS-CMP-001 shell: persistent labelled navigation landmark + main content region. */
export function AppShellLayout({ title, navLinks, linkComponent: Link, headerRight, children }: AppShellLayoutProps) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Title order={4}>{title}</Title>
            <Group component="nav" aria-label="Primary" gap="xs">
              {navLinks.map((link) => (
                <Anchor key={link.to} component="div">
                  {Link({ to: link.to, children: link.label })}
                </Anchor>
              ))}
            </Group>
          </Group>
          {headerRight}
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
