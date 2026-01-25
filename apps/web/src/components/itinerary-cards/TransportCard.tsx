import { Chip, Stack, Typography, Box } from '@mui/material';

function getUTCOffset(timezone: string): string {
  try {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    const sign = offset >= 0 ? '+' : '';
    return `UTC${sign}${offset}`;
  } catch {
    return timezone;
  }
}

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
        🕐{' '}
        {new Date(startDateTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
        {endDateTime &&
          ` - ${new Date(endDateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}`}
        {startTimezone && ` (${getUTCOffset(startTimezone)})`}
      </Typography>
    </Box>
  );
}
