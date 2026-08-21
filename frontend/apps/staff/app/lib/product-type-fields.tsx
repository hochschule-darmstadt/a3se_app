import { Select, TextInput } from "@mantine/core";

import { ROOM_TYPE_OPTIONS, isAirlineFlightType, isRoomCategoryType, isStructuralChildType } from "./catalogue-product-types";

export interface ProductTypeFieldValues {
  name: string;
  flightNumber: string;
  departureLocationCode: string;
  arrivalLocationCode: string;
  scheduledDepartureLocalTime: string;
  scheduledArrivalLocalTime: string;
  aircraftTypeDesignator: string;
  roomTypeCode: string;
  smokingPreferenceCode: string;
  seatNumber: string;
  roomNumber: string;
}

export const EMPTY_PRODUCT_TYPE_FIELD_VALUES: ProductTypeFieldValues = {
  name: "",
  flightNumber: "",
  departureLocationCode: "",
  arrivalLocationCode: "",
  scheduledDepartureLocalTime: "",
  scheduledArrivalLocalTime: "",
  aircraftTypeDesignator: "",
  roomTypeCode: "room/double",
  smokingPreferenceCode: "",
  seatNumber: "",
  roomNumber: "",
};

function isSeatType(type: string): boolean {
  return type === "product/airline/flight/seat";
}

function isRoomType(type: string): boolean {
  return type === "product/accommodation/room-type/room";
}

/** Type-driven fields. `name` is source data; TERM-011 display values are read-only response fields. */
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
      {!isStructuralChildType(type) ? (
        <TextInput
          label="Name"
          required={!isAirlineFlightType(type) && !isRoomCategoryType(type)}
          value={values.name}
          onChange={(event) => set("name", event.currentTarget.value)}
        />
      ) : null}
      {isSeatType(type) ? (
        <TextInput
          label="Seat number"
          required
          placeholder="e.g. 12A"
          value={values.seatNumber}
          onChange={(event) => set("seatNumber", event.currentTarget.value.toUpperCase())}
        />
      ) : null}
      {isRoomType(type) ? (
        <TextInput
          label="Room number"
          required
          placeholder="e.g. 204"
          value={values.roomNumber}
          onChange={(event) => set("roomNumber", event.currentTarget.value)}
        />
      ) : null}
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

/** Builds writable source properties; computed display fields are deliberately absent. */
export function productTypeProperties(
  type: string,
  values: ProductTypeFieldValues,
  lifecycleStatusCode: "product/draft" | "product/active" | "product/retired"
): Record<string, unknown> {
  // Structural children derive their labels from seat/room number.
  if (isSeatType(type)) {
    return { seatNumber: values.seatNumber.trim() };
  }
  if (isRoomType(type)) {
    return { roomNumber: values.roomNumber.trim() };
  }
  const base = { name: values.name.trim() || null, lifecycleStatusCode };
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
  if (!isStructuralChildType(type) && !isAirlineFlightType(type) && !isRoomCategoryType(type) && !values.name.trim()) {
    errors.push("Enter a name.");
  }
  if (isAirlineFlightType(type)) {
    if (!values.flightNumber.trim()) errors.push("Enter a flight number.");
    if (!values.departureLocationCode.trim()) errors.push("Enter a departure location code.");
    if (!values.arrivalLocationCode.trim()) errors.push("Enter an arrival location code.");
    if (values.departureLocationCode.trim() === values.arrivalLocationCode.trim() && values.departureLocationCode.trim())
      errors.push("Departure and arrival location codes must differ.");
    if (!values.scheduledDepartureLocalTime) errors.push("Enter a scheduled departure time.");
    if (!values.scheduledArrivalLocalTime) errors.push("Enter a scheduled arrival time.");
  }
  if (isSeatType(type) && !values.seatNumber.trim()) errors.push("Enter a seat number.");
  if (isRoomType(type) && !values.roomNumber.trim()) errors.push("Enter a room number.");
  return errors;
}

export function fieldValuesFromProperties(type: string, properties: Record<string, unknown>): ProductTypeFieldValues {
  return {
    ...EMPTY_PRODUCT_TYPE_FIELD_VALUES,
    name: (properties.name as string | null) ?? "",
    flightNumber: (properties.flightNumber as string | undefined) ?? "",
    departureLocationCode: (properties.departureLocationCode as string | undefined) ?? "",
    arrivalLocationCode: (properties.arrivalLocationCode as string | undefined) ?? "",
    scheduledDepartureLocalTime: ((properties.scheduledDepartureLocalTime as string | undefined) ?? "").slice(0, 5),
    scheduledArrivalLocalTime: ((properties.scheduledArrivalLocalTime as string | undefined) ?? "").slice(0, 5),
    aircraftTypeDesignator: (properties.aircraftTypeDesignator as string | null) ?? "",
    roomTypeCode: (properties.roomTypeCode as string | undefined) ?? "room/double",
    smokingPreferenceCode: (properties.smokingPreferenceCode as string | null) ?? "",
    seatNumber: (properties.seatNumber as string | undefined) ?? "",
    roomNumber: (properties.roomNumber as string | undefined) ?? "",
  };
}
