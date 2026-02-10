"use client";

import {
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Chip,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { TripRole } from "@itinavi/schema";
import type { TripMember } from "@/hooks/useShareTripDialog";
import { ROLE_COLORS, ROLE_LABELS, getUserDisplayName } from "@/lib/trip-helpers";

interface MemberListItemProps {
  member: TripMember;
  isCurrentUser: boolean;
  canModify: boolean;
  onRoleChange: (userId: string, newRole: TripRole) => void;
  onRemove: (userId: string, username: string) => void;
}

export function MemberListItem({
  member,
  isCurrentUser,
  canModify,
  onRoleChange,
  onRemove,
}: MemberListItemProps) {
  const displayName = getUserDisplayName(member.user);
  
  const handleRemoveClick = () => {
    if (confirm(`Remove ${displayName} from this trip?`)) {
      onRemove(member.userId, displayName);
    }
  };

  return (
    <ListItem
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        mb: 1,
      }}
      secondaryAction={
        <Stack direction="row" spacing={1} alignItems="center">
          {canModify ? (
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={member.role}
                onChange={(e) =>
                  onRoleChange(member.userId, e.target.value as TripRole)
                }
              >
                <MenuItem value="EDITOR">Editor</MenuItem>
                <MenuItem value="VIEWER">Viewer</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Chip
              label={ROLE_LABELS[member.role]}
              color={ROLE_COLORS[member.role]}
              size="small"
            />
          )}
          
          {canModify && (
            <IconButton
              size="small"
              color="error"
              onClick={handleRemoveClick}
              aria-label={`Remove ${displayName} from trip`}
              title={`Remove ${displayName}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      }
    >
      <ListItemText
        primary={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body1">
              {displayName}
            </Typography>
            {isCurrentUser && (
              <Chip label="You" size="small" variant="outlined" />
            )}
          </Stack>
        }
        secondary={
          <Stack spacing={0.5} mt={0.5}>
            <Typography variant="caption" color="text.secondary">
              @{member.user.username}
            </Typography>
            {member.user.email && (
              <Typography variant="caption" color="text.secondary">
                {member.user.email}
              </Typography>
            )}
          </Stack>
        }
      />
    </ListItem>
  );
}
