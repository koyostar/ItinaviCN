import { Card, CardContent, Stack, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent>
        <Stack alignItems="center" spacing={2} py={4}>
          {icon}
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          {description && (
            <Typography color="text.secondary">{description}</Typography>
          )}
          {action && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              href={action.href}
            >
              {action.label}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
