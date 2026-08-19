import { Anchor, Button, Container, Stack, TextInput, Title } from "@mantine/core";
import { FormErrorSummary, StatusBanner, useMockActor } from "@cct/ui";
import { type FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";

export function meta() {
  return [{ title: "Sign in – Christopher Columbus Travel" }];
}

/**
 * VIEW-C-011 (sign-in) and VIEW-C-012 (registration), combined into one
 * screen with a toggle rather than a fully separate flow (per the issue's
 * own scope guidance: registration/sign-in mechanism is otherwise
 * unresolved, NAV-Q-006/WF-Q-003). `MockAuthProvider` is a PoC placeholder
 * (DR-0015): no credential is verified, no token is issued. `PER-001` is
 * hardcoded as this thin slice's one demonstration customer identity
 * because it is the only seeded Person with both a customer and a
 * traveller role (`backend/scripts/seed/sources/persons.json`) -- a real
 * registration/account-selection flow is out of scope here.
 */
export default function SignIn() {
  const t = useT();
  const navigate = useNavigate();
  const { signIn } = useMockActor();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId") ?? "";
  const date = searchParams.get("date") ?? "";

  const [mode, setMode] = useState<"sign-in" | "register">("sign-in");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!displayName.trim()) {
      setErrors([t("signIn.error.displayName")]);
      return;
    }
    setErrors([]);
    // PER-001 is the one seeded demonstration customer identity (see module note above).
    signIn({ displayName: displayName.trim(), personId: "PER-001" });

    const params = new URLSearchParams(searchParams);
    navigate(`/offer?${params.toString()}`);
  }

  return (
    <CustomerShell
      breadcrumbs={[
        { label: "Travel portal", to: "/" },
        { label: "Trip composition", to: "/compose" },
        { label: "Sign in" },
      ]}
    >
      <Container py="xl" size="sm">
        <Stack gap="lg">
          <Title order={1}>{t("signIn.heading")}</Title>
          <StatusBanner kind="info" title={t("signIn.notice")} />
          {productId ? <p>{t("signIn.context", { product: productId, date })}</p> : null}

          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              <FormErrorSummary errors={errors} />
              <TextInput
                label={t("signIn.displayName.label")}
                value={displayName}
                onChange={(event) => setDisplayName(event.currentTarget.value)}
              />
              <Button type="submit" color="orange">
                {mode === "sign-in" ? t("signIn.submit") : t("signIn.register.submit")}
              </Button>
              <Anchor
                component="button"
                type="button"
                onClick={() => setMode(mode === "sign-in" ? "register" : "sign-in")}
              >
                {mode === "sign-in" ? t("signIn.toggle.toRegister") : t("signIn.toggle.toSignIn")}
              </Anchor>
            </Stack>
          </form>
        </Stack>
      </Container>
    </CustomerShell>
  );
}
