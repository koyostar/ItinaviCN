"use client";

import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";

interface PasswordChangeFormProps {
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  error: string;
  success: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function PasswordChangeForm({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  success,
  loading,
  onSubmit,
}: PasswordChangeFormProps) {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6">Change Password</Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              fullWidth
              disabled={loading}
            />

            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              disabled={loading}
              helperText="At least 6 characters"
            />

            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ alignSelf: "flex-start" }}
            >
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
