import { Box, Chip, Stack, Typography } from '@mui/material';

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

interface FoodDetails {
  cuisine?: string;
  reservationInfo?: string;
}

interface FoodCardProps {
  title: string;
  startDateTime: string;
  startTimezone?: string | null;
  status: string;
  details: FoodDetails | null;
  statusColor: 'default' | 'primary' | 'success' | 'error';
  typeColor: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
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
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Typography variant="h6">{title}</Typography>
        {details?.cuisine && (
          <Chip label={details.cuisine} size="small" color={typeColor} />
        )}
        <Chip label={status} size="small" color={statusColor} variant="outlined" />
      </Stack>

      <Typography variant="body2" color="text.secondary">
        🕐{' '}
        {new Date(startDateTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
        {startTimezone && ` (${getUTCOffset(startTimezone)})`}
      </Typography>

      {details?.reservationInfo && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          📝 {details.reservationInfo}
        </Typography>
      )}
    </Box>
  );
}
