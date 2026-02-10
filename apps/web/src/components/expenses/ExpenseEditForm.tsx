import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  ExpenseCategory,
  ItineraryItemResponse,
  TripResponse,
} from "@itinavi/schema";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";

interface ExpenseEditFormProps {
  formData: {
    title: string;
    category: ExpenseCategory;
    expenseDateTime: string;
    amount: string;
    destinationCurrency: string;
    exchangeRateUsed: string;
    linkedItineraryItemId: string;
    notes: string;
  };
  trip: TripResponse | undefined;
  itineraryItems: ItineraryItemResponse[];
  rateLoading: boolean;
  rateError: string | null;
  submitError: string | null;
  submitting: boolean;
  onFieldChange: <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => void;
  onFetchRate: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ExpenseEditForm({
  formData,
  trip,
  itineraryItems,
  rateLoading,
  rateError,
  submitError,
  submitting,
  onFieldChange,
  onFetchRate,
  onSubmit,
  onCancel,
}: ExpenseEditFormProps) {
  const categoryOptions = Object.entries(EXPENSE_CATEGORY_LABELS).map(
    ([value, label]) => ({
      value: value as ExpenseCategory,
      label,
    })
  );

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={3}>
        {submitError && (
          <Typography color="error" variant="body2">
            {submitError}
          </Typography>
        )}

        <TextField
          label="Title"
          required
          fullWidth
          value={formData.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          placeholder="e.g., Hotel Stay, Taxi to Airport"
        />

        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            label="Category"
            onChange={(e) =>
              onFieldChange("category", e.target.value as ExpenseCategory)
            }
          >
            {categoryOptions.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Date & Time"
          type="datetime-local"
          required
          fullWidth
          value={formData.expenseDateTime}
          onChange={(e) => onFieldChange("expenseDateTime", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Stack direction="row" spacing={2}>
          <TextField
            label="Amount"
            type="number"
            required
            fullWidth
            value={formData.amount}
            onChange={(e) => onFieldChange("amount", e.target.value)}
            placeholder="e.g., 150.50"
            inputProps={{ step: "0.01", min: "0" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {formData.destinationCurrency}
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth required>
            <InputLabel>Currency</InputLabel>
            <Select
              value={formData.destinationCurrency}
              label="Currency"
              onChange={(e) =>
                onFieldChange("destinationCurrency", e.target.value)
              }
            >
              <MenuItem value={trip?.destinationCurrency || "CNY"}>
                {trip?.destinationCurrency || "CNY"} (Destination)
              </MenuItem>
              <MenuItem value={trip?.originCurrency || "SGD"}>
                {trip?.originCurrency || "SGD"} (Origin)
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField
            label="Exchange Rate"
            type="number"
            fullWidth
            value={formData.exchangeRateUsed}
            onChange={(e) => onFieldChange("exchangeRateUsed", e.target.value)}
            placeholder="Optional - e.g., 1.25"
            inputProps={{ step: "0.000001", min: "0" }}
            helperText={
              rateError
                ? rateError
                : "Fetched when saving if empty, or manually enter"
            }
            error={!!rateError}
          />
          <Button
            variant="outlined"
            onClick={onFetchRate}
            disabled={rateLoading || !formData.expenseDateTime || !trip?.originCurrency}
            sx={{ mt: 1, minWidth: 120 }}
          >
            {rateLoading ? "Fetching..." : "Fetch Rate"}
          </Button>
        </Stack>

        <FormControl fullWidth>
          <InputLabel>Link to Itinerary Item</InputLabel>
          <Select
            value={formData.linkedItineraryItemId}
            label="Link to Itinerary Item"
            onChange={(e) =>
              onFieldChange("linkedItineraryItemId", e.target.value)
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {itineraryItems.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.type}: {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Notes"
          fullWidth
          multiline
          rows={4}
          value={formData.notes}
          onChange={(e) => onFieldChange("notes", e.target.value)}
          placeholder="Any additional details about this expense"
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
