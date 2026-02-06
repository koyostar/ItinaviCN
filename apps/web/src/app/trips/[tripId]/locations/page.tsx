"use client";

import {
  ConfirmDialog,
  EmptyState,
  PageErrorState,
  PageLoadingState,
} from "@/components/ui";
import { useDeleteConfirmation, useLocations } from "@/hooks";
import { api } from "@/lib/api";
import { getLocationCategoryChipSx } from "@/lib/constants";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlaceIcon from "@mui/icons-material/Place";
import SyncIcon from "@mui/icons-material/Sync";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function LocationsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const { locations, loading, error, refetch } = useLocations(tripId);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const deleteConfirmation = useDeleteConfirmation(async (id) => {
    await api.locations.delete(tripId, id);
  }, refetch);

  const handleSyncLocations = async () => {
    try {
      setSyncing(true);
      setSyncMessage(null);
      const result = (await api.itinerary.syncLocations(tripId)) as {
        created: number;
      };
      setSyncMessage(
        `Synced successfully! ${result.created} location(s) created from itinerary.`,
      );
      await refetch();
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (err) {
      setSyncMessage(
        err instanceof Error ? err.message : "Failed to sync locations",
      );
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <PageLoadingState message="Loading locations..." />;
  }

  if (error) {
    return <PageErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        {syncMessage && (
          <Card sx={{ bgcolor: "info.light" }}>
            <CardContent>
              <Typography color="info.contrastText">{syncMessage}</Typography>
            </CardContent>
          </Card>
        )}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => router.push(`/trips/${tripId}`)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Locations
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<SyncIcon />}
              onClick={handleSyncLocations}
              disabled={syncing}
            >
              {syncing ? "Syncing..." : "Sync from Itinerary"}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              href={`/trips/${tripId}/locations/new`}
            >
              Add Location
            </Button>
          </Stack>
        </Stack>

        {locations.length === 0 ? (
          <EmptyState
            icon={<PlaceIcon sx={{ fontSize: 64, color: "text.secondary" }} />}
            title="No locations yet"
            description="Add your first location to start planning your trip"
            action={{
              label: "Add Location",
              href: `/trips/${tripId}/locations/new`,
            }}
          />
        ) : (
          <Stack spacing={2}>
            {locations.map((location) => (
              <Card key={location.id}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box flex={1}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="h6">{location.name}</Typography>
                        <Chip
                          label={location.category}
                          size="small"
                          sx={getLocationCategoryChipSx(location.category)}
                        />
                      </Stack>

                      {location.address && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          📍 {location.address}
                        </Typography>
                      )}

                      {location.latitude !== null &&
                        location.longitude !== null && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            🗺️ {location.latitude.toFixed(6)},{" "}
                            {location.longitude.toFixed(6)}
                          </Typography>
                        )}

                      {location.notes && (
                        <Typography variant="body2" color="text.secondary">
                          {location.notes}
                        </Typography>
                      )}
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
                        onClick={() =>
                          deleteConfirmation.handleDelete(location.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <ConfirmDialog
          open={deleteConfirmation.open}
          title="Delete Location"
          message="Are you sure you want to delete this location? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={deleteConfirmation.handleConfirm}
          onCancel={deleteConfirmation.handleCancel}
          loading={deleteConfirmation.loading}
          confirmColor="error"
        />
      </Stack>
    </Container>
  );
}
