'use client';

import { useEffect, useState } from 'react';
import type { ItineraryItemResponse } from '@itinavi/schema';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import HotelIcon from '@mui/icons-material/Hotel';
import PlaceIcon from '@mui/icons-material/Place';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { api } from '@/lib/api';

const typeIcons = {
  Flight: FlightIcon,
  Transport: DirectionsBusIcon,
  Accommodation: HotelIcon,
  PlaceVisit: PlaceIcon,
  Food: RestaurantIcon,
};

const typeColors: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'> = {
  Flight: 'primary',
  Transport: 'info',
  Accommodation: 'success',
  PlaceVisit: 'warning',
  Food: 'error',
};

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'error'> = {
  Planned: 'default',
  Booked: 'primary',
  Done: 'success',
  Skipped: 'error',
};

export default function ItineraryPage({ params }: { params: { tripId: string } }) {
  const [items, setItems] = useState<ItineraryItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadItems();
  }, [params.tripId]);

  async function loadItems() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.itinerary.list(params.tripId);
      setItems((response as { items: ItineraryItemResponse[] }).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(itemId: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.itinerary.delete(params.tripId, itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item');
    }
  }

  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  // Group by day
  const groupedByDay = filteredItems.reduce((acc, item) => {
    const day = new Date(item.startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {} as Record<string, ItineraryItemResponse[]>);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading itinerary...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={loadItems} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Itinerary
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href={`/trips/${params.tripId}/itinerary/new`}
        >
          Add Item
        </Button>
      </Stack>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Flight">Flight</MenuItem>
            <MenuItem value="Transport">Transport</MenuItem>
            <MenuItem value="Accommodation">Accommodation</MenuItem>
            <MenuItem value="PlaceVisit">Place Visit</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
            <MenuItem value="Skipped">Skipped</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {Object.keys(groupedByDay).length === 0 ? (
        <Card>
          <CardContent>
            <Stack alignItems="center" spacing={2} py={4}>
              <FlightIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                No itinerary items yet
              </Typography>
              <Typography color="text.secondary">
                Add your first item to start planning your trip
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href={`/trips/${params.tripId}/itinerary/new`}
              >
                Add Item
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {Object.entries(groupedByDay).map(([day, dayItems]) => (
            <Box key={day}>
              <Typography variant="h6" mb={2} color="primary">
                {day}
              </Typography>
              <Stack spacing={2}>
                {dayItems.map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <Card key={item.id}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Stack direction="row" spacing={2} flex={1}>
                            <Icon color="action" />
                            <Box flex={1}>
                              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <Typography variant="h6">{item.title}</Typography>
                                <Chip
                                  label={item.type}
                                  size="small"
                                  color={typeColors[item.type]}
                                />
                                <Chip
                                  label={item.status}
                                  size="small"
                                  color={statusColors[item.status]}
                                  variant="outlined"
                                />
                              </Stack>
                              
                              <Typography variant="body2" color="text.secondary">
                                🕐 {new Date(item.startDateTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {item.endDateTime && ` - ${new Date(item.endDateTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}`}
                              </Typography>
                              
                              {item.notes && (
                                <Typography variant="body2" color="text.secondary" mt={1}>
                                  {item.notes}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                          
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              color="primary"
                              href={`/trips/${params.tripId}/itinerary/${item.id}/edit`}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  );
}
