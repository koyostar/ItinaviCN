"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@itinavi/schema";
import { api } from "@/lib/api";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}

function ProfilePageContent() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Dev features
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [devLoading, setDevLoading] = useState(false);
  const [devError, setDevError] = useState("");
  const [devSuccess, setDevSuccess] = useState("");
  const isDev = user?.userType === "Dev";

  useEffect(() => {
    if (isDev) {
      loadAllUsers();
    }
  }, [isDev]);

  const loadAllUsers = async () => {
    try {
      const users = await api.auth.getAllUsers();
      setAllUsers(users as User[]);
    } catch (err: any) {
      console.error("Failed to load users:", err);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const updatedUser = await api.auth.updateProfile({
        displayName: displayName || undefined,
        email: email || undefined,
      });

      updateUser(updatedUser as any);
      setProfileSuccess("Profile updated successfully!");
    } catch (err: any) {
      setProfileError(
        err?.data?.message || err.message || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);

    try {
      await api.auth.changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(
        err?.data?.message || err.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDevResetPassword = async (userId: string, username: string) => {
    if (!confirm(`Reset password for ${username} to default "password"?`)) {
      return;
    }

    setDevError("");
    setDevSuccess("");
    setDevLoading(true);

    try {
      await api.auth.devResetPassword(userId);
      setDevSuccess(`Password reset for ${username}. New password: "password"`);
      setTimeout(() => setDevSuccess(""), 5000);
    } catch (err: any) {
      setDevError(
        err?.data?.message || err.message || "Failed to reset password"
      );
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Button variant="outlined" onClick={() => router.push("/trips")}>
            ← Back to Trips
          </Button>
        </Box>

        <Typography variant="h4" component="h1">
          User Profile
        </Typography>

        {/* Profile Information */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 64, height: 64 }}>
                {user?.displayName?.[0] || user?.username?.[0] || "?"}
              </Avatar>
              <Box>
                <Typography variant="h6">{user?.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.userType} Account
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Typography variant="h6">Profile Information</Typography>

            {profileError && <Alert severity="error">{profileError}</Alert>}
            {profileSuccess && (
              <Alert severity="success">{profileSuccess}</Alert>
            )}

            <form onSubmit={handleProfileSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  value={user?.username || ""}
                  disabled
                  fullWidth
                  helperText="Username cannot be changed"
                />

                <TextField
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setProfileSuccess("");
                  }}
                  fullWidth
                  disabled={profileLoading}
                />

                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setProfileSuccess("");
                  }}
                  fullWidth
                  disabled={profileLoading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={profileLoading}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {profileLoading ? "Updating..." : "Update Profile"}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>

        {/* Change Password */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h6">Change Password</Typography>

            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            {passwordSuccess && (
              <Alert severity="success">{passwordSuccess}</Alert>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordSuccess("");
                  }}
                  required
                  fullWidth
                  disabled={passwordLoading}
                />

                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordSuccess("");
                  }}
                  required
                  fullWidth
                  disabled={passwordLoading}
                  helperText="At least 6 characters"
                />

                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordSuccess("");
                  }}
                  required
                  fullWidth
                  disabled={passwordLoading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={passwordLoading}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>

        {/* Dev Features */}
        {isDev && (
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

              {devError && <Alert severity="error">{devError}</Alert>}
              {devSuccess && <Alert severity="success">{devSuccess}</Alert>}

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
                            onClick={() =>
                              handleDevResetPassword(u.id, u.username)
                            }
                            disabled={devLoading || u.id === user?.id}
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
        )}
      </Stack>
    </Container>
  );
}
