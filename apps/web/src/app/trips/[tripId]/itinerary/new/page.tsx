'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateItineraryItemRequest, ItineraryItemType, TransportMode } from '@itinavi/schema';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { api } from '@/lib/api';

const TYPES: ItineraryItemType[] = ['Flight', 'Transport', 'Accommodation', 'PlaceVisit', 'Food'];
const TRANSPORT_MODES: TransportMode[] = ['Metro', 'Bus', 'Taxi', 'Didi', 'Train', 'Walk', 'Other'];

export default function NewItineraryItemPage({ params }: { params: { tripId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<ItineraryItemType>('PlaceVisit');
  const [formData, setFormData] = useState({
    title: '',
    startDateTime: '',
    endDateTime: '',
    status: 'Planned' as const,
    notes: '',
    bookingRef: '',
    url: '',
  });

  // Type-specific details
  const [flightDetails, setFlightDetails] = useState({
    airline: '',
    flightNo: '',
    departAirport: '',
    arriveAirport: '',
    terminal: '',
    seat: '',
  });

  const [transportDetails, setTransportDetails] = useState({
    mode: 'Metro' as TransportMode,
  });

  const [accommodationDetails, setAccommodationDetails] = useState({
    checkInDateTime: '',
    checkOutDateTime: '',
    guests: '',
  });

  const [placeVisitDetails, setPlaceVisitDetails] = useState({
    ticketInfo: '',
    openingHours: '',
  });

  const [foodDetails, setFoodDetails] = useState({
    cuisine: '',
    reservationInfo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let details: unknown = null;

      if (type === 'Flight') {
        details = Object.fromEntries(
          Object.entries(flightDetails).filter(([, v]) => v !== '')
        );
      } else if (type === 'Transport') {
        details = { mode: transportDetails.mode };
      } else if (type === 'Accommodation') {
        details = Object.fromEntries(
          Object.entries({
            ...accommodationDetails,
            guests: accommodationDetails.guests ? parseInt(accommodationDetails.guests) : undefined,
          }).filter(([, v]) => v !== undefined && v !== '')
        );
      } else if (type === 'PlaceVisit') {
        details = Object.fromEntries(
          Object.entries(placeVisitDetails).filter(([, v]) => v !== '')
        );
      } else if (type === 'Food') {
        details = Object.fromEntries(
          Object.entries(foodDetails).filter(([, v]) => v !== '')
        );
      }

      const payload: CreateItineraryItemRequest = {
        type,
        title: formData.title,
        startDateTime: formData.startDateTime,
        ...(formData.endDateTime && { endDateTime: formData.endDateTime }),
        status: formData.status,
        ...(formData.notes && { notes: formData.notes }),
        ...(formData.bookingRef && { bookingRef: formData.bookingRef }),
        ...(formData.url && { url: formData.url }),
        ...(details && typeof details === 'object' && Object.keys(details).length > 0 ? { details } : {}),
      } as CreateItineraryItemRequest;

      await api.itinerary.create(params.tripId, payload);
      router.push(`/trips/${params.tripId}/itinerary`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create item');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Add Itinerary Item
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value as ItineraryItemType)}
                >
                  {TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Title"
                required
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`e.g., ${type === 'Flight' ? 'Flight to Beijing' : type === 'Food' ? 'Dinner at Dadong' : 'Visit Forbidden City'}`}
              />

              <TextField
                label="Start Date & Time"
                type="datetime-local"
                required
                fullWidth
                value={formData.startDateTime}
                onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="End Date & Time"
                type="datetime-local"
                fullWidth
                value={formData.endDateTime}
                onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              {/* Flight-specific fields */}
              {type === 'Flight' && (
                <Stack spacing={2}>
                  <Typography variant="subtitle2" color="primary">Flight Details</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Airline"
                      fullWidth
                      value={flightDetails.airline}
                      onChange={(e) => setFlightDetails({ ...flightDetails, airline: e.target.value })}
                    />
                    <TextField
                      label="Flight No"
                      fullWidth
                      value={flightDetails.flightNo}
                      onChange={(e) => setFlightDetails({ ...flightDetails, flightNo: e.target.value })}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Depart Airport"
                      fullWidth
                      value={flightDetails.departAirport}
                      onChange={(e) => setFlightDetails({ ...flightDetails, departAirport: e.target.value })}
                    />
                    <TextField
                      label="Arrive Airport"
                      fullWidth
                      value={flightDetails.arriveAirport}
                      onChange={(e) => setFlightDetails({ ...flightDetails, arriveAirport: e.target.value })}
                    />
                  </Stack>
                </Stack>
              )}

              {/* Transport-specific fields */}
              {type === 'Transport' && (
                <FormControl fullWidth>
                  <InputLabel>Transport Mode</InputLabel>
                  <Select
                    value={transportDetails.mode}
                    label="Transport Mode"
                    onChange={(e) => setTransportDetails({ mode: e.target.value as TransportMode })}
                  >
                    {TRANSPORT_MODES.map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {mode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Accommodation-specific fields */}
              {type === 'Accommodation' && (
                <Stack spacing={2}>
                  <Typography variant="subtitle2" color="primary">Accommodation Details</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Check-in"
                      type="datetime-local"
                      fullWidth
                      value={accommodationDetails.checkInDateTime}
                      onChange={(e) => setAccommodationDetails({ ...accommodationDetails, checkInDateTime: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Check-out"
                      type="datetime-local"
                      fullWidth
                      value={accommodationDetails.checkOutDateTime}
                      onChange={(e) => setAccommodationDetails({ ...accommodationDetails, checkOutDateTime: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                  <TextField
                    label="Number of Guests"
                    type="number"
                    fullWidth
                    value={accommodationDetails.guests}
                    onChange={(e) => setAccommodationDetails({ ...accommodationDetails, guests: e.target.value })}
                  />
                </Stack>
              )}

              {/* PlaceVisit-specific fields */}
              {type === 'PlaceVisit' && (
                <Stack spacing={2}>
                  <Typography variant="subtitle2" color="primary">Place Visit Details</Typography>
                  <TextField
                    label="Ticket Info"
                    fullWidth
                    value={placeVisitDetails.ticketInfo}
                    onChange={(e) => setPlaceVisitDetails({ ...placeVisitDetails, ticketInfo: e.target.value })}
                    placeholder="e.g., ¥60, book online"
                  />
                  <TextField
                    label="Opening Hours"
                    fullWidth
                    value={placeVisitDetails.openingHours}
                    onChange={(e) => setPlaceVisitDetails({ ...placeVisitDetails, openingHours: e.target.value })}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                  />
                </Stack>
              )}

              {/* Food-specific fields */}
              {type === 'Food' && (
                <Stack spacing={2}>
                  <Typography variant="subtitle2" color="primary">Food Details</Typography>
                  <TextField
                    label="Cuisine"
                    fullWidth
                    value={foodDetails.cuisine}
                    onChange={(e) => setFoodDetails({ ...foodDetails, cuisine: e.target.value })}
                    placeholder="e.g., Peking Duck, Sichuan"
                  />
                  <TextField
                    label="Reservation Info"
                    fullWidth
                    value={foodDetails.reservationInfo}
                    onChange={(e) => setFoodDetails({ ...foodDetails, reservationInfo: e.target.value })}
                    placeholder="e.g., Reserved for 7 PM, Table 12"
                  />
                </Stack>
              )}

              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />

              <TextField
                label="Booking Reference"
                fullWidth
                value={formData.bookingRef}
                onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })}
              />

              <TextField
                label="URL"
                type="url"
                fullWidth
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => router.push(`/trips/${params.tripId}/itinerary`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Item'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
