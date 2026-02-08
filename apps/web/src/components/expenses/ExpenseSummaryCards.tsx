import { Card, CardContent, Stack, Typography } from "@mui/material";

interface ExpenseSummaryCardsProps {
  totalsByCurrency: Record<string, number>;
}

export function ExpenseSummaryCards({
  totalsByCurrency,
}: ExpenseSummaryCardsProps) {
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
    </Stack>
  );
}
