import { Stack, TextField, Typography } from "@mui/material";
import { DateTimeFields } from "./DateTimeFields";

interface PlaceVisitDetails {
  title: string;
  ticketInfo: string;
  openingHours: string;
  startTimezone: string;
  startDateTime: string;
  endTimezone: string;
  endDateTime: string;
}

interface PlaceVisitFieldsProps {
  placeVisitDetails: PlaceVisitDetails;
  onPlaceVisitDetailsChange: (details: Partial<PlaceVisitDetails>) => void;
}

export function PlaceVisitFields({
  placeVisitDetails,
  onPlaceVisitDetailsChange,
}: PlaceVisitFieldsProps) {
  return (
    <>
      <TextField
        label="Title"
        required
        fullWidth
        value={placeVisitDetails.title}
        onChange={(e) =>
          onPlaceVisitDetailsChange({
            ...placeVisitDetails,
            title: e.target.value,
          })
        }
        placeholder="e.g., Visit Forbidden City"
      />
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="primary">
          Place Visit Details
        </Typography>
        <TextField
          label="Ticket Info"
          fullWidth
          value={placeVisitDetails.ticketInfo}
          onChange={(e) =>
            onPlaceVisitDetailsChange({
              ...placeVisitDetails,
              ticketInfo: e.target.value,
            })
          }
          placeholder="e.g., ¥60, book online"
        />
        <TextField
          label="Opening Hours"
          fullWidth
          value={placeVisitDetails.openingHours}
          onChange={(e) =>
            onPlaceVisitDetailsChange({
              ...placeVisitDetails,
              openingHours: e.target.value,
            })
          }
          placeholder="e.g., 9:00 AM - 5:00 PM"
        />
      </Stack>

      <DateTimeFields
        label="Start Date & Time"
        timezone={placeVisitDetails.startTimezone}
        dateTime={placeVisitDetails.startDateTime}
        required
        onTimezoneChange={(tz) =>
          onPlaceVisitDetailsChange({ startTimezone: tz })
        }
        onDateTimeChange={(dt) =>
          onPlaceVisitDetailsChange({ startDateTime: dt })
        }
      />

      <DateTimeFields
        label="End Date & Time"
        timezone={placeVisitDetails.endTimezone}
        dateTime={placeVisitDetails.endDateTime}
        onTimezoneChange={(tz) =>
          onPlaceVisitDetailsChange({ endTimezone: tz })
        }
        onDateTimeChange={(dt) =>
          onPlaceVisitDetailsChange({ endDateTime: dt })
        }
      />
    </>
  );
}
