"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import type { CreateItineraryItemRequest } from "@itinavi/schema";
import { Card, CardContent, Container, Typography } from "@mui/material";
import { api } from "@/lib/api";
import { ItineraryForm } from "@/components/forms";
import { useTripTimezone, useFormSubmit } from "@/hooks";

export default function NewItineraryItemPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const { timezone: defaultTimezone } = useTripTimezone(tripId);

  const { handleSubmit, submitting } = useFormSubmit(
    async (data: CreateItineraryItemRequest) => {
      await api.itinerary.create(tripId, data);
    },
    { onSuccess: () => router.push(`/trips/${tripId}/itinerary`) },
  );

  const handleCancel = () => {
    router.push(`/trips/${tripId}/itinerary`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Add Itinerary Item
      </Typography>

      <Card>
        <CardContent>
          <ItineraryForm
            defaultTimezone={defaultTimezone}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
