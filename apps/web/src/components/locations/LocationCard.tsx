import { getLocationCategoryChipSx } from "@/lib/constants";
import type { LocationResponse } from "@itinavi/schema";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

interface LocationCardProps {
  location: LocationResponse;
  tripId: string;
  onDelete: (id: string) => void;
}

export function LocationCard({
  location,
  tripId,
  onDelete,
}: LocationCardProps) {
  return (
    <Card>
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

            {location.latitude !== null && location.longitude !== null && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                🗺️ {location.latitude.toFixed(6)},{" "}
                {location.longitude.toFixed(6)}
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

          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              color="primary"
              href={`/trips/${tripId}/locations/${location.id}/edit`}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(location.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
