"use client";

import { useEffect, useState } from "react";
import type {
  CreateItineraryItemRequest,
  ItineraryItemType,
  TransportMode,
  ItineraryItemResponse,
} from "@itinavi/schema";
import { ITINERARY_TYPES, ITINERARY_STATUSES } from "@/lib/constants";
import {
  utcToDateTimeLocal,
  dateTimeLocalToUTC,
  utcToDateTimeLocalInTimezone,
} from "@/lib/dateUtils";
import { FlightFields } from "../itinerary/fields/FlightFields";
import { AccommodationFields } from "../itinerary/fields/AccommodationFields";
import { TransportFields } from "../itinerary/fields/TransportFields";
import { PlaceVisitFields } from "../itinerary/fields/PlaceVisitFields";
import { FoodFields } from "../itinerary/fields/FoodFields";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";

interface ItineraryFormProps {
  initialData?: ItineraryItemResponse;
  defaultTimezone?: string;
  onSubmit: (data: CreateItineraryItemRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ItineraryForm({
  initialData,
  defaultTimezone = "Asia/Shanghai",
  onSubmit,
  onCancel,
  loading = false,
}: ItineraryFormProps) {
  const [type, setType] = useState<ItineraryItemType>(
    initialData?.type || "PlaceVisit",
  );

  // Parse title for flights (format: "DepartureCity - ArrivalCity")
  const parsedFlightTitle =
    initialData?.type === "Flight" && initialData?.title
      ? initialData.title.split(" - ")
      : ["", ""];

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    startDateTime: initialData?.startDateTime
      ? utcToDateTimeLocal(initialData.startDateTime)
      : "",
    endDateTime: initialData?.endDateTime
      ? utcToDateTimeLocal(initialData.endDateTime)
      : "",
    status: initialData?.status || "Planned",
    timezone: initialData?.timezone || defaultTimezone,
    startTimezone: initialData?.startTimezone || defaultTimezone,
    endTimezone: initialData?.endTimezone || defaultTimezone,
    notes: initialData?.notes || "",
    bookingRef: initialData?.bookingRef || "",
    url: initialData?.url || "",
  });

