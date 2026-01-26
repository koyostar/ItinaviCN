import { Box, Stack, Typography } from "@mui/material";
import { getUTCOffset } from "@/lib/utils/timezone";
import { formatUTCTime } from "@/lib/dateUtils";

interface PlaceDetails {
  address?: string;
  ticketInfo?: string;
  openingTime?: string;
  closingTime?: string;
}

interface PlaceCardProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
  status: string;
  details: PlaceDetails | null;
  statusColor: "default" | "primary" | "success" | "error";
  typeColor: "primary" | "secondary" | "success" | "error" | "warning" | "info";
}

export function PlaceCard({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
  status,
  details,
  statusColor,
  typeColor,
}: PlaceCardProps) {
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
        {title}
      </Typography>

      {details?.address && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          📍 {details.address}
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary">
        🕐 {formatUTCTime(startDateTime)}
        {endDateTime && ` - ${formatUTCTime(endDateTime)}`}
        {startTimezone && ` (${getUTCOffset(startTimezone)})`}
      </Typography>

      {details?.ticketInfo && (
        <Stack direction="row" spacing={2} mt={1}>
          {details?.ticketInfo && (
            <Typography variant="body2" color="text.secondary">
              🎫 {details.ticketInfo}
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
}
