'use client';

import { useEffect, useState } from 'react';
import type { TripResponse } from '@itinavi/schema';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { api } from '@/lib/api';

export default function TripsPage() {
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  <Box>
                    <Typography variant="h6">{trip.title}</Typography>
                    {trip.destination && (
                      <Typography variant="body2" color="text.secondary">
                        📍 {trip.destination}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
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
    </Container>
  );
}
