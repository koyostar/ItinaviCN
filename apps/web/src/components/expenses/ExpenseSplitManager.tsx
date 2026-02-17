import type { ExpenseSplitInput, UserInfo } from "@itinavi/schema";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { getUserDisplay } from "@/lib/utils/expenses";

interface ExpenseSplitManagerProps {
  splits: ExpenseSplitInput[];
  totalAmount: number;
  currency: string;
  availableUsers: UserInfo[];
  paidByUserId?: string;
  paidByUser?: UserInfo | null;
  paymentMethod?: string | null;
  expenseTitle?: string;
  onChange: (splits: ExpenseSplitInput[]) => void;
}

type SplitMode = "even" | "percentage" | "amount";

export function ExpenseSplitManager({
  splits,
  totalAmount,
  currency,
  availableUsers,
  paidByUserId,
  paidByUser,
  paymentMethod,
  expenseTitle,
  onChange,
}: ExpenseSplitManagerProps) {
  const [splitMode, setSplitMode] = useState<SplitMode>("even");
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set());

  // Initialize input splits from saved splits (or empty if new)
  const [inputSplits, setInputSplits] = useState<ExpenseSplitInput[]>(() => {
    if (splits.length > 0) {
      return [...splits]; // Copy saved splits as initial working values
    }
    return [];
  });
  const [percentages, setPercentages] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (splits.length > 0) {
      const percentPerPerson = 100 / splits.length;
      splits.forEach((split) => {
        initial[split.userId] = percentPerPerson;
      });
    }
    return initial;
  });

  const handleSplitEvenly = () => {
    if (inputSplits.length === 0) return;

    const userIds = inputSplits.map((s) => s.userId);
    const amountPerPerson = Math.floor(totalAmount / userIds.length);
    const remainder = totalAmount - amountPerPerson * userIds.length;

    const newInputSplits = userIds.map((userId, index) => ({
      userId,
      amountOwed: index === 0 ? amountPerPerson + remainder : amountPerPerson,
    }));

    setInputSplits(newInputSplits);

    // Update percentages
    const percentPerPerson = 100 / userIds.length;
    const newPercentages: Record<string, number> = {};
    userIds.forEach((userId) => {
      newPercentages[userId] = percentPerPerson;
    });
    setPercentages(newPercentages);

    // Clear all locks when splitting evenly
    setLockedFields(new Set());

    // Auto-save
    onChange(newInputSplits);

    setSplitMode("even");
  };

  const handleSplitByPercentage = () => {
    if (inputSplits.length === 0) return;

    // Calculate percentages from current input amounts
    const newPercentages: Record<string, number> = {};
    inputSplits.forEach((split) => {
      newPercentages[split.userId] =
        totalAmount > 0 ? (split.amountOwed / totalAmount) * 100 : 0;
    });

    setPercentages(newPercentages);
    setSplitMode("percentage");
  };

  const handleAddSplit = (userId: string) => {
    const existingSplit = inputSplits.find((s) => s.userId === userId);
    if (existingSplit) return;

    const newInputSplits = [...inputSplits, { userId, amountOwed: 0 }];
    setInputSplits(newInputSplits);
    onChange(newInputSplits); // Notify parent of new working state

    // Initialize percentage to 0
    setPercentages({ ...percentages, [userId]: 0 });
  };

  const handleRemoveSplit = (userId: string) => {
    const newInputSplits = inputSplits.filter((s) => s.userId !== userId);
    setInputSplits(newInputSplits);
    onChange(newInputSplits); // Notify parent of new working state

    // Remove from percentages and locks
    const newPercentages = { ...percentages };
    delete newPercentages[userId];
    setPercentages(newPercentages);

    const newLocked = new Set(lockedFields);
    newLocked.delete(userId);
    setLockedFields(newLocked);
  };

  const handleUpdateAmount = (userId: string, amount: number) => {
    const newInputSplits = inputSplits.map((s) =>
      s.userId === userId ? { ...s, amountOwed: amount } : s
    );
    setInputSplits(newInputSplits);

    // Update percentage state to keep in sync
    const newPercentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    setPercentages({ ...percentages, [userId]: newPercentage });

    // Mark this field as manually edited (locked)
    setLockedFields(new Set(lockedFields).add(userId));

    // Auto-save
    onChange(newInputSplits);

    setSplitMode("amount");
  };

  const handleAmountBlur = (userId: string) => {
    if (splitMode === "even") return; // Don't auto-distribute in even mode

    // Get unlocked fields (excluding the one just edited)
    const unlockedFields = inputSplits.filter(
      (s) => s.userId !== userId && !lockedFields.has(s.userId)
    );

    if (unlockedFields.length === 0) return; // All fields are locked

    // Calculate total of locked fields
    const lockedTotal = inputSplits
      .filter((s) => lockedFields.has(s.userId))
      .reduce((sum, s) => sum + s.amountOwed, 0);

    // Distribute remaining amount among unlocked fields
    const remaining = totalAmount - lockedTotal;
    const amountPerUnlocked = Math.floor(remaining / unlockedFields.length);
    const remainder = remaining - amountPerUnlocked * unlockedFields.length;

    const newInputSplits = inputSplits.map((s, index) => {
      if (lockedFields.has(s.userId)) return s;
      const unlockedIndex = unlockedFields.findIndex(
        (u) => u.userId === s.userId
      );
      return {
        ...s,
        amountOwed:
          unlockedIndex === 0
            ? amountPerUnlocked + remainder
            : amountPerUnlocked,
      };
    });

    setInputSplits(newInputSplits);

    // Update percentages
    const newPercentages: Record<string, number> = {};
    newInputSplits.forEach((split) => {
      newPercentages[split.userId] =
        totalAmount > 0 ? (split.amountOwed / totalAmount) * 100 : 0;
    });
    setPercentages(newPercentages);

    // Auto-save
    onChange(newInputSplits);
  };

  const handleUpdatePercentage = (userId: string, percentage: number) => {
    const newPercentages = { ...percentages, [userId]: percentage };
    setPercentages(newPercentages);

    // Calculate amount from percentage
    const amount = Math.round((totalAmount * percentage) / 100);
    const newInputSplits = inputSplits.map((s) =>
      s.userId === userId ? { ...s, amountOwed: amount } : s
    );
    setInputSplits(newInputSplits);

    // Mark this field as manually edited (locked)
    setLockedFields(new Set(lockedFields).add(userId));

    // Auto-save
    onChange(newInputSplits);
  };

  const handlePercentageBlur = (userId: string) => {
    // Get unlocked fields (excluding the one just edited)
    const unlockedFields = inputSplits.filter(
      (s) => s.userId !== userId && !lockedFields.has(s.userId)
    );

    if (unlockedFields.length === 0) return; // All fields are locked

    // Calculate total percentage of locked fields
    const lockedPercentage = Array.from(lockedFields).reduce(
      (sum, lockedUserId) => sum + (percentages[lockedUserId] || 0),
      0
    );

    // Distribute remaining percentage among unlocked fields
    const remainingPercentage = 100 - lockedPercentage;
    const percentPerUnlocked = remainingPercentage / unlockedFields.length;

    const newPercentages: Record<string, number> = { ...percentages };
    const newInputSplits = inputSplits.map((s) => {
      if (lockedFields.has(s.userId)) return s;

      newPercentages[s.userId] = percentPerUnlocked;
      const amount = Math.round((totalAmount * percentPerUnlocked) / 100);
      return { ...s, amountOwed: amount };
    });

    setPercentages(newPercentages);
    setInputSplits(newInputSplits);

    // Auto-save
    onChange(newInputSplits);
  };

  const toggleLock = (userId: string) => {
    const newLocked = new Set(lockedFields);
    if (newLocked.has(userId)) {
      newLocked.delete(userId);
    } else {
      newLocked.add(userId);
    }
    setLockedFields(newLocked);
  };

  const getUserDisplayById = (userId: string) => {
    const user = availableUsers.find((u) => u.id === userId);
    return getUserDisplay(user);
  };

  // Calculate totals from saved splits
  const totalSavedSplit = splits.reduce((sum, s) => sum + s.amountOwed, 0);

  // Calculate totals from input splits (what user is working with)
  const totalInputSplit = inputSplits.reduce((sum, s) => sum + s.amountOwed, 0);
  const remaining = totalAmount - totalInputSplit;
  const totalPercentage = Object.values(percentages).reduce(
    (sum, p) => sum + p,
    0
  );

  const availableToAdd = availableUsers.filter(
    (user) => !inputSplits.some((s) => s.userId === user.id)
  );

  return (
    <Box>
      <Stack spacing={2}>
        {/* Expense Header */}
        {(expenseTitle || paidByUser || paymentMethod) && (
          <>
            <Stack spacing={1}>
              {expenseTitle && (
                <Typography variant="h6">
                  {expenseTitle}
                </Typography>
              )}
              <Typography variant="body1" color="text.secondary">
                Total: {currency} {(totalAmount / 100).toFixed(2)}
              </Typography>
              
              {(paidByUser || paymentMethod) && (
                <Stack direction="row" spacing={3}>
                  {paidByUser && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Paid by {getUserDisplay(paidByUser)}
                      </Typography>
                    </Stack>
                  )}
                  {paymentMethod && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PaymentIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {paymentMethod}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              )}
            </Stack>
            <Divider />
          </>
        )}
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant={splitMode === "even" ? "contained" : "outlined"}
              onClick={handleSplitEvenly}
              disabled={
                totalAmount === 0 ||
                (inputSplits.length === 0 && availableUsers.length === 0)
              }
            >
              Even
            </Button>
            <Button
              size="small"
              variant={splitMode === "percentage" ? "contained" : "outlined"}
              onClick={handleSplitByPercentage}
              disabled={totalAmount === 0 || inputSplits.length === 0}
            >
              Percentage
            </Button>
            <Button
              size="small"
              variant={splitMode === "amount" ? "contained" : "outlined"}
              onClick={() => {
                setSplitMode("amount");
                // Initialize percentages from current input amounts
                const newPercentages: Record<string, number> = {};
                inputSplits.forEach((split) => {
                  newPercentages[split.userId] =
                    totalAmount > 0
                      ? (split.amountOwed / totalAmount) * 100
                      : 0;
                });
                setPercentages(newPercentages);
              }}
              disabled={inputSplits.length === 0}
            >
              Amount
            </Button>
          </Stack>
        </Box>

        {splitMode !== "even" && inputSplits.length > 1 && (
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            💡 Tip: When you edit a value, unlocked fields will auto-adjust to
            reach 100%. Click the lock icon to prevent a field from
            auto-adjusting.
          </Typography>
        )}

        {inputSplits.length > 0 ? (
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Saved Split</TableCell>
                  <TableCell align="right" sx={{ minWidth: 140 }}>
                    {splitMode === "percentage"
                      ? "Percentage"
                      : splitMode === "amount"
                        ? "Split Amount"
                        : "Split"}
                  </TableCell>
                  <TableCell align="center" sx={{ width: 100 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inputSplits.map((inputSplit) => {
                  const isPayer = inputSplit.userId === paidByUserId;
                  const savedSplit = splits.find(
                    (s) => s.userId === inputSplit.userId
                  );
                  return (
                    <TableRow
                      key={inputSplit.userId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        bgcolor: isPayer ? "action.hover" : "transparent",
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">
                            {getUserDisplayById(inputSplit.userId)}
                          </Typography>
                          {isPayer && (
                            <Chip
                              label="Payer"
                              size="small"
                              color="primary"
                              sx={{ height: 20 }}
                            />
                          )}
                          {lockedFields.has(inputSplit.userId) && (
                            <Tooltip title="Locked - won't auto-adjust">
                              <LockIcon
                                fontSize="small"
                                color="action"
                                sx={{ fontSize: 16 }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {savedSplit ? `${currency} ${(savedSplit.amountOwed / 100).toFixed(2)}` : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {splitMode === "percentage" ? (
                          <Box>
                            <TextField
                              type="number"
                              size="small"
                              value={percentages[inputSplit.userId] || 0}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                handleUpdatePercentage(inputSplit.userId, value);
                              }}
                              onBlur={() => handlePercentageBlur(inputSplit.userId)}
                              inputProps={{ step: "0.01", min: "0", max: "100" }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                              sx={{ width: 120 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {currency} {inputSplit ? (inputSplit.amountOwed / 100).toFixed(2) : '0.00'}
                            </Typography>
                          </Box>
                        ) : (
                          <TextField
                            type="number"
                            size="small"
                            value={(inputSplit.amountOwed / 100).toFixed(2)}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              handleUpdateAmount(
                                inputSplit.userId,
                                Math.round(value * 100)
                              );
                            }}
                            onBlur={() => handleAmountBlur(inputSplit.userId)}
                            inputProps={{ step: "0.01", min: "0" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {currency}
                                </InputAdornment>
                              ),
                            }}
                            sx={{ width: 140 }}
                            disabled={splitMode === "even"}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={0.5} justifyContent="center">
                          <Tooltip
                            title={
                              lockedFields.has(inputSplit.userId)
                                ? "Unlock (allow auto-adjust)"
                                : "Lock (prevent auto-adjust)"
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={() => toggleLock(inputSplit.userId)}
                              color={
                                lockedFields.has(inputSplit.userId)
                                  ? "primary"
                                  : "default"
                              }
                            >
                              {lockedFields.has(inputSplit.userId) ? (
                                <LockIcon fontSize="small" />
                              ) : (
                                <LockOpenIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveSplit(inputSplit.userId)}
                            color="error"
                            title="Remove"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 1.5,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.default",
              }}
            >
              {splitMode === "percentage" ? (
                <>
                  <Typography variant="body2" fontWeight="medium">
                    Total Percentage:{" "}
                    <Typography
                      component="span"
                      color={
                        Math.abs(totalPercentage - 100) < 0.01
                          ? "success.main"
                          : "error.main"
                      }
                    >
                      {totalPercentage.toFixed(2)}%
                    </Typography>
                  </Typography>
                  {Math.abs(totalPercentage - 100) >= 0.01 && (
                    <Typography variant="body2" color="error">
                      {totalPercentage < 100 ? "Remaining" : "Over"}:{" "}
                      {Math.abs(100 - totalPercentage).toFixed(2)}%
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="body2" fontWeight="medium">
                    Total Split:{" "}
                    <Typography
                      component="span"
                      color={remaining === 0 ? "success.main" : "error.main"}
                    >
                      {currency} {(totalInputSplit / 100).toFixed(2)}
                    </Typography>
                  </Typography>
                  {remaining !== 0 && (
                    <Typography variant="body2" color="error">
                      Remaining: {currency}{" "}
                      {Math.abs(remaining / 100).toFixed(2)}
                      {remaining < 0 ? " (over)" : ""}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No users in this split. Add people below to start splitting the
            expense.
          </Typography>
        )}

        {availableToAdd.length > 0 && (
          <FormControl fullWidth size="small">
            <InputLabel>Add Person to Split</InputLabel>
            <Select
              value=""
              label="Add Person to Split"
              onChange={(e) => handleAddSplit(e.target.value)}
            >
              {availableToAdd.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.displayName || user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>
    </Box>
  );
}
