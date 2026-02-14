import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { TransportMode } from "@itinavi/schema";
import { TRANSPORT_MODES } from "@/lib/constants/itinerary";
import { DateTimeFields } from "./DateTimeFields";

interface TransportDetails {
  title: string;
  mode: TransportMode;
  startTimezone: string;
  startDateTime: string;
  endTimezone: string;
  endDateTime: string;
}

interface TransportFieldsProps {
  transportDetails: TransportDetails;
  onTransportDetailsChange: (details: Partial<TransportDetails>) => void;
}

export function TransportFields({
  transportDetails,
  onTransportDetailsChange,
}: TransportFieldsProps) {
  return (
    <>
      <TextField
        label="Title"
        required
        fullWidth
        value={transportDetails.title}
        onChange={(e) =>
          onTransportDetailsChange({
            ...transportDetails,
            title: e.target.value,
          })
        }
        placeholder="e.g., Metro to Summer Palace"
      />
      <FormControl fullWidth>
        <InputLabel>Transport Mode</InputLabel>
        <Select
          value={transportDetails.mode}
          label="Transport Mode"
          onChange={(e) =>
            onTransportDetailsChange({
              ...transportDetails,
              mode: e.target.value as TransportMode,
            })
          }
        >
          {TRANSPORT_MODES.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DateTimeFields
        label="Start Date & Time"
        timezone={transportDetails.startTimezone}
        dateTime={transportDetails.startDateTime}
        required
        onTimezoneChange={(tz) =>
          onTransportDetailsChange({ startTimezone: tz })
        }
        onDateTimeChange={(dt) =>
          onTransportDetailsChange({ startDateTime: dt })
        }
      />

      <DateTimeFields
        label="End Date & Time"
        timezone={transportDetails.endTimezone}
        dateTime={transportDetails.endDateTime}
        onTimezoneChange={(tz) => onTransportDetailsChange({ endTimezone: tz })}
        onDateTimeChange={(dt) => onTransportDetailsChange({ endDateTime: dt })}
      />
    </>
  );
}
