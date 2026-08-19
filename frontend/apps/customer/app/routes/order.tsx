import { Anchor, Button, Container, CopyButton, Group, Stack, Text, Title } from "@mantine/core";
import { isRetryable, type ApiError } from "@cct/api-client";
import { StatusBanner, useMockActor } from "@cct/ui";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { apiClient } from "../api";
import { useT } from "../i18n";
import { stockItemId } from "../lib/availability";
import {
  SUBMISSION_STEPS,
  generateDraftOrderId,
  runSubmissionStep,
  type ResolvedRoles,
  type SubmissionStepId,
} from "../lib/order-submission";
import { CustomerShell } from "../lib/shell";

export function meta() {
  return [{ title: "Order – Christopher Columbus Travel" }];
}

type Status = "running" | "success" | "error";

/**
 * VIEW-C-004: performs the real order-submission sequence on entry
 * (`POST /orders` -> `POST .../positions` -> `PUT .../stock` ->
 * `PUT .../traveller` -> `PUT .../customer`) and shows the confirmation
 * state. The order/position ids are generated once (`useState` lazy init)
 * and reused across retries so a retry resumes from the failed step instead
 * of re-creating already-created entities (which would otherwise surface a
 * spurious `conflict` on the order id itself).
 */
export default function Order() {
  const t = useT();
  const navigate = useNavigate();
  const { actor } = useMockActor();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId") ?? "";
  const date = searchParams.get("date") ?? "";

  const [orderId] = useState(generateDraftOrderId);
  const positionId = `${orderId}-P1`;
  const stockId = stockItemId(productId, date);

  const [status, setStatus] = useState<Status>("running");
  const [error, setError] = useState<ApiError | null>(null);
  const [failedStep, setFailedStep] = useState<SubmissionStepId | null>(null);
  const rolesRef = useRef<ResolvedRoles | null>(null);
  const completedRef = useRef<Set<SubmissionStepId>>(new Set());

  useEffect(() => {
    if (!actor) {
      navigate(`/sign-in?${searchParams.toString()}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor]);

  async function runFrom(startIndex: number) {
    if (!actor) return;
    setStatus("running");
    setError(null);
    setFailedStep(null);

    const context = { apiClient, personId: actor.personId, orderId, positionId, stockItemId: stockId };

    for (let index = startIndex; index < SUBMISSION_STEPS.length; index += 1) {
      const step = SUBMISSION_STEPS[index];
      if (!step) continue;
      if (completedRef.current.has(step)) continue;
      try {
        const result = await runSubmissionStep(step, context, rolesRef.current);
        if (step === "roles" && result) {
          rolesRef.current = result;
        }
        completedRef.current.add(step);
      } catch (caught) {
        setError(caught as ApiError);
        setFailedStep(step);
        setStatus("error");
        return;
      }
    }
    setStatus("success");
  }

  const startedRef = useRef(false);
  useEffect(() => {
    if (!actor || startedRef.current) return;
    startedRef.current = true;
    void runFrom(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor]);

  function retry() {
    const startIndex = failedStep ? SUBMISSION_STEPS.indexOf(failedStep) : 0;
    void runFrom(startIndex);
  }

  if (!actor) {
    return null;
  }

  return (
    <CustomerShell breadcrumbs={[{ label: "Travel portal", to: "/" }, { label: "Order" }]}>
      <Container py="xl" size="md">
        <Stack gap="lg">
          <Title order={1}>{t("order.heading")}</Title>

          {status === "running" ? <StatusBanner kind="loading" title={t("order.submitting")} /> : null}

          {status === "error" && error ? renderError(error) : null}

          {status === "success" ? (
            <Stack gap="md">
              <StatusBanner kind="success" title={t("order.success.title")} description={t("order.success.description")} />
              <Group>
                <Text fw={700}>{t("order.success.id.label")}:</Text>
                <Text>{orderId}</Text>
                <CopyButton value={orderId}>
                  {({ copied, copy }) => (
                    <Button size="compact-sm" variant="light" onClick={copy}>
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  )}
                </CopyButton>
              </Group>
              <Text>
                {t("order.success.number.label")}: {orderId}
              </Text>
              <Link to="/">{t("nav.home")}</Link>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </CustomerShell>
  );

  function renderError(currentError: ApiError) {
    if (currentError.kind === "conflict") {
      return (
        <Stack gap="xs">
          <StatusBanner
            kind="conflict"
            title={t("order.error.conflict.title")}
            description={`${t("order.error.conflict.description")} (${currentError.detail})`}
          />
          <Anchor component={Link} to={`/offer?${searchParams.toString()}`}>
            {t("order.backToOffer")}
          </Anchor>
        </Stack>
      );
    }
    if (currentError.kind === "validation") {
      return (
        <Stack gap="xs">
          <StatusBanner kind="error" title={t("order.error.validation.title")} description={currentError.detail} />
          <Anchor component={Link} to={`/offer?${searchParams.toString()}`}>
            {t("order.backToOffer")}
          </Anchor>
        </Stack>
      );
    }
    if (isRetryable(currentError)) {
      return (
        <StatusBanner
          kind="error"
          title={t("order.error.retryable.title")}
          description={currentError.detail}
          onRetry={retry}
        />
      );
    }
    return <StatusBanner kind="error" title={currentError.title} description={currentError.detail} onRetry={retry} />;
  }
}
