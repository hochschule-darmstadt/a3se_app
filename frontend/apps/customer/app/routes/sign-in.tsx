import { Anchor, Button, Checkbox, Container, Stack, TextInput, Title } from "@mantine/core";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: string[] = [];
    if (!email.trim()) nextErrors.push(t("signIn.error.email"));
    if (!password) nextErrors.push(t("signIn.error.password"));
    if (mode === "register" && !givenName.trim()) nextErrors.push(t("signIn.error.givenName"));
    if (mode === "register" && !familyName.trim()) nextErrors.push(t("signIn.error.familyName"));
    if (mode === "register" && !privacyAcknowledged) nextErrors.push(t("signIn.error.privacy"));
    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors([]);
    // PER-001 is the one seeded demonstration customer identity (see module note above).
    signIn({ displayName: mode === "register" ? `${givenName.trim()} ${familyName.trim()}` : email.trim(), personId: "PER-001" });

    const returnTo = searchParams.get("returnTo");
    if (returnTo?.startsWith("/")) {
      navigate(returnTo);
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.delete("returnTo");
    navigate(`/offer?${params.toString()}`);
  }

  return (
    <CustomerShell
      breadcrumbs={[
        { label: "Travel portal", to: "/" },
        { label: "Trip composition", to: "/compose" },
        { label: mode === "register" ? "Registration" : "Sign in" },
      ]}
    >
      <Container py="xl" size="sm">
        <Stack gap="lg">
          <Title order={1}>{mode === "register" ? t("signIn.register.heading") : t("signIn.heading")}</Title>
          <StatusBanner kind="info" title={mode === "register" ? t("signIn.register.notice") : t("signIn.notice")} />
          {productId ? <p>{t("signIn.context", { product: productId, date })}</p> : null}

          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              <FormErrorSummary errors={errors} />
              {mode === "register" ? <>
                <TextInput label={t("signIn.givenName.label")} value={givenName} onChange={(event) => setGivenName(event.currentTarget.value)} />
                <TextInput label={t("signIn.familyName.label")} value={familyName} onChange={(event) => setFamilyName(event.currentTarget.value)} />
              </> : null}
              <TextInput type="email" autoComplete="email" label={t("signIn.email.label")} value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
              <TextInput type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} label={t("signIn.password.label")} value={password} onChange={(event) => setPassword(event.currentTarget.value)} />
              {mode === "register" ? <Checkbox label={t("signIn.privacy.label")} checked={privacyAcknowledged} onChange={(event) => setPrivacyAcknowledged(event.currentTarget.checked)} /> : null}
              <Button type="submit" color="orange">
                {mode === "sign-in" ? t("signIn.submit") : t("signIn.register.submit")}
              </Button>
              <Anchor component="button" type="button" onClick={() => setMode(mode === "sign-in" ? "register" : "sign-in")}>
                {mode === "sign-in" ? t("signIn.toggle.toRegister") : t("signIn.register.already")}
              </Anchor>
            </Stack>
          </form>
        </Stack>
      </Container>
    </CustomerShell>
  );
}
