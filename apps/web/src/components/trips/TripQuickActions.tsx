import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import {
  MdAttachMoney,
  MdEvent,
  MdPlace,
} from "react-icons/md";

interface TripQuickActionsProps {
  tripId: string;
}

export function TripQuickActions({ tripId }: TripQuickActionsProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      flexWrap="wrap"
    >
      <Card sx={{ flex: { sm: "1 1 45%", md: "1 1 22%" } }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <MdPlace size={48} color="#1976d2" />
            <Typography variant="h6" textAlign="center">
              Locations
            </Typography>
            <Button
              variant="contained"
              fullWidth
              href={`/trips/${tripId}/locations`}
            >
              Manage Locations
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ flex: { sm: "1 1 45%", md: "1 1 22%" } }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <MdEvent size={48} color="#1976d2" />
            <Typography variant="h6" textAlign="center">
              Itinerary
            </Typography>
            <Button
              variant="contained"
              fullWidth
              href={`/trips/${tripId}/itinerary`}
            >
              View Itinerary
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ flex: { sm: "1 1 45%", md: "1 1 22%" } }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <MdAttachMoney size={48} color="#1976d2" />
            <Typography variant="h6" textAlign="center">
              Expenses
            </Typography>
            <Button
              variant="contained"
              fullWidth
              href={`/trips/${tripId}/expenses`}
            >
              Track Expenses
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ flex: { sm: "1 1 45%", md: "1 1 22%" } }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <MdPlace size={48} style={{ opacity: 0.6 }} />
            <Typography variant="h6" textAlign="center">
              Maps
            </Typography>
            <Button variant="outlined" fullWidth disabled>
              Coming Soon
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
