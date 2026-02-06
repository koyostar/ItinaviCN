"use client";

import { ItineraryForm } from "@/components/forms";
import {
  AccommodationCard,
  FlightCard,
  FoodCard,
  PlaceCard,
  TransportCard,
} from "@/components/itinerary/cards";
import {
  AccommodationDetailsComponent,
  FlightDetailsComponent,
  FoodDetailsComponent,
  PlaceDetailsComponent,
  TransportDetailsComponent,
} from "@/components/itinerary/details";
import {
  ConfirmDialog,
  FormDialog,
  PageErrorState,
  PageHeader,
  PageLoadingState,
} from "@/components/ui";
import {
  useDeleteConfirmation,
  useDetailsDialog,
  useEditDialog,
  useItineraryItems,
  useTripTimezone,
} from "@/hooks";
import { api } from "@/lib/api";
import {
  ITINERARY_STATUS_COLORS,
  ITINERARY_TYPE_COLORS,
  ITINERARY_TYPE_ICONS,
} from "@/lib/constants";
import { formatUTCDate } from "@/lib/dateUtils";
import type { ItineraryItemResponse } from "@itinavi/schema";
import AddIcon from "@mui/icons-material/Add";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

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

  const deleteConfirmation = useDeleteConfirmation(async (id) => {
    await api.itinerary.delete(tripId, id);
  }, refetch);

  const editDialog = useEditDialog<ItineraryItemResponse>();
  const detailsDialog = useDetailsDialog<ItineraryItemResponse>();
  const { timezone: defaultTimezone } = useTripTimezone(tripId);

  const filteredItems = items.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  // Group by day - items spanning multiple days appear in each day
  const groupedByDay = filteredItems.reduce(
    (acc, item) => {
      const startDay = formatUTCDate(item.startDateTime, "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Add to start day
      if (!acc[startDay]) acc[startDay] = [];
      acc[startDay].push(item);

      // If item has end date on different day, add to all days in between
      if (item.endDateTime) {
        const startDate = new Date(item.startDateTime);
        const endDate = new Date(item.endDateTime);

        // Check if they're on different calendar days
        const startDateOnly = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
        );
        const endDateOnly = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
        );

        if (startDateOnly.getTime() !== endDateOnly.getTime()) {
          // Add to end day
          const endDay = formatUTCDate(item.endDateTime, "en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          if (!acc[endDay]) acc[endDay] = [];
          if (!acc[endDay].find((i) => i.id === item.id)) {
            acc[endDay].push(item);
          }

          // Add to intermediate days
          const currentDate = new Date(startDateOnly);
          currentDate.setDate(currentDate.getDate() + 1);

          while (currentDate < endDateOnly) {
            const intermediateDay = formatUTCDate(
              currentDate.toISOString(),
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            );
            if (!acc[intermediateDay]) acc[intermediateDay] = [];
            if (!acc[intermediateDay].find((i) => i.id === item.id)) {
              acc[intermediateDay].push(item);
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      }

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
              <MenuItem value="Place">Place</MenuItem>
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
            {Object.entries(groupedByDay)
              .sort(([dayA], [dayB]) => {
                // Parse the formatted date strings back to Date objects for comparison
                const dateA = new Date(dayA);
                const dateB = new Date(dayB);
                return dateA.getTime() - dateB.getTime();
              })
              .map(([day, dayItems]) => (
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
                              borderColor: `${ITINERARY_TYPE_COLORS[item.type]}.main`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 1,
                            }}
                          >
                            <Icon
                              sx={{ fontSize: 18 }}
                              color={ITINERARY_TYPE_COLORS[item.type]}
                            />
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
                                      color={
                                        ITINERARY_STATUS_COLORS[item.status]
                                      }
                                      variant="outlined"
                                    />
                                  </Stack>
                                  <Stack direction="row" spacing={1}>
                                    <IconButton
                                      size="small"
                                      color="success"
                                      onClick={() =>
                                        router.push(
                                          `/trips/${tripId}/expenses/new?itineraryItemId=${item.id}`,
                                        )
                                      }
                                      title="Add expense for this item"
                                    >
                                      <AttachMoneyIcon />
                                    </IconButton>
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
                                  onClick={() =>
                                    detailsDialog.openDetails(item)
                                  }
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
                                      details={item.details as any}
                                    />
                                  ) : item.type === "Accommodation" ? (
                                    <AccommodationCard
                                      title={item.title}
                                      startDateTime={item.startDateTime}
                                      endDateTime={item.endDateTime}
                                      details={item.details as any}
                                    />
                                  ) : item.type === "Transport" ? (
                                    <TransportCard
                                      title={item.title}
                                      startDateTime={item.startDateTime}
                                      endDateTime={item.endDateTime}
                                      startTimezone={item.startTimezone}
                                    />
                                  ) : item.type === "Place" ? (
                                    <PlaceCard
                                      title={item.title}
                                      startDateTime={item.startDateTime}
                                      endDateTime={item.endDateTime}
                                      startTimezone={item.startTimezone}
                                      details={item.details as any}
                                    />
                                  ) : item.type === "Food" ? (
                                    <FoodCard
                                      title={item.title}
                                      startDateTime={item.startDateTime}
                                      startTimezone={item.startTimezone}
                                      details={item.details as any}
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
                  await api.itinerary.update(tripId, item.id, data);
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
                {detailsDialog.item.type === "Place" && (
                  <PlaceDetailsComponent
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
