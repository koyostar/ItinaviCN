import { Stack, TextField, Typography } from "@mui/material";
import { AmapPlaceAutocomplete } from "../../AmapPlaceAutocomplete";
import { DateTimeFields } from "./DateTimeFields";

interface PlaceDetails {
  title: string;
  city?: string;
  district?: string;
  province?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  adcode?: string;
  citycode?: string;
  amapPoiId?: string;
  ticketInfo: string;
  openingTime: string;
  closingTime: string;
  startTimezone: string;
  startDateTime: string;
  endTimezone: string;
  endDateTime: string;
}

interface PlaceFieldsProps {
  placeDetails: PlaceDetails;
  onPlaceDetailsChange: (details: Partial<PlaceDetails>) => void;
}

export function PlaceFields({
  placeDetails,
  onPlaceDetailsChange,
}: PlaceFieldsProps) {
  return (
    <>
      <AmapPlaceAutocomplete
        label="Place Name"
        value={placeDetails.title}
        onPlaceSelect={(place) =>
          onPlaceDetailsChange({
            title: place.name,
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
        placeholder="Search for place..."
        required
      />
      <TextField
        label="Address"
        fullWidth
        value={placeDetails.address}
        onChange={(e) =>
          onPlaceDetailsChange({
            address: e.target.value,
          })
        }
        placeholder="Address will be filled automatically from search"
      />
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="primary">
          Place Details
        </Typography>
        <TextField
          label="Ticket Info"
          fullWidth
          value={placeDetails.ticketInfo}
          onChange={(e) =>
            onPlaceDetailsChange({
              ticketInfo: e.target.value,
            })
          }
          placeholder="e.g., ¥60, book online"
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Opening Time"
            type="time"
            fullWidth
            value={placeDetails.openingTime}
            onChange={(e) =>
              onPlaceDetailsChange({
                openingTime: e.target.value,
              })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Closing Time"
            type="time"
            fullWidth
            value={placeDetails.closingTime}
            onChange={(e) =>
              onPlaceDetailsChange({
                closingTime: e.target.value,
              })
            }
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Stack>

      <DateTimeFields
        label="Start Date & Time"
        timezone={placeDetails.startTimezone}
        dateTime={placeDetails.startDateTime}
        required
        onTimezoneChange={(tz) => onPlaceDetailsChange({ startTimezone: tz })}
        onDateTimeChange={(dt) => onPlaceDetailsChange({ startDateTime: dt })}
      />

      <DateTimeFields
        label="End Date & Time"
        timezone={placeDetails.endTimezone}
        dateTime={placeDetails.endDateTime}
        onTimezoneChange={(tz) => onPlaceDetailsChange({ endTimezone: tz })}
        onDateTimeChange={(dt) => onPlaceDetailsChange({ endDateTime: dt })}
      />
    </>
  );
}
