import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Box, Button, Card, IconButton, Stack, Typography } from "@mui/material";
import type { DestinationInput } from "@/hooks/useDestinationManager";
import { CountryAutocomplete } from "./CountryAutocomplete";
import { CityAutocomplete } from "./CityAutocomplete";

interface DestinationFieldsProps {
  destinations: DestinationInput[];
  language: "en" | "zh";
  onAddDestination: () => void;
  onRemoveDestination: (index: number) => void;
  onCountryChange: (index: number, value: string) => void;
  onAddCity: (destIndex: number) => void;
  onRemoveCity: (destIndex: number, cityIndex: number) => void;
  onCityChange: (destIndex: number, cityIndex: number, value: string) => void;
}

export function DestinationFields({
  destinations,
  language,
  onAddDestination,
  onRemoveDestination,
  onCountryChange,
  onAddCity,
  onRemoveCity,
  onCityChange,
}: DestinationFieldsProps) {
  return (
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
        <Button size="small" startIcon={<AddIcon />} onClick={onAddDestination}>
          Add Destination
        </Button>
      </Stack>

      {destinations.map((dest, destIndex) => (
        <Card key={destIndex} variant="outlined" sx={{ mb: 2, p: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CountryAutocomplete
                value={dest.country}
                onChange={(value) => onCountryChange(destIndex, value)}
                language={language}
              />
              {destinations.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => onRemoveDestination(destIndex)}
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
                  onClick={() => onAddCity(destIndex)}
                >
                  Add City
                </Button>
              </Stack>

              {dest.cities.map((city, cityIndex) => (
                <Stack key={cityIndex} direction="row" spacing={1} mb={1}>
                  <CityAutocomplete
                    country={dest.country}
                    value={city}
                    onChange={(value) => onCityChange(destIndex, cityIndex, value)}
                    language={language}
                  />
                  {dest.cities.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveCity(destIndex, cityIndex)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
              ))}
            </Box>
          </Stack>
        </Card>
      ))}
    </Box>
  );
}
