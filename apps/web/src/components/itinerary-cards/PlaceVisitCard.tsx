import { Box, Chip, Stack, Typography } from '@mui/material';
import { getUTCOffset } from '@/lib/utils/timezone';
import { formatUTCTime } from '@/lib/dateUtils';

interface PlaceVisitDetails {
  ticketInfo?: string;
  openingHours?: string;
}

interface PlaceVisitCardProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
  status: string;
  details: PlaceVisitDetails | null;
  statusColor: 'default' | 'primary' | 'success' | 'error';
  typeColor: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export function PlaceVisitCard({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
  status,
  details,
  statusColor,
  typeColor,
}: PlaceVisitCardProps) {
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Typography variant="h6">{title}</Typography>
        <Chip label="PlaceVisit" size="small" color={typeColor} />
        <Chip label={status} size="small" color={statusColor} variant="outlined" />
      </Stack>

      <Typography variant="body2" color="text.secondary">
        🕐 {formatUTCTime(startDateTime)}
        {endDateTime && ` - ${formatUTCTime(endDateTime)}`}
        {startTimezone && ` (${getUTCOffset(startTimezone)})`}
      </Typography>

      {(details?.openingHours || details?.ticketInfo) && (
        <Stack direction="row" spacing={2} mt={1}>
          {details?.openingHours && (
            <Typography variant="body2" color="text.secondary">
              🕒 {details.openingHours}
            </Typography>
          )}
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
