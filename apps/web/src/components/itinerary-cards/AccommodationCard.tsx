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

interface AccommodationDetails {
  checkInDateTime?: string;
  checkOutDateTime?: string;
  guests?: number;
}

interface AccommodationCardProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
  status: string;
  details: AccommodationDetails | null;
  statusColor: 'default' | 'primary' | 'success' | 'error';
  typeColor: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export function AccommodationCard({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
  status,
  details,
  statusColor,
  typeColor,
}: AccommodationCardProps) {
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Typography variant="h6">{title}</Typography>
        <Chip label="Accommodation" size="small" color={typeColor} />
        <Chip label={status} size="small" color={statusColor} variant="outlined" />
      </Stack>

      <Stack direction="row" spacing={3} mt={1}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Check-in
          </Typography>
          <Typography variant="body2">
            {new Date(startDateTime).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" alignSelf="center">
          →
        </Typography>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Check-out
          </Typography>
          <Typography variant="body2">
            {endDateTime
              ? new Date(endDateTime).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'TBD'}
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
      {startTimezone && (
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          ({getUTCOffset(startTimezone)})
        </Typography>
      )}
    </Box>
  );
}
