import { Box, Stack, Typography, Divider } from "@mui/material";
import { getUTCOffset } from "@itinavi/schema";
import { formatUTCDateTime, formatUTCDate } from "@/lib/dateUtils";

interface AccommodationDetails {
  hotelName?: string;
  address?: string;
  checkInDateTime?: string;
  checkOutDateTime?: string;
  guests?: number;
}

interface AccommodationDetailsProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
  bookingRef?: string | null;
  url?: string | null;
  notes?: string | null;
  details: AccommodationDetails | null;
}

export function AccommodationDetailsComponent({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
  bookingRef,
  url,
  notes,
  details,
}: AccommodationDetailsProps) {
  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {details?.hotelName || title}
        </Typography>
        {details?.address && (
          <Typography variant="body1" color="text.secondary">
            📍 {details.address}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Check-in & Check-out */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Check-in
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatUTCDate(startDateTime)}
            </Typography>
            <Typography variant="body1">
              {formatUTCDateTime(startDateTime)}
              {startTimezone && ` (${getUTCOffset(startTimezone)})`}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Check-out
            </Typography>
            {endDateTime ? (
              <>
                <Typography variant="body1" fontWeight={600}>
                  {formatUTCDate(endDateTime)}
                </Typography>
                <Typography variant="body1">
                  {formatUTCDateTime(endDateTime)}
                  {startTimezone && ` (${getUTCOffset(startTimezone)})`}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                TBD
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Guests */}
      {details?.guests && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Number of Guests
            </Typography>
            <Typography variant="body1">{details.guests}</Typography>
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
