'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ItineraryItemResponse, UpdateItineraryItemRequest, TripResponse } from '@itinavi/schema';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '@/lib/api';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ItineraryForm } from '@/components/ItineraryForm';
import { formatUTCDate } from '@/lib/dateUtils';
import {
  ITINERARY_TYPE_ICONS,
  ITINERARY_TYPE_COLORS,
  ITINERARY_STATUS_COLORS,
} from '@/lib/constants';
import {
  FlightCard,
  AccommodationCard,
  TransportCard,
  PlaceVisitCard,
  FoodCard,
} from '@/components/itinerary-cards';

export default function ItineraryPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const router = useRouter();
  const [items, setItems] = useState<ItineraryItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ItineraryItemResponse | null>(null);
  const [updating, setUpdating] = useState(false);
  const [defaultTimezone, setDefaultTimezone] = useState('Asia/Shanghai');

  useEffect(() => {
    loadItems();
  }, [tripId]);

  async function loadItems() {
    try {
      setLoading(true);
      setError(null);
      const [itemsResponse, tripData] = await Promise.all([
        api.itinerary.list(tripId),
        api.trips.get(tripId) as Promise<TripResponse>,
      ]);
      setItems((itemsResponse as { items: ItineraryItemResponse[] }).items);
      
      // Set default timezone from trip destination
      const country = tripData.destinations?.[0]?.country;
      let timezone = 'Asia/Shanghai';
      if (country === 'Singapore') timezone = 'Asia/Singapore';
      else if (country === 'Japan') timezone = 'Asia/Tokyo';
      else if (country === 'Hong Kong') timezone = 'Asia/Hong_Kong';
      else if (country === 'South Korea') timezone = 'Asia/Seoul';
      else if (country === 'Thailand') timezone = 'Asia/Bangkok';
      setDefaultTimezone(timezone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(itemId: string) {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await api.itinerary.delete(tripId, itemToDelete);
      setItems((prev) => prev.filter((item) => item.id !== itemToDelete));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setDeleting(false);
    }
  }

  function handleEdit(item: ItineraryItemResponse) {
    setItemToEdit(item);
    setEditDialogOpen(true);
  }

  async function handleUpdate(data: UpdateItineraryItemRequest) {
    if (!itemToEdit) return;
    setUpdating(true);
    try {
      const updated = await api.itinerary.update(tripId, itemToEdit.id, data);
      setItems(items.map((item) => (item.id === itemToEdit.id ? updated as ItineraryItemResponse : item)));
      setEditDialogOpen(false);
      setItemToEdit(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setUpdating(false);
    }
  }

  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  // Group by day
  const groupedByDay = filteredItems.reduce((acc, item) => {
    const day = formatUTCDate(item.startDateTime, 'en-US', {
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
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => router.push(`/trips/${tripId}`)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Itinerary
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            href={`/trips/${tripId}/itinerary/new`}
          >
            Add Item
          </Button>
        </Stack>

        {/* Filters */}
        <Stack direction="row" spacing={2}>
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
                {(() => {
                  const FlightIcon = ITINERARY_TYPE_ICONS.Flight;
                  return <FlightIcon sx={{ fontSize: 64, color: 'text.secondary' }} />;
                })()}
                <Typography variant="h6" color="text.secondary">
                  No itinerary items yet
                </Typography>
                <Typography color="text.secondary">
                  Add your first item to start planning your trip
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  href={`/trips/${tripId}/itinerary/new`}
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
                <Stack spacing={0}>
                  {dayItems.map((item, index) => {
                    const Icon = ITINERARY_TYPE_ICONS[item.type];
                    const isLast = index === dayItems.length - 1;
                    return (
                      <Box key={item.id} sx={{ position: 'relative', pl: 6 }}>
                        {/* Timeline connector line */}
                        {!isLast && (
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 14,
                              top: 48,
                              bottom: -16,
                              width: 2,
                              bgcolor: 'divider',
                            }}
                          />
                        )}
                        
                        {/* Timeline dot with icon */}
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 16,
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: 'background.paper',
                            border: 2,
                            borderColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1,
                          }}
                        >
                          <Icon sx={{ fontSize: 18 }} color="primary" />
                        </Box>

                        <Card sx={{ mb: 2 }}>
                          <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box flex={1}>
                                {item.type === 'Flight' ? (
                                  <FlightCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    endDateTime={item.endDateTime}
                                    startTimezone={item.startTimezone}
                                    endTimezone={item.endTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={ITINERARY_STATUS_COLORS[item.status]}
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : item.type === 'Accommodation' ? (
                                  <AccommodationCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    endDateTime={item.endDateTime}
                                    startTimezone={item.startTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={ITINERARY_STATUS_COLORS[item.status]}
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : item.type === 'Transport' ? (
                                  <TransportCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    endDateTime={item.endDateTime}
                                    startTimezone={item.startTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={ITINERARY_STATUS_COLORS[item.status]}
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : item.type === 'PlaceVisit' ? (
                                  <PlaceVisitCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    endDateTime={item.endDateTime}
                                    startTimezone={item.startTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={ITINERARY_STATUS_COLORS[item.status]}
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : item.type === 'Food' ? (
                                  <FoodCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    startTimezone={item.startTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={ITINERARY_STATUS_COLORS[item.status]}
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : null}
                                
                                {item.notes && (
                                  <Typography variant="body2" color="text.secondary" mt={1}>
                                    {item.notes}
                                  </Typography>
                                )}
                              </Box>
                              
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEdit(item)}
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
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onCancel={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Itinerary Item"
          message="Are you sure you want to delete this itinerary item? This action cannot be undone."
          confirmLabel="Delete"
          confirmColor="error"
          loading={deleting}
        />

        <Dialog
          open={editDialogOpen}
          onClose={() => {
            if (!updating) {
              setEditDialogOpen(false);
              setItemToEdit(null);
            }
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Itinerary Item</DialogTitle>
          <DialogContent>
            {itemToEdit && (
              <Box sx={{ pt: 1 }}>
                <ItineraryForm
                  initialData={itemToEdit}
                  defaultTimezone={defaultTimezone}
                  onSubmit={handleUpdate}
                  onCancel={() => {
                    setEditDialogOpen(false);
                    setItemToEdit(null);
                  }}
                  loading={updating}
                />
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Stack>
    </Container>
  );
}
