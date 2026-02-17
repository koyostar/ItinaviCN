"use client";

import {
  useExchangeRate,
  useFormSubmit,
  useItineraryItems,
  useTrip,
  useTripMembers,
} from "@/hooks";
import { api } from "@/lib/api";
import { ExpenseEditForm } from "@/components/expenses/ExpenseEditForm";
import type {
  CreateExpenseRequest,
  ExpenseCategory,
  PaymentMethod,
} from "@itinavi/schema";
import {
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function NewExpensePage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { trip } = useTrip(tripId);
  const { items: itineraryItems } = useItineraryItems(tripId);
  const { members } = useTripMembers(tripId);
  const {
    rate,
    loading: rateLoading,
    error: rateError,
    fetchRate,
  } = useExchangeRate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Other" as ExpenseCategory,
    expenseDateTime: "",
    amount: "",
    destinationCurrency: trip?.destinationCurrency || "CNY",
    exchangeRateUsed: "",
    linkedItineraryItemId: "",
    notes: "",
    paidByUserId: user?.id || "",
    paymentMethod: "Cash" as PaymentMethod,
  });

  // Pre-select itinerary item from URL parameter
  useEffect(() => {
    const itineraryItemId = searchParams.get("itineraryItemId");

    if (itineraryItemId && itineraryItems.length > 0) {
      const selectedItem = itineraryItems.find(
        (item) => item.id === itineraryItemId
      );
      if (selectedItem) {
        // Map itinerary type to expense category
        const categoryMap: Record<string, ExpenseCategory> = {
          Flight: "Transport",
          Transport: "Transport",
          Accommodation: "Accommodation",
          Place: "Attraction",
          Food: "Food",
        };
        const mappedCategory = categoryMap[selectedItem.type] || "Other";

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData((prev) => ({
          ...prev,
          linkedItineraryItemId: itineraryItemId,
          category: mappedCategory,
          title: prev.title || selectedItem.title,
          expenseDateTime:
            prev.expenseDateTime ||
            new Date(selectedItem.startDateTime).toISOString().slice(0, 16),
        }));
      }
    }
  }, [searchParams, itineraryItems]);

  // Update form when rate is manually fetched
  useEffect(() => {
    if (rate !== null) {
      setFormData((prev) => ({ ...prev, exchangeRateUsed: rate.toString() }));
    }
  }, [rate]);

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const {
    handleSubmit: submitForm,
    submitting,
    error,
  } = useFormSubmit(
    async (_: void) => {
      // Validate required fields
      if (!formData.title || !formData.amount || !formData.expenseDateTime) {
        throw new Error("Please fill in all required fields");
      }

      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue < 0) {
        throw new Error("Please enter a valid amount");
      }

      // Fetch exchange rate if empty and currencies are different
      let exchangeRate = formData.exchangeRateUsed
        ? parseFloat(formData.exchangeRateUsed)
        : undefined;

      if (
        !exchangeRate &&
        trip?.originCurrency &&
        formData.destinationCurrency !== trip.originCurrency
      ) {
        const expenseDate = new Date(formData.expenseDateTime)
          .toISOString()
          .split("T")[0];
        const fetchedRate = await fetchRate(
          trip.originCurrency,
          formData.destinationCurrency,
          expenseDate,
        );
        if (fetchedRate !== null) {
          exchangeRate = fetchedRate;
        }
      }

      const payload: CreateExpenseRequest = {
        title: formData.title,
        category: formData.category,
        expenseDateTime: new Date(formData.expenseDateTime).toISOString(),
        amountDestinationMinor: Math.round(amountValue * 100),
        destinationCurrency: formData.destinationCurrency,
        ...(exchangeRate && { exchangeRateUsed: exchangeRate }),
        ...(formData.linkedItineraryItemId && {
          linkedItineraryItemId: formData.linkedItineraryItemId,
        }),
        ...(formData.notes && { notes: formData.notes }),
        paidByUserId: formData.paidByUserId,
        paymentMethod: formData.paymentMethod,
      };

      await api.expenses.create(tripId, payload);
    },
    { onSuccess: () => router.push(`/trips/${tripId}/expenses`) }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(undefined as void);
  };

  const handleFetchRate = () => {
    if (
      formData.expenseDateTime &&
      formData.destinationCurrency &&
      trip?.originCurrency
    ) {
      const expenseDate = new Date(formData.expenseDateTime)
        .toISOString()
        .split("T")[0];
      fetchRate(
        trip.originCurrency,
        formData.destinationCurrency,
        expenseDate
      );
    }
  };

  const handleCancel = () => {
    router.push(`/trips/${tripId}/expenses`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Add New Expense
      </Typography>

      <Card>
        <CardContent>
          <ExpenseEditForm
            formData={formData}
            trip={trip ?? undefined}
            itineraryItems={itineraryItems}
            availableUsers={members}
            rateLoading={rateLoading}
            rateError={rateError}
            submitError={error}
            submitting={submitting}
            onFieldChange={updateField}
            onFetchRate={handleFetchRate}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
