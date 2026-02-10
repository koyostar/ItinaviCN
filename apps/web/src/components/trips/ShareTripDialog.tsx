"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/contexts/AuthContext";
import { useShareTripDialog } from "@/hooks/useShareTripDialog";
import { AddMemberForm } from "./AddMemberForm";
import { MemberList } from "./MemberList";
import { RolePermissionsInfo } from "./RolePermissionsInfo";

interface ShareTripDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle: string;
  isOwner: boolean;
}

export function ShareTripDialog({
  open,
  onClose,
  tripId,
  tripTitle,
  isOwner,
}: ShareTripDialogProps) {
  const { user: currentUser } = useAuth();
  
  const {
    members,
    loading,
    error,
    success,
    availableUsers,
    loadingUsers,
    selectedUser,
    addRole,
    adding,
    setSelectedUser,
    setAddRole,
    addMember,
    updateMemberRole,
    removeMember,
    resetForm,
  } = useShareTripDialog({
    tripId,
    open,
    currentUserId: currentUser?.id,
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Share Trip: {tripTitle}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          {isOwner && (
            <AddMemberForm
              availableUsers={availableUsers}
              selectedUser={selectedUser}
              onUserChange={setSelectedUser}
              role={addRole}
              onRoleChange={setAddRole}
              onSubmit={addMember}
              adding={adding}
              loadingUsers={loadingUsers}
            />
          )}

          <MemberList
            members={members}
            loading={loading}
            currentUserId={currentUser?.id}
            isOwner={isOwner}
            onRoleChange={updateMemberRole}
            onRemove={removeMember}
          />

          <RolePermissionsInfo />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
