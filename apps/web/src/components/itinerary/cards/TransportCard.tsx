import { formatUTCTime } from "@/lib/dateUtils";
import { getUTCOffset } from "@itinavi/schema";
import { Box, Typography } from "@mui/material";

interface TransportCardProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
}

export function TransportCard({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
}: TransportCardProps) {
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

      <Typography variant="body2" color="text.secondary">
        🕐 {formatUTCTime(startDateTime)}
        {endDateTime && ` - ${formatUTCTime(endDateTime)}`}
        {startTimezone && ` (${getUTCOffset(startTimezone)})`}
      </Typography>
    </Box>
  );
}
