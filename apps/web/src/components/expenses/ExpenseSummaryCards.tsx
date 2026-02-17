import type { BalanceSummary } from "@itinavi/schema";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

interface ExpenseSummaryCardsProps {
  totalsByCurrency: Record<string, number>;
  totalSplits?: number;
  settledSplits?: number;
  onSettlementClick?: () => void;
  myBalance?: BalanceSummary | null;
  onBalanceClick?: () => void;
}

export function ExpenseSummaryCards({
  totalsByCurrency,
  totalSplits = 0,
  settledSplits = 0,
  onSettlementClick,
  myBalance,
  onBalanceClick,
}: ExpenseSummaryCardsProps) {
  const allSettled = totalSplits > 0 && settledSplits === totalSplits;
  const hasSettlements = totalSplits > 0;
  const netBalance = myBalance ? myBalance.netBalance / 100 : 0;
  const isOwed = netBalance > 0;
  const owes = netBalance < 0;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      flexWrap="wrap"
      useFlexGap
    >
      {Object.entries(totalsByCurrency).map(([currency, total]) => (
        <Card
          key={currency}
          sx={{
            minWidth: { xs: "100%", sm: 200 },
            flex: { xs: "1 1 100%", sm: "1 1 auto" },
          }}
        >
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              Total Spent in {currency}
            </Typography>
            <Typography variant="h4">{total.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      ))}

      {/* Balance Card */}
      <Card
        sx={{
          minWidth: { xs: "100%", sm: 250 },
          flex: { xs: "1 1 100%", sm: "0 1 auto" },
          cursor: onBalanceClick ? "pointer" : "default",
          "&:hover": onBalanceClick
            ? {
                boxShadow: 3,
              }
            : {},
        }}
      >
        <CardActionArea onClick={onBalanceClick} disabled={!onBalanceClick}>
          <CardContent>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="overline" color="text.secondary">
                  Your Balance
                </Typography>
              </Stack>

              {myBalance && (
                <Stack spacing={1}>
                  {/* You owe */}
                  {myBalance.owesTo &&
                    Object.keys(myBalance.owesTo).length > 0 && (
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight="medium"
                          display="block"
                          mb={0.5}
                        >
                          You owe:
                        </Typography>
                        {Object.entries(myBalance.owesTo).map(
                          ([userId, data]) => {
                            const balanceData = data as {
                              amount: number;
                              user: {
                                id: string;
                                username: string;
                                displayName: string | null;
                              };
                            };
                            return (
                              <Typography
                                key={userId}
                                variant="caption"
                                color="error.main"
                                display="block"
                              >
                                •{" "}
                                {balanceData.user.displayName ||
                                  balanceData.user.username}
                                : ${(balanceData.amount / 100).toFixed(2)}
                              </Typography>
                            );
                          }
                        )}
                      </Box>
                    )}

                  {/* Owed to you */}
                  {myBalance.owedBy &&
                    Object.keys(myBalance.owedBy).length > 0 && (
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight="medium"
                          display="block"
                          mb={0.5}
                        >
                          Owed to you:
                        </Typography>
                        {Object.entries(myBalance.owedBy).map(
                          ([userId, data]) => {
                            const balanceData = data as {
                              amount: number;
                              user: {
                                id: string;
                                username: string;
                                displayName: string | null;
                              };
                            };
                            return (
                              <Typography
                                key={userId}
                                variant="caption"
                                color="success.main"
                                display="block"
                              >
                                •{" "}
                                {balanceData.user.displayName ||
                                  balanceData.user.username}
                                : ${(balanceData.amount / 100).toFixed(2)}
                              </Typography>
                            );
                          }
                        )}
                      </Box>
                    )}

                  {/* All settled */}
                  {(!myBalance.owesTo ||
                    Object.keys(myBalance.owesTo).length === 0) &&
                    (!myBalance.owedBy ||
                      Object.keys(myBalance.owedBy).length === 0) && (
                      <Typography variant="body2" color="success.main">
                        All settled up!
                      </Typography>
                    )}
                </Stack>
              )}
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* Settlement Summary Card */}
      {hasSettlements && (
        <Card
          sx={{
            minWidth: { xs: "100%", sm: 200 },
            flex: { xs: "1 1 100%", sm: "0 1 auto" },
            cursor: onSettlementClick ? "pointer" : "default",
            "&:hover": onSettlementClick
              ? {
                  boxShadow: 3,
                }
              : {},
          }}
        >
          <CardActionArea
            onClick={onSettlementClick}
            disabled={!onSettlementClick}
          >
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccountBalanceWalletIcon color="primary" />
                  <Typography variant="overline" color="text.secondary">
                    Settlements
                  </Typography>
                </Stack>
                <Typography variant="h4">
                  {settledSplits}/{totalSplits}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {allSettled ? (
                    <>
                      <CheckCircleIcon fontSize="small" color="success" />
                      <Typography variant="caption" color="success.main">
                        All Settled
                      </Typography>
                    </>
                  ) : (
                    <>
                      <PendingIcon fontSize="small" color="warning" />
                      <Typography variant="caption" color="warning.main">
                        {totalSplits - settledSplits} Pending
                      </Typography>
                    </>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </Stack>
  );
}
