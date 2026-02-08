import {
  EXPENSE_CATEGORY_ICONS,
  EXPENSE_CATEGORY_LABELS,
  getExpenseCategoryChipSx,
  getExpenseCategoryIconColor,
} from "@/lib/constants";
import type { ExpenseResponse, ItineraryItemResponse } from "@itinavi/schema";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

interface ExpenseCardProps {
  expense: ExpenseResponse;
  linkedItem?: ItineraryItemResponse;
  tripId: string;
  originCurrency?: string;
  onDelete: (id: string) => void;
}

export function ExpenseCard({
  expense,
  linkedItem,
  tripId,
  originCurrency,
  onDelete,
}: ExpenseCardProps) {
  const Icon = EXPENSE_CATEGORY_ICONS[expense.category];
  const amount = expense.amountDestinationMinor / 100;
  const originAmount =
    expense.exchangeRateUsed && originCurrency
      ? amount / expense.exchangeRateUsed
      : null;

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Icon
              sx={{
                fontSize: 32,
                color: getExpenseCategoryIconColor(expense.category),
              }}
            />
            <Box>
              <Typography variant="h6">{expense.title}</Typography>
              <Stack direction="row" spacing={1} mt={0.5}>
                <Chip
                  label={EXPENSE_CATEGORY_LABELS[expense.category]}
                  size="small"
                  sx={getExpenseCategoryChipSx(expense.category)}
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
                  <Typography variant="caption" color="text.secondary">
                    {expense.notes}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box textAlign="right">
              <Typography variant="h6">
                {expense.destinationCurrency} {amount.toFixed(2)}
              </Typography>
              {originAmount && originCurrency && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  ~{originCurrency} {originAmount.toFixed(2)}
                </Typography>
              )}
              {expense.exchangeRateUsed && (
                <Typography variant="caption" color="text.secondary">
                  {originCurrency} 1 = {expense.destinationCurrency}{" "}
                  {expense.exchangeRateUsed}
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
                onClick={() => onDelete(expense.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
