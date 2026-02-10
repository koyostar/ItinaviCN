"use client";

import { LocationCard, LocationsMap } from "@/components/locations";
import {
  ConfirmDialog,
  EmptyState,
  PageErrorState,
  PageLoadingState,
  SyncMessageAlert,
} from "@/components/ui";
import { useDeleteConfirmation, useLocationFilters, useLocations, useSnackbar, useSyncLocations } from "@/hooks";
import { api } from "@/lib/api";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use } from "react";
import { MdAdd, MdArrowBack, MdPlace, MdSync } from "react-icons/md";

export default function LocationsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { locations, loading, error, refetch } = useLocations(tripId);
  const { syncing, syncMessage, handleSync } = useSyncLocations(
    tripId,
    refetch
  );
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();
  const {
    selectedCity,
    selectedProvince,
    selectedCategory,
    setSelectedCity,
    setSelectedProvince,
    setSelectedCategory,
    provinces,
    cities,
    categories,
    filteredLocations,
  } = useLocationFilters(locations);

  const deleteConfirmation = useDeleteConfirmation(async (id) => {
    await api.locations.delete(tripId, id);
  }, refetch);

  const handleAddToItinerary = async (location: any) => {
    try {
      // Create a Place itinerary item from the location
      await api.itinerary.create(tripId, {
        type: "Place",
        title: location.name,
        startDateTime: new Date().toISOString(),
        timezone: "Asia/Shanghai",
        locationId: location.id,
        details: {
          city: location.city || undefined,
          district: location.district || undefined,
          province: location.province || undefined,
          address: location.address || undefined,
          latitude: location.latitude || undefined,
          longitude: location.longitude || undefined,
          adcode: location.adcode || undefined,
          citycode: location.citycode || undefined,
          amapPoiId: location.amapPoiId || undefined,
        },
        notes: location.notes || undefined,
      });

      showSuccess(`Added "${location.name}" to itinerary`);
    } catch (error) {
      showError(
        `Failed to add to itinerary: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };



  if (loading) {
    return <PageLoadingState message="Loading locations..." />;
  }

  if (error) {
    return <PageErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}
    >
      <Stack spacing={3}>
        {syncMessage && <SyncMessageAlert message={syncMessage} />}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 1, sm: 2 }}
        >
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
            <IconButton
              onClick={() => router.push(`/trips/${tripId}`)}
              size="small"
            >
              <MdArrowBack />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontSize: { xs: "1.25rem", sm: "2.125rem" } }}
            >
              Locations
            </Typography>
          </Stack>
          <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
            {isMobile ? (
              <Button
                variant="outlined"
                startIcon={<MdSync />}
                onClick={handleSync}
                disabled={syncing}
                size="small"
                sx={{ borderRadius: "8px", px: 1, py: 0.5 }}
              >
                Sync
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<MdSync />}
                onClick={handleSync}
                disabled={syncing}
                size="small"
              >
                {syncing ? "Syncing..." : "Sync from Itinerary"}
              </Button>
            )}
            {isMobile ? (
              <Button
                variant="contained"
                startIcon={<MdAdd />}
                href={`/trips/${tripId}/locations/new`}
                size="small"
                sx={{ borderRadius: "8px", px: 1, py: 0.5 }}
              >
                Add
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<MdAdd />}
                href={`/trips/${tripId}/locations/new`}
                size="small"
              >
                Add Location
              </Button>
            )}
          </Stack>
        </Stack>

        {locations.length === 0 ? (
          <EmptyState
            icon={<MdPlace size={64} style={{ opacity: 0.6 }} />}
            title="No locations yet"
            description="Add your first location to start planning your trip"
            action={{
              label: "Add Location",
              href: `/trips/${tripId}/locations/new`,
            }}
          />
        ) : (
          <>
            {(cities.length > 1 ||
              categories.length > 1 ||
              provinces.length > 1) && (
              <Box
                sx={{
                  overflowX: { xs: "auto", sm: "visible" },
                  pt: 1,
                  pb: { xs: 1, sm: 0 },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ minWidth: { xs: "max-content", sm: "auto" } }}
                >
                  {provinces.length > 1 && (
                    <Autocomplete
                      options={provinces}
                      value={selectedProvince}
                      onChange={(event, newValue) =>
                        setSelectedProvince(newValue)
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Province" />
                      )}
                      sx={{ minWidth: { xs: 140, sm: 200 } }}
                      size="small"
                    />
                  )}
                  {cities.length > 1 && (
                    <Autocomplete
                      options={cities}
                      value={selectedCity}
                      onChange={(event, newValue) => setSelectedCity(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="City" />
                      )}
                      sx={{
                        minWidth: { xs: 140, sm: 200 },
                        display: { xs: "none", sm: "block" },
                      }}
                      size="small"
                    />
                  )}
                  {categories.length > 1 && (
                    <Autocomplete
                      options={categories}
                      value={selectedCategory}
                      onChange={(event, newValue) =>
                        setSelectedCategory(newValue)
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Category" />
                      )}
                      sx={{ minWidth: { xs: 140, sm: 200 } }}
                      size="small"
                    />
                  )}
                </Stack>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                height: { md: "calc(100vh - 280px)" },
              }}
            >
              <Box
                sx={{
                  flex: { xs: "1", md: "0 0 400px" },
                  overflowY: "auto",
                  pr: 1,
                  maxHeight: { md: "none" },
                }}
              >
                <Stack spacing={2}>
                  {filteredLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      tripId={tripId}
                      onDelete={deleteConfirmation.handleDelete}
                      onAddToItinerary={handleAddToItinerary}
                      onClick={(locationId) => {
                        // Trigger the map to show the location
                        if ((window as any).__mapLocationClickHandler) {
                          (window as any).__mapLocationClickHandler(locationId);
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Box>
              {!isMobile && (
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    height: "auto",
                  }}
                >
                  <LocationsMap
                    locations={filteredLocations}
                    onLocationClick={(locationId) => {
                      // This enables the map to register the click handler
                    }}
                  />
                </Box>
              )}
            </Box>
          </>
        )}

        <ConfirmDialog
          open={deleteConfirmation.open}
          title="Delete Location"
          message="Are you sure you want to delete this location? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={deleteConfirmation.handleConfirm}
          onCancel={deleteConfirmation.handleCancel}
          loading={deleteConfirmation.loading}
          confirmColor="error"
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={hideSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={hideSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
}
