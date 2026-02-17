import { Box, Stack, Typography, Divider } from "@mui/material";
import { getUTCOffset } from "@itinavi/schema";
import { formatUTCTime, formatUTCDate } from "@/lib/dateUtils";

interface FoodDetails {
  address?: string;
  cuisine?: string;
  openingTime?: string;
  closingTime?: string;
  reservationInfo?: string;
}

interface FoodDetailsProps {
  title: string;
  startDateTime: string;
  startTimezone?: string | null;
  bookingRef?: string | null;
  url?: string | null;
  notes?: string | null;
  details: FoodDetails | null;
}

export function FoodDetailsComponent({
  title,
  startDateTime,
  startTimezone,
  bookingRef,
  url,
  notes,
  details,
}: FoodDetailsProps) {
  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {details?.cuisine && (
          <Typography variant="subtitle1" color="text.secondary">
            {details.cuisine}
          </Typography>
        )}
        {details?.address && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            📍 {details.address}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Timing */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Time
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {formatUTCDate(startDateTime)}
        </Typography>
        <Typography variant="body1">
          {formatUTCTime(startDateTime)}
          {startTimezone && ` (${getUTCOffset(startTimezone)})`}
        </Typography>
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
              🏪 {details.openingTime} - {details.closingTime}
            </Typography>
          </Stack>
        </>
      )}

      {/* Reservation Info */}
      {details?.reservationInfo && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Reservation
            </Typography>
            <Typography variant="body1">
              📝 {details.reservationInfo}
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
