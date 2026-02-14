import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { MdAttachMoney, MdEvent, MdPlace } from "react-icons/md";

interface TripQuickActionsProps {
  tripId: string;
}

export function TripQuickActions({ tripId }: TripQuickActionsProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
      <Card
        sx={{ flex: { sm: "1 1 45%", md: "1 1 22%" }, bgcolor: "primary.main" }}
      >
        <CardActionArea component={Link} href={`/trips/${tripId}/locations`}>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <MdPlace size={48} color="white" />
              <Typography
                variant="h6"
                textAlign="center"
                color="primary.contrastText"
              >
                Locations
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      <Card
        sx={{ flex: { sm: "1 1 45%", md: "1 1 22%" }, bgcolor: "primary.main" }}
      >
        <CardActionArea component={Link} href={`/trips/${tripId}/itinerary`}>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <MdEvent size={48} color="white" />
              <Typography
                variant="h6"
                textAlign="center"
                color="primary.contrastText"
              >
                Itinerary
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      <Card
        sx={{ flex: { sm: "1 1 45%", md: "1 1 22%" }, bgcolor: "primary.main" }}
      >
        <CardActionArea component={Link} href={`/trips/${tripId}/expenses`}>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <MdAttachMoney size={48} color="white" />
              <Typography
                variant="h6"
                textAlign="center"
                color="primary.contrastText"
              >
                Expenses
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Stack>
  );
}
