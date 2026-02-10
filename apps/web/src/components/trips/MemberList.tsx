"use client";

import {
  Box,
  Typography,
  CircularProgress,
  List,
} from "@mui/material";
import type { TripRole } from "@itinavi/schema";
import type { TripMember } from "@/hooks/useShareTripDialog";
import { MemberListItem } from "./MemberListItem";

interface MemberListProps {
  members: TripMember[];
  loading: boolean;
  currentUserId: string | undefined;
  isOwner: boolean;
  onRoleChange: (userId: string, newRole: TripRole) => void;
  onRemove: (userId: string, username: string) => void;
}

export function MemberList({
  members,
  loading,
  currentUserId,
  isOwner,
  onRoleChange,
  onRemove,
}: MemberListProps) {
  if (loading) {
    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Current Members
        </Typography>
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (members.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Current Members (0)
        </Typography>
        <Typography variant="body2" color="text.secondary" py={2}>
          No members yet. Add someone to collaborate!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Current Members ({members.length})
      </Typography>
      <List>
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const canModify = isOwner && member.role !== "OWNER" && !isCurrentUser;

          return (
            <MemberListItem
              key={member.id}
              member={member}
              isCurrentUser={isCurrentUser}
              canModify={canModify}
              onRoleChange={onRoleChange}
              onRemove={onRemove}
            />
          );
        })}
      </List>
    </Box>
  );
}
