"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import type { LocationResponse } from "@itinavi/schema";
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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaceIcon from "@mui/icons-material/Place";
import { api } from "@/lib/api";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { PageLoadingState } from "@/components/PageLoadingState";
import { PageErrorState } from "@/components/PageErrorState";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { useLocations } from "@/hooks/useLocations";
import { LOCATION_CATEGORY_COLORS } from "@/lib/constants";

export default function LocationsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const { locations, loading, error, refetch } = useLocations(tripId);

  const deleteConfirmation = useDeleteConfirmation(async (id) => {
    await api.locations.delete(tripId, id);
  }, refetch);

  if (loading) {
    return <PageLoadingState message="Loading locations..." />;
  }

  if (error) {
    return <PageErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Locations"
          backButton={{
            onClick: () => router.push(`/trips/${tripId}`),
          }}
          action={{
            label: "Add Location",
            href: `/trips/${tripId}/locations/new`,
          }}
        />

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
                          color={LOCATION_CATEGORY_COLORS[location.category]}
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
