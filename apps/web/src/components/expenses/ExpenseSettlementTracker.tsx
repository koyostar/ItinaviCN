import type { ExpenseResponse, UserInfo } from "@itinavi/schema";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { formatUTCDate } from "@/lib/dateUtils";
import { getUserDisplay } from "@/lib/utils/expenses";
import { useState, useMemo } from "react";

interface ExpenseSettlementTrackerProps {
  expenses: ExpenseResponse[];
  members: UserInfo[];
  currentUserId?: string;
  onSettle: (expenseId: string, userId: string) => Promise<void>;
  settling?: boolean;
}

interface SplitDetail {
  expenseId: string;
  expenseTitle: string;
  splitId: string;
  userId: string;
  userName: string;
  amountOwed: number;
  currency: string;
  isSettled: boolean;
  settledAt?: string | null;
  paidByUserId: string | null;
  paidByUserName: string;
  isPayer: boolean;
  isCurrentUser: boolean;
}

interface Balance {
  from: string;
  to: string;
  amount: number;
  currency: string;
}

export function ExpenseSettlementTracker({
  expenses,
  members,
  currentUserId,
  onSettle,
  settling,
}: ExpenseSettlementTrackerProps) {
  const [selectedPerson, setSelectedPerson] = useState<string>("all");

  // Flatten all splits from all expenses with details
  const allSplits = useMemo(() => {
    const splits: SplitDetail[] = [];
    
    expenses.forEach((expense) => {
      if (!expense.splits || expense.splits.length === 0) return;
      
      expense.splits.forEach((split) => {
        splits.push({
          expenseId: expense.id,
          expenseTitle: expense.title,
          splitId: split.id,
          userId: split.userId,
          userName: getUserDisplay(split.user),
          amountOwed: split.amountOwed / 100,
          currency: expense.destinationCurrency,
          isSettled: split.isSettled,
          settledAt: split.settledAt,
          paidByUserId: expense.paidByUserId,
          paidByUserName: getUserDisplay(expense.paidByUser),
          isPayer: split.userId === expense.paidByUserId,
          isCurrentUser: split.userId === currentUserId,
        });
      });
    });
    
    return splits;
  }, [expenses, currentUserId]);

  // Calculate aggregated balances (who owes who)
  const balances = useMemo(() => {
    const balanceMap = new Map<string, Balance>();
    
    allSplits
      .filter((split) => !split.isSettled && !split.isPayer)
      .forEach((split) => {
        const key = `${split.userId}->${split.paidByUserId}-${split.currency}`;
        
        if (balanceMap.has(key)) {
          const existing = balanceMap.get(key)!;
          existing.amount += split.amountOwed;
        } else {
          balanceMap.set(key, {
            from: split.userName,
            to: split.paidByUserName,
            amount: split.amountOwed,
            currency: split.currency,
          });
        }
      });
    
    return Array.from(balanceMap.values());
  }, [allSplits]);

  // Filter splits based on selected person
  const filteredSplits = useMemo(() => {
    if (selectedPerson === "all") return allSplits;
    return allSplits.filter(
      (split) => split.userId === selectedPerson || split.paidByUserId === selectedPerson
    );
  }, [allSplits, selectedPerson]);

  const totalSplits = filteredSplits.length;
  const settledSplits = filteredSplits.filter((s) => s.isSettled).length;
  const allSettled = totalSplits > 0 && settledSplits === totalSplits;

  if (allSplits.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No expense splits to settle.
      </Typography>
    );
  }

  return (
    <Box>
      <Stack spacing={3}>
        {/* Filter and Summary Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Person</InputLabel>
            <Select
              value={selectedPerson}
              label="Filter by Person"
              onChange={(e) => setSelectedPerson(e.target.value)}
            >
              <MenuItem value="all">All People</MenuItem>
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {getUserDisplay(member)}
                  {member.id === currentUserId && " (You)"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Chip
            icon={allSettled ? <CheckCircleIcon /> : <PendingIcon />}
            label={
              allSettled
                ? "All Settled"
                : `${settledSplits}/${totalSplits} Settled`
            }
            color={allSettled ? "success" : "warning"}
            size="small"
          />
        </Stack>

        {/* Outstanding Balances Summary */}
        {balances.length > 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Outstanding Balances
              </Typography>
              <Stack spacing={1} mt={1}>
                {balances.map((balance, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    <strong>{balance.from}</strong> owes <strong>{balance.to}</strong>:{" "}
                    {balance.currency} {balance.amount.toFixed(2)}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        <Divider />

        {/* Settlement Details Table */}
        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Settlement Details
          </Typography>
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, mt: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Expense</TableCell>
                  <TableCell>Person</TableCell>
                  <TableCell>Paid By</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSplits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" py={2}>
                        No settlements found for this filter.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSplits.map((split) => {
                    const canSettle =
                      !split.isSettled &&
                      (currentUserId === split.paidByUserId || split.isCurrentUser);

                    return (
                      <TableRow
                        key={split.splitId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          bgcolor: split.isPayer ? "action.hover" : "transparent",
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {split.expenseTitle}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2">
                              {split.userName}
                              {split.isCurrentUser && " (You)"}
                            </Typography>
                            {split.isPayer && (
                              <Chip
                                label="Payer"
                                size="small"
                                color="primary"
                                sx={{ height: 18, fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {split.paidByUserName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {split.currency} {split.amountOwed.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {split.isSettled ? (
                            <Tooltip
                              title={
                                split.settledAt
                                  ? `Settled on ${formatUTCDate(split.settledAt, "en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}`
                                  : "Settled"
                              }
                            >
                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                                justifyContent="center"
                              >
                                <CheckCircleIcon
                                  fontSize="small"
                                  color="success"
                                  sx={{ fontSize: 16 }}
                                />
                                <Typography
                                  variant="caption"
                                  color="success.main"
                                >
                                  Settled
                                </Typography>
                              </Stack>
                            </Tooltip>
                          ) : (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                              justifyContent="center"
                            >
                              <PendingIcon
                                fontSize="small"
                                color="warning"
                                sx={{ fontSize: 16 }}
                              />
                              <Typography variant="caption" color="warning.main">
                                Pending
                              </Typography>
                            </Stack>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {canSettle && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => onSettle(split.expenseId, split.userId)}
                              disabled={settling}
                            >
                              Mark Settled
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>

        {/* Helpful Tip */}
        {!allSettled && (
          <Typography variant="caption" color="text.secondary">
            💡 Tip: Payer and individual persons can mark their own splits as settled.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
