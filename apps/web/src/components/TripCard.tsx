import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { TripResponse } from "@itinavi/schema";
import { COUNTRIES, CITIES, getDisplayName } from "@itinavi/schema";
import { formatUTCDate } from "@/lib/dateUtils";

interface TripCardProps {
  trip: TripResponse;
  language: "en" | "zh";
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onNavigateToItinerary: (e: React.MouseEvent) => void;
  onNavigateToLocations: (e: React.MouseEvent) => void;
}

export function TripCard({
  trip,
  language,
  onClick,
  onEdit,
  onDelete,
  onNavigateToItinerary,
  onNavigateToLocations,
}: TripCardProps) {
  return (
    <Card
      sx={{
        cursor: "pointer",
        "&:hover": {
          boxShadow: 3,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Box flex={1}>
              <Typography variant="h6">{trip.title}</Typography>
              {trip.destinations && trip.destinations.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  📍{" "}
                  {trip.destinations
                    .map((d) => {
                      const countryData = COUNTRIES[d.country];
                      const countryName = countryData
                        ? getDisplayName(countryData, language)
                        : d.country;
                      const cityNames = d.cities
                        .map((city) => {
                          const cityData = CITIES[d.country]?.[city];
                          return cityData
                            ? getDisplayName(cityData, language)
                            : city;
                        })
                        .join(", ");
                      return `${countryName} (${cityNames})`;
                    })
                    .join(" • ")}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {formatUTCDate(trip.startDate, "en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {formatUTCDate(trip.endDate, "en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                color="primary"
                onClick={onEdit}
                title="Edit trip"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={onDelete}
                title="Delete trip"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={onNavigateToItinerary}
            >
              Itinerary
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onNavigateToLocations}
            >
              Locations
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
