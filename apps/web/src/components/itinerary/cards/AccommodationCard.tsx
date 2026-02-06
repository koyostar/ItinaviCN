import { formatUTCDateTime } from "@/lib/dateUtils";
import { Box, Stack, Typography } from "@mui/material";

interface AccommodationDetails {
  hotelName?: string;
  address?: string;
  checkInDateTime?: string;
  checkOutDateTime?: string;
  guests?: number;
}

interface AccommodationCardProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  details: AccommodationDetails | null;
}

export function AccommodationCard({
  title,
  startDateTime,
  endDateTime,
  details,
}: AccommodationCardProps) {
  return (
    <Box
      sx={{
        transition: "opacity 0.2s",
        "&:hover": {
          opacity: 0.8,
        },
      }}
    >
      <Typography variant="h6" mb={1}>
        {details?.hotelName || title}
      </Typography>

      {details?.address && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          📍 {details.address}
        </Typography>
      )}

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 3 }}
        mt={1}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Check-in
          </Typography>
          <Typography variant="body2">
            {formatUTCDateTime(startDateTime)}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          alignSelf={{ xs: "flex-start", md: "center" }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          →
        </Typography>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Check-out
          </Typography>
          <Typography variant="body2">
            {endDateTime ? formatUTCDateTime(endDateTime) : "TBD"}
          </Typography>
        </Box>
        {details?.guests && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Guests
            </Typography>
            <Typography variant="body2">{details.guests}</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
