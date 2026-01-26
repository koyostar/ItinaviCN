import { Container, Typography, Button, Stack } from "@mui/material";

interface PageErrorStateProps {
  error: string;
  onRetry?: () => void;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function PageErrorState({
  error,
  onRetry,
  maxWidth = "lg",
}: PageErrorStateProps) {
  return (
    <Container maxWidth={maxWidth} sx={{ mt: 4 }}>
      <Stack spacing={2}>
        <Typography color="error">{error}</Typography>
        {onRetry && (
          <Button onClick={onRetry} sx={{ alignSelf: "flex-start" }}>
            Retry
          </Button>
        )}
      </Stack>
    </Container>
  );
}
