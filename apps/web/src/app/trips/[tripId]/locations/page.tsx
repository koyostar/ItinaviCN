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
  Autocomplete,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
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
  const { locations, loading, error, refetch } = useLocations(tripId);
  const { syncing, syncMessage, handleSync } = useSyncLocations(
    tripId,
    refetch
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const deleteConfirmation = useDeleteConfirmation(async (id) => {
    await api.locations.delete(tripId, id);
  }, refetch);

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
    console.log('[LocationsPage] All locations:', locations);
    const uniqueCities = new Set<string>();
    locations.forEach((location) => {
      // Only include cities from selected province, or all if no province selected
      if (location.city && (!selectedProvince || location.province === selectedProvince)) {
        uniqueCities.add(location.city);
      }
    });
    const citiesArray = Array.from(uniqueCities).sort();
    console.log('[LocationsPage] Extracted cities for province', selectedProvince, ':', citiesArray);
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
    console.log('[LocationsPage] Selected filters:', { city: selectedCity, province: selectedProvince, category: selectedCategory });
    let filtered = locations;
    
    if (selectedProvince) {
      filtered = filtered.filter((location) => location.province === selectedProvince);
    }
    if (selectedCity) {
      filtered = filtered.filter((location) => location.city === selectedCity);
    }
    if (selectedCategory) {
      filtered = filtered.filter((location) => location.category === selectedCategory);
    }
    
    console.log('[LocationsPage] Filtered locations:', filtered);
    return filtered;
  }, [locations, selectedCity, selectedProvince, selectedCategory]);

  if (loading) {
    return <PageLoadingState message="Loading locations..." />;
  }

  if (error) {
    return <PageErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        {syncMessage && <SyncMessageAlert message={syncMessage} />}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => router.push(`/trips/${tripId}`)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Locations
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<SyncIcon />}
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? "Syncing..." : "Sync from Itinerary"}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              href={`/trips/${tripId}/locations/new`}
            >
              Add Location
            </Button>
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
            {(cities.length > 1 || categories.length > 1 || provinces.length > 1) && (
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {provinces.length > 1 && (
                  <Autocomplete
                    options={provinces}
                    value={selectedProvince}
                    onChange={(event, newValue) => setSelectedProvince(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filter by Province"
                        placeholder="All provinces"
                      />
                    )}
                    sx={{ minWidth: 200 }}
                    size="small"
                  />
                )}
                {cities.length > 1 && (
                  <Autocomplete
                    options={cities}
                    value={selectedCity}
                    onChange={(event, newValue) => setSelectedCity(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filter by City"
                        placeholder="All cities"
                      />
                    )}
                    sx={{ minWidth: 200 }}
                    size="small"
                  />
                )}
                {categories.length > 1 && (
                  <Autocomplete
                    options={categories}
                    value={selectedCategory}
                    onChange={(event, newValue) => setSelectedCategory(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filter by Category"
                        placeholder="All categories"
                      />
                    )}
                    sx={{ minWidth: 200 }}
                    size="small"
                  />
                )}
              </Stack>
            )}
            <Box sx={{ display: "flex", gap: 3, height: "calc(100vh - 280px)" }}>
              <Box sx={{ flex: "0 0 400px", overflowY: "auto", pr: 1 }}>
                <Stack spacing={2}>
                  {filteredLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      tripId={tripId}
                      onDelete={deleteConfirmation.handleDelete}
                    />
                  ))}
                </Stack>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <LocationsMap locations={filteredLocations} />
              </Box>
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
      </Stack>
    </Container>
  );
}
