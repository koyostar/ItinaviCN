import { Box, Stack, Typography, Divider } from "@mui/material";
import { getUTCOffset } from "@itinavi/schema";
import {
  formatUTCTime,
  formatUTCDate,
  calculateDuration,
} from "@/lib/dateUtils";

interface PlaceDetails {
  address?: string;
  ticketInfo?: string;
  openingTime?: string;
  closingTime?: string;
}

interface PlaceDetailsProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
  bookingRef?: string | null;
  url?: string | null;
  notes?: string | null;
  details: PlaceDetails | null;
}

export function PlaceDetailsComponent({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
  bookingRef,
  url,
  notes,
  details,
}: PlaceDetailsProps) {
  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {details?.address && (
          <Typography variant="body1" color="text.secondary">
            📍 {details.address}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Timing */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Visit Time
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatUTCDate(startDateTime)}
            </Typography>
            <Typography variant="body1">
              {formatUTCTime(startDateTime)}
              {endDateTime && ` - ${formatUTCTime(endDateTime)}`}
              {startTimezone && ` (${getUTCOffset(startTimezone)})`}
            </Typography>
          </Stack>
        </Box>

        {endDateTime && (
          <Box sx={{ flex: 1 }}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="h6">
                {calculateDuration(startDateTime, endDateTime)}
              </Typography>
            </Stack>
          </Box>
        )}
      </Stack>

      {/* Opening Hours */}
      {details?.openingTime && details?.closingTime && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Opening Hours
            </Typography>
            <Typography variant="body1">
              🕒 {details.openingTime} - {details.closingTime}
            </Typography>
          </Stack>
        </>
      )}

      {/* Ticket Info */}
      {details?.ticketInfo && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Ticket Information
            </Typography>
            <Typography variant="body1">🎫 {details.ticketInfo}</Typography>
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
