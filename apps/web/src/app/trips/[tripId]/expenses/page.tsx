"use client";

import {
  ExpenseCard,
  ExpenseCategoryFilter,
  ExpenseSummaryCards,
} from "@/components/expenses";
import {
  ConfirmDialog,
  FormDialog,
  PageErrorState,
  PageHeader,
  PageLoadingState,
} from "@/components/ui";
import {
  useDeleteConfirmation,
  useEditDialog,
  useExchangeRate,
  useExpenses,
  useFormSubmit,
  useItineraryItems,
  useTrip,
} from "@/hooks";
import { api } from "@/lib/api";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import {
  calculateTotalsByCurrency,
  groupExpensesByDate,
} from "@/lib/utils/expenses";
import type {
  ExpenseCategory,
  ExpenseResponse,
  UpdateExpenseRequest,
} from "@itinavi/schema";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function ExpensesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { trip, loading: tripLoading } = useTrip(tripId);
  const { expenses, loading, error, refetch } = useExpenses(tripId);
  const { items: itineraryItems } = useItineraryItems(tripId);

  const deleteConfirmation = useDeleteConfirmation(async (id) => {
    await api.expenses.delete(tripId, id);
  }, refetch);

  const editDialog = useEditDialog<ExpenseResponse>();
  const {
    rate,
    loading: rateLoading,
    error: rateError,
    fetchRate,
  } = useExchangeRate();

  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Other" as ExpenseCategory,
    expenseDateTime: "",
    amount: "",
    destinationCurrency: "",
    exchangeRateUsed: "",
    linkedItineraryItemId: "",
    notes: "",
  });

  // Update form when editing an expense
  useEffect(() => {
    if (editDialog.item) {
      const dateTime = new Date(editDialog.item.expenseDateTime);
      const localDateTime = new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setEditFormData({
        title: editDialog.item.title,
        category: editDialog.item.category,
        expenseDateTime: localDateTime,
        amount: (editDialog.item.amountDestinationMinor / 100).toString(),
        destinationCurrency: editDialog.item.destinationCurrency,
        exchangeRateUsed: editDialog.item.exchangeRateUsed?.toString() || "",
        linkedItineraryItemId: editDialog.item.linkedItineraryItemId || "",
        notes: editDialog.item.notes || "",
      });
    }
  }, [editDialog.item]);

  // Update form when rate is manually fetched
  useEffect(() => {
    if (rate !== null) {
      setEditFormData((prev) => ({ ...prev, exchangeRateUsed: rate.toString() }));
    }
  }, [rate]);

  const { handleSubmit: submitEdit, submitting, error: submitError } = useFormSubmit(
    async (_: void) => {
      if (!editDialog.item) return;

      if (!editFormData.title || !editFormData.amount || !editFormData.expenseDateTime) {
        throw new Error("Please fill in all required fields");
      }

      const amountValue = parseFloat(editFormData.amount);
      if (isNaN(amountValue) || amountValue < 0) {
        throw new Error("Please enter a valid amount");
      }

      let exchangeRate = editFormData.exchangeRateUsed
        ? parseFloat(editFormData.exchangeRateUsed)
        : undefined;

      if (
        !exchangeRate &&
        trip?.originCurrency &&
        editFormData.destinationCurrency !== trip.originCurrency
      ) {
        const expenseDate = new Date(editFormData.expenseDateTime)
          .toISOString()
          .split("T")[0];
        const fetchedRate = await fetchRate(
          trip.originCurrency,
          editFormData.destinationCurrency,
          expenseDate,
        );
        if (fetchedRate !== null) {
          exchangeRate = fetchedRate;
        }
      }

      const payload: UpdateExpenseRequest = {
        title: editFormData.title,
        category: editFormData.category,
        expenseDateTime: new Date(editFormData.expenseDateTime).toISOString(),
        amountDestinationMinor: Math.round(amountValue * 100),
        destinationCurrency: editFormData.destinationCurrency,
        ...(exchangeRate && { exchangeRateUsed: exchangeRate }),
        linkedItineraryItemId: editFormData.linkedItineraryItemId || undefined,
        notes: editFormData.notes || undefined,
      };

      await api.expenses.update(tripId, editDialog.item.id, payload);
      await refetch();
      editDialog.closeEdit();
    },
    { onSuccess: () => {} }
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEdit(undefined as void);
  };

  const categoryOptions = Object.entries(EXPENSE_CATEGORY_LABELS).map(
    ([value, label]) => ({
      value: value as ExpenseCategory,
      label,
    })
  );

  const filteredExpenses = expenses.filter((expense) => {
    if (filterCategory !== "all" && expense.category !== filterCategory)
      return false;
    return true;
  });

  const groupedByDate = groupExpensesByDate(filteredExpenses);
  const totalsByCurrency = calculateTotalsByCurrency(expenses);

  if (loading || tripLoading) {
    return <PageLoadingState message="Loading expenses..." />;
  }

  if (error) {
    return <PageErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Expenses"
          backButton={{
            onClick: () => router.push(`/trips/${tripId}`),
          }}
          action={{
            label: "Add Expense",
            href: `/trips/${tripId}/expenses/new`,
          }}
        />

        {/* Summary Cards */}
        <ExpenseSummaryCards totalsByCurrency={totalsByCurrency} />

        {/* Filter */}
        <ExpenseCategoryFilter
          value={filterCategory}
          onChange={setFilterCategory}
        />

        {/* Expenses List */}
        {Object.keys(groupedByDate).length === 0 ? (
          <Card>
            <CardContent>
              <Stack alignItems="center" spacing={2} py={4}>
                <Typography variant="h6" color="text.secondary">
                  No expenses yet
                </Typography>
                <Typography color="text.secondary">
                  Track your spending by adding expenses
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  href={`/trips/${tripId}/expenses/new`}
                >
                  Add Expense
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {Object.entries(groupedByDate).map(([date, dateExpenses]) => (
              <Box key={date}>
                <Typography variant="h6" mb={2} color="primary">
                  {date}
                </Typography>
                <Stack spacing={2}>
                  {dateExpenses.map((expense) => {
                    const linkedItem = expense.linkedItineraryItemId
                      ? itineraryItems.find(
                          (item) => item.id === expense.linkedItineraryItemId
                        )
                      : undefined;

                    return (
                      <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        linkedItem={linkedItem}
                        tripId={tripId}
                        originCurrency={trip?.originCurrency}
                        onEdit={editDialog.openEdit}
                        onDelete={deleteConfirmation.handleDelete}
                      />
                    );
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        <ConfirmDialog
          open={deleteConfirmation.open}
          onCancel={deleteConfirmation.handleCancel}
          onConfirm={deleteConfirmation.handleConfirm}
          title="Delete Expense"
          message="Are you sure you want to delete this expense? This action cannot be undone."
          confirmLabel="Delete"
          confirmColor="error"
          loading={deleteConfirmation.loading}
        />

        <FormDialog
          open={editDialog.open}
          title="Edit Expense"
          onClose={editDialog.closeEdit}
        >
          <Box component="form" onSubmit={handleEditSubmit}>
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
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                placeholder="e.g., Hotel Stay, Taxi to Airport"
              />

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editFormData.category}
                  label="Category"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
                value={editFormData.expenseDateTime}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, expenseDateTime: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Amount"
                  type="number"
                  required
                  fullWidth
                  value={editFormData.amount}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, amount: e.target.value })
                  }
                  placeholder="e.g., 150.50"
                  inputProps={{ step: "0.01", min: "0" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {editFormData.destinationCurrency}
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth required>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={editFormData.destinationCurrency}
                    label="Currency"
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
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

              <Stack direction="row" spacing={2} alignItems="flex-start">
                <TextField
                  label="Exchange Rate"
                  type="number"
                  fullWidth
                  value={editFormData.exchangeRateUsed}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      exchangeRateUsed: e.target.value,
                    })
                  }
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
                  onClick={() => {
                    if (
                      editFormData.expenseDateTime &&
                      editFormData.destinationCurrency &&
                      trip?.originCurrency
                    ) {
                      const expenseDate = new Date(editFormData.expenseDateTime)
                        .toISOString()
                        .split("T")[0];
                      fetchRate(
                        trip.originCurrency,
                        editFormData.destinationCurrency,
                        expenseDate
                      );
                    }
                  }}
                  disabled={
                    rateLoading ||
                    !editFormData.expenseDateTime ||
                    !trip?.originCurrency
                  }
                  sx={{ mt: 1, minWidth: 120 }}
                >
                  {rateLoading ? "Fetching..." : "Fetch Rate"}
                </Button>
              </Stack>

              <FormControl fullWidth>
                <InputLabel>Link to Itinerary Item</InputLabel>
                <Select
                  value={editFormData.linkedItineraryItemId}
                  label="Link to Itinerary Item"
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
                value={editFormData.notes}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, notes: e.target.value })
                }
                placeholder="Any additional details about this expense"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={editDialog.closeEdit}
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
        </FormDialog>
      </Stack>
    </Container>
  );
}
