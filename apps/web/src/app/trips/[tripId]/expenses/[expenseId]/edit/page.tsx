"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  UpdateExpenseRequest,
  ExpenseCategory,
  ExpenseResponse,
} from "@itinavi/schema";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { api } from "@/lib/api";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import { useFormSubmit, useItineraryItems, useTrip } from "@/hooks";

export default function EditExpensePage({
  params,
}: {
  params: Promise<{ tripId: string; expenseId: string }>;
}) {
  const { tripId, expenseId } = use(params);
  const router = useRouter();
  const { trip } = useTrip(tripId);
  const { items: itineraryItems } = useItineraryItems(tripId);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Other" as ExpenseCategory,
    expenseDateTime: "",
    amount: "",
    destinationCurrency: "",
    exchangeRateUsed: "",
    linkedItineraryItemId: "",
    notes: "",
  });

  useEffect(() => {
    async function loadExpense() {
      try {
        setLoading(true);
        const expense = (await api.expenses.get(
          tripId,
          expenseId,
        )) as ExpenseResponse;
        setFormData({
          title: expense.title,
          category: expense.category,
          expenseDateTime: expense.expenseDateTime.slice(0, 16), // Convert to datetime-local format
          amount: (expense.amountDestinationMinor / 100).toFixed(2),
          destinationCurrency: expense.destinationCurrency,
          exchangeRateUsed: expense.exchangeRateUsed?.toString() || "",
          linkedItineraryItemId: expense.linkedItineraryItemId || "",
          notes: expense.notes || "",
        });
        setLoadError(null);
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "Failed to load expense",
        );
      } finally {
        setLoading(false);
      }
    }

    loadExpense();
  }, [tripId, expenseId]);

  const {
    handleSubmit: submitForm,
    submitting,
    error,
  } = useFormSubmit(
    async (_: void) => {
      // Validate required fields
      if (!formData.title || !formData.amount || !formData.expenseDateTime) {
        throw new Error("Please fill in all required fields");
      }

      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue < 0) {
        throw new Error("Please enter a valid amount");
      }

      const payload: UpdateExpenseRequest = {
        title: formData.title,
        category: formData.category,
        expenseDateTime: new Date(formData.expenseDateTime).toISOString(),
        amountDestinationMinor: Math.round(amountValue * 100), // Convert to cents
        destinationCurrency: formData.destinationCurrency,
        ...(formData.exchangeRateUsed && {
          exchangeRateUsed: parseFloat(formData.exchangeRateUsed),
        }),
        linkedItineraryItemId: formData.linkedItineraryItemId || undefined,
        notes: formData.notes || undefined,
      };

      await api.expenses.update(tripId, expenseId, payload);
    },
    { onSuccess: () => router.push(`/trips/${tripId}/expenses`) },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(undefined as void);
  };

  const categoryOptions = Object.entries(EXPENSE_CATEGORY_LABELS).map(
    ([value, label]) => ({
      value: value as ExpenseCategory,
      label,
    }),
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography>Loading expense...</Typography>
        </Stack>
      </Container>
    );
  }

  if (loadError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography color="error" variant="h6" gutterBottom>
              Error Loading Expense
            </Typography>
            <Typography color="error" variant="body2" mb={2}>
              {loadError}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push(`/trips/${tripId}/expenses`)}
            >
              Back to Expenses
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Edit Expense
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              <TextField
                label="Title"
                required
                fullWidth
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Hotel Stay, Taxi to Airport"
              />

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as ExpenseCategory,
                    })
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
                onChange={(e) =>
                  setFormData({ ...formData, expenseDateTime: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Amount"
                  type="number"
                  required
                  fullWidth
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
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
                      setFormData({
                        ...formData,
                        destinationCurrency: e.target.value,
                      })
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

              <TextField
                label="Exchange Rate"
                type="number"
                fullWidth
                value={formData.exchangeRateUsed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    exchangeRateUsed: e.target.value,
                  })
                }
                placeholder="Optional - e.g., 1.25"
                inputProps={{ step: "0.000001", min: "0" }}
                helperText="Exchange rate used for this transaction"
              />

              <FormControl fullWidth>
                <InputLabel>Link to Itinerary Item</InputLabel>
                <Select
                  value={formData.linkedItineraryItemId}
                  label="Link to Itinerary Item"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      linkedItineraryItemId: e.target.value,
                    })
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
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional details about this expense"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => router.push(`/trips/${tripId}/expenses`)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
