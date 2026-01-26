import { Stack, TextField, Typography } from "@mui/material";
import { DateTimeFields } from "./DateTimeFields";

interface PlaceDetails {
  title: string;
  ticketInfo: string;
  openingHours: string;
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
      <TextField
        label="Title"
        required
        fullWidth
        value={placeDetails.title}
        onChange={(e) =>
          onPlaceDetailsChange({
            ...placeDetails,
            title: e.target.value,
          })
        }
        placeholder="e.g., Visit Forbidden City"
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
              ...placeDetails,
              ticketInfo: e.target.value,
            })
          }
          placeholder="e.g., ¥60, book online"
        />
        <TextField
          label="Opening Hours"
          fullWidth
          value={placeDetails.openingHours}
          onChange={(e) =>
            onPlaceDetailsChange({
              ...placeDetails,
              openingHours: e.target.value,
            })
          }
          placeholder="e.g., 9:00 AM - 5:00 PM"
        />
      </Stack>

      <DateTimeFields
        label="Start Date & Time"
        timezone={placeDetails.startTimezone}
        dateTime={placeDetails.startDateTime}
        required
        onTimezoneChange={(tz) =>
          onPlaceDetailsChange({ startTimezone: tz })
        }
        onDateTimeChange={(dt) =>
          onPlaceDetailsChange({ startDateTime: dt })
        }
      />

      <DateTimeFields
        label="End Date & Time"
        timezone={placeDetails.endTimezone}
        dateTime={placeDetails.endDateTime}
        onTimezoneChange={(tz) =>
          onPlaceDetailsChange({ endTimezone: tz })
        }
        onDateTimeChange={(dt) =>
          onPlaceDetailsChange({ endDateTime: dt })
        }
      />
    </>
  );
}
