import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { COMMON_TIMEZONES } from "@itinavi/schema";

interface DateTimeFieldsProps {
  label: string;
  timezone: string;
  dateTime: string;
  required?: boolean;
  onTimezoneChange: (timezone: string) => void;
  onDateTimeChange: (dateTime: string) => void;
}

export function DateTimeFields({
  label,
  timezone,
  dateTime,
  required = false,
  onTimezoneChange,
  onDateTimeChange,
}: DateTimeFieldsProps) {
  return (
    <Stack direction="row" spacing={2}>
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>Timezone</InputLabel>
        <Select
          value={timezone}
          label="Timezone"
          onChange={(e) => onTimezoneChange(e.target.value)}
        >
          {COMMON_TIMEZONES.map((tz) => (
            <MenuItem key={tz.value} value={tz.value}>
              {tz.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label={label}
        type="datetime-local"
        required={required}
        sx={{ flex: 2 }}
        value={dateTime}
        onChange={(e) => onDateTimeChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </Stack>
  );
}
