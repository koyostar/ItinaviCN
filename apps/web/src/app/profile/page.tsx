"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { UserManagementTable } from "@/components/profile/UserManagementTable";
import { useAuth } from "@/contexts/AuthContext";
import { usePasswordChange, useProfileForm } from "@/hooks";
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
  
  const profileForm = useProfileForm(
    user?.displayName || "",
    user?.email || "",
    updateUser
  );
  
  const passwordChange = usePasswordChange();

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
            <ProfileHeader user={user!} />

            <ProfileForm
              user={user!}
              displayName={profileForm.displayName}
              setDisplayName={profileForm.setDisplayName}
              email={profileForm.email}
              setEmail={profileForm.setEmail}
              error={profileForm.error}
              success={profileForm.success}
              loading={profileForm.loading}
              onSubmit={profileForm.handleSubmit}
            />
          </Stack>
        </Paper>

        {/* Change Password */}
        <PasswordChangeForm
          currentPassword={passwordChange.currentPassword}
          setCurrentPassword={passwordChange.setCurrentPassword}
          newPassword={passwordChange.newPassword}
          setNewPassword={passwordChange.setNewPassword}
          confirmPassword={passwordChange.confirmPassword}
          setConfirmPassword={passwordChange.setConfirmPassword}
          error={passwordChange.error}
          success={passwordChange.success}
          loading={passwordChange.loading}
          onSubmit={passwordChange.handleSubmit}
        />

        {/* Dev Features */}
        {isDev && (
          <UserManagementTable
            allUsers={allUsers}
            currentUserId={user?.id}
            error={devError}
            success={devSuccess}
            loading={devLoading}
            onResetPassword={handleDevResetPassword}
          />
        )}
      </Stack>
    </Container>
  );
}
