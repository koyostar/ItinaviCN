"use client";

import {
  Box,
  Stack,
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import type { TripRole } from "@itinavi/schema";
import type { User } from "@/hooks/useShareTripDialog";
import { getUserDisplayName, getUserIdentifier } from "@/lib/trip-helpers";

interface AddMemberFormProps {
  availableUsers: User[];
  selectedUser: User | null;
  onUserChange: (user: User | null) => void;
  role: TripRole;
  onRoleChange: (role: TripRole) => void;
  onSubmit: () => void;
  adding: boolean;
  loadingUsers: boolean;
}

export function AddMemberForm({
  availableUsers,
  selectedUser,
  onUserChange,
  role,
  onRoleChange,
  onSubmit,
  adding,
  loadingUsers,
}: AddMemberFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="subtitle2" gutterBottom>
        Add New Member
      </Typography>
      <Stack spacing={2}>
        <Autocomplete
          options={availableUsers}
          getOptionLabel={getUserIdentifier}
          value={selectedUser}
          onChange={(_, newValue) => onUserChange(newValue)}
          disabled={adding || loadingUsers}
          loading={loadingUsers}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select User"
              placeholder="Search by name or username"
              size="small"
            />
          )}
          renderOption={(props, user) => (
            <li {...props} key={user.id}>
              <Stack>
                <Typography variant="body2">
                  {getUserDisplayName(user)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  @{user.username}
                  {user.email && ` • ${user.email}`}
                </Typography>
              </Stack>
            </li>
          )}
        />
        
        <FormControl fullWidth size="small" disabled={adding}>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => onRoleChange(e.target.value as TripRole)}
          >
            <MenuItem value="EDITOR">Editor - Can modify trip</MenuItem>
            <MenuItem value="VIEWER">Viewer - Read only</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          disabled={adding || !selectedUser}
          sx={{ alignSelf: "flex-start" }}
        >
          {adding ? "Adding..." : "Add Member"}
        </Button>
      </Stack>
    </Box>
  );
}
