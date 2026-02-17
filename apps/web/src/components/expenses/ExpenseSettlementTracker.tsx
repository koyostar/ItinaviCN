import { formatUTCDate } from "@/lib/dateUtils";
import { getUserDisplay } from "@/lib/utils/expenses";
import type { ExpenseResponse, UserInfo } from "@itinavi/schema";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

interface ExpenseSettlementTrackerProps {
  expenses: ExpenseResponse[];
  members: UserInfo[];
  currentUserId?: string;
  onSettle: (expenseId: string, userId: string) => Promise<void>;
  onUnsettle: (expenseId: string, userId: string) => Promise<void>;
  onBatchSettle: (fromUserId: string, toUserId: string) => Promise<void>;
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
  onUnsettle,
  onBatchSettle,
  settling,
}: ExpenseSettlementTrackerProps) {
  const [selectedPerson, setSelectedPerson] = useState<string>("all");

  // Flatten all splits from all expenses with details
  const allSplits = useMemo(() => {
    const splits: SplitDetail[] = [];

    expenses.forEach((expense) => {
      if (!expense.splits || expense.splits.length === 0) return;

      expense.splits.forEach((split) => {
        const isPayer = split.userId === expense.paidByUserId;
        splits.push({
          expenseId: expense.id,
          expenseTitle: expense.title,
          splitId: split.id,
          userId: split.userId,
          userName: getUserDisplay(split.user),
          amountOwed: split.amountOwed / 100,
          currency: expense.destinationCurrency,
          isSettled: split.isSettled || isPayer, // Auto-settle if user paid for themselves
          settledAt: split.settledAt,
          paidByUserId: expense.paidByUserId,
          paidByUserName: getUserDisplay(expense.paidByUser),
          isPayer,
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

  // Calculate per-member balances with simplified settlements
  const memberBalances = useMemo(() => {
    const balanceMap = new Map<
      string,
      {
        memberId: string;
        memberName: string;
        owes: number;
        isOwed: number;
        net: number;
        owesTo: Array<{ userId: string; name: string; amount: number }>;
        owedBy: Array<{ userId: string; name: string; amount: number }>;
        settlements: Array<{
          type: "pay" | "receive";
          userId: string;
          name: string;
          amount: number;
        }>;
      }
    >();

    // Initialize all members
    members.forEach((member) => {
      balanceMap.set(member.id, {
        memberId: member.id,
        memberName: getUserDisplay(member),
        owes: 0,
        isOwed: 0,
        net: 0,
        owesTo: [],
        owedBy: [],
        settlements: [],
      });
    });

    // Calculate from unsettled splits
    allSplits
      .filter(
        (split) => !split.isSettled && !split.isPayer && split.paidByUserId
      )
      .forEach((split) => {
        // Person who owes
        const debtor = balanceMap.get(split.userId);
        if (debtor && split.paidByUserId) {
          debtor.owes += split.amountOwed;
          debtor.net -= split.amountOwed;

          // Find or add to owesTo list
          const existing = debtor.owesTo.find(
            (o) => o.userId === split.paidByUserId
          );
          if (existing) {
            existing.amount += split.amountOwed;
          } else {
            debtor.owesTo.push({
              userId: split.paidByUserId,
              name: split.paidByUserName,
              amount: split.amountOwed,
            });
          }
        }

        // Person who is owed
        if (split.paidByUserId) {
          const creditor = balanceMap.get(split.paidByUserId);
          if (creditor) {
            creditor.isOwed += split.amountOwed;
            creditor.net += split.amountOwed;

            // Find or add to owedBy list
            const existing = creditor.owedBy.find(
              (o) => o.userId === split.userId
            );
            if (existing) {
              existing.amount += split.amountOwed;
            } else {
              creditor.owedBy.push({
                userId: split.userId,
                name: split.userName,
                amount: split.amountOwed,
              });
            }
          }
        }
      });

    // Calculate simplified settlements (offset debts between same people)
    balanceMap.forEach((balance) => {
      const settlementMap = new Map<
        string,
        { userId: string; name: string; amount: number }
      >();

      // Add amounts owed TO others (positive = you owe them)
      balance.owesTo.forEach((debt) => {
        const key = debt.userId;
        const existing = settlementMap.get(key);
        if (existing) {
          existing.amount += debt.amount;
        } else {
          settlementMap.set(key, {
            userId: debt.userId,
            name: debt.name,
            amount: debt.amount,
          });
        }
      });

      // Subtract amounts owed BY others (negative = they owe you)
      balance.owedBy.forEach((credit) => {
        const key = credit.userId;
        const existing = settlementMap.get(key);
        if (existing) {
          existing.amount -= credit.amount;
        } else {
          settlementMap.set(key, {
            userId: credit.userId,
            name: credit.name,
            amount: -credit.amount,
          });
        }
      });

      // Convert to settlements array
      const settlements: Array<{
        type: "pay" | "receive";
        userId: string;
        name: string;
        amount: number;
      }> = [];
      settlementMap.forEach((data) => {
        if (data.amount > 0) {
          // Positive = you need to pay them
          settlements.push({
            type: "pay",
            userId: data.userId,
            name: data.name,
            amount: data.amount,
          });
        } else if (data.amount < 0) {
          // Negative = they need to pay you
          settlements.push({
            type: "receive",
            userId: data.userId,
            name: data.name,
            amount: Math.abs(data.amount),
          });
        }
      });

      balance.settlements = settlements;
    });

    return Array.from(balanceMap.values()).filter(
      (b) => b.owes > 0 || b.isOwed > 0
    );
  }, [allSplits, members]);

  // Filter splits based on selected person
  const filteredSplits = useMemo(() => {
    if (selectedPerson === "all") return allSplits;
    return allSplits.filter(
      (split) =>
        split.userId === selectedPerson || split.paidByUserId === selectedPerson
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
        {/* Outstanding Balances Summary */}
        {memberBalances.length > 0 && (
          <Box>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              mt={1}
              useFlexGap
            >
              {/* Show All Card */}
              <Card
                variant="outlined"
                sx={{
                  minWidth: 200,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: selectedPerson === "all" ? 2 : 1,
                  borderColor:
                    selectedPerson === "all" ? "primary.main" : "divider",
                  bgcolor:
                    selectedPerson === "all"
                      ? "action.selected"
                      : "transparent",
                  "&:hover": {
                    boxShadow: 2,
                    borderColor: "primary.main",
                  },
                }}
                onClick={() => setSelectedPerson("all")}
              >
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    All People
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View all settlements
                  </Typography>
                </CardContent>
              </Card>

              {memberBalances.map((balance) => (
                <Card
                  key={balance.memberId}
                  variant="outlined"
                  sx={{
                    minWidth: 220,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: selectedPerson === balance.memberId ? 2 : 1,
                    borderColor:
                      selectedPerson === balance.memberId
                        ? "primary.main"
                        : "divider",
                    bgcolor:
                      selectedPerson === balance.memberId
                        ? "action.selected"
                        : "transparent",
                    "&:hover": {
                      boxShadow: 2,
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => setSelectedPerson(balance.memberId)}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight="bold"
                    >
                      {balance.memberName}
                      {balance.memberId === currentUserId && " (You)"}
                    </Typography>

                    <Stack spacing={1.5} mt={1}>
                      {/* Settlements - who to pay */}
                      {balance.settlements.filter((s) => s.type === "pay")
                        .length > 0 && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="medium"
                            display="block"
                            mb={0.5}
                          >
                            To Pay:
                          </Typography>
                          <Stack spacing={0.5}>
                            {balance.settlements
                              .filter((s) => s.type === "pay")
                              .map((settlement, idx) => (
                                <Stack
                                  key={idx}
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  gap={1}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Typography
                                    variant="caption"
                                    color="error.main"
                                    display="flex"
                                    alignItems="center"
                                    gap={0.5}
                                    fontWeight="medium"
                                  >
                                    <ArrowForwardIcon fontSize="small" />
                                    {settlement.name} $
                                    {settlement.amount.toFixed(2)}
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      onBatchSettle(
                                        balance.memberId,
                                        settlement.userId
                                      )
                                    }
                                    disabled={settling}
                                    sx={{
                                      minWidth: 60,
                                      fontSize: "0.7rem",
                                      py: 0.25,
                                    }}
                                  >
                                    Settle
                                  </Button>
                                </Stack>
                              ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Settlements - who needs to pay you */}
                      {balance.settlements.filter((s) => s.type === "receive")
                        .length > 0 && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="medium"
                            display="block"
                            mb={0.5}
                          >
                            To Receive:
                          </Typography>
                          <Stack spacing={0.5}>
                            {balance.settlements
                              .filter((s) => s.type === "receive")
                              .map((settlement, idx) => (
                                <Typography
                                  key={idx}
                                  variant="body2"
                                  color="success.main"
                                  display="flex"
                                  alignItems="center"
                                  gap={0.5}
                                  fontWeight="bold"
                                >
                                  <ArrowBackIcon fontSize="small" />
                                  {settlement.name} $
                                  {settlement.amount.toFixed(2)}
                                </Typography>
                              ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Show all settled if no settlements */}
                      {balance.settlements.length === 0 && (
                        <Typography
                          variant="body2"
                          color="success.main"
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                        >
                          <CheckCircleIcon fontSize="small" />
                          All settled
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        <Divider />

        {/* Settlement Details Table */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Settlement Details
            </Typography>
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
          <Box
            sx={{ 
              border: 1, 
              borderColor: "divider", 
              borderRadius: 1, 
              mt: 1,
              overflowX: { xs: "auto", sm: "visible" },
              WebkitOverflowScrolling: "touch"
            }}
          >
            <Table size="small" sx={{ minWidth: { xs: 600, sm: "auto" } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Expense</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Person</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Paid By</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Amount</TableCell>
                  <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Action</TableCell>
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
                    const hasPermission =
                      !split.isPayer && // Can't settle/unsettle if you paid for yourself
                      (currentUserId === split.paidByUserId ||
                        split.isCurrentUser);
                    const canSettle = !split.isSettled && hasPermission;
                    const canUnsettle = split.isSettled && hasPermission;

                    return (
                      <TableRow
                        key={split.splitId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          bgcolor: split.isPayer
                            ? "action.hover"
                            : "transparent",
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 150, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            {split.expenseTitle}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {split.userName}
                              {split.isCurrentUser && " (You)"}
                            </Typography>
                            {split.isPayer && (
                              <Chip
                                label="Payer"
                                size="small"
                                color="primary"
                                sx={{ height: 18, fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {split.paidByUserName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {split.currency} {split.amountOwed.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {split.isSettled ? (
                            <Tooltip
                              title={
                                split.settledAt
                                  ? `Settled on ${formatUTCDate(
                                      split.settledAt,
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}`
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
                              <Typography
                                variant="caption"
                                color="warning.main"
                              >
                                Pending
                              </Typography>
                            </Stack>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {split.isSettled
                            ? // Show Undo button for settled splits
                              canUnsettle && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="warning"
                                  sx={{ py: 0.2 }}
                                  onClick={() =>
                                    onUnsettle(split.expenseId, split.userId)
                                  }
                                  disabled={settling}
                                >
                                  Undo
                                </Button>
                              )
                            : // Show Settle button for unsettled splits
                              canSettle && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="success"
                                  sx={{ py: 0.2 }}
                                  onClick={() =>
                                    onSettle(split.expenseId, split.userId)
                                  }
                                  disabled={settling}
                                >
                                  Settle
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
            💡 Tip: Payer and individual persons can mark their own splits as
            settled.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
