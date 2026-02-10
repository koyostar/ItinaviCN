"use client";

import { LocationCard, LocationsMap } from "@/components/locations";
import {
  ConfirmDialog,
  EmptyState,
  PageErrorState,
  PageLoadingState,
  SyncMessageAlert,
} from "@/components/ui";
import { useDeleteConfirmation, useLocations, useSyncLocations } from "@/hooks";
import { api } from "@/lib/api";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaceIcon from "@mui/icons-material/Place";
import SyncIcon from "@mui/icons-material/Sync";
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
import { use, useEffect, useMemo, useState } from "react";

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
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

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

      setSnackbar({
        open: true,
        message: `Added "${location.name}" to itinerary`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to add to itinerary: ${error instanceof Error ? error.message : "Unknown error"}`,
        severity: "error",
      });
    }
  };

  // Extract unique provinces from locations
  const provinces = useMemo(() => {
    const uniqueProvinces = new Set<string>();
    locations.forEach((location) => {
      if (location.province) {
        uniqueProvinces.add(location.province);
      }
    });
    return Array.from(uniqueProvinces).sort();
  }, [locations]);

  // Extract unique cities from locations (filtered by selected province)
  const cities = useMemo(() => {
    console.log("[LocationsPage] All locations:", locations);
    const uniqueCities = new Set<string>();
    locations.forEach((location) => {
      // Only include cities from selected province, or all if no province selected
      if (
        location.city &&
        (!selectedProvince || location.province === selectedProvince)
      ) {
        uniqueCities.add(location.city);
      }
    });
    const citiesArray = Array.from(uniqueCities).sort();
    console.log(
      "[LocationsPage] Extracted cities for province",
      selectedProvince,
      ":",
      citiesArray
    );
    return citiesArray;
  }, [locations, selectedProvince]);

  // Extract unique categories from locations
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    locations.forEach((location) => {
      uniqueCategories.add(location.category);
    });
    return Array.from(uniqueCategories).sort();
  }, [locations]);

  // Clear child filters when parent filter changes
  useEffect(() => {
    // When province changes, clear city
    setSelectedCity(null);
  }, [selectedProvince]);

  // Filter locations by selected city, province, and category
  const filteredLocations = useMemo(() => {
    console.log("[LocationsPage] Selected filters:", {
      city: selectedCity,
      province: selectedProvince,
      category: selectedCategory,
    });
    let filtered = locations;

    if (selectedProvince) {
      filtered = filtered.filter(
        (location) => location.province === selectedProvince
      );
    }
    if (selectedCity) {
      filtered = filtered.filter((location) => location.city === selectedCity);
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (location) => location.category === selectedCategory
      );
    }

    console.log("[LocationsPage] Filtered locations:", filtered);
    return filtered;
  }, [locations, selectedCity, selectedProvince, selectedCategory]);

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
              <ArrowBackIcon />
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
                startIcon={<SyncIcon />}
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
                startIcon={<SyncIcon />}
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
                startIcon={<AddIcon />}
                href={`/trips/${tripId}/locations/new`}
                size="small"
                sx={{ borderRadius: "8px", px: 1, py: 0.5 }}
              >
                Add
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
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
            icon={<PlaceIcon sx={{ fontSize: 64, color: "text.secondary" }} />}
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
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
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
