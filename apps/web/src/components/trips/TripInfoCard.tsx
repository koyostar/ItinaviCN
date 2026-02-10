import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { TripResponse } from "@itinavi/schema";
import { calculateDays, formatUTCDate } from "@/lib/dateUtils";
import {
  MdAttachMoney,
  MdCalendarMonth,
  MdEvent,
} from "react-icons/md";
import { TripSummaryCard } from "./TripSummaryCard";

interface TripInfoCardProps {
  trip: TripResponse;
  counts: {
    locations: number;
    itinerary: number;
    expenses: number;
    totalAmount: number;
  };
  loadingCounts: boolean;
}

export function TripInfoCard({ trip, counts, loadingCounts }: TripInfoCardProps) {
  const duration = calculateDays(trip.startDate, trip.endDate);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Trip Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MdCalendarMonth size={20} style={{ opacity: 0.6 }} />
                  <Typography>{formatUTCDate(trip.startDate)}</Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  End Date
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MdCalendarMonth size={20} style={{ opacity: 0.6 }} />
                  <Typography>{formatUTCDate(trip.endDate)}</Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MdEvent size={20} style={{ opacity: 0.6 }} />
                  <Typography>
                    {duration} {duration === 1 ? "day" : "days"}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Destination Currency
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MdAttachMoney size={20} style={{ opacity: 0.6 }} />
                  <Typography>{trip.destinationCurrency}</Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Origin Currency
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MdAttachMoney size={20} style={{ opacity: 0.6 }} />
                  <Typography>{trip.originCurrency}</Typography>
                </Stack>
              </Box>
              {trip.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body2">{trip.notes}</Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>
        
        <TripSummaryCard trip={trip} counts={counts} loading={loadingCounts} />
      </CardContent>
    </Card>
  );
}
