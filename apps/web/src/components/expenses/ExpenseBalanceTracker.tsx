import type { BalanceSummary, UserInfo } from "@itinavi/schema";
import { getUserDisplay } from "@/lib/utils/expenses";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

interface ExpenseBalanceTrackerProps {
  myBalance: BalanceSummary | null;
  tripBalances: Record<string, Record<string, number>>;
  members: UserInfo[];
}

export function ExpenseBalanceTracker({
  myBalance,
  tripBalances,
  members,
}: ExpenseBalanceTrackerProps) {
  // Helper to get user display name by ID
  const getUserName = (userId: string) => {
    const member = members.find(m => m.id === userId);
    return member ? getUserDisplay(member) : `User ${userId.slice(0, 8)}...`;
  };
  if (!myBalance) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading balance information...
      </Typography>
    );
  }

  return (
    <Stack spacing={3}>
      {/* My Balance Summary */}
      <Card variant="outlined">
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
                    const data = balanceData as { amount: number; user: { id: string; username: string; displayName: string | null } };
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
                    const data = balanceData as { amount: number; user: { id: string; username: string; displayName: string | null } };
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

      {/* Trip-wide Balances */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Trip Balances
          </Typography>
          {Object.keys(tripBalances).length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No outstanding balances. Everyone is settled up!
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {Object.entries(tripBalances).map(([debtorId, creditors]) =>
                Object.entries(creditors).map(([creditorId, amount]) => (
                  <Typography key={`${debtorId}-${creditorId}`} variant="body2">
                    {getUserName(debtorId)} owes {getUserName(creditorId)}{" "}
                    <Box 
                      component="span" 
                      fontWeight="medium"
                      sx={{
                        backgroundColor: 'action.hover',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {(amount / 100).toFixed(2)}
                    </Box>
                  </Typography>
                ))
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
