'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LocationResponse } from '@itinavi/schema';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlaceIcon from '@mui/icons-material/Place';
import { api } from '@/lib/api';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LOCATION_CATEGORY_COLORS } from '@/lib/constants';

export default function LocationsPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const router = useRouter();
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadLocations();
  }, [tripId]);

  async function loadLocations() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.locations.list(tripId);
      setLocations((response as { items: LocationResponse[] }).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(locationId: string) {
    setLocationToDelete(locationId);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!locationToDelete) return;

    try {
      setDeleting(true);
      await api.locations.delete(tripId, locationToDelete);
      setLocations((prev) => prev.filter((loc) => loc.id !== locationToDelete));
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete location');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading locations...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => router.push(`/trips/${tripId}`)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Locations
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            href={`/trips/${tripId}/locations/new`}
          >
            Add Location
          </Button>
        </Stack>

        {locations.length === 0 ? (
          <Card>
            <CardContent>
              <Stack alignItems="center" spacing={2} py={4}>
                <PlaceIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary">
                  No locations yet
                </Typography>
                <Typography color="text.secondary">
                  Add your first location to start planning your trip
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  href={`/trips/${tripId}/locations/new`}
                >
                  Add Location
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {locations.map((location) => (
              <Card key={location.id}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Typography variant="h6">{location.name}</Typography>
                        <Chip
                          label={location.category}
                          size="small"
                          color={LOCATION_CATEGORY_COLORS[location.category]}
                        />
                      </Stack>
                      
                      {location.address && (
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          📍 {location.address}
                        </Typography>
                      )}
                      
                      {(location.latitude !== null && location.longitude !== null) && (
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          🗺️ {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
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
                        onClick={() => handleDelete(location.id)}
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
          open={deleteDialogOpen}
          title="Delete Location"
          message="Are you sure you want to delete this location? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setLocationToDelete(null);
          }}
          loading={deleting}
          confirmColor="error"
        />
      </Stack>
    </Container>
  );
}
