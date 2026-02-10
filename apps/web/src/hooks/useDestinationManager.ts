import { useState } from "react";

export interface DestinationInput {
  country: string;
  cities: string[];
}

export function useDestinationManager(
  initialDestinations: DestinationInput[] = [{ country: "", cities: [""] }]
) {
  const [destinations, setDestinations] =
    useState<DestinationInput[]>(initialDestinations);

  const handleAddDestination = () => {
    setDestinations([...destinations, { country: "", cities: [""] }]);
  };

  const handleRemoveDestination = (index: number) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((_, i) => i !== index));
    }
  };

  const handleCountryChange = (index: number, value: string) => {
    const updated = [...destinations];
    updated[index].country = value;
    setDestinations(updated);
  };

  const handleAddCity = (destIndex: number) => {
    const updated = [...destinations];
    updated[destIndex].cities.push("");
    setDestinations(updated);
  };

  const handleRemoveCity = (destIndex: number, cityIndex: number) => {
    const updated = [...destinations];
    if (updated[destIndex].cities.length > 1) {
      updated[destIndex].cities = updated[destIndex].cities.filter(
        (_, i) => i !== cityIndex
      );
      setDestinations(updated);
    }
  };

  const handleCityChange = (
    destIndex: number,
    cityIndex: number,
    value: string
  ) => {
    const updated = [...destinations];
    updated[destIndex].cities[cityIndex] = value;
    setDestinations(updated);
  };

  const getValidDestinations = () => {
    return destinations
      .filter((d) => d.country.trim() && d.cities.some((c) => c.trim()))
      .map((d) => ({
        country: d.country.trim(),
        cities: d.cities.filter((c) => c.trim()).map((c) => c.trim()),
      }));
  };

  return {
    destinations,
    handleAddDestination,
    handleRemoveDestination,
    handleCountryChange,
    handleAddCity,
    handleRemoveCity,
    handleCityChange,
    getValidDestinations,
  };
}
