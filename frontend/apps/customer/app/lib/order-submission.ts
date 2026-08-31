import { toApiError, type ApiClient, type ApiError } from "@cct/api-client";

/** `ORD-DRAFT-<timestamp>` per the issue's own instruction -- never collides with seeded `ORD-nnn` ids. */
export function generateDraftOrderId(): string {
  return `ORD-DRAFT-${Date.now()}`;
}

export interface ResolvedRoles {
  readonly customerRoleId: string;
  readonly travellerRoleId: string;
}

/**
 * Resolves the signed-in mock actor's real customer/traveller role ids via
 * `GET /persons/{id}/roles`, rather than hardcoding the seeded
 * `PER-001-CUSTOMER`/`PER-001-TRAVELLER` ids directly -- the ids happen to
 * follow that pattern in the seed data, but looking them up by role `type`
 * is the same shape a non-demo person record would need.
 */
export async function resolvePersonRoles(apiClient: ApiClient, personId: string): Promise<ResolvedRoles> {
  const { data, error, response } = await apiClient.GET("/persons/{person_id}/roles", {
    params: { path: { person_id: personId } },
  });
  if (!response.ok || !data) {
    throw toApiError(error, response);
  }
  const customer = data.find((role) => role.type === "person/customer");
  const traveller = data.find((role) => role.type === "person/traveller");
  if (!customer || !traveller) {
    const missing: ApiError = {
      kind: "validation",
      title: "Missing customer/traveller role",
      detail: `Person ${personId} does not have both a customer and a traveller role.`,
    };
    throw missing;
  }
  return { customerRoleId: customer.entityId, travellerRoleId: traveller.entityId };
}

export type SubmissionStepId = "roles" | "order" | "position" | "stock" | "traveller" | "customer";

export const SUBMISSION_STEPS: readonly SubmissionStepId[] = [
  "roles",
  "order",
  "position",
  "stock",
  "traveller",
  "customer",
];

export interface SubmissionContext {
  readonly apiClient: ApiClient;
  readonly personId: string;
  readonly orderId: string;
  readonly positionId: string;
  readonly stockItemId: string;
}

/**
 * Runs one submission step. Each step is idempotent-safe to re-run only
 * when the caller ensures it has not already succeeded (see `order.tsx`'s
 * `completedSteps` tracking) -- retrying a step that already succeeded
 * (e.g. re-POSTing the same order id) would otherwise surface as a
 * `conflict`/`duplicate` failure instead of progressing.
 */
export async function runSubmissionStep(
  step: SubmissionStepId,
  context: SubmissionContext,
  roles: ResolvedRoles | null
): Promise<ResolvedRoles | void> {
  const { apiClient, personId, orderId, positionId, stockItemId } = context;

  switch (step) {
    case "roles":
      return resolvePersonRoles(apiClient, personId);

    case "order": {
      const { error, response } = await apiClient.POST("/orders", {
        body: { properties: { orderStatusCode: "order/reserved" } },
      });
      if (!response.ok) throw toApiError(error, response);
      return;
    }

    case "position": {
      const { error, response } = await apiClient.POST("/orders/{order_id}/positions", {
        params: { path: { order_id: orderId } },
        body: { entityId: positionId },
      });
      if (!response.ok) throw toApiError(error, response);
      return;
    }

    case "stock": {
      const { error, response } = await apiClient.PUT("/orders/{order_id}/positions/{position_id}/stock", {
        params: { path: { order_id: orderId, position_id: positionId } },
        body: { stockItemId },
      });
      if (!response.ok) throw toApiError(error, response);
      return;
    }

    case "traveller": {
      if (!roles) throw new Error("roles must resolve before assigning a traveller");
      const { error, response } = await apiClient.PUT("/orders/{order_id}/positions/{position_id}/traveller", {
        params: { path: { order_id: orderId, position_id: positionId } },
        body: { travellerRoleId: roles.travellerRoleId },
      });
      if (!response.ok) throw toApiError(error, response);
      return;
    }

    case "customer": {
      if (!roles) throw new Error("roles must resolve before assigning a customer");
      const { error, response } = await apiClient.PUT("/orders/{order_id}/customer", {
        params: { path: { order_id: orderId } },
        body: { customerRoleId: roles.customerRoleId },
      });
      if (!response.ok) throw toApiError(error, response);
      return;
    }

    default:
      return;
  }
}
