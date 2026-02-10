"use client";

import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import type { User } from "@itinavi/schema";

interface ProfileFormProps {
  user: User;
  displayName: string;
  setDisplayName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  error: string;
  success: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileForm({
  user,
  displayName,
  setDisplayName,
  email,
  setEmail,
  error,
  success,
  loading,
  onSubmit,
}: ProfileFormProps) {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6">Profile Information</Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              value={user.username}
              disabled
              fullWidth
              helperText="Username cannot be changed"
            />

            <TextField
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ alignSelf: "flex-start" }}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
