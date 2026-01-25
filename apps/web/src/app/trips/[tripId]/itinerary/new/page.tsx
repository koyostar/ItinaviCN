'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateItineraryItemRequest, TripResponse } from '@itinavi/schema';
import {
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { api } from '@/lib/api';
import { ItineraryForm } from '@/components/ItineraryForm';

export default function NewItineraryItemPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [defaultTimezone, setDefaultTimezone] = useState('Asia/Shanghai');

  useEffect(() => {
    // Load trip to get destination timezone
    async function loadTrip() {
      try {
        const trip = await api.trips.get(tripId) as TripResponse;
        // Set default timezone based on destination country
        const country = trip.destinations?.[0]?.country;
        let timezone = 'Asia/Shanghai';
        if (country === 'Singapore') timezone = 'Asia/Singapore';
        else if (country === 'Japan') timezone = 'Asia/Tokyo';
        else if (country === 'Hong Kong') timezone = 'Asia/Hong_Kong';
        else if (country === 'South Korea') timezone = 'Asia/Seoul';
        else if (country === 'Thailand') timezone = 'Asia/Bangkok';
        
        setDefaultTimezone(timezone);
      } catch (err) {
        console.error('Failed to load trip:', err);
      }
    }
    loadTrip();
  }, [tripId]);

  const handleSubmit = async (data: CreateItineraryItemRequest) => {
    setLoading(true);
    try {
      await api.itinerary.create(tripId, data);
      router.push(`/trips/${tripId}/itinerary`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create item');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/trips/${tripId}/itinerary`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Add Itinerary Item
      </Typography>

      <Card>
        <CardContent>
          <ItineraryForm
            defaultTimezone={defaultTimezone}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
