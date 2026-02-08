import { useState, useCallback } from "react";

/**
 * Options for configuring form submission behavior
 */
interface UseFormSubmitOptions {
  /** Callback function called after successful submission */
  onSuccess?: () => void;
  /** Callback function called when submission fails */
  onError?: (error: Error) => void;
}

/**
 * Return type for the useFormSubmit hook
 * @template T - The type of data being submitted
 */
interface UseFormSubmitReturn<T> {
  /** Function to handle form submission with the given data */
  handleSubmit: (data: T) => Promise<void>;
  /** Whether the form is currently being submitted */
  submitting: boolean;
  /** Error message from the last submission attempt, null if no error */
  error: string | null;
  /** Function to manually clear the error state */
  clearError: () => void;
}

/**
 * Custom hook for managing form submission state and error handling.
 *
 * Provides a consistent pattern for handling form submissions with loading states,
 * error handling, and success/error callbacks. Prevents duplicate submissions while
 * one is in progress.
 *
 * @template T - The type of data being submitted
 * @param {function} submitFn - Async function that performs the submission
 * @param {UseFormSubmitOptions} options - Optional success/error callbacks
 * @returns {UseFormSubmitReturn<T>} Object with handleSubmit function, submitting state, error, and clearError
 *
 * @example
 * ```tsx
 * function CreateTripForm() {
 *   const router = useRouter();
 *   const { handleSubmit, submitting, error } = useFormSubmit(
 *     async (data: CreateTripRequest) => {
 *       await api.trips.create(data);
 *     },
 *     { onSuccess: () => router.push('/trips') }
 *   );
 *
 *   return (
 *     <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
 *       {error && <ErrorMessage>{error}</ErrorMessage>}
 *       <Button type="submit" disabled={submitting}>
 *         {submitting ? 'Creating...' : 'Create Trip'}
 *       </Button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useFormSubmit<T>(
  submitFn: (data: T) => Promise<void>,
  options?: UseFormSubmitOptions
): UseFormSubmitReturn<T> {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: T) => {
      setSubmitting(true);
      setError(null);
      try {
        await submitFn(data);
        options?.onSuccess?.();
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Submission failed";
        setError(errorMsg);
        options?.onError?.(err as Error);
      } finally {
        setSubmitting(false);
      }
    },
    [submitFn, options]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { handleSubmit, submitting, error, clearError };
}
