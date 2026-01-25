import { Chip, Stack, Typography, Box } from '@mui/material';
import { getUTCOffset } from '@/lib/utils/timezone';
import { formatUTCTime } from '@/lib/dateUtils';

interface TransportDetails {
  mode?: string;
  fromLocationId?: string;
  toLocationId?: string;
}

interface TransportCardProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
  status: string;
  details: TransportDetails | null;
  statusColor: 'default' | 'primary' | 'success' | 'error';
  typeColor: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export function TransportCard({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
  status,
  details,
  statusColor,
  typeColor,
}: TransportCardProps) {
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Typography variant="h6">{title}</Typography>
        <Chip
          label={details?.mode || 'Transport'}
          size="small"
          color={typeColor}
        />
        <Chip label={status} size="small" color={statusColor} variant="outlined" />
      </Stack>

      <Typography variant="body2" color="text.secondary">
        🕐 {formatUTCTime(startDateTime)}
        {endDateTime && ` - ${formatUTCTime(endDateTime)}`}
        {startTimezone && ` (${getUTCOffset(startTimezone)})`}
      </Typography>
    </Box>
  );
}
