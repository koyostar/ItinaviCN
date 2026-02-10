import { useState } from "react";
import { api } from "@/lib/api";

export function useProfileForm(
  initialDisplayName: string,
  initialEmail: string,
  onUpdate: (user: any) => void
) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const updatedUser = await api.auth.updateProfile({
        displayName: displayName || undefined,
        email: email || undefined,
      });

      onUpdate(updatedUser as any);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(
        err?.data?.message || err.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    displayName,
    setDisplayName,
    email,
    setEmail,
    error,
    success,
    loading,
    handleSubmit,
  };
}
