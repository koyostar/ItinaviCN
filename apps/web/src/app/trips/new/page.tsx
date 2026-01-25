'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateTripRequest, DisplayCurrencyMode } from '@itinavi/schema';
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

const CURRENCY_MODES: DisplayCurrencyMode[] = ['DestinationOnly', 'OriginOnly', 'Both'];

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateTripRequest>>({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    destinationCurrency: 'CNY',
    originCurrency: 'SGD',
    displayCurrencyMode: 'Both',
    defaultExchangeRate: undefined,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: CreateTripRequest = {
        title: formData.title!,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        destinationCurrency: formData.destinationCurrency!,
        originCurrency: formData.originCurrency!,
        displayCurrencyMode: formData.displayCurrencyMode!,
        ...(formData.destination && { destination: formData.destination }),
        ...(formData.defaultExchangeRate && { defaultExchangeRate: formData.defaultExchangeRate }),
        ...(formData.notes && { notes: formData.notes }),
      };

      const result = await api.trips.create(payload);
      router.push(`/trips/${(result as { id: string }).id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create trip');
      setLoading(false);
    }
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Beijing Adventure 2026"
              />

              <TextField
                label="Destination"
                fullWidth
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., Beijing, China"
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  required
                  fullWidth
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value + 'T00:00:00Z' })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  required
                  fullWidth
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value + 'T23:59:59Z' })}
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
                  onChange={(e) => setFormData({ ...formData, destinationCurrency: e.target.value })}
                  placeholder="CNY"
                  helperText="Currency used in destination (e.g., CNY for China)"
                />
                <TextField
                  label="Origin Currency"
                  required
                  fullWidth
                  value={formData.originCurrency}
                  onChange={(e) => setFormData({ ...formData, originCurrency: e.target.value })}
                  placeholder="SGD"
                  helperText="Your home currency (e.g., SGD, USD)"
                />
              </Stack>

              <FormControl fullWidth>
                <InputLabel>Display Currency Mode</InputLabel>
                <Select
                  value={formData.displayCurrencyMode}
                  label="Display Currency Mode"
                  onChange={(e) => setFormData({ ...formData, displayCurrencyMode: e.target.value as DisplayCurrencyMode })}
                >
                  {CURRENCY_MODES.map((mode) => (
                    <MenuItem key={mode} value={mode}>
                      {mode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Default Exchange Rate"
                type="number"
                fullWidth
                value={formData.defaultExchangeRate ?? ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  defaultExchangeRate: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="e.g., 5.2"
                helperText="1 destination currency = X origin currency"
                inputProps={{ step: '0.01', min: '0' }}
              />

              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes about your trip"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => router.push('/trips')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Trip'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
