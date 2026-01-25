'use client';

import { useEffect, useState } from 'react';
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
import PlaceIcon from '@mui/icons-material/Place';
import { api } from '@/lib/api';

const categoryColors: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'> = {
  Place: 'primary',
  Restaurant: 'error',
  Accommodation: 'success',
  TransportNode: 'info',
  Shop: 'warning',
  Other: 'secondary',
};

export default function LocationsPage({ params }: { params: { tripId: string } }) {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
  }, [params.tripId]);

  async function loadLocations() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.locations.list(params.tripId);
      setLocations((response as { items: LocationResponse[] }).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(locationId: string) {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      await api.locations.delete(params.tripId, locationId);
      setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete location');
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
        <Button onClick={loadLocations} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Locations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href={`/trips/${params.tripId}/locations/new`}
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
                href={`/trips/${params.tripId}/locations/new`}
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
                        color={categoryColors[location.category]}
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
                      href={`/trips/${params.tripId}/locations/${location.id}/edit`}
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
    </Container>
  );
}
