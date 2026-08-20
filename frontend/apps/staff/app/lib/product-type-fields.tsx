import { Select, TextInput } from "@mantine/core";

import { ROOM_TYPE_OPTIONS, isAirlineFlightType, isRoomCategoryType } from "./catalogue-product-types";

export interface ProductTypeFieldValues {
  displayName: string;
  flightNumber: string;
  departureLocationCode: string;
  arrivalLocationCode: string;
  scheduledDepartureLocalTime: string;
  scheduledArrivalLocalTime: string;
  aircraftTypeDesignator: string;
  roomTypeCode: string;
  smokingPreferenceCode: string;
}

export const EMPTY_PRODUCT_TYPE_FIELD_VALUES: ProductTypeFieldValues = {
  displayName: "",
  flightNumber: "",
  departureLocationCode: "",
  arrivalLocationCode: "",
  scheduledDepartureLocalTime: "",
  scheduledArrivalLocalTime: "",
  aircraftTypeDesignator: "",
  roomTypeCode: "room/double",
  smokingPreferenceCode: "",
};

/** Type-driven field inputs shared by the create and edit forms: flight, room-category, and "no extra fields" shapes cover all 12 catalogue-root types (entity-model TERM-002/TERM-004). */
export function ProductTypeFields({
  type,
  values,
  onChange,
}: {
  readonly type: string;
  readonly values: ProductTypeFieldValues;
  readonly onChange: (values: ProductTypeFieldValues) => void;
}) {
  function set<K extends keyof ProductTypeFieldValues>(key: K, value: string) {
    onChange({ ...values, [key]: value });
  }

  return (
    <>
      <TextInput label="Display name" value={values.displayName} onChange={(event) => set("displayName", event.currentTarget.value)} />
      {isAirlineFlightType(type) ? (
        <>
          <TextInput label="Flight number" required value={values.flightNumber} onChange={(event) => set("flightNumber", event.currentTarget.value)} />
          <TextInput
            label="Departure location code"
            required
            placeholder="e.g. FRA"
            value={values.departureLocationCode}
            onChange={(event) => set("departureLocationCode", event.currentTarget.value.toUpperCase())}
          />
          <TextInput
            label="Arrival location code"
            required
            placeholder="e.g. GIG"
            value={values.arrivalLocationCode}
            onChange={(event) => set("arrivalLocationCode", event.currentTarget.value.toUpperCase())}
          />
          <TextInput
            label="Scheduled departure (local time)"
            type="time"
            required
            value={values.scheduledDepartureLocalTime}
            onChange={(event) => set("scheduledDepartureLocalTime", event.currentTarget.value)}
          />
          <TextInput
            label="Scheduled arrival (local time)"
            type="time"
            required
            value={values.scheduledArrivalLocalTime}
            onChange={(event) => set("scheduledArrivalLocalTime", event.currentTarget.value)}
          />
          <TextInput
            label="Aircraft type designator"
            placeholder="optional"
            value={values.aircraftTypeDesignator}
            onChange={(event) => set("aircraftTypeDesignator", event.currentTarget.value.toUpperCase())}
          />
        </>
      ) : null}
      {isRoomCategoryType(type) ? (
        <>
          <Select
            label="Room type"
            required
            data={ROOM_TYPE_OPTIONS}
            value={values.roomTypeCode}
            onChange={(value) => set("roomTypeCode", value ?? "room/double")}
            allowDeselect={false}
          />
          <Select
            label="Smoking preference"
            placeholder="Unspecified"
            data={[
              { value: "nonSmoking", label: "Non-smoking" },
              { value: "smoking", label: "Smoking" },
              { value: "unspecified", label: "Unspecified" },
            ]}
            value={values.smokingPreferenceCode || null}
            onChange={(value) => set("smokingPreferenceCode", value ?? "")}
            clearable
          />
        </>
      ) : null}
    </>
  );
}

/** Builds the type-specific properties payload (plus displayName/lifecycleStatusCode) the API expects for `type`. */
export function productTypeProperties(
  type: string,
  values: ProductTypeFieldValues,
  lifecycleStatusCode: "product/draft" | "product/active" | "product/retired"
): Record<string, unknown> {
  const base = { displayName: values.displayName.trim() || null, lifecycleStatusCode };
  if (isAirlineFlightType(type)) {
    return {
      ...base,
      flightNumber: values.flightNumber.trim(),
      departureLocationCode: values.departureLocationCode.trim(),
      arrivalLocationCode: values.arrivalLocationCode.trim(),
      scheduledDepartureLocalTime: values.scheduledDepartureLocalTime,
      scheduledArrivalLocalTime: values.scheduledArrivalLocalTime,
      aircraftTypeDesignator: values.aircraftTypeDesignator.trim() || null,
    };
  }
  if (isRoomCategoryType(type)) {
    return {
      ...base,
      roomTypeCode: values.roomTypeCode,
      smokingPreferenceCode: values.smokingPreferenceCode || null,
    };
  }
  return base;
}

export function productTypeValidationErrors(type: string, values: ProductTypeFieldValues): string[] {
  const errors: string[] = [];
  if (isAirlineFlightType(type)) {
    if (!values.flightNumber.trim()) errors.push("Enter a flight number.");
    if (!values.departureLocationCode.trim()) errors.push("Enter a departure location code.");
    if (!values.arrivalLocationCode.trim()) errors.push("Enter an arrival location code.");
    if (values.departureLocationCode.trim() === values.arrivalLocationCode.trim() && values.departureLocationCode.trim())
      errors.push("Departure and arrival location codes must differ.");
    if (!values.scheduledDepartureLocalTime) errors.push("Enter a scheduled departure time.");
    if (!values.scheduledArrivalLocalTime) errors.push("Enter a scheduled arrival time.");
  }
  return errors;
}

export function fieldValuesFromProperties(type: string, properties: Record<string, unknown>): ProductTypeFieldValues {
  return {
    ...EMPTY_PRODUCT_TYPE_FIELD_VALUES,
    displayName: (properties.displayName as string | null) ?? "",
    flightNumber: (properties.flightNumber as string | undefined) ?? "",
    departureLocationCode: (properties.departureLocationCode as string | undefined) ?? "",
    arrivalLocationCode: (properties.arrivalLocationCode as string | undefined) ?? "",
    scheduledDepartureLocalTime: ((properties.scheduledDepartureLocalTime as string | undefined) ?? "").slice(0, 5),
    scheduledArrivalLocalTime: ((properties.scheduledArrivalLocalTime as string | undefined) ?? "").slice(0, 5),
    aircraftTypeDesignator: (properties.aircraftTypeDesignator as string | null) ?? "",
    roomTypeCode: (properties.roomTypeCode as string | undefined) ?? "room/double",
    smokingPreferenceCode: (properties.smokingPreferenceCode as string | null) ?? "",
  };
}
