"use client";

import { useEffect, useState } from "react";
import type {
  CreateItineraryItemRequest,
  ItineraryItemType,
  TransportMode,
  ItineraryItemResponse,
} from "@itinavi/schema";
import {
  ITINERARY_TYPES,
  TRANSPORT_MODES,
  ITINERARY_STATUSES,
} from "@/lib/constants";
import { COMMON_TIMEZONES } from "@/lib/utils/timezone";
import { utcToDateTimeLocal, dateTimeLocalToUTC } from "@/lib/dateUtils";
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
  Typography,
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
  const [departureCity, setDepartureCity] = useState(
    parsedFlightTitle[0] || "",
  );
  const [arrivalCity, setArrivalCity] = useState(parsedFlightTitle[1] || "");

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
    airline: (initialData?.details as any)?.airline || "",
    flightNo: (initialData?.details as any)?.flightNo || "",
    departAirport: (initialData?.details as any)?.departAirport || "",
    arriveAirport: (initialData?.details as any)?.arriveAirport || "",
    terminal: (initialData?.details as any)?.terminal || "",
    seat: (initialData?.details as any)?.seat || "",
  });

  const [transportDetails, setTransportDetails] = useState({
    mode: ((initialData?.details as any)?.mode || "Metro") as TransportMode,
  });

  const [accommodationDetails, setAccommodationDetails] = useState({
    checkInDateTime: (initialData?.details as any)?.checkInDateTime || "",
    checkOutDateTime: (initialData?.details as any)?.checkOutDateTime || "",
    guests: (initialData?.details as any)?.guests?.toString() || "",
  });

  const [placeVisitDetails, setPlaceVisitDetails] = useState({
    ticketInfo: (initialData?.details as any)?.ticketInfo || "",
    openingHours: (initialData?.details as any)?.openingHours || "",
  });

  const [foodDetails, setFoodDetails] = useState({
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

    if (type === "Flight") {
      details = Object.fromEntries(
        Object.entries(flightDetails).filter(([, v]) => v !== ""),
      );
    } else if (type === "Transport") {
      details = { mode: transportDetails.mode };
    } else if (type === "Accommodation") {
      details = Object.fromEntries(
        Object.entries({
          ...accommodationDetails,
          guests: accommodationDetails.guests
            ? parseInt(accommodationDetails.guests)
            : undefined,
        }).filter(([, v]) => v !== undefined && v !== ""),
      );
    } else if (type === "PlaceVisit") {
      details = Object.fromEntries(
        Object.entries(placeVisitDetails).filter(([, v]) => v !== ""),
      );
    } else if (type === "Food") {
      details = Object.fromEntries(
        Object.entries(foodDetails).filter(([, v]) => v !== ""),
      );
    }

    // Convert datetime-local to UTC ISO string
    const startDateTime = dateTimeLocalToUTC(formData.startDateTime);
    const endDateTime = formData.endDateTime
      ? dateTimeLocalToUTC(formData.endDateTime)
      : undefined;

    // For flights, combine departure and arrival cities into title
    const title =
      type === "Flight" ? `${departureCity} - ${arrivalCity}` : formData.title;

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
          <>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Departure City"
                required
                fullWidth
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                placeholder="e.g., Singapore"
              />
              <TextField
                label="Arrival City"
                required
                fullWidth
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
                placeholder="e.g., Chongqing"
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Departure Airport"
                fullWidth
                value={flightDetails.departAirport}
                onChange={(e) =>
                  setFlightDetails({
                    ...flightDetails,
                    departAirport: e.target.value,
                  })
                }
                placeholder="e.g., SIN"
              />
              <TextField
                label="Arrival Airport"
                fullWidth
                value={flightDetails.arriveAirport}
                onChange={(e) =>
                  setFlightDetails({
                    ...flightDetails,
                    arriveAirport: e.target.value,
                  })
                }
                placeholder="e.g., CKG"
              />
            </Stack>
          </>
        ) : (
          <TextField
            label="Title"
            required
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder={`e.g., ${type === "Food" ? "Dinner at Dadong" : "Visit Forbidden City"}`}
          />
        )}

        <Stack direction="row" spacing={2}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Start Timezone</InputLabel>
            <Select
              value={formData.startTimezone}
              label="Start Timezone"
              onChange={(e) =>
                setFormData({ ...formData, startTimezone: e.target.value })
              }
            >
              {COMMON_TIMEZONES.map((tz) => (
                <MenuItem key={tz.value} value={tz.value}>
                  {tz.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Date & Time"
            type="datetime-local"
            required
            sx={{ flex: 3 }}
            value={formData.startDateTime}
            onChange={(e) =>
              setFormData({ ...formData, startDateTime: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>End Timezone</InputLabel>
            <Select
              value={formData.endTimezone}
              label="End Timezone"
              onChange={(e) =>
                setFormData({ ...formData, endTimezone: e.target.value })
              }
            >
              {COMMON_TIMEZONES.map((tz) => (
                <MenuItem key={tz.value} value={tz.value}>
                  {tz.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="End Date & Time"
            type="datetime-local"
            sx={{ flex: 3 }}
            value={formData.endDateTime}
            onChange={(e) =>
              setFormData({ ...formData, endDateTime: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        {/* Flight-specific fields */}
        {type === "Flight" && (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="primary">
              Flight Details
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Airline"
                fullWidth
                value={flightDetails.airline}
                onChange={(e) =>
                  setFlightDetails({
                    ...flightDetails,
                    airline: e.target.value,
                  })
                }
              />
              <TextField
                label="Flight No"
                fullWidth
                value={flightDetails.flightNo}
                onChange={(e) =>
                  setFlightDetails({
                    ...flightDetails,
                    flightNo: e.target.value,
                  })
                }
              />
            </Stack>
          </Stack>
        )}

        {/* Transport-specific fields */}
        {type === "Transport" && (
          <FormControl fullWidth>
            <InputLabel>Transport Mode</InputLabel>
            <Select
              value={transportDetails.mode}
              label="Transport Mode"
              onChange={(e) =>
                setTransportDetails({ mode: e.target.value as TransportMode })
              }
            >
              {TRANSPORT_MODES.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Accommodation-specific fields */}
        {type === "Accommodation" && (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="primary">
              Accommodation Details
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Check-in"
                type="datetime-local"
                fullWidth
                value={accommodationDetails.checkInDateTime}
                onChange={(e) =>
                  setAccommodationDetails({
                    ...accommodationDetails,
                    checkInDateTime: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Check-out"
                type="datetime-local"
                fullWidth
                value={accommodationDetails.checkOutDateTime}
                onChange={(e) =>
                  setAccommodationDetails({
                    ...accommodationDetails,
                    checkOutDateTime: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <TextField
              label="Number of Guests"
              type="number"
              fullWidth
              value={accommodationDetails.guests}
              onChange={(e) =>
                setAccommodationDetails({
                  ...accommodationDetails,
                  guests: e.target.value,
                })
              }
            />
          </Stack>
        )}

        {/* PlaceVisit-specific fields */}
        {type === "PlaceVisit" && (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="primary">
              Place Visit Details
            </Typography>
            <TextField
              label="Ticket Info"
              fullWidth
              value={placeVisitDetails.ticketInfo}
              onChange={(e) =>
                setPlaceVisitDetails({
                  ...placeVisitDetails,
                  ticketInfo: e.target.value,
                })
              }
              placeholder="e.g., ¥60, book online"
            />
            <TextField
              label="Opening Hours"
              fullWidth
              value={placeVisitDetails.openingHours}
              onChange={(e) =>
                setPlaceVisitDetails({
                  ...placeVisitDetails,
                  openingHours: e.target.value,
                })
              }
              placeholder="e.g., 9:00 AM - 5:00 PM"
            />
          </Stack>
        )}

        {/* Food-specific fields */}
        {type === "Food" && (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="primary">
              Food Details
            </Typography>
            <TextField
              label="Cuisine"
              fullWidth
              value={foodDetails.cuisine}
              onChange={(e) =>
                setFoodDetails({ ...foodDetails, cuisine: e.target.value })
              }
              placeholder="e.g., Peking Duck, Sichuan"
            />
            <TextField
              label="Reservation Info"
              fullWidth
              value={foodDetails.reservationInfo}
              onChange={(e) =>
                setFoodDetails({
                  ...foodDetails,
                  reservationInfo: e.target.value,
                })
              }
              placeholder="e.g., Reserved for 7 PM, Table 12"
            />
          </Stack>
        )}

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
              setFormData({ ...formData, status: e.target.value as typeof ITINERARY_STATUSES[number] })
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
