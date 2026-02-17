import { Stack, TextField, Typography } from "@mui/material";
import { AmapPlaceAutocomplete } from "../../AmapPlaceAutocomplete";
import { DateTimeFields } from "./DateTimeFields";

interface AccommodationDetails {
  hotelName: string;
  city?: string;
  district?: string;
  province?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  adcode?: string;
  citycode?: string;
  amapPoiId?: string;
  guests: string;
  startTimezone: string;
  startDateTime: string;
  endTimezone: string;
  endDateTime: string;
}

interface AccommodationFieldsProps {
  accommodationDetails: AccommodationDetails;
  onAccommodationDetailsChange: (
    details: Partial<AccommodationDetails>
  ) => void;
}

export function AccommodationFields({
  accommodationDetails,
  onAccommodationDetailsChange,
  nameLabel = "Hotel Name",
}: AccommodationFieldsProps & { nameLabel?: string }) {
  return (
    <>
      <AmapPlaceAutocomplete
        label={nameLabel}
        value={accommodationDetails.hotelName}
        onPlaceSelect={(place) =>
          onAccommodationDetailsChange({
            hotelName: place.name,
            address: place.address,
            city: place.city,
            district: place.district,
            province: place.province,
            adcode: place.adcode,
            citycode: place.citycode,
            amapPoiId: place.amapPoiId,
            ...(place.location && {
              latitude: place.location.lat,
              longitude: place.location.lng,
            }),
          })
        }
        placeholder={`Search for ${nameLabel.toLowerCase()}...`}
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
