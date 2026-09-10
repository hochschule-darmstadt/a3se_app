import { Button, Modal, Radio, Stack, TextInput } from "@mantine/core";
import { StatusBanner, useMockActor } from "@cct/ui";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useT } from "../i18n";
import { CustomerShell } from "../lib/shell";
import { useTravel, type TravelTraveller } from "../lib/travel";

export default function TravellerSelection() {
  const t = useT();
  const { actor } = useMockActor();
  const travel = useTravel();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnTo = params.get("returnTo") || "/travel";
  const [selected, setSelected] = useState("self");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");

  useEffect(() => {
    if (!actor) navigate(`/sign-in?${new URLSearchParams({ returnTo: `/travel/add?${params.toString()}` })}`, { replace: true });
  }, [actor, navigate, params]);
  if (!actor) return null;

  const self: TravelTraveller = { clientTravellerId: "self", kind: "self", displayName: actor.displayName };
  const travellers = [self, ...travel.travellers.filter((item) => item.kind === "new")];

  function submit(event: FormEvent) {
    event.preventDefault();
    let traveller = travellers.find((item) => item.clientTravellerId === selected);
    if (selected === "new") {
      if (!givenName.trim() || !familyName.trim()) return;
      traveller = { clientTravellerId: `traveller-${crypto.randomUUID()}`, kind: "new",
        displayName: `${givenName.trim()} ${familyName.trim()}`, givenName: givenName.trim(), familyName: familyName.trim() };
    }
    if (!traveller || !travel.pending) return;
    travel.addTraveller(traveller);
    travel.addPendingPosition(traveller.clientTravellerId);
    navigate(returnTo);
  }

  return <CustomerShell breadcrumbs={[{ label: "Travel portal", to: "/" }, { label: t("travel.traveller.heading") }]}>
    <Modal opened onClose={() => navigate(returnTo)} title={t("travel.traveller.heading")} centered size="sm">
      {!travel.pending ? <StatusBanner kind="empty" title={t("travel.empty")} /> : <form onSubmit={submit}><Stack gap="md">
        <Radio.Group value={selected} onChange={setSelected}><Stack gap="xs">
          {travellers.map((traveller) => <Radio key={traveller.clientTravellerId} value={traveller.clientTravellerId}
            label={traveller.kind === "self" ? `${t("travel.traveller.self")} (${traveller.displayName})` : traveller.displayName} />)}
          <Radio value="new" label={t("travel.traveller.add")} />
        </Stack></Radio.Group>
        {selected === "new" ? <><TextInput required label="Given name" value={givenName} onChange={(e) => setGivenName(e.currentTarget.value)} />
          <TextInput required label="Family name" value={familyName} onChange={(e) => setFamilyName(e.currentTarget.value)} /></> : null}
        <Button type="submit" color="orange">{t("travel.traveller.continue")}</Button>
      </Stack></form>}
    </Modal>
  </CustomerShell>;
}
