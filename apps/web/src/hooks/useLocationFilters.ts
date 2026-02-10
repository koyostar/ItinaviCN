import { useState, useEffect, useMemo } from "react";
import type { LocationResponse } from "@itinavi/schema";

export function useLocationFilters(locations: LocationResponse[]) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique provinces from locations
  const provinces = useMemo(() => {
    const uniqueProvinces = new Set<string>();
    locations.forEach((location) => {
      if (location.province) {
        uniqueProvinces.add(location.province);
      }
    });
    return Array.from(uniqueProvinces).sort();
  }, [locations]);

  // Extract unique cities from locations (filtered by selected province)
  const cities = useMemo(() => {
    const uniqueCities = new Set<string>();
    locations.forEach((location) => {
      // Only include cities from selected province, or all if no province selected
      if (
        location.city &&
        (!selectedProvince || location.province === selectedProvince)
      ) {
        uniqueCities.add(location.city);
      }
    });
    return Array.from(uniqueCities).sort();
  }, [locations, selectedProvince]);

  // Extract unique categories from locations
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    locations.forEach((location) => {
      uniqueCategories.add(location.category);
    });
    return Array.from(uniqueCategories).sort();
  }, [locations]);

  // Clear child filters when parent filter changes
  useEffect(() => {
    // When province changes, clear city
    setSelectedCity(null);
  }, [selectedProvince]);

  // Filter locations by selected city, province, and category
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    if (selectedProvince) {
      filtered = filtered.filter(
        (location) => location.province === selectedProvince
      );
    }
    if (selectedCity) {
      filtered = filtered.filter((location) => location.city === selectedCity);
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (location) => location.category === selectedCategory
      );
    }

    return filtered;
  }, [locations, selectedCity, selectedProvince, selectedCategory]);

  return {
    // Filters
    selectedCity,
    selectedProvince,
    selectedCategory,
    setSelectedCity,
    setSelectedProvince,
    setSelectedCategory,
    
    // Available filter options
    provinces,
    cities,
    categories,
    
    // Filtered result
    filteredLocations,
  };
}
