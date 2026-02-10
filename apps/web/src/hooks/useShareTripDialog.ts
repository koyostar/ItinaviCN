import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ROLE_LABELS, getUserDisplayName } from "@/lib/trip-helpers";
import type { TripRole } from "@itinavi/schema";

export interface User {
  id: string;
  username: string;
  email: string | null;
  displayName: string | null;
}

export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: TripRole;
  joinedAt: string;
  user: User;
}

interface UseShareTripDialogOptions {
  tripId: string;
  open: boolean;
  currentUserId: string | undefined;
}

export function useShareTripDialog({ tripId, open, currentUserId }: UseShareTripDialogOptions) {
  const [members, setMembers] = useState<TripMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Available users state
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Add member form state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addRole, setAddRole] = useState<TripRole>("EDITOR");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (open) {
      loadMembers();
      loadUsers();
    }
  }, [open, tripId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.trips.listMembers(tripId);
      setMembers(data as TripMember[]);
    } catch (err: any) {
      setError(err?.data?.message || err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await api.auth.getAllUsers();
      setAvailableUsers(data as User[]);
    } catch (err: any) {
      console.error("Failed to load users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const addMember = async () => {
    if (!selectedUser) {
      setError("Please select a user");
      return false;
    }

    try {
      setAdding(true);
      setError("");
      setSuccess("");
      
      await api.trips.addMember(tripId, {
        userId: selectedUser.id,
        role: addRole,
      });
      
      const roleName = ROLE_LABELS[addRole];
      setSuccess(`${getUserDisplayName(selectedUser)} added successfully as ${roleName}`);
      setSelectedUser(null);
      setAddRole("EDITOR");
      
      await loadMembers();
      
      setTimeout(() => setSuccess(""), 3000);
      return true;
    } catch (err: any) {
      setError(err?.data?.message || err.message || "Failed to add member");
      return false;
    } finally {
      setAdding(false);
    }
  };

  const updateMemberRole = async (userId: string, newRole: TripRole) => {
    try {
      setError("");
      setSuccess("");
      
      await api.trips.updateMemberRole(tripId, userId, { role: newRole });
      
      setSuccess("Member role updated successfully");
      await loadMembers();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.data?.message || err.message || "Failed to update role");
    }
  };

  const removeMember = async (userId: string) => {
    try {
      setError("");
      setSuccess("");
      
      await api.trips.removeMember(tripId, userId);
      
      setSuccess("Member removed successfully");
      await loadMembers();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err?.data?.message || err.message || "Failed to remove member");
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setSelectedUser(null);
    setAddRole("EDITOR");
    clearMessages();
  };

  // Filter out current user and existing members
  const availableUsersFiltered = availableUsers.filter(
    (user) => user.id !== currentUserId && !members.some((member) => member.userId === user.id)
  );

  return {
    // State
    members,
    loading,
    error,
    success,
    availableUsers: availableUsersFiltered,
    loadingUsers,
    selectedUser,
    addRole,
    adding,
    
    // Actions
    setSelectedUser,
    setAddRole,
    addMember,
    updateMemberRole,
    removeMember,
    clearMessages,
    resetForm,
  };
}
