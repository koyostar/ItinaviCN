"use client";

import { TripForm } from "@/components/forms";
import { ShareTripDialog } from "@/components/trips/ShareTripDialog";
import { TripInfoCard } from "@/components/trips/TripInfoCard";
import { TripQuickActions } from "@/components/trips/TripQuickActions";
import { ConfirmDialog } from "@/components/ui";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useTripDetail, useTripCounts } from "@/hooks";
import type { CreateTripRequest } from "@itinavi/schema";
import { CITIES, COUNTRIES, getDisplayName } from "@itinavi/schema";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
  MdDelete,
  MdEdit,
  MdPeople,
  MdPlace,
} from "react-icons/md";

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const { language } = useUserPreferences();

  const {
    trip,
    loading,
    error,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    shareDialogOpen,
    setShareDialogOpen,
    updating,
    deleting,
    handleUpdate,
    handleDelete,
    refetch,
  } = useTripDetail(tripId);

  const { counts, loading: loadingCounts, refetch: refetchCounts } = useTripCounts(tripId);

  async function handleEditSubmit(payload: Partial<CreateTripRequest>) {
    try {
      await handleUpdate(payload);
      refetchCounts(); // Reload counts after update
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update trip");
    }
  }

  async function handleConfirmDelete() {
    try {
      await handleDelete();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete trip");
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading trip...</Typography>
      </Container>
    );
  }

  if (error || !trip) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error || "Trip not found"}</Typography>
        <Button onClick={() => router.push("/trips")} sx={{ mt: 2 }}>
          Back to Trips
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {trip.title}
            </Typography>
            {trip.destinations && trip.destinations.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {trip.destinations.map((dest, idx) => {
                  const countryData = COUNTRIES[dest.country];
                  const countryName = countryData
                    ? getDisplayName(countryData, language)
                    : dest.country;
                  const cityNames = dest.cities
                    .map((city) => {
                      const cityData = CITIES[dest.country]?.[city];
                      return cityData
                        ? getDisplayName(cityData, language)
                        : city;
                    })
                    .join(", ");
                  return (
                    <Chip
                      key={idx}
                      icon={<MdPlace />}
                      label={`${countryName} (${cityNames})`}
                      variant="outlined"
                    />
                  );
                })}
              </Stack>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton
              color="primary"
              onClick={() => setShareDialogOpen(true)}
              title="Share trip"
            >
              <MdPeople />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => setEditDialogOpen(true)}
              title="Edit trip"
            >
              <MdEdit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              title="Delete trip"
            >
              <MdDelete />
            </IconButton>
          </Stack>
        </Stack>

        {/* Trip Info Card */}
        <TripInfoCard
          trip={trip}
          counts={counts}
          loadingCounts={loadingCounts}
        />

        {/* Quick Actions */}
        <TripQuickActions tripId={tripId} />

        {/* Back Button */}
        <Box>
          <Button variant="outlined" onClick={() => router.push("/trips")}>
            Back to Trips
          </Button>
        </Box>
      </Stack>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Trip</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TripForm
              initialData={{
                title: trip.title,
                destinations: trip.destinations || [],
                startDate: trip.startDate,
                endDate: trip.endDate,
                destinationCurrency: trip.destinationCurrency,
                originCurrency: trip.originCurrency,
                notes: trip.notes || undefined,
              }}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditDialogOpen(false)}
              submitLabel="Update Trip"
              loading={updating}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This action cannot be undone. All locations and itinerary items associated with this trip will also be deleted."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleting}
        confirmColor="error"
      />

      {/* Share Dialog */}
      <ShareTripDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        tripId={tripId}
        tripTitle={trip.title}
        isOwner={true} // TODO: Get from trip owner check
      />
    </Container>
  );
}
