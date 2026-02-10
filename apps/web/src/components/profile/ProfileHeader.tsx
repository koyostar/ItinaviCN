"use client";

import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import type { User } from "@itinavi/schema";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ width: 64, height: 64 }}>
          {user.displayName?.[0] || user.username[0] || "?"}
        </Avatar>
        <Box>
          <Typography variant="h6">{user.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.userType} Account
          </Typography>
        </Box>
      </Box>

      <Divider />
    </>
  );
}
