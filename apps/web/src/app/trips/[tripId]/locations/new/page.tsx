"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateLocationRequest, LocationCategory } from "@itinavi/schema";
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
} from "@mui/material";
import { api } from "@/lib/api";
import { LOCATION_CATEGORIES } from "@/lib/constants";
import { useFormSubmit } from "@/hooks";
import { AmapPlaceAutocomplete } from "@/components/AmapPlaceAutocomplete";

export default function NewLocationPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState<CreateLocationRequest>({
    name: "",
    category: "Place",
    city: "",
    district: "",
    province: "",
    address: "",
    latitude: undefined,
    longitude: undefined,
    adcode: "",
    citycode: "",
    amapPoiId: "",
    notes: "",
  });

  const { handleSubmit: submitForm, submitting } = useFormSubmit(
    async (_: void) => {
      const payload = {
        name: formData.name,
        category: formData.category,
        ...(formData.city && { city: formData.city }),
        ...(formData.district && { district: formData.district }),
        ...(formData.province && { province: formData.province }),
        ...(formData.address && { address: formData.address }),
        ...(formData.latitude !== undefined && { latitude: formData.latitude }),
        ...(formData.longitude !== undefined && {
          longitude: formData.longitude,
        }),
        ...(formData.adcode && { adcode: formData.adcode }),
        ...(formData.citycode && { citycode: formData.citycode }),
        ...(formData.amapPoiId && { amapPoiId: formData.amapPoiId }),
        ...(formData.notes && { notes: formData.notes }),
      };
      await api.locations.create(tripId, payload);
    },
    { onSuccess: () => router.push(`/trips/${tripId}/locations`) }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(undefined as void);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Add New Location
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <AmapPlaceAutocomplete
                label="Name"
                value={formData.name}
                onPlaceSelect={(place) => {
                  setFormData({
                    ...formData,
                    name: place.name,
                    city: place.city || formData.city,
                    district: place.district || formData.district,
                    province: place.province || formData.province,
                    address: place.address || formData.address,
                    adcode: place.adcode || formData.adcode,
                    citycode: place.citycode || formData.citycode,
                    amapPoiId: place.amapPoiId || formData.amapPoiId,
                    ...(place.location && {
                      latitude: place.location.lat,
                      longitude: place.location.lng,
                    }),
                  });
                }}
                placeholder="Search for a place..."
                required
              />

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as LocationCategory,
                    })
                  }
                >
                  {LOCATION_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Address"
                fullWidth
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="e.g., Huairou District, Beijing"
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Latitude"
                  type="number"
                  fullWidth
                  value={formData.latitude ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="e.g., 40.4319"
                  inputProps={{ step: "any" }}
                />
                <TextField
                  label="Longitude"
                  type="number"
                  fullWidth
                  value={formData.longitude ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="e.g., 116.5704"
                  inputProps={{ step: "any" }}
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
                placeholder="Any additional notes about this location"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => router.push(`/trips/${tripId}/locations`)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Location"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
