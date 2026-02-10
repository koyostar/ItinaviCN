import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { formatUTCDate } from "@/lib/dateUtils";
import type { TripResponse } from "@itinavi/schema";
import { CITIES, COUNTRIES, getDisplayName } from "@itinavi/schema";
import { MdDelete, MdEdit, MdPeople, MdEvent, MdPlace, MdAttachMoney } from "react-icons/md";

interface TripCardProps {
  trip: TripResponse;
  language: "en" | "zh";
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onNavigateToItinerary: (e: React.MouseEvent) => void;
  onNavigateToLocations: (e: React.MouseEvent) => void;
  onNavigateToExpenses: (e: React.MouseEvent) => void;
}

export function TripCard({
  trip,
  language,
  onClick,
  onEdit,
  onDelete,
  onShare,
  onNavigateToItinerary,
  onNavigateToLocations,
  onNavigateToExpenses,
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
                onClick={onShare}
                title="Share trip"
              >
                <MdPeople />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                onClick={onEdit}
                title="Edit trip"
              >
                <MdEdit />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={onDelete}
                title="Delete trip"
              >
                <MdDelete />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<MdEvent />}
              onClick={onNavigateToItinerary}
            >
              Itinerary
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<MdPlace />}
              onClick={onNavigateToLocations}
            >
              Locations
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<MdAttachMoney />}
              onClick={onNavigateToExpenses}
            >
              Expenses
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
