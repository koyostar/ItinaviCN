"use client";

import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useDestinationManager, useFormSubmit } from "@/hooks";
import { api } from "@/lib/api";
import type { CreateTripRequest } from "@itinavi/schema";
import { DestinationFields } from "@/components/trips/DestinationFields";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTripPage() {
  const router = useRouter();
  const { language } = useUserPreferences();
  const {
    destinations,
    handleAddDestination,
    handleRemoveDestination,
    handleCountryChange,
    handleAddCity,
    handleRemoveCity,
    handleCityChange,
    getValidDestinations,
  } = useDestinationManager();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [formData, setFormData] = useState<Partial<CreateTripRequest>>({
    title: "",
    startDate: "",
    endDate: "",
    destinationCurrency: "CNY",
    originCurrency: "SGD",
    notes: "",
  });

  const { handleSubmit: submitForm, submitting } = useFormSubmit(
    async (_: void) => {
      const validDestinations = getValidDestinations();

      const payload: CreateTripRequest = {
        title: formData.title!,
        startDate: `${startDate}T00:00:00Z`,
        endDate: `${endDate}T23:59:59Z`,
        destinationCurrency: formData.destinationCurrency!,
        originCurrency: formData.originCurrency!,
        ...(validDestinations.length > 0 && {
          destinations: validDestinations,
        }),
        ...(formData.notes && { notes: formData.notes }),
      };

      await api.trips.create(payload);
    },
    { onSuccess: () => router.push("/trips") }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(undefined as void);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Create New Trip
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Trip Title"
                required
                fullWidth
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Beijing Adventure 2026"
              />

              <DestinationFields
                destinations={destinations}
                language={language}
                onAddDestination={handleAddDestination}
                onRemoveDestination={handleRemoveDestination}
                onCountryChange={handleCountryChange}
                onAddCity={handleAddCity}
                onRemoveCity={handleRemoveCity}
                onCityChange={handleCityChange}
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  required
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  required
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              <Typography variant="subtitle2" color="text.secondary" mt={2}>
                Currency Settings
              </Typography>

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Destination Currency"
                  required
                  fullWidth
                  value={formData.destinationCurrency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destinationCurrency: e.target.value,
                    })
                  }
                  placeholder="CNY"
                  helperText="Currency used in destination (e.g., CNY for China)"
                />
                <TextField
                  label="Origin Currency"
                  required
                  fullWidth
                  value={formData.originCurrency}
                  onChange={(e) =>
                    setFormData({ ...formData, originCurrency: e.target.value })
                  }
                  placeholder="SGD"
                  helperText="Your home currency (e.g., SGD, USD)"
                />
              </Stack>

              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional notes about your trip"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => router.push("/trips")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Trip"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
