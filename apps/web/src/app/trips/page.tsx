'use client';

import { useEffect, useState } from 'react';
import type { TripResponse, CreateTripRequest } from '@itinavi/schema';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '@/lib/api';
import { COUNTRIES, CITIES, getDisplayName } from '@/lib/locations';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { TripForm } from '@/components/TripForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { formatUTCDate } from '@/lib/dateUtils';

export default function TripsPage() {
  const { language } = useUserPreferences();
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<TripResponse | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.trips.list();
      setTrips((response as { items: TripResponse[] }).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  }

  function handleEditClick(trip: TripResponse) {
    setTripToEdit(trip);
    setEditDialogOpen(true);
  }

  async function handleEditSubmit(payload: Partial<CreateTripRequest>) {
    if (!tripToEdit) return;

    try {
      setUpdating(true);
      await api.trips.update(tripToEdit.id, payload);
      setEditDialogOpen(false);
      setTripToEdit(null);
      loadTrips();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update trip');
    } finally {
      setUpdating(false);
    }
  }

  function handleCancelEdit() {
    setEditDialogOpen(false);
    setTripToEdit(null);
  }

  function handleDeleteClick(tripId: string) {
    setTripToDelete(tripId);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!tripToDelete) return;

    try {
      setDeleting(true);
      await api.trips.delete(tripToDelete);
      setDeleteDialogOpen(false);
      setTripToDelete(null);
      loadTrips();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete trip');
    } finally {
      setDeleting(false);
    }
  }

  function handleCancelDelete() {
    setDeleteDialogOpen(false);
    setTripToDelete(null);
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading trips...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={loadTrips} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Trips
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href="/trips/new"
        >
          Create Trip
        </Button>
      </Stack>

      {trips.length === 0 ? (
        <Card>
          <CardContent>
            <Stack alignItems="center" spacing={2} py={4}>
              <Typography variant="h6" color="text.secondary">
                No trips yet
              </Typography>
              <Typography color="text.secondary">
                Create your first trip to start planning
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href="/trips/new"
              >
                Create Trip
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {trips.map((trip) => (
            <Card key={trip.id}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="start">
                    <Box flex={1}>
                      <Typography variant="h6">{trip.title}</Typography>
                      {trip.destinations && trip.destinations.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          📍 {trip.destinations.map(d => {
                            const countryData = COUNTRIES[d.country];
                            const countryName = countryData ? getDisplayName(countryData, language) : d.country;
                            const cityNames = d.cities.map(city => {
                              const cityData = CITIES[d.country]?.[city];
                              return cityData ? getDisplayName(cityData, language) : city;
                            }).join(', ');
                            return `${countryName} (${cityNames})`;
                          }).join(' • ')}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {formatUTCDate(trip.startDate, 'en-US', { month: 'short', day: 'numeric' })} - {formatUTCDate(trip.endDate, 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(trip)}
                        title="Edit trip"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(trip.id)}
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
                      href={`/trips/${trip.id}/itinerary`}
                    >
                      Itinerary
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      href={`/trips/${trip.id}/locations`}
                    >
                      Locations
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      href={`/trips/${trip.id}`}
                    >
                      Details
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog
        open={editDialogOpen}
        onClose={handleCancelEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Trip</DialogTitle>
        <DialogContent>
          {tripToEdit && (
            <Box sx={{ pt: 1 }}>
              <TripForm
                initialData={{
                  title: tripToEdit.title,
                  destinations: tripToEdit.destinations || [],
                  startDate: tripToEdit.startDate,
                  endDate: tripToEdit.endDate,
                  destinationCurrency: tripToEdit.destinationCurrency,
                  originCurrency: tripToEdit.originCurrency,
                  notes: tripToEdit.notes || undefined,
                }}
                onSubmit={handleEditSubmit}
                onCancel={handleCancelEdit}
                submitLabel="Update Trip"
                loading={updating}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

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
