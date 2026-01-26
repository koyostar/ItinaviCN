import { Stack, TextField, Typography } from "@mui/material";
import { AmapPlaceAutocomplete } from "../../AmapPlaceAutocomplete";
import { DateTimeFields } from "./DateTimeFields";

interface AccommodationDetails {
  hotelName: string;
  address: string;
  guests: string;
  startTimezone: string;
  startDateTime: string;
  endTimezone: string;
  endDateTime: string;
}

interface AccommodationFieldsProps {
  accommodationDetails: AccommodationDetails;
  onAccommodationDetailsChange: (
    details: Partial<AccommodationDetails>,
  ) => void;
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
              guests: e.target.value,
            })
          }
        />
      </Stack>

      <DateTimeFields
        label="Check-In"
        timezone={accommodationDetails.startTimezone}
        dateTime={accommodationDetails.startDateTime}
        required
        onTimezoneChange={(tz) =>
          onAccommodationDetailsChange({ startTimezone: tz })
        }
        onDateTimeChange={(dt) =>
          onAccommodationDetailsChange({ startDateTime: dt })
        }
      />

      <DateTimeFields
        label="Check-Out"
        timezone={accommodationDetails.endTimezone}
        dateTime={accommodationDetails.endDateTime}
        onTimezoneChange={(tz) =>
          onAccommodationDetailsChange({ endTimezone: tz })
        }
        onDateTimeChange={(dt) =>
          onAccommodationDetailsChange({ endDateTime: dt })
        }
      />
    </>
  );
}
