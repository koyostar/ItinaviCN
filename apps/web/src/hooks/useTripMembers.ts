import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { UserInfo } from "@itinavi/schema";

interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: string;
  user: UserInfo;
}

export function useTripMembers(tripId: string | null) {
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tripId) return;

    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = (await api.trips.listMembers(tripId)) as TripMember[];
        setMembers(data.map((m) => m.user));
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [tripId]);

  return { members, loading, error };
}
