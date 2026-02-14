import { getLocationCategoryChipSx } from "@/lib/constants/location";
import type { LocationResponse } from "@itinavi/schema";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

interface LocationCardProps {
  location: LocationResponse;
  tripId: string;
  onDelete: (id: string) => void;
  onClick?: (locationId: string) => void;
  onAddToItinerary?: (location: LocationResponse) => void;
}

export function LocationCard({
  location,
  tripId,
  onDelete,
  onClick,
  onAddToItinerary,
}: LocationCardProps) {
  return (
    <Card
      sx={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        "&:hover": onClick
          ? {
              boxShadow: 3,
              transform: "translateY(-2px)",
            }
          : {},
      }}
      onClick={(e) => {
        // Only trigger if not clicking on buttons
        if (onClick && !(e.target as HTMLElement).closest("button, a")) {
          onClick(location.id);
        }
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Typography variant="h6">{location.name}</Typography>
            </Stack>

            {location.address && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                📍 {location.address}
              </Typography>
            )}

            {location.notes && (
              <Typography variant="body2" color="text.secondary">
                {location.notes}
              </Typography>
            )}
            <Chip
              label={location.category}
              size="small"
              sx={getLocationCategoryChipSx(location.category)}
            />
          </Box>

          <Stack direction="row">
            {onAddToItinerary && (
              <Tooltip title="Add to Itinerary">
                <IconButton
                  size="medium"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToItinerary(location);
                  }}
                  sx={{ p: 1 }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
            <IconButton
              size="medium"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(location.id);
              }}
              sx={{ p: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
