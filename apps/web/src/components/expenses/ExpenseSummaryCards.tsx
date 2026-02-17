import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import type { BalanceSummary } from "@itinavi/schema";

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
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {Object.entries(totalsByCurrency).map(([currency, total]) => (
        <Card key={currency} sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="overline" color="text.secondary">
              Total ({currency})
            </Typography>
            <Typography variant="h4">{total.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      ))}
      
      {/* Balance Card */}
      <Card 
        sx={{ 
          minWidth: 200,
          cursor: onBalanceClick ? 'pointer' : 'default',
          '&:hover': onBalanceClick ? {
            boxShadow: 3,
          } : {},
        }}
      >
        <CardActionArea 
          onClick={onBalanceClick}
          disabled={!onBalanceClick}
        >
          <CardContent>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="overline" color="text.secondary">
                  Your Balance
                </Typography>
              </Stack>
              <Typography 
                variant="h4"
                color={
                  isOwed
                    ? "success.main"
                    : owes
                      ? "error.main"
                      : "text.primary"
                }
              >
                {netBalance > 0 ? "+" : ""}{netBalance.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isOwed 
                  ? "You are owed" 
                  : owes 
                    ? "You owe" 
                    : "Settled up"}
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      
      {/* Settlement Summary Card */}
      {hasSettlements && (
        <Card 
          sx={{ 
            minWidth: 200,
            cursor: onSettlementClick ? 'pointer' : 'default',
            '&:hover': onSettlementClick ? {
              boxShadow: 3,
            } : {},
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
