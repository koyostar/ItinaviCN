"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import { PageHeader, PageLoadingState, PageErrorState } from "@/components/ui";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { BalanceSummary, UserInfo } from "@itinavi/schema";

interface BalanceData {
  user: UserInfo;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

export default function ExpenseBalancesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myBalance, setMyBalance] = useState<BalanceSummary | null>(null);
  const [tripBalances, setTripBalances] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);
      setError(null);
      try {
        const [myBalanceData, tripBalanceData] = await Promise.all([
          api.expenses.getMyBalance(tripId),
          api.expenses.getTripBalances(tripId),
        ]);
        setMyBalance(myBalanceData as BalanceSummary);
        setTripBalances(tripBalanceData as Record<string, Record<string, number>>);
      } catch (err: any) {
        setError(err?.message || "Failed to load balance information");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchBalances();
    }
  }, [tripId]);

  const handleSettle = async (expenseId: string, userId: string) => {
    try {
      await api.expenses.settleSplit(tripId, expenseId, userId);
      // Refresh balances
      const [myBalanceData, tripBalanceData] = await Promise.all([
        api.expenses.getMyBalance(tripId),
        api.expenses.getTripBalances(tripId),
      ]);
      setMyBalance(myBalanceData as BalanceSummary);
      setTripBalances(tripBalanceData as Record<string, Record<string, number>>);
    } catch (err: any) {
      setError(err?.message || "Failed to settle expense");
    }
  };

  if (loading) return <PageLoadingState />;
  if (error) return <PageErrorState error={error} />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="Expense Balances"
      />
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Track who owes whom and settle up
      </Typography>

      <Stack spacing={3}>
        {/* My Balance Summary */}
        {myBalance && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Balance
              </Typography>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Total Paid:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {(myBalance.totalPaid / 100).toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Total Owed:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {(myBalance.totalOwed / 100).toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{
                    pt: 2,
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h6">Net Balance:</Typography>
                  <Typography
                    variant="h6"
                    color={
                      myBalance.netBalance > 0
                        ? "success.main"
                        : myBalance.netBalance < 0
                          ? "error.main"
                          : "text.primary"
                    }
                  >
                    {myBalance.netBalance > 0 ? "+" : ""}
                    {(myBalance.netBalance / 100).toFixed(2)}
                  </Typography>
                </Box>

                {/* Who owes you */}
                {myBalance.owedBy && Object.keys(myBalance.owedBy).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      People who owe you:
                    </Typography>
                    <Stack spacing={1}>
                      {Object.entries(myBalance.owedBy).map(([userId, balanceData]) => {
                        const data = balanceData as { amount: number; user: UserInfo };
                        return (
                          <Box
                            key={userId}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2">
                              {data.user.displayName || data.user.username}
                            </Typography>
                            <Chip
                              label={`${(data.amount / 100).toFixed(2)}`}
                              color="success"
                              size="small"
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                {/* Who you owe */}
                {myBalance.owesTo && Object.keys(myBalance.owesTo).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      You owe:
                    </Typography>
                    <Stack spacing={1}>
                      {Object.entries(myBalance.owesTo).map(([userId, balanceData]) => {
                        const data = balanceData as { amount: number; user: UserInfo };
                        return (
                          <Box
                            key={userId}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2">
                              {data.user.displayName || data.user.username}
                            </Typography>
                            <Chip
                              label={`${(data.amount / 100).toFixed(2)}`}
                              color="error"
                              size="small"
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Trip-wide Balances */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              All Trip Balances
            </Typography>
            {Object.keys(tripBalances).length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No outstanding balances. Everyone is settled up!
              </Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Owes</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(tripBalances).map(([debtorId, creditors]) =>
                      Object.entries(creditors).map(([creditorId, amount]) => (
                        <TableRow key={`${debtorId}-${creditorId}`}>
                          <TableCell>Debtor {debtorId.slice(0, 8)}...</TableCell>
                          <TableCell>Creditor {creditorId.slice(0, 8)}...</TableCell>
                          <TableCell align="right">
                            {(amount / 100).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
