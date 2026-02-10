"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { User } from "@itinavi/schema";

interface UserManagementTableProps {
  allUsers: User[];
  currentUserId: string | undefined;
  error: string;
  success: string;
  loading: boolean;
  onResetPassword: (userId: string, username: string) => void;
}

export function UserManagementTable({
  allUsers,
  currentUserId,
  error,
  success,
  loading,
  onResetPassword,
}: UserManagementTableProps) {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Chip label="DEV ONLY" color="error" size="small" />
          <Typography variant="h6" sx={{ mt: 1 }}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reset user passwords to default: &quot;password&quot;
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Display Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.displayName || "-"}</TableCell>
                  <TableCell>{u.email || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.userType}
                      size="small"
                      color={u.userType === "Dev" ? "error" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => onResetPassword(u.id, u.username)}
                      disabled={loading || u.id === currentUserId}
                    >
                      Reset Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
}
