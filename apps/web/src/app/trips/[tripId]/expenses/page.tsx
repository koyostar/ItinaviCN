"use client";

import {
  ConfirmDialog,
  PageErrorState,
  PageHeader,
  PageLoadingState,
} from "@/components/ui";
import { useDeleteConfirmation, useExpenses, useItineraryItems } from "@/hooks";
import { api } from "@/lib/api";
import {
  EXPENSE_CATEGORY_ICONS,
  EXPENSE_CATEGORY_LABELS,
  getExpenseCategoryChipSx,
  getExpenseCategoryIconColor,
} from "@/lib/constants";
import { formatUTCDate } from "@/lib/dateUtils";
import type { ExpenseResponse } from "@itinavi/schema";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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

  const { expenses, loading, error, refetch } = useExpenses(tripId);
  const { items: itineraryItems } = useItineraryItems(tripId);

  const deleteConfirmation = useDeleteConfirmation(async (id) => {
    await api.expenses.delete(tripId, id);
  }, refetch);

  const filteredExpenses = expenses.filter((expense) => {
    if (filterCategory !== "all" && expense.category !== filterCategory)
      return false;
    return true;
  });

  // Group by date
  const groupedByDate = filteredExpenses.reduce(
    (acc, expense) => {
      const date = formatUTCDate(expense.expenseDateTime, "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(expense);
      return acc;
    },
    {} as Record<string, ExpenseResponse[]>,
  );

  // Calculate total per currency
  const totalsByurrency = expenses.reduce(
    (acc, expense) => {
      const currency = expense.destinationCurrency;
      if (!acc[currency]) acc[currency] = 0;
      acc[currency] += expense.amountDestinationMinor / 100; // Convert from minor units
      return acc;
    },
    {} as Record<string, number>,
  );

  if (loading) {
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
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {Object.entries(totalsByurrency).map(([currency, total]) => (
            <Card key={currency} sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Total ({currency})
                </Typography>
                <Typography variant="h4">{total.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Filter */}
        <FormControl size="small" sx={{ maxWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="Accommodation">Accommodation</MenuItem>
            <MenuItem value="Transport">Transport</MenuItem>
            <MenuItem value="Food">Food & Dining</MenuItem>
            <MenuItem value="Shop">Shopping</MenuItem>
            <MenuItem value="Attraction">Attractions</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

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
                    const Icon = EXPENSE_CATEGORY_ICONS[expense.category];
                    const amount = expense.amountDestinationMinor / 100;
                    const linkedItem = expense.linkedItineraryItemId
                      ? itineraryItems.find(
                          (item) => item.id === expense.linkedItineraryItemId,
                        )
                      : null;

                    return (
                      <Card key={expense.id}>
                        <CardContent>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Icon
                                sx={{
                                  fontSize: 32,
                                  color: getExpenseCategoryIconColor(
                                    expense.category,
                                  ),
                                }}
                              />
                              <Box>
                                <Typography variant="h6">
                                  {expense.title}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={0.5}>
                                  <Chip
                                    label={
                                      EXPENSE_CATEGORY_LABELS[expense.category]
                                    }
                                    size="small"
                                    sx={getExpenseCategoryChipSx(
                                      expense.category,
                                    )}
                                  />
                                  {linkedItem && (
                                    <Chip
                                      label={`${linkedItem.type}: ${linkedItem.title}`}
                                      size="small"
                                      variant="outlined"
                                      color="info"
                                    />
                                  )}
                                  {expense.notes && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {expense.notes}
                                    </Typography>
                                  )}
                                </Stack>
                              </Box>
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Box textAlign="right">
                                <Typography variant="h6">
                                  {expense.destinationCurrency}{" "}
                                  {amount.toFixed(2)}
                                </Typography>
                                {expense.exchangeRateUsed && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Rate: {expense.exchangeRateUsed}
                                  </Typography>
                                )}
                              </Box>
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  href={`/trips/${tripId}/expenses/${expense.id}/edit`}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    deleteConfirmation.handleDelete(expense.id)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
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
      </Stack>
    </Container>
  );
}
