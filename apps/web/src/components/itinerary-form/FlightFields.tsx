import { Stack, TextField, Typography } from "@mui/material";

interface FlightDetails {
  departureCity: string;
  arrivalCity: string;
  airline: string;
  flightNo: string;
  departAirport: string;
  arriveAirport: string;
  terminal: string;
  seat: string;
}

interface FlightFieldsProps {
  flightDetails: FlightDetails;
  onFlightDetailsChange: (details: FlightDetails) => void;
}

export function FlightFields({
  flightDetails,
  onFlightDetailsChange,
}: FlightFieldsProps) {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Departure City"
          required
          fullWidth
          value={flightDetails.departureCity}
          onChange={(e) =>
            onFlightDetailsChange({
              ...flightDetails,
              departureCity: e.target.value,
            })
          }
          placeholder="e.g., Singapore"
        />
        <TextField
          label="Arrival City"
          required
          fullWidth
          value={flightDetails.arrivalCity}
          onChange={(e) =>
            onFlightDetailsChange({
              ...flightDetails,
              arrivalCity: e.target.value,
            })
          }
          placeholder="e.g., Chongqing"
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Departure Airport"
          fullWidth
          value={flightDetails.departAirport}
          onChange={(e) =>
            onFlightDetailsChange({
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
            onFlightDetailsChange({
              ...flightDetails,
              arriveAirport: e.target.value,
            })
          }
          placeholder="e.g., CKG"
        />
      </Stack>
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
              onFlightDetailsChange({
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
              onFlightDetailsChange({
                ...flightDetails,
                flightNo: e.target.value,
              })
            }
          />
        </Stack>
      </Stack>
    </>
  );
}
