import { Box, Stack, Typography, Divider } from "@mui/material";
import { getUTCOffset } from "@itinavi/schema";
import {
  formatUTCTime,
  formatUTCDate,
  calculateDuration,
} from "@/lib/dateUtils";

interface TransportDetails {
  mode?: string;
  fromLocationId?: string;
  toLocationId?: string;
}

interface TransportDetailsProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
  bookingRef?: string | null;
  url?: string | null;
  notes?: string | null;
  details: TransportDetails | null;
}

export function TransportDetailsComponent({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
  bookingRef,
  url,
  notes,
  details,
}: TransportDetailsProps) {
  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {details?.mode && (
          <Typography variant="subtitle1" color="text.secondary">
            {details.mode}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Timing */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Departure
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatUTCDate(startDateTime)}
            </Typography>
            <Typography variant="body1">
              {formatUTCTime(startDateTime)}
              {startTimezone && ` (${getUTCOffset(startTimezone)})`}
            </Typography>
          </Stack>
        </Box>

        {endDateTime && (
          <Box sx={{ flex: 1 }}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                Arrival
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatUTCDate(endDateTime)}
              </Typography>
              <Typography variant="body1">
                {formatUTCTime(endDateTime)}
                {startTimezone && ` (${getUTCOffset(startTimezone)})`}
              </Typography>
            </Stack>
          </Box>
        )}
      </Stack>

      {/* Duration */}
      {endDateTime && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="body1">
              {calculateDuration(startDateTime, endDateTime)}
            </Typography>
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
