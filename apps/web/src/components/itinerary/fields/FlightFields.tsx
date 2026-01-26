import { Stack, TextField, Typography, Box } from "@mui/material";
import { DateTimeFields } from "./DateTimeFields";
import { AmapPlaceAutocomplete } from "../../AmapPlaceAutocomplete";

interface FlightDetails {
  departureCity: string;
  arrivalCity: string;
  airline: string;
  flightNo: string;
  departureAirport: string;
  arrivalAirport: string;
  departureAirportAddress: string;
  arrivalAirportAddress: string;
  startTimezone: string;
  startDateTime: string;
  endTimezone: string;
  endDateTime: string;
}

interface FlightFieldsProps {
  flightDetails: FlightDetails;
  onFlightDetailsChange: (details: Partial<FlightDetails>) => void;
}

export function FlightFields({
  flightDetails,
  onFlightDetailsChange,
}: FlightFieldsProps) {
  return (
    <>
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        {/* Departure Column */}
        <Box flex={1}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Departure
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="City"
              required
              fullWidth
              value={flightDetails.departureCity}
              onChange={(e) =>
                onFlightDetailsChange({ departureCity: e.target.value })
              }
              placeholder="e.g., Singapore"
            />
            <AmapPlaceAutocomplete
              label="Departure Airport"
              value={flightDetails.departureAirport}
              onPlaceSelect={(place) =>
                onFlightDetailsChange({
                  departureAirport: place.name,
                  departureAirportAddress: place.address,
                })
              }
              placeholder="Search for departure airport"
              city={flightDetails.departureCity}
            />
            <TextField
              label="Departure Airport Address"
              fullWidth
              value={flightDetails.departureAirportAddress}
              onChange={(e) =>
                onFlightDetailsChange({
                  departureAirportAddress: e.target.value,
                })
              }
              placeholder="Optional"
            />
            <DateTimeFields
              label="Departure Time"
              timezone={flightDetails.startTimezone}
              dateTime={flightDetails.startDateTime}
              required
              onTimezoneChange={(tz) =>
                onFlightDetailsChange({ startTimezone: tz })
              }
              onDateTimeChange={(dt) =>
                onFlightDetailsChange({ startDateTime: dt })
              }
            />
          </Stack>
        </Box>

        {/* Arrival Column */}
        <Box flex={1}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Arrival
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="City"
              required
              fullWidth
              value={flightDetails.arrivalCity}
              onChange={(e) =>
                onFlightDetailsChange({ arrivalCity: e.target.value })
              }
              placeholder="e.g., Chongqing"
            />
            <AmapPlaceAutocomplete
              label="Arrival Airport"
              value={flightDetails.arrivalAirport}
              onPlaceSelect={(place) =>
                onFlightDetailsChange({
                  arrivalAirport: place.name,
                  arrivalAirportAddress: place.address,
                })
              }
              placeholder="Search for arrival airport"
              city={flightDetails.arrivalCity}
            />
            <TextField
              label="Airport Address"
              fullWidth
              value={flightDetails.arrivalAirportAddress}
              onChange={(e) =>
                onFlightDetailsChange({ arrivalAirportAddress: e.target.value })
              }
              placeholder="Optional"
            />
            <DateTimeFields
              label="Arrival Time"
              timezone={flightDetails.endTimezone}
              dateTime={flightDetails.endDateTime}
              onTimezoneChange={(tz) =>
                onFlightDetailsChange({ endTimezone: tz })
              }
              onDateTimeChange={(dt) =>
                onFlightDetailsChange({ endDateTime: dt })
              }
            />
          </Stack>
        </Box>
      </Stack>

      {/* Flight Details below */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="primary">
          Flight Information
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Airline"
            fullWidth
            value={flightDetails.airline}
            onChange={(e) => onFlightDetailsChange({ airline: e.target.value })}
            placeholder="e.g., Singapore Airlines"
          />
          <TextField
            label="Flight No"
            fullWidth
            value={flightDetails.flightNo}
            onChange={(e) =>
              onFlightDetailsChange({ flightNo: e.target.value })
            }
            placeholder="e.g., SQ123"
          />
        </Stack>
      </Stack>
    </>
  );
}
