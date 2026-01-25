import { Box, Chip, Stack, Typography } from '@mui/material';
import { getUTCOffset } from '@/lib/utils/timezone';
import { formatUTCDateTime } from '@/lib/dateUtils';

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
        <Typography variant="h6">{details?.hotelName || title}</Typography>
        <Chip label="Accommodation" size="small" color={typeColor} />
        <Chip label={status} size="small" color={statusColor} variant="outlined" />
      </Stack>

      {details?.address && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          📍 {details.address}
        </Typography>
      )}

      <Stack direction="row" spacing={3} mt={1}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Check-in
          </Typography>
          <Typography variant="body2">
            {formatUTCDateTime(startDateTime)}
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
            {endDateTime ? formatUTCDateTime(endDateTime) : 'TBD'}
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
