"use client";

import { useEffect, useState } from "react";
import type {
  CreateItineraryItemRequest,
  ItineraryItemType,
  TransportMode,
  ItineraryItemResponse,
} from "@itinavi/schema";
import { ITINERARY_TYPES, ITINERARY_STATUSES } from "@/lib/constants";
import { utcToDateTimeLocal, dateTimeLocalToUTC } from "@/lib/dateUtils";
import { FlightFields } from "./itinerary-form/FlightFields";
import { AccommodationFields } from "./itinerary-form/AccommodationFields";
import { TransportFields } from "./itinerary-form/TransportFields";
import { PlaceVisitFields } from "./itinerary-form/PlaceVisitFields";
import { FoodFields } from "./itinerary-form/FoodFields";
import { DateTimeFields } from "./itinerary-form/DateTimeFields";
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
    departAirport: (initialData?.details as any)?.departAirport || "",
    arriveAirport: (initialData?.details as any)?.arriveAirport || "",
    terminal: (initialData?.details as any)?.terminal || "",
    seat: (initialData?.details as any)?.seat || "",
  });

  const [transportDetails, setTransportDetails] = useState({
    title: initialData?.type === "Transport" ? initialData.title : "",
    mode: ((initialData?.details as any)?.mode || "Metro") as TransportMode,
  });

  const [accommodationDetails, setAccommodationDetails] = useState({
    hotelName: initialData?.type === "Accommodation" ? initialData.title : "",
    address: (initialData?.details as any)?.address || "",
    guests: (initialData?.details as any)?.guests?.toString() || "",
  });

  const [placeVisitDetails, setPlaceVisitDetails] = useState({
    title: initialData?.type === "PlaceVisit" ? initialData.title : "",
    ticketInfo: (initialData?.details as any)?.ticketInfo || "",
    openingHours: (initialData?.details as any)?.openingHours || "",
  });

  const [foodDetails, setFoodDetails] = useState({
    title: initialData?.type === "Food" ? initialData.title : "",
    cuisine: (initialData?.details as any)?.cuisine || "",
    reservationInfo: (initialData?.details as any)?.reservationInfo || "",
  });

  useEffect(() => {
    if (!initialData && defaultTimezone) {
      setFormData((prev) => ({
        ...prev,
        timezone: defaultTimezone,
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
      details = Object.fromEntries(
        Object.entries(flightDetails).filter(([, v]) => v !== ""),
      );
      // For flights, combine departure and arrival cities into title
      title = `${flightDetails.departureCity} - ${flightDetails.arrivalCity}`;
      startDateTime = dateTimeLocalToUTC(formData.startDateTime);
      endDateTime = formData.endDateTime
        ? dateTimeLocalToUTC(formData.endDateTime)
        : undefined;
    } else if (type === "Transport") {
      details = { mode: transportDetails.mode };
      title = transportDetails.title;
      startDateTime = dateTimeLocalToUTC(formData.startDateTime);
      endDateTime = formData.endDateTime
        ? dateTimeLocalToUTC(formData.endDateTime)
        : undefined;
    } else if (type === "Accommodation") {
      // For accommodation: hotelName -> title, formData dates -> start/endDateTime, address -> details
      title = accommodationDetails.hotelName;
      startDateTime = dateTimeLocalToUTC(formData.startDateTime);
      endDateTime = formData.endDateTime
        ? dateTimeLocalToUTC(formData.endDateTime)
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
      details = Object.fromEntries(
        Object.entries(placeVisitDetails).filter(([, v]) => v !== ""),
      );
      startDateTime = dateTimeLocalToUTC(formData.startDateTime);
      endDateTime = formData.endDateTime
        ? dateTimeLocalToUTC(formData.endDateTime)
        : undefined;
    } else if (type === "Food") {
      title = foodDetails.title;
      details = Object.fromEntries(
        Object.entries(foodDetails).filter(([, v]) => v !== ""),
      );
      startDateTime = dateTimeLocalToUTC(formData.startDateTime);
      endDateTime = formData.endDateTime
        ? dateTimeLocalToUTC(formData.endDateTime)
        : undefined;
    } else {
      // Default fallback
      startDateTime = dateTimeLocalToUTC(formData.startDateTime);
      endDateTime = formData.endDateTime
        ? dateTimeLocalToUTC(formData.endDateTime)
        : undefined;
    }

    const payload: CreateItineraryItemRequest = {
      type,
      title,
      startDateTime,
      ...(endDateTime && { endDateTime }),
      timezone: formData.timezone,
      startTimezone: formData.startTimezone,
      ...(formData.endTimezone && { endTimezone: formData.endTimezone }),
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
            onFlightDetailsChange={setFlightDetails}
          />
        ) : type === "Accommodation" ? (
          <AccommodationFields
            accommodationDetails={accommodationDetails}
            onAccommodationDetailsChange={setAccommodationDetails}
          />
        ) : type === "Transport" ? (
          <TransportFields
            transportDetails={transportDetails}
            onTransportDetailsChange={setTransportDetails}
          />
        ) : type === "PlaceVisit" ? (
          <PlaceVisitFields
            placeVisitDetails={placeVisitDetails}
            onPlaceVisitDetailsChange={setPlaceVisitDetails}
          />
        ) : type === "Food" ? (
          <FoodFields
            foodDetails={foodDetails}
            onFoodDetailsChange={setFoodDetails}
          />
        ) : null}

        <DateTimeFields
          label={type === "Accommodation" ? "Check-In" : "Start Date & Time"}
          timezone={formData.startTimezone}
          dateTime={formData.startDateTime}
          required
          onTimezoneChange={(tz) =>
            setFormData({ ...formData, startTimezone: tz })
          }
          onDateTimeChange={(dt) =>
            setFormData({ ...formData, startDateTime: dt })
          }
        />

        <DateTimeFields
          label={type === "Accommodation" ? "Check-Out" : "End Date & Time"}
          timezone={formData.endTimezone}
          dateTime={formData.endDateTime}
          onTimezoneChange={(tz) =>
            setFormData({ ...formData, endTimezone: tz })
          }
          onDateTimeChange={(dt) =>
            setFormData({ ...formData, endDateTime: dt })
          }
        />

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
