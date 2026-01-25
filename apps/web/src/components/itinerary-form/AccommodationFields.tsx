import { Stack, TextField, Typography } from "@mui/material";
import { AmapPlaceAutocomplete } from "../AmapPlaceAutocomplete";

interface AccommodationDetails {
  hotelName: string;
  address: string;
  guests: string;
}

interface AccommodationFieldsProps {
  accommodationDetails: AccommodationDetails;
  onAccommodationDetailsChange: (details: AccommodationDetails) => void;
}

export function AccommodationFields({
  accommodationDetails,
  onAccommodationDetailsChange,
}: AccommodationFieldsProps) {
  return (
    <>
      <AmapPlaceAutocomplete
        label="Hotel Name"
        value={accommodationDetails.hotelName}
        onPlaceSelect={(place) =>
          onAccommodationDetailsChange({
            ...accommodationDetails,
            hotelName: place.name,
            address: place.address,
          })
        }
        placeholder="Search for hotel..."
        required
      />
      <TextField
        label="Address"
        fullWidth
        value={accommodationDetails.address}
        onChange={(e) =>
          onAccommodationDetailsChange({
            ...accommodationDetails,
            address: e.target.value,
          })
        }
        placeholder="Address will be filled automatically from search"
      />
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="primary">
          Accommodation Details
        </Typography>
        <TextField
          label="Number of Guests"
          type="number"
          fullWidth
          value={accommodationDetails.guests}
          onChange={(e) =>
            onAccommodationDetailsChange({
              ...accommodationDetails,
              guests: e.target.value,
            })
          }
        />
      </Stack>
    </>
  );
}
