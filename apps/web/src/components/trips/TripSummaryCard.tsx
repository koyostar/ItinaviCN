import {
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { TripResponse } from "@itinavi/schema";
import {
  MdAttachMoney,
  MdEvent,
  MdPlace,
  MdReceipt,
} from "react-icons/md";

interface TripSummaryCardProps {
  trip: TripResponse;
  counts: {
    locations: number;
    itinerary: number;
    expenses: number;
    totalAmount: number;
  };
  loading: boolean;
}

export function TripSummaryCard({ trip, counts, loading }: TripSummaryCardProps) {
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Summary
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Locations
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <MdPlace size={20} style={{ opacity: 0.6 }} />
                <Typography>{loading ? "..." : counts.locations}</Typography>
              </Stack>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Itinerary Items
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <MdEvent size={20} style={{ opacity: 0.6 }} />
                <Typography>{loading ? "..." : counts.itinerary}</Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Expenses
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <MdReceipt size={20} style={{ opacity: 0.6 }} />
                <Typography>{loading ? "..." : counts.expenses}</Typography>
              </Stack>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Amount
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <MdAttachMoney size={20} style={{ opacity: 0.6 }} />
                <Typography>
                  {loading
                    ? "..."
                    : `${trip.destinationCurrency} ${counts.totalAmount.toFixed(2)}`}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
