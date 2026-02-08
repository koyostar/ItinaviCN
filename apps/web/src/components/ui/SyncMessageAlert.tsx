import { Card, CardContent, Typography } from "@mui/material";

interface SyncMessageAlertProps {
  message: string;
}

export function SyncMessageAlert({ message }: SyncMessageAlertProps) {
  return (
    <Card sx={{ bgcolor: "info.light" }}>
      <CardContent>
        <Typography color="info.contrastText">{message}</Typography>
      </CardContent>
    </Card>
  );
}
