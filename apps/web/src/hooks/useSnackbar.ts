import { useState } from "react";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message: string,
    severity: SnackbarState["severity"] = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const showSuccess = (message: string) => showSnackbar(message, "success");
  const showError = (message: string) => showSnackbar(message, "error");
  const showInfo = (message: string) => showSnackbar(message, "info");
  const showWarning = (message: string) => showSnackbar(message, "warning");

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    snackbar,
    showSnackbar,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideSnackbar,
  };
}
