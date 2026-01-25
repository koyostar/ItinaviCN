const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'An error occurred',
      response.status,
      errorData,
    );
  }

  return response.json();
}

export const api = {
  // Trips
  trips: {
    list: () => fetchApi('/api/trips'),
    get: (tripId: string) => fetchApi(`/api/trips/${tripId}`),
    create: (data: unknown) =>
      fetchApi('/api/trips', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (tripId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Locations
  locations: {
    list: (tripId: string) => fetchApi(`/api/trips/${tripId}/locations`),
    get: (tripId: string, locationId: string) =>
      fetchApi(`/api/trips/${tripId}/locations/${locationId}`),
    create: (tripId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}/locations`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (tripId: string, locationId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}/locations/${locationId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (tripId: string, locationId: string) =>
      fetchApi(`/api/trips/${tripId}/locations/${locationId}`, {
        method: 'DELETE',
      }),
  },
};
