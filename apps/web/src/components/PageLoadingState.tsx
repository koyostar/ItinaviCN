import { Container, Typography } from "@mui/material";

interface PageLoadingStateProps {
  message?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function PageLoadingState({
  message = "Loading...",
  maxWidth = "lg",
}: PageLoadingStateProps) {
  return (
    <Container maxWidth={maxWidth} sx={{ mt: 4 }}>
      <Typography>{message}</Typography>
    </Container>
  );
}
