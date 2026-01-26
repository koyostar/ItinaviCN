"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ItineraryItemResponse,
  UpdateItineraryItemRequest,
  TripResponse,
} from "@itinavi/schema";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { api } from "@/lib/api";
import { ConfirmDialog, PageLoadingState, PageErrorState, EmptyState, PageHeader, FormDialog } from "@/components/ui";
import { useDeleteConfirmation, useEditDialog, useDetailsDialog, useTripTimezone, useItineraryItems } from "@/hooks";
import { getTimezoneForCountry } from "@/lib/utils/timezone";
import { ItineraryForm } from "@/components/forms";
import { formatUTCDate } from "@/lib/dateUtils";
import {
  ITINERARY_TYPE_ICONS,
  ITINERARY_TYPE_COLORS,
  ITINERARY_STATUS_COLORS,
} from "@/lib/constants";
import {
  FlightCard,
  AccommodationCard,
  TransportCard,
  PlaceVisitCard,
  FoodCard,
} from "@/components/itinerary/cards";
import {
  FlightDetailsComponent,
  AccommodationDetailsComponent,
  TransportDetailsComponent,
  PlaceVisitDetailsComponent,
  FoodDetailsComponent,
} from "@/components/itinerary/details";

export default function ItineraryPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { items, loading, error, refetch } = useItineraryItems(tripId);

  const deleteConfirmation = useDeleteConfirmation(
    async (id) => {
      await api.itinerary.delete(tripId, id);
    },
    refetch,
  );

  const editDialog = useEditDialog<ItineraryItemResponse>();
  const detailsDialog = useDetailsDialog<ItineraryItemResponse>();
  const { timezone: defaultTimezone } = useTripTimezone(tripId);

  const filteredItems = items.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  // Group by day
  const groupedByDay = filteredItems.reduce(
    (acc, item) => {
      const day = formatUTCDate(item.startDateTime, "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    },
    {} as Record<string, ItineraryItemResponse[]>,
  );

  if (loading) {
    return <PageLoadingState message="Loading itinerary..." />;
  }

  if (error) {
    return <PageErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Itinerary"
          backButton={{
            onClick: () => router.push(`/trips/${tripId}`),
          }}
          action={{
            label: "Add",
            href: `/trips/${tripId}/itinerary/new`,
          }}
        />

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
                  return (
                    <FlightIcon
                      sx={{ fontSize: 64, color: "text.secondary" }}
                    />
                  );
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
                  Add
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
                      <Box key={item.id} sx={{ position: "relative", pl: 6 }}>
                        {/* Timeline connector line */}
                        {!isLast && (
                          <Box
                            sx={{
                              position: "absolute",
                              left: 14,
                              top: 48,
                              bottom: -16,
                              width: 2,
                              bgcolor: "divider",
                            }}
                          />
                        )}

                        {/* Timeline dot with icon */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            top: 16,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "background.paper",
                            border: 2,
                            borderColor: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                          }}
                        >
                          <Icon sx={{ fontSize: 18 }} color="primary" />
                        </Box>

                        <Card sx={{ mb: 2 }}>
                          <CardContent>
                            <Stack spacing={2}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                width="100%"
                              >
                                <Stack direction="row" spacing={1}>
                                  <Chip
                                    label={item.type}
                                    size="small"
                                    color={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                  <Chip
                                    label={item.status}
                                    size="small"
                                    color={ITINERARY_STATUS_COLORS[item.status]}
                                    variant="outlined"
                                  />
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => editDialog.openEdit(item)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                    deleteConfirmation.handleDelete(item.id)
                                  }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Stack>
                              </Stack>
                              <Box
                                onClick={() => detailsDialog.openDetails(item)}
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": {
                                    opacity: 0.8,
                                  },
                                }}
                              >
                                {item.type === "Flight" ? (
                                  <FlightCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    endDateTime={item.endDateTime}
                                    startTimezone={item.startTimezone}
                                    endTimezone={item.endTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={
                                      ITINERARY_STATUS_COLORS[item.status]
                                    }
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : item.type === "Accommodation" ? (
                                  <AccommodationCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    endDateTime={item.endDateTime}
                                    startTimezone={item.startTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={
                                      ITINERARY_STATUS_COLORS[item.status]
                                    }
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : item.type === "Transport" ? (
                                  <TransportCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    endDateTime={item.endDateTime}
                                    startTimezone={item.startTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={
                                      ITINERARY_STATUS_COLORS[item.status]
                                    }
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : item.type === "PlaceVisit" ? (
                                  <PlaceVisitCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    endDateTime={item.endDateTime}
                                    startTimezone={item.startTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={
                                      ITINERARY_STATUS_COLORS[item.status]
                                    }
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : item.type === "Food" ? (
                                  <FoodCard
                                    title={item.title}
                                    startDateTime={item.startDateTime}
                                    startTimezone={item.startTimezone}
                                    status={item.status}
                                    details={item.details as any}
                                    statusColor={
                                      ITINERARY_STATUS_COLORS[item.status]
                                    }
                                    typeColor={ITINERARY_TYPE_COLORS[item.type]}
                                  />
                                ) : null}

                                {item.notes && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={1}
                                  >
                                    {item.notes}
                                  </Typography>
                                )}
                              </Box>
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
          open={deleteConfirmation.open}
          onCancel={deleteConfirmation.handleCancel}
          onConfirm={deleteConfirmation.handleConfirm}
          title="Delete Itinerary Item"
          message="Are you sure you want to delete this itinerary item? This action cannot be undone."
          confirmLabel="Delete"
          confirmColor="error"
          loading={deleteConfirmation.loading}
        />

        <FormDialog
          open={editDialog.open}
          title="Edit Itinerary Item"
          onClose={editDialog.closeEdit}
        >
          {editDialog.item && (
            <ItineraryForm
              initialData={editDialog.item}
              defaultTimezone={defaultTimezone}
              onSubmit={(data) =>
                editDialog.handleSubmit(async (item) => {
                  await api.itinerary.update(
                    tripId,
                    item.id,
                    data,
                  );
                  refetch();
                })
              }
              onCancel={editDialog.closeEdit}
              loading={editDialog.submitting}
            />
          )}
        </FormDialog>

        <Dialog
          open={detailsDialog.open}
          onClose={detailsDialog.closeDetails}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{detailsDialog.item?.type} Details</DialogTitle>
          <DialogContent>
            {detailsDialog.item && (
              <Box sx={{ pt: 2 }}>
                {detailsDialog.item.type === "Flight" && (
                  <FlightDetailsComponent
                    title={detailsDialog.item.title}
                    startDateTime={detailsDialog.item.startDateTime}
                    endDateTime={detailsDialog.item.endDateTime}
                    startTimezone={detailsDialog.item.startTimezone}
                    endTimezone={detailsDialog.item.endTimezone}
                    bookingRef={detailsDialog.item.bookingRef}
                    url={detailsDialog.item.url}
                    notes={detailsDialog.item.notes}
                    details={detailsDialog.item.details as any}
                  />
                )}
                {detailsDialog.item.type === "Accommodation" && (
                  <AccommodationDetailsComponent
                    title={detailsDialog.item.title}
                    startDateTime={detailsDialog.item.startDateTime}
                    endDateTime={detailsDialog.item.endDateTime}
                    startTimezone={detailsDialog.item.startTimezone}
                    bookingRef={detailsDialog.item.bookingRef}
                    url={detailsDialog.item.url}
                    notes={detailsDialog.item.notes}
                    details={detailsDialog.item.details as any}
                  />
                )}
                {detailsDialog.item.type === "Transport" && (
                  <TransportDetailsComponent
                    title={detailsDialog.item.title}
                    startDateTime={detailsDialog.item.startDateTime}
                    endDateTime={detailsDialog.item.endDateTime}
                    startTimezone={detailsDialog.item.startTimezone}
                    bookingRef={detailsDialog.item.bookingRef}
                    url={detailsDialog.item.url}
                    notes={detailsDialog.item.notes}
                    details={detailsDialog.item.details as any}
                  />
                )}
                {detailsDialog.item.type === "PlaceVisit" && (
                  <PlaceVisitDetailsComponent
                    title={detailsDialog.item.title}
                    startDateTime={detailsDialog.item.startDateTime}
                    endDateTime={detailsDialog.item.endDateTime}
                    startTimezone={detailsDialog.item.startTimezone}
                    bookingRef={detailsDialog.item.bookingRef}
                    url={detailsDialog.item.url}
                    notes={detailsDialog.item.notes}
                    details={detailsDialog.item.details as any}
                  />
                )}
                {detailsDialog.item.type === "Food" && (
                  <FoodDetailsComponent
                    title={detailsDialog.item.title}
                    startDateTime={detailsDialog.item.startDateTime}
                    startTimezone={detailsDialog.item.startTimezone}
                    bookingRef={detailsDialog.item.bookingRef}
                    url={detailsDialog.item.url}
                    notes={detailsDialog.item.notes}
                    details={detailsDialog.item.details as any}
                  />
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Stack>
    </Container>
  );
}
