import { Box, Stack, Typography, Divider } from "@mui/material";
import { getUTCOffset } from "@/lib/utils/timezone";
import {
  formatUTCTime,
  formatUTCDate,
  calculateDuration,
} from "@/lib/dateUtils";

interface FlightDetails {
  flightNo?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureAirportAddress?: string;
  arrivalAirportAddress?: string;
  terminal?: string;
  airline?: string;
  seat?: string;
}

interface FlightDetailsProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
  endTimezone?: string | null;
  bookingRef?: string | null;
  url?: string | null;
  notes?: string | null;
  details: FlightDetails | null;
}

export function FlightDetailsComponent({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
  endTimezone,
  bookingRef,
  url,
  notes,
  details,
}: FlightDetailsProps) {
  const cities = title.split(" - ");
  const departureCity = cities[0] || "Departure";
  const arrivalCity = cities[1] || "Arrival";

  return (
    <Stack spacing={3}>
      {/* Flight Header */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {details?.airline && (
          <Typography variant="subtitle1" color="text.secondary">
            {details.airline} {details.flightNo && `• ${details.flightNo}`}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Departure & Arrival */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Departure
            </Typography>
            <Typography variant="h6">{departureCity}</Typography>
            {details?.departureAirport && (
              <Typography variant="body1" color="text.secondary">
                {details.departureAirport}
              </Typography>
            )}
            {details?.departureAirportAddress && (
              <Typography variant="body2" color="text.secondary">
                📍 {details.departureAirportAddress}
              </Typography>
            )}
            {startTimezone && (
              <>
                <Typography variant="body1" fontWeight={600}>
                  {formatUTCDate(startDateTime)}
                </Typography>
                <Typography variant="body1">
                  {formatUTCTime(startDateTime)} ({getUTCOffset(startTimezone)})
                </Typography>
              </>
            )}
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Arrival
            </Typography>
            <Typography variant="h6">{arrivalCity}</Typography>
            {details?.arrivalAirport && (
              <Typography variant="body1" color="text.secondary">
                {details.arrivalAirport}
              </Typography>
            )}
            {details?.arrivalAirportAddress && (
              <Typography variant="body2" color="text.secondary">
                📍 {details.arrivalAirportAddress}
              </Typography>
            )}
            {endTimezone && endDateTime && (
              <>
                <Typography variant="body1" fontWeight={600}>
                  {formatUTCDate(endDateTime)}
                </Typography>
                <Typography variant="body1">
                  {formatUTCTime(endDateTime)} ({getUTCOffset(endTimezone)})
                </Typography>
              </>
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Flight Duration */}
      {endDateTime && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Flight Duration
            </Typography>
            <Typography variant="body1">
              {calculateDuration(startDateTime, endDateTime)}
            </Typography>
          </Stack>
        </>
      )}

      {/* Additional Details */}
      {(details?.terminal || details?.seat) && (
        <>
          <Divider />
          <Stack direction="row" spacing={2}>
            {details.terminal && (
              <Stack spacing={1} sx={{ flex: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  Terminal
                </Typography>
                <Typography variant="body1">{details.terminal}</Typography>
              </Stack>
            )}
            {details.seat && (
              <Stack spacing={1} sx={{ flex: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  Seat
                </Typography>
                <Typography variant="body1">{details.seat}</Typography>
              </Stack>
            )}
          </Stack>
        </>
      )}

      {/* Booking Reference */}
      {bookingRef && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Booking Reference
            </Typography>
            <Typography variant="body1">{bookingRef}</Typography>
          </Stack>
        </>
      )}

      {/* URL */}
      {url && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Booking URL
            </Typography>
            <Typography
              variant="body1"
              sx={{ wordBreak: "break-all" }}
              component="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              {url}
            </Typography>
          </Stack>
        </>
      )}

      {/* Notes */}
      {notes && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Notes
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {notes}
            </Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
}