  // Type-specific details
  const [flightDetails, setFlightDetails] = useState({
    departureCity: parsedFlightTitle[0] || "",
    arrivalCity: parsedFlightTitle[1] || "",
    airline: (initialData?.details as any)?.airline || "",
    flightNo: (initialData?.details as any)?.flightNo || "",
    departureAirport: (initialData?.details as any)?.departureAirport || "",
    arrivalAirport: (initialData?.details as any)?.arrivalAirport || "",
    departureAirportAddress:
      (initialData?.details as any)?.departureAirportAddress || "",
    arrivalAirportAddress:
      (initialData?.details as any)?.arrivalAirportAddress || "",
    startTimezone: initialData?.startTimezone || defaultTimezone,
    startDateTime:
      initialData?.startDateTime && initialData?.startTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.startDateTime,
            initialData.startTimezone,
          )
        : "",
    endTimezone: initialData?.endTimezone || defaultTimezone,
    endDateTime:
      initialData?.endDateTime && initialData?.endTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.endDateTime,
            initialData.endTimezone,
          )
        : "",
  });

  const [transportDetails, setTransportDetails] = useState({
    title: initialData?.type === "Transport" ? initialData.title : "",
    mode: ((initialData?.details as any)?.mode || "Metro") as TransportMode,
    startTimezone: initialData?.startTimezone || defaultTimezone,
    startDateTime:
      initialData?.startDateTime && initialData?.startTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.startDateTime,
            initialData.startTimezone,
          )
        : "",
    endTimezone: initialData?.endTimezone || defaultTimezone,
    endDateTime:
      initialData?.endDateTime && initialData?.endTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.endDateTime,
            initialData.endTimezone,
          )
        : "",
  });

  const [accommodationDetails, setAccommodationDetails] = useState({
    hotelName: initialData?.type === "Accommodation" ? initialData.title : "",
    address: (initialData?.details as any)?.address || "",
    guests: (initialData?.details as any)?.guests?.toString() || "",
    startTimezone: initialData?.startTimezone || defaultTimezone,
    startDateTime:
      initialData?.startDateTime && initialData?.startTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.startDateTime,
            initialData.startTimezone,
          )
        : "",
    endTimezone: initialData?.endTimezone || defaultTimezone,
    endDateTime:
      initialData?.endDateTime && initialData?.endTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.endDateTime,
            initialData.endTimezone,
          )
        : "",
  });

  const [placeVisitDetails, setPlaceVisitDetails] = useState({
    title: initialData?.type === "PlaceVisit" ? initialData.title : "",
    ticketInfo: (initialData?.details as any)?.ticketInfo || "",
    openingHours: (initialData?.details as any)?.openingHours || "",
    startTimezone: initialData?.startTimezone || defaultTimezone,
    startDateTime:
      initialData?.startDateTime && initialData?.startTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.startDateTime,
            initialData.startTimezone,
          )
        : "",
    endTimezone: initialData?.endTimezone || defaultTimezone,
    endDateTime:
      initialData?.endDateTime && initialData?.endTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.endDateTime,
            initialData.endTimezone,
          )
        : "",
  });

  const [foodDetails, setFoodDetails] = useState({
    title: initialData?.type === "Food" ? initialData.title : "",
    cuisine: (initialData?.details as any)?.cuisine || "",
    reservationInfo: (initialData?.details as any)?.reservationInfo || "",
    startTimezone: initialData?.startTimezone || defaultTimezone,
    startDateTime:
      initialData?.startDateTime && initialData?.startTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.startDateTime,
            initialData.startTimezone,
          )
        : "",
    endTimezone: initialData?.endTimezone || defaultTimezone,
    endDateTime:
      initialData?.endDateTime && initialData?.endTimezone
        ? utcToDateTimeLocalInTimezone(
            initialData.endDateTime,
            initialData.endTimezone,
          )
        : "",
  });

  useEffect(() => {
    if (!initialData && defaultTimezone) {
      setFormData((prev) => ({
        ...prev,
        timezone: defaultTimezone,
        startTimezone: defaultTimezone,
        endTimezone: defaultTimezone,
      }));
      setFlightDetails((prev) => ({
        ...prev,
        startTimezone: defaultTimezone,
        endTimezone: defaultTimezone,
      }));
      setTransportDetails((prev) => ({
        ...prev,
        startTimezone: defaultTimezone,
        endTimezone: defaultTimezone,
      }));
      setAccommodationDetails((prev) => ({
        ...prev,
        startTimezone: defaultTimezone,
        endTimezone: defaultTimezone,
      }));
      setPlaceVisitDetails((prev) => ({
        ...prev,
        startTimezone: defaultTimezone,
        endTimezone: defaultTimezone,
      }));
      setFoodDetails((prev) => ({
        ...prev,
        startTimezone: defaultTimezone,
        endTimezone: defaultTimezone,
      }));
    }
  }, [defaultTimezone, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let details: unknown = null;
    let title = formData.title;
    let startDateTime: string;
    let endDateTime: string | undefined;

    if (type === "Flight") {
      const {
        departureCity,
        arrivalCity,
        startTimezone: st,
        startDateTime: sdt,
        endTimezone: et,
        endDateTime: edt,
        ...flightData
      } = flightDetails;
      details = Object.fromEntries(
        Object.entries(flightData).filter(([, v]) => v !== ""),
      );
      // For flights, combine departure and arrival cities into title
      title = `${flightDetails.departureCity} - ${flightDetails.arrivalCity}`;
      startDateTime = dateTimeLocalToUTC(flightDetails.startDateTime);
      endDateTime = flightDetails.endDateTime
        ? dateTimeLocalToUTC(flightDetails.endDateTime)
        : undefined;
    } else if (type === "Transport") {
      details = { mode: transportDetails.mode };
      title = transportDetails.title;
      startDateTime = dateTimeLocalToUTC(transportDetails.startDateTime);
      endDateTime = transportDetails.endDateTime
        ? dateTimeLocalToUTC(transportDetails.endDateTime)
        : undefined;
    } else if (type === "Accommodation") {
      // For accommodation: hotelName -> title, formData dates -> start/endDateTime, address -> details
      title = accommodationDetails.hotelName;
      startDateTime = dateTimeLocalToUTC(accommodationDetails.startDateTime);
      endDateTime = accommodationDetails.endDateTime
        ? dateTimeLocalToUTC(accommodationDetails.endDateTime)
        : undefined;
      details = Object.fromEntries(
        Object.entries({
          address: accommodationDetails.address,
          guests: accommodationDetails.guests
            ? parseInt(accommodationDetails.guests)
            : undefined,
        }).filter(([, v]) => v !== undefined && v !== ""),
      );
    } else if (type === "PlaceVisit") {
      title = placeVisitDetails.title;
      const {
        startTimezone: st,
        startDateTime: sdt,
        endTimezone: et,
        endDateTime: edt,
        title: t,
        ...placeData
      } = placeVisitDetails;
      details = Object.fromEntries(
        Object.entries(placeData).filter(([, v]) => v !== ""),
      );
      startDateTime = dateTimeLocalToUTC(placeVisitDetails.startDateTime);
      endDateTime = placeVisitDetails.endDateTime
        ? dateTimeLocalToUTC(placeVisitDetails.endDateTime)
        : undefined;
    } else if (type === "Food") {
      title = foodDetails.title;
      const {
        startTimezone: st,
        startDateTime: sdt,
        endTimezone: et,
        endDateTime: edt,
        title: t,
        ...foodData
      } = foodDetails;
      details = Object.fromEntries(
        Object.entries(foodData).filter(([, v]) => v !== ""),
      );
      startDateTime = dateTimeLocalToUTC(foodDetails.startDateTime);
      endDateTime = foodDetails.endDateTime
        ? dateTimeLocalToUTC(foodDetails.endDateTime)
        : undefined;
    } else {
      // Default fallback
      startDateTime = dateTimeLocalToUTC(formData.startDateTime);
      endDateTime = formData.endDateTime
        ? dateTimeLocalToUTC(formData.endDateTime)
        : undefined;
    }

    // Get timezones from the appropriate details object
    let startTimezone = formData.startTimezone;
    let endTimezone = formData.endTimezone;
    if (type === "Flight") {
      startTimezone = flightDetails.startTimezone;
      endTimezone = flightDetails.endTimezone;
    } else if (type === "Transport") {
      startTimezone = transportDetails.startTimezone;
      endTimezone = transportDetails.endTimezone;
    } else if (type === "Accommodation") {
      startTimezone = accommodationDetails.startTimezone;
      endTimezone = accommodationDetails.endTimezone;
    } else if (type === "PlaceVisit") {
      startTimezone = placeVisitDetails.startTimezone;
      endTimezone = placeVisitDetails.endTimezone;
    } else if (type === "Food") {
      startTimezone = foodDetails.startTimezone;
      endTimezone = foodDetails.endTimezone;
    }

    const payload: CreateItineraryItemRequest = {
      type,
      title,
      startDateTime,
      ...(endDateTime && { endDateTime }),
      timezone: formData.timezone,
      startTimezone,
      ...(endTimezone && { endTimezone }),
      status: formData.status,
      ...(formData.notes && { notes: formData.notes }),
      ...(formData.bookingRef && { bookingRef: formData.bookingRef }),
      ...(formData.url && { url: formData.url }),
      ...(details &&
      typeof details === "object" &&
      Object.keys(details).length > 0
        ? { details }
        : {}),
    } as CreateItineraryItemRequest;

    await onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <FormControl fullWidth required>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value as ItineraryItemType)}
          >
            {ITINERARY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {type === "Flight" ? (
          <FlightFields
            flightDetails={flightDetails}
            onFlightDetailsChange={(updates) =>
              setFlightDetails({ ...flightDetails, ...updates })
            }
          />
        ) : type === "Accommodation" ? (
          <AccommodationFields
            accommodationDetails={accommodationDetails}
            onAccommodationDetailsChange={(updates) =>
              setAccommodationDetails({ ...accommodationDetails, ...updates })
            }
          />
        ) : type === "Transport" ? (
          <TransportFields
            transportDetails={transportDetails}
            onTransportDetailsChange={(updates) =>
              setTransportDetails({ ...transportDetails, ...updates })
            }
          />
        ) : type === "PlaceVisit" ? (
          <PlaceVisitFields
            placeVisitDetails={placeVisitDetails}
            onPlaceVisitDetailsChange={(updates) =>
              setPlaceVisitDetails({ ...placeVisitDetails, ...updates })
            }
          />
        ) : type === "Food" ? (
          <FoodFields
            foodDetails={foodDetails}
            onFoodDetailsChange={(updates) =>
              setFoodDetails({ ...foodDetails, ...updates })
            }
          />
        ) : null}

        <TextField
          label="Notes"
          fullWidth
          multiline
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <TextField
          label="Booking Reference"
          fullWidth
          value={formData.bookingRef}
          onChange={(e) =>
            setFormData({ ...formData, bookingRef: e.target.value })
          }
        />

        <TextField
          label="URL"
          type="url"
          fullWidth
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://"
        />

        <FormControl component="fieldset" required>
          <FormLabel component="legend">Status</FormLabel>
          <RadioGroup
            row
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as (typeof ITINERARY_STATUSES)[number],
              })
            }
          >
            {ITINERARY_STATUSES.map((s) => (
              <FormControlLabel
                key={s}
                value={s}
                control={<Radio />}
                label={s}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading
              ? "Saving..."
              : initialData
                ? "Update Item"
                : "Create Item"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
