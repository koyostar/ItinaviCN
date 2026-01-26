import { Box, Stack, Typography } from "@mui/material";
import { getUTCOffset } from "@/lib/utils/timezone";
import { formatUTCTime } from "@/lib/dateUtils";

interface FoodDetails {
  address?: string;
  cuisine?: string;
  openingTime?: string;
  closingTime?: string;
  reservationInfo?: string;
}

interface FoodCardProps {
  title: string;
  startDateTime: string;
  startTimezone?: string | null;
  status: string;
  details: FoodDetails | null;
  statusColor: "default" | "primary" | "success" | "error";
  typeColor: "primary" | "secondary" | "success" | "error" | "warning" | "info";
}

export function FoodCard({
  title,
  startDateTime,
  startTimezone,
  status,
  details,
  statusColor,
  typeColor,
}: FoodCardProps) {
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

      {details?.cuisine && (
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          🍽️ {details.cuisine}
        </Typography>
      )}

      {details?.address && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          📍 {details.address}
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary">
        🕐 {formatUTCTime(startDateTime)}
        {startTimezone && ` (${getUTCOffset(startTimezone)})`}
      </Typography>

      {(details?.openingTime && details?.closingTime) ||
      details?.reservationInfo ? (
        <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
          {details?.openingTime && details?.closingTime && (
            <Typography variant="body2" color="text.secondary">
              🕒 {details.openingTime} - {details.closingTime}
            </Typography>
          )}
          {details?.reservationInfo && (
            <Typography variant="body2" color="text.secondary">
              📝 {details.reservationInfo}
            </Typography>
          )}
        </Stack>
      ) : null}
    </Box>
  );
}
