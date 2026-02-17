"use client";

import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { ExpenseCategoryFilter } from "@/components/expenses/ExpenseCategoryFilter";
import { ExpenseEditForm } from "@/components/expenses/ExpenseEditForm";
import { ExpenseBalanceTracker } from "@/components/expenses/ExpenseBalanceTracker";
import { ExpenseSettlementTracker } from "@/components/expenses/ExpenseSettlementTracker";
import { ExpenseSplitManager } from "@/components/expenses/ExpenseSplitManager";
import { ExpenseSummaryCards } from "@/components/expenses/ExpenseSummaryCards";
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
  useTripMembers,
} from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import {
  calculateTotalsByCurrency,
  groupExpensesByDate,
  mapSplitsToInput,
} from "@/lib/utils/expenses";
import type {
  BalanceSummary,
  ExpenseResponse,
  ExpenseSplitInput,
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
import { use, useState, useEffect } from "react";

export default function ExpensesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { user } = useAuth();

  const { trip, loading: tripLoading } = useTrip(tripId);
  const { expenses, loading, error, refetch } = useExpenses(tripId);
  const { items: itineraryItems } = useItineraryItems(tripId);
  const { members } = useTripMembers(tripId);
  const [myBalance, setMyBalance] = useState<BalanceSummary | null>(null);
  const [tripBalances, setTripBalances] = useState<Record<string, Record<string, number>>>({});

  // Fetch balance data
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const [balanceData, tripBalanceData] = await Promise.all([
          api.expenses.getMyBalance(tripId),
          api.expenses.getTripBalances(tripId),
        ]);
        setMyBalance(balanceData as BalanceSummary);
        setTripBalances(tripBalanceData as Record<string, Record<string, number>>);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
        setMyBalance(null);
        setTripBalances({});
      }
    };

    if (tripId) {
      fetchBalance();
    }
  }, [tripId, expenses]); // Re-fetch when expenses change

  const deleteConfirmation = useDeleteConfirmation(async (id) => {
    await api.expenses.delete(tripId, id);
  }, refetch);

  const editDialog = useEditDialog<ExpenseResponse>();
  const splitDialog = useEditDialog<ExpenseResponse>();
  const [settlementDialogOpen, setSettlementDialogOpen] = useState(false);
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [splits, setSplits] = useState<ExpenseSplitInput[]>([]);
  const [settling, setSettling] = useState(false);

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

      if (!formData.title || !formData.amount || !formData.expenseDateTime) {
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
        paidByUserId: formData.paidByUserId || undefined,
        paymentMethod: formData.paymentMethod,
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
    if (
      formData.expenseDateTime &&
      formData.destinationCurrency &&
      trip?.originCurrency
    ) {
      const expenseDate = new Date(formData.expenseDateTime)
        .toISOString()
        .split("T")[0];
      fetchRate(trip.originCurrency, formData.destinationCurrency, expenseDate);
    }
  };

  const handleOpenSplit = (expense: ExpenseResponse) => {
    splitDialog.openEdit(expense);
    setSplits(
      expense.splits && expense.splits.length > 0
        ? mapSplitsToInput(expense.splits)
        : []
    );
  };

  const {
    handleSubmit: submitSplit,
    submitting: splitSubmitting,
    error: splitSubmitError,
  } = useFormSubmit(
    async (_: void) => {
      if (!splitDialog.item) return;

      const payload: UpdateExpenseRequest = {
        splits,
      };

      await api.expenses.update(tripId, splitDialog.item.id, payload);
      await refetch();
      splitDialog.closeEdit();
      setSplits([]);
    },
    { onSuccess: () => {} }
  );

  const handleSplitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSplit(undefined as void);
  };

  const handleOpenSettlement = () => {
    setSettlementDialogOpen(true);
  };

  const handleSettle = async (expenseId: string, userId: string) => {
    try {
      setSettling(true);
      await api.expenses.settleSplit(
        tripId,
        expenseId,
        userId
      );
      await refetch();
    } catch (error) {
      console.error("Failed to settle split:", error);
    } finally {
      setSettling(false);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (filterCategory !== "all" && expense.category !== filterCategory)
      return false;
    return true;
  });

  const groupedByDate = groupExpensesByDate(filteredExpenses);
  const totalsByCurrency = calculateTotalsByCurrency(expenses);
  
  // Calculate settlement statistics
  const allSplits = expenses.flatMap(expense => expense.splits || []);
  const totalSplits = allSplits.length;
  const settledSplits = allSplits.filter(split => split.isSettled).length;

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
        <ExpenseSummaryCards 
          totalsByCurrency={totalsByCurrency}
          totalSplits={totalSplits}
          settledSplits={settledSplits}
          onSettlementClick={handleOpenSettlement}
          myBalance={myBalance}
          onBalanceClick={() => setBalanceDialogOpen(true)}
        />

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
                        onSplit={handleOpenSplit}
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
            trip={trip ?? undefined}
            itineraryItems={itineraryItems}
            availableUsers={members}
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

        <FormDialog
          open={splitDialog.open}
          title="Manage Expense Split"
          onClose={splitDialog.closeEdit}
        >
          <Box component="form" onSubmit={handleSplitSubmit}>
            <Stack spacing={3}>
              {splitSubmitError && (
                <Typography color="error" variant="body2">
                  {splitSubmitError}
                </Typography>
              )}

              {splitDialog.item && (
                <ExpenseSplitManager
                  splits={splits}
                  totalAmount={splitDialog.item.amountDestinationMinor}
                  currency={splitDialog.item.destinationCurrency}
                  availableUsers={members}
                  paidByUserId={splitDialog.item.paidByUserId || undefined}
                  paidByUser={splitDialog.item.paidByUser}
                  paymentMethod={splitDialog.item.paymentMethod || undefined}
                  expenseTitle={splitDialog.item.title}
                  onChange={setSplits}
              />
              )}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={splitDialog.closeEdit}
                  disabled={splitSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={splitSubmitting}
                >
                  {splitSubmitting ? "Saving..." : "Save Split"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </FormDialog>

        <FormDialog
          open={settlementDialogOpen}
          title="Manage Settlements"
          onClose={() => setSettlementDialogOpen(false)}
          maxWidth="md"
        >
          <ExpenseSettlementTracker
            expenses={expenses}
            members={members}
            currentUserId={user?.id}
            onSettle={handleSettle}
            settling={settling}
          />
        </FormDialog>

        <FormDialog
          open={balanceDialogOpen}
          title="Expense Balances"
          onClose={() => setBalanceDialogOpen(false)}
          maxWidth="md"
        >
          <ExpenseBalanceTracker
            myBalance={myBalance}
            tripBalances={tripBalances}
            members={members}
          />
        </FormDialog>
      </Stack>
    </Container>
  );
}
