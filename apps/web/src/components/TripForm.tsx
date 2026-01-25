'use client';

import { useState, useEffect } from 'react';
import type { CreateTripRequest } from '@itinavi/schema';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  COUNTRIES,
  CITIES,
  getDisplayName,
  findLocationKey,
} from '@/lib/locations';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface DestinationInput {
  country: string;
  cities: string[];
}

interface TripFormProps {
  initialData?: {
    title: string;
    destinations?: Array<{ country: string; cities: string[] }>;
    startDate: string;
    endDate: string;
    destinationCurrency: string;
    originCurrency: string;
    notes?: string;
  };
  onSubmit: (data: Partial<CreateTripRequest>) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function TripForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Trip',
  loading = false,
}: TripFormProps) {
  const { language } = useUserPreferences();
  const [destinations, setDestinations] = useState<DestinationInput[]>(
    initialData?.destinations || [{ country: '', cities: [''] }]
  );
  const [startDate, setStartDate] = useState<string>(
    initialData?.startDate ? initialData.startDate.split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState<string>(
    initialData?.endDate ? initialData.endDate.split('T')[0] : ''
  );
  const [formData, setFormData] = useState<Partial<CreateTripRequest>>({
    title: initialData?.title || '',
    destinationCurrency: initialData?.destinationCurrency || 'CNY',
    originCurrency: initialData?.originCurrency || 'SGD',
    notes: initialData?.notes || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        destinationCurrency: initialData.destinationCurrency,
        originCurrency: initialData.originCurrency,
        notes: initialData.notes || '',
      });
      if (initialData.destinations) {
        setDestinations(initialData.destinations);
      }
      setStartDate(initialData.startDate.split('T')[0]);
      setEndDate(initialData.endDate.split('T')[0]);
    }
  }, [initialData]);

  const handleAddDestination = () => {
    setDestinations([...destinations, { country: '', cities: [''] }]);
  };

  const handleRemoveDestination = (index: number) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((_, i) => i !== index));
    }
  };

  const handleCountryChange = (index: number, value: string) => {
    const updated = [...destinations];
    updated[index].country = value;
    setDestinations(updated);
  };

  const handleAddCity = (destIndex: number) => {
    const updated = [...destinations];
    updated[destIndex].cities.push('');
    setDestinations(updated);
  };

  const handleRemoveCity = (destIndex: number, cityIndex: number) => {
    const updated = [...destinations];
    if (updated[destIndex].cities.length > 1) {
      updated[destIndex].cities = updated[destIndex].cities.filter(
        (_, i) => i !== cityIndex
      );
      setDestinations(updated);
    }
  };

  const handleCityChange = (
    destIndex: number,
    cityIndex: number,
    value: string
  ) => {
    const updated = [...destinations];
    updated[destIndex].cities[cityIndex] = value;
    setDestinations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validDestinations = destinations
      .filter((d) => d.country.trim() && d.cities.some((c) => c.trim()))
      .map((d) => ({
        country: d.country.trim(),
        cities: d.cities.filter((c) => c.trim()).map((c) => c.trim()),
      }));

    const payload: Partial<CreateTripRequest> = {
      title: formData.title!,
      startDate: startDate + 'T00:00:00Z',
      endDate: endDate + 'T23:59:59Z',
      destinationCurrency: formData.destinationCurrency!,
      originCurrency: formData.originCurrency!,
      ...(validDestinations.length > 0 && {
        destinations: validDestinations,
      }),
      ...(formData.notes && { notes: formData.notes }),
    };

    await onSubmit(payload);
  };

  return (
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

        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Destinations
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddDestination}
              type="button"
            >
              Add Destination
            </Button>
          </Stack>

          {destinations.map((dest, destIndex) => (
            <Card key={destIndex} variant="outlined" sx={{ mb: 2, p: 2 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Autocomplete
                    fullWidth
                    options={Object.keys(COUNTRIES)}
                    value={dest.country}
                    inputValue={
                      dest.country
                        ? COUNTRIES[dest.country]
                          ? getDisplayName(COUNTRIES[dest.country], language)
                          : dest.country
                        : ''
                    }
                    onInputChange={(_, newInputValue, reason) => {
                      if (reason === 'input') {
                        handleCountryChange(destIndex, newInputValue);
                      } else if (reason === 'clear') {
                        handleCountryChange(destIndex, '');
                      }
                    }}
                    onChange={(_, newValue) => {
                      const standardized = newValue
                        ? findLocationKey(newValue, COUNTRIES) || newValue
                        : '';
                      handleCountryChange(destIndex, standardized);
                    }}
                    filterOptions={(options, state) => {
                      const inputValue = state.inputValue.toLowerCase();
                      return options.filter((option) => {
                        const countryData = COUNTRIES[option];
                        return (
                          option.toLowerCase().includes(inputValue) ||
                          countryData.en.toLowerCase().includes(inputValue) ||
                          countryData.zh.includes(state.inputValue)
                        );
                      });
                    }}
                    getOptionLabel={(option) => {
                      const countryData = COUNTRIES[option];
                      return countryData
                        ? getDisplayName(countryData, language)
                        : option;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        placeholder="Search country..."
                      />
                    )}
                    renderOption={(props, option) => {
                      const countryData = COUNTRIES[option];
                      return (
                        <li {...props} key={option}>
                          {countryData
                            ? `${countryData.zh} / ${countryData.en}`
                            : option}
                        </li>
                      );
                    }}
                  />
                  {destinations.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveDestination(destIndex)}
                      type="button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>

                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Cities
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddCity(destIndex)}
                      type="button"
                    >
                      Add City
                    </Button>
                  </Stack>

                  {dest.cities.map((city, cityIndex) => {
                    const countryCities =
                      dest.country && CITIES[dest.country]
                        ? CITIES[dest.country]
                        : {};

                    return (
                      <Stack
                        key={cityIndex}
                        direction="row"
                        spacing={1}
                        mb={1}
                      >
                        <Autocomplete
                          size="small"
                          fullWidth
                          options={Object.keys(countryCities)}
                          value={city}
                          inputValue={
                            city
                              ? countryCities[city]
                                ? getDisplayName(
                                    countryCities[city],
                                    language
                                  )
                                : city
                              : ''
                          }
                          onInputChange={(_, newInputValue, reason) => {
                            if (reason === 'input') {
                              handleCityChange(
                                destIndex,
                                cityIndex,
                                newInputValue
                              );
                            } else if (reason === 'clear') {
                              handleCityChange(destIndex, cityIndex, '');
                            }
                          }}
                          onChange={(_, newValue) => {
                            const standardized = newValue
                              ? findLocationKey(newValue, countryCities) ||
                                newValue
                              : '';
                            handleCityChange(
                              destIndex,
                              cityIndex,
                              standardized
                            );
                          }}
                          filterOptions={(options, state) => {
                            const inputValue = state.inputValue.toLowerCase();
                            return options.filter((option) => {
                              const cityData = countryCities[option];
                              return (
                                option.toLowerCase().includes(inputValue) ||
                                cityData.en
                                  .toLowerCase()
                                  .includes(inputValue) ||
                                cityData.zh.includes(state.inputValue)
                              );
                            });
                          }}
                          getOptionLabel={(option) => {
                            const cityData = countryCities[option];
                            return cityData
                              ? getDisplayName(cityData, language)
                              : option;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Search city..."
                            />
                          )}
                          renderOption={(props, option) => {
                            const cityData = countryCities[option];
                            return (
                              <li {...props} key={option}>
                                {cityData
                                  ? `${cityData.zh} / ${cityData.en}`
                                  : option}
                              </li>
                            );
                          }}
                        />
                        {dest.cities.length > 1 && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleRemoveCity(destIndex, cityIndex)
                            }
                            type="button"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                    );
                  })}
                </Box>
              </Stack>
            </Card>
          ))}
        </Box>

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
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              type="button"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
