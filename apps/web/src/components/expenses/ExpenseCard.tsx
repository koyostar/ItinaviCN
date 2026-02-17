import {
  EXPENSE_CATEGORY_ICONS,
  EXPENSE_CATEGORY_LABELS,
  getExpenseCategoryChipSx,
  getExpenseCategoryIconColor,
} from "@/lib/constants/expense";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { BiTransfer } from "react-icons/bi";
import { MdPayment, MdPerson } from "react-icons/md";

interface ExpenseCardProps {
  expense: ExpenseResponse;
  linkedItem?: ItineraryItemResponse;
  tripId: string;
  originCurrency?: string;
  onEdit: (expense: ExpenseResponse) => void;
  onDelete: (id: string) => void;
  onSplit?: (expense: ExpenseResponse) => void;
}

export function ExpenseCard({
  expense,
  linkedItem,
  tripId,
  onSplit,
  originCurrency,
  onEdit,
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
        <Stack direction="row" spacing={2}>
          {/* Icon - vertically centered */}
          <Box display="flex" alignItems="center">
            <Icon
              sx={{
                fontSize: 32,
                color: getExpenseCategoryIconColor(expense.category),
              }}
            />
          </Box>

          {/* Main content */}
          <Stack spacing={2} sx={{ flex: 1 }}>
            {/* Chips and Actions */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1} flexWrap="wrap">
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
              </Stack>
              <Stack direction="row" spacing={1}>
                {onSplit && (
                  <Tooltip title="Manage Split">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => onSplit(expense)}
                    >
                      <BiTransfer />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(expense)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(expense.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            {/* Title and Amount */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Stack spacing={3}>
                <Typography variant="h6">{expense.title}</Typography>{" "}
                {/* Payment Info */}
                {(expense.paidByUser || expense.paymentMethod) && (
                  <Stack direction="row" spacing={3}>
                    {expense.paidByUser && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <MdPerson fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Paid by{" "}
                          {expense.paidByUser.displayName ||
                            expense.paidByUser.username}
                        </Typography>
                      </Stack>
                    )}
                    {expense.paymentMethod && (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <MdPayment fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {expense.paymentMethod}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                )}
              </Stack>
              <Stack spacing={0} textAlign="right">
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
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {originCurrency} 1 = {expense.destinationCurrency}{" "}
                    {expense.exchangeRateUsed}
                  </Typography>
                )}
              </Stack>
            </Stack>

            {/* Notes */}
            {expense.notes && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                {expense.notes}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
