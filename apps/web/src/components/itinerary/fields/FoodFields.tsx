import { Stack, TextField, Typography } from "@mui/material";
import { AmapPlaceAutocomplete } from "../../AmapPlaceAutocomplete";
import { DateTimeFields } from "./DateTimeFields";

interface FoodDetails {
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
  cuisine: string;
  openingTime: string;
  closingTime: string;
  reservationInfo: string;
  startTimezone: string;
  startDateTime: string;
  endTimezone: string;
  endDateTime: string;
}

interface FoodFieldsProps {
  foodDetails: FoodDetails;
  onFoodDetailsChange: (details: Partial<FoodDetails>) => void;
}

export function FoodFields({
  foodDetails,
  onFoodDetailsChange,
  nameLabel = "Restaurant Name",
}: FoodFieldsProps & { nameLabel?: string }) {
  return (
    <>
      <AmapPlaceAutocomplete
        label={nameLabel}
        value={foodDetails.title}
        onPlaceSelect={(place) =>
          onFoodDetailsChange({
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
        placeholder={`Search for ${nameLabel.toLowerCase()}...`}
        required
      />
      <TextField
        label="Address"
        fullWidth
        value={foodDetails.address}
        onChange={(e) =>
          onFoodDetailsChange({
            address: e.target.value,
          })
        }
        placeholder="Address will be filled automatically from search"
      />
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="primary">
          Food Details
        </Typography>
        <TextField
          label="Cuisine"
          fullWidth
          value={foodDetails.cuisine}
          onChange={(e) =>
            onFoodDetailsChange({
              ...foodDetails,
              cuisine: e.target.value,
            })
          }
          placeholder="e.g., Peking Duck, Sichuan"
        />
        <TextField
          label="Reservation Info"
          fullWidth
          value={foodDetails.reservationInfo}
          onChange={(e) =>
            onFoodDetailsChange({
              ...foodDetails,
              reservationInfo: e.target.value,
            })
          }
          placeholder="e.g., Reserved for 7 PM, Table 12"
        />
      </Stack>

      <DateTimeFields
        label="Start Date & Time"
        timezone={foodDetails.startTimezone}
        dateTime={foodDetails.startDateTime}
        required
        onTimezoneChange={(tz) => onFoodDetailsChange({ startTimezone: tz })}
        onDateTimeChange={(dt) => onFoodDetailsChange({ startDateTime: dt })}
      />

      <DateTimeFields
        label="End Date & Time"
        timezone={foodDetails.endTimezone}
        dateTime={foodDetails.endDateTime}
        onTimezoneChange={(tz) => onFoodDetailsChange({ endTimezone: tz })}
        onDateTimeChange={(dt) => onFoodDetailsChange({ endDateTime: dt })}
      />
    </>
  );
}
