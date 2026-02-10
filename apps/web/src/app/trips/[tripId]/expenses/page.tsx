"use client";

import {
  ExpenseCard,
  ExpenseCategoryFilter,
  ExpenseEditForm,
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
  useExpenseEditForm,
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
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

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

  const { formData, updateField, setExchangeRate } = useExpenseEditForm(
    editDialog.item
  );

  // Update form when rate is manually fetched
  if (rate !== null) {
    setExchangeRate(rate);
  }

  const {
    handleSubmit: submitEdit,
    submitting,
    error: submitError,
  } = useFormSubmit(
    async (_: void) => {
      if (!editDialog.item) return;

      if (
        !editFormData.title ||
        !editFormData.amount ||
        !editFormData.expenseDateTime
      ) {
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
          expenseDate
        );
        if (fetchedRate !== null) {
          exchangeRate = fetchedRate;
        }
      }

      const payload: UpdateExpenseRequest = {
        tformData.title ||
        !formData.amount ||
        !formData.expenseDateTime
      ) {
        throw new Error("Please fill in all required fields");
      }

      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue < 0) {
        throw new Error("Please enter a valid amount");
      }

      let exchangeRate = formData.exchangeRateUsed
        ? parseFloat(formData.exchangeRateUsed)
        : undefined;

      if (
        !exchangeRate &&
        trip?.originCurrency &&
        formData.destinationCurrency !== trip.originCurrency
      ) {
        const expenseDate = new Date(formData.expenseDateTime)
          .toISOString()
          .split("T")[0];
        const fetchedRate = await fetchRate(
          trip.originCurrency,
          formData.destinationCurrency,
          expenseDate
        );
        if (fetchedRate !== null) {
          exchangeRate = fetchedRate;
        }
      }

      const payload: UpdateExpenseRequest = {
        title: formData.title,
        category: formData.category,
        expenseDateTime: new Date(formData.expenseDateTime).toISOString(),
        amountDestinationMinor: Math.round(amountValue * 100),
        destinationCurrency: formData.destinationCurrency,
        ...(exchangeRate && { exchangeRateUsed: exchangeRate }),
        linkedItineraryItemId: formData.linkedItineraryItemId || undefined,
        notes: formData.notes || undefined,
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

  const handleFetchRate = () => {
    if (formData.expenseDateTime && formData.destinationCurrency && trip?.originCurrency) {
      const expenseDate = new Date(formData.expenseDateTime)
        .toISOString()
        .split("T")[0];
      fetchRate(
        trip.originCurrency,
        formData.destinationCurrency,
        expenseDate
      );
    }
  }
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
          <ExpenseEditForm
            formData={formData}
            trip={trip}
            itineraryItems={itineraryItems}
            rateLoading={rateLoading}
            rateError={rateError}
            submitError={submitError}
            submitting={submitting}
            onFieldChange={updateField}
            onFetchRate={handleFetchRate}
            onSubmit={handleEditSubmit}
            onCancel={editDialog.closeEdit}
          />
        </FormDialog>
      </Stack>
    </Container>
  );
}
