'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateLocationRequest, LocationCategory } from '@itinavi/schema';
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

const CATEGORIES: LocationCategory[] = [
  'Place',
  'Restaurant',
  'Accommodation',
  'TransportNode',
  'Shop',
  'Other',
];

export default function NewLocationPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateLocationRequest>({
    name: '',
    category: 'Place',
    address: '',
    latitude: undefined,
    longitude: undefined,
    baiduPlaceId: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        ...(formData.address && { address: formData.address }),
        ...(formData.latitude !== undefined && { latitude: formData.latitude }),
        ...(formData.longitude !== undefined && { longitude: formData.longitude }),
        ...(formData.baiduPlaceId && { baiduPlaceId: formData.baiduPlaceId }),
        ...(formData.notes && { notes: formData.notes }),
      };

      await api.locations.create(tripId, payload);
      router.push(`/trips/${tripId}/locations`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create location');
      setLoading(false);
    }
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
              <TextField
                label="Name"
                required
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Great Wall of China"
              />

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as LocationCategory })
                  }
                >
                  {CATEGORIES.map((cat) => (
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
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., Huairou District, Beijing"
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Latitude"
                  type="number"
                  fullWidth
                  value={formData.latitude ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g., 40.4319"
                  inputProps={{ step: 'any' }}
                />
                <TextField
                  label="Longitude"
                  type="number"
                  fullWidth
                  value={formData.longitude ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g., 116.5704"
                  inputProps={{ step: 'any' }}
                />
              </Stack>

              <TextField
                label="Baidu Place ID"
                fullWidth
                value={formData.baiduPlaceId}
                onChange={(e) => setFormData({ ...formData, baiduPlaceId: e.target.value })}
                placeholder="Optional - Baidu Maps place identifier"
              />

              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes about this location"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => router.push(`/trips/${tripId}/locations`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Location'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
