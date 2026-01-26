import { Stack, Typography, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface PageHeaderProps {
  title: string;
  backButton?: {
    onClick: () => void;
  };
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
}

export function PageHeader({ title, backButton, action }: PageHeaderProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {backButton && (
          <IconButton onClick={backButton.onClick}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
      </Stack>
      {action && (
        <Button
          variant="contained"
          startIcon={action.icon || <AddIcon />}
          href={action.href}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </Stack>
  );
}
