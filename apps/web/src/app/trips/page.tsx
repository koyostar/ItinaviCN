"use client";

import { TripForm } from "@/components/forms";
import { TripCard } from "@/components/TripCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ShareTripDialog } from "@/components/trips/ShareTripDialog";
import {
  ConfirmDialog,
  EmptyState,
  FormDialog,
  PageErrorState,
  PageHeader,
  PageLoadingState,
} from "@/components/ui";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useDeleteConfirmation, useEditDialog, useTrips } from "@/hooks";
import { api } from "@/lib/api";
import type { TripResponse } from "@itinavi/schema";
import { Container, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TripsPage() {
  return (
    <ProtectedRoute>
      <TripsPageContent />
    </ProtectedRoute>
  );
}

function TripsPageContent() {
  const router = useRouter();
  const { language } = useUserPreferences();
  const { trips, loading, error, refetch } = useTrips();
  const [shareTrip, setShareTrip] = useState<TripResponse | null>(null);

  const deleteConfirmation = useDeleteConfirmation(async (id) => {
    await api.trips.delete(id);
  }, refetch);

  const editDialog = useEditDialog<TripResponse>();

  if (loading) {
    return <PageLoadingState message="Loading trips..." />;
  }

  if (error) {
    return <PageErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="My Trips"
        action={{
          label: "Create Trip",
          href: "/trips/new",
        }}
      />

      {trips.length === 0 ? (
        <EmptyState
          title="No trips yet"
          description="Create your first trip to start planning"
          action={{
            label: "Create Trip",
            href: "/trips/new",
          }}
        />
      ) : (
        <Stack spacing={2}>
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              language={language}
              onClick={() => router.push(`/trips/${trip.id}`)}
              onEdit={(e) => {
                e.stopPropagation();
                editDialog.openEdit(trip);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                deleteConfirmation.handleDelete(trip.id);
              }}
              onShare={(e) => {
                e.stopPropagation();
                setShareTrip(trip);
              }}
              onNavigateToItinerary={(e) => {
                e.stopPropagation();
                router.push(`/trips/${trip.id}/itinerary`);
              }}
              onNavigateToLocations={(e) => {
                e.stopPropagation();
                router.push(`/trips/${trip.id}/locations`);
              }}
              onNavigateToExpenses={(e) => {
                e.stopPropagation();
                router.push(`/trips/${trip.id}/expenses`);
              }}
            />
          ))}
        </Stack>
      )}

      <FormDialog
        open={editDialog.open}
        title="Edit Trip"
        onClose={editDialog.closeEdit}
      >
        {editDialog.item && (
          <TripForm
            initialData={{
              title: editDialog.item.title,
              destinations: editDialog.item.destinations || [],
              startDate: editDialog.item.startDate,
              endDate: editDialog.item.endDate,
              destinationCurrency: editDialog.item.destinationCurrency,
              originCurrency: editDialog.item.originCurrency,
              notes: editDialog.item.notes || undefined,
            }}
            onSubmit={(data) =>
              editDialog.handleSubmit(async (trip) => {
                await api.trips.update(trip.id, data);
                refetch();
              })
            }
            onCancel={editDialog.closeEdit}
            submitLabel="Update Trip"
            loading={editDialog.submitting}
          />
        )}
      </FormDialog>

      <ConfirmDialog
        open={deleteConfirmation.open}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This action cannot be undone. All locations and itinerary items associated with this trip will also be deleted."
        confirmLabel="Delete"
        onConfirm={deleteConfirmation.handleConfirm}
        onCancel={deleteConfirmation.handleCancel}
        loading={deleteConfirmation.loading}
        confirmColor="error"
      />

      {shareTrip && (
        <ShareTripDialog
          open={!!shareTrip}
          onClose={() => setShareTrip(null)}
          tripId={shareTrip.id}
          tripTitle={shareTrip.title}
          isOwner={true} // TODO: Get from trip owner check
        />
      )}
    </Container>
  );
}
