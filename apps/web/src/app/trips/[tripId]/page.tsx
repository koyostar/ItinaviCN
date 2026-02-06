"use client";

import { TripForm } from "@/components/forms";
import { ConfirmDialog } from "@/components/ui";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { api } from "@/lib/api";
import { calculateDays, formatUTCDate } from "@/lib/dateUtils";
import { CITIES, COUNTRIES, getDisplayName } from "@/lib/locations";
import type { CreateTripRequest, TripResponse } from "@itinavi/schema";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const { language } = useUserPreferences();

  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function loadTrip() {
    try {
      setLoading(true);
      setError(null);
      const data = (await api.trips.get(tripId)) as TripResponse;
      setTrip(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trip");
    } finally {
      setLoading(false);
    }
  }

  function handleEditClick() {
    setEditDialogOpen(true);
  }

  async function handleEditSubmit(payload: Partial<CreateTripRequest>) {
    try {
      setUpdating(true);
      await api.trips.update(tripId, payload);
      setEditDialogOpen(false);
      loadTrip();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update trip");
    } finally {
      setUpdating(false);
    }
  }

  function handleCancelEdit() {
    setEditDialogOpen(false);
  }

  function handleDeleteClick() {
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    try {
      setDeleting(true);
      await api.trips.delete(tripId);
      router.push("/trips");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete trip");
      setDeleting(false);
    }
  }

  function handleCancelDelete() {
    setDeleteDialogOpen(false);
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

  const duration = calculateDays(trip.startDate, trip.endDate);

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
                      icon={<PlaceIcon />}
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
              onClick={handleEditClick}
              title="Edit trip"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={handleDeleteClick}
              title="Delete trip"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Trip Info Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trip Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Start Date
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography>{formatUTCDate(trip.startDate)}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      End Date
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography>{formatUTCDate(trip.endDate)}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Duration
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EventIcon fontSize="small" color="action" />
                      <Typography>
                        {duration} {duration === 1 ? "day" : "days"}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Destination Currency
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AttachMoneyIcon fontSize="small" color="action" />
                      <Typography>{trip.destinationCurrency}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Origin Currency
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AttachMoneyIcon fontSize="small" color="action" />
                      <Typography>{trip.originCurrency}</Typography>
                    </Stack>
                  </Box>
                  {trip.notes && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body2">{trip.notes}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
        >
          <Card sx={{ flex: { sm: "1 1 45%", md: "1 1 22%" } }}>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <PlaceIcon sx={{ fontSize: 48 }} color="primary" />
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
                <EventIcon sx={{ fontSize: 48 }} color="primary" />
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
                <AttachMoneyIcon sx={{ fontSize: 48 }} color="primary" />
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
                <PlaceIcon sx={{ fontSize: 48 }} color="action" />
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
        onClose={handleCancelEdit}
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
              onCancel={handleCancelEdit}
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
        onCancel={handleCancelDelete}
        loading={deleting}
        confirmColor="error"
      />
    </Container>
  );
}
