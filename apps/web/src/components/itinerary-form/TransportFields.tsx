import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import type { TransportMode } from "@itinavi/schema";
import { TRANSPORT_MODES } from "@/lib/constants";

interface TransportDetails {
  title: string;
  mode: TransportMode;
}

interface TransportFieldsProps {
  transportDetails: TransportDetails;
  onTransportDetailsChange: (details: TransportDetails) => void;
}

export function TransportFields({ transportDetails, onTransportDetailsChange }: TransportFieldsProps) {
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
    </>
  );
}
