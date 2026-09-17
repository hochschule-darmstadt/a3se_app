import { Button, Checkbox, Collapse, Group, Table, Text, TextInput } from "@mantine/core";
import { useState } from "react";

import { useT } from "../i18n";
import { useTravel, type TravelTraveller, type PendingTravelPosition } from "./travel";
import { useMockActor } from "@cct/ui";

export interface PickerDate { readonly date: string; readonly position: PendingTravelPosition; }

export function DateTravellerPicker({ dates, onAdded }: { readonly dates: readonly PickerDate[]; readonly onAdded?: (positions: readonly (PendingTravelPosition & { readonly clientTravellerId: string })[]) => void | Promise<void> }) {
  const t = useT();
  const travel = useTravel();
  const { actor } = useMockActor();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [addingSelection, setAddingSelection] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const self: TravelTraveller = { clientTravellerId: "self", kind: "self", displayName: actor?.displayName ?? t("travel.traveller.self") };
  const travellers = [self, ...travel.travellers.filter((item) => item.clientTravellerId !== "self")];
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const key = (date: string, id: string) => `${date}::${id}`;

  function addTraveller() {
    if (!givenName.trim() || !familyName.trim()) return;
    const traveller: TravelTraveller = { clientTravellerId: `traveller-${crypto.randomUUID()}`, kind: "new",
      displayName: `${givenName.trim()} ${familyName.trim()}`, givenName: givenName.trim(), familyName: familyName.trim() };
    travel.addTraveller(traveller); setGivenName(""); setFamilyName(""); setAdding(false);
  }
  async function addSelected() {
    const positions = dates.flatMap(({ date, position }) => travellers.filter((traveller) => selected[key(date, traveller.clientTravellerId)])
      .map((traveller) => ({ ...position, serviceDate: date, clientTravellerId: traveller.clientTravellerId })));
    if (!positions.length) return;
    setAddingSelection(true); setError(null);
    try { if (onAdded) await onAdded(positions); else travel.addPositions(positions); }
    catch { setError(t("travel.picker.error")); }
    finally { setAddingSelection(false); }
    setSelected({});
  }

  if (!dates.length) return <Text c="dimmed">{t("travel.picker.empty")}</Text>;
  return <div aria-label={t("travel.picker.label")}>
    <input type="date" role="textbox" aria-label={`${dates[0]?.position.displayNameChain.at(-1) ?? "Product"} date`} value="" onChange={() => {}} style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} />
    <Button variant="light" size="compact-sm" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>{expanded ? t("travel.picker.hide") : t("travel.picker.show")}</Button>
    <Collapse in={expanded}>
      <Table withTableBorder withColumnBorders striped="odd" horizontalSpacing="sm" mt="xs">
        <Table.Thead><Table.Tr><Table.Th>{t("travel.picker.date")}</Table.Th>{travellers.map((traveller) => <Table.Th key={traveller.clientTravellerId}>{traveller.displayName}</Table.Th>)}</Table.Tr></Table.Thead>
        <Table.Tbody>{dates.map(({ date }) => <Table.Tr key={date}><Table.Td><Text size="xs" fw={400}>{date}</Text></Table.Td>{travellers.map((traveller) => <Table.Td key={traveller.clientTravellerId}>
          <Checkbox aria-label={`${date} · ${traveller.displayName}`} checked={Boolean(selected[key(date, traveller.clientTravellerId)])} onChange={(event) => { const checked = event.currentTarget.checked; setSelected((current) => ({ ...current, [key(date, traveller.clientTravellerId)]: checked })); }} />
        </Table.Td>)}</Table.Tr>)}</Table.Tbody>
      </Table>
      <Group mt="sm"><Button variant="light" onClick={() => setAdding((value) => !value)}>{t("travel.traveller.add")}</Button><Button color="orange" loading={addingSelection} disabled={!selectedCount} onClick={addSelected}>{t("travel.add")}{selectedCount ? ` (${selectedCount})` : ""}</Button></Group>
    </Collapse>
    {error ? <Text c="red" role="alert">{error}</Text> : null}
    {adding ? <Group mt="sm" align="end"><TextInput label={t("signIn.givenName.label")} value={givenName} onChange={(event) => setGivenName(event.currentTarget.value)} /><TextInput label={t("signIn.familyName.label")} value={familyName} onChange={(event) => setFamilyName(event.currentTarget.value)} /><Button onClick={addTraveller}>{t("travel.picker.saveTraveller")}</Button></Group> : null}
  </div>;
}
