"use client";

import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface PlaceSuggestion {
  name: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  city?: string;
  district?: string;
  province?: string;
  adcode?: string;
  citycode?: string;
  amapPoiId?: string;
}

interface AmapPlaceAutocompleteProps {
  label: string;
  value: string;
  onPlaceSelect: (place: {
    name: string;
    address: string;
    location?: { lat: number; lng: number };
    city?: string;
    district?: string;
    province?: string;
    adcode?: string;
    citycode?: string;
    amapPoiId?: string;
  }) => void;
  placeholder?: string;
  required?: boolean;
  city?: string;
}

export function AmapPlaceAutocomplete({
  label,
  value,
  onPlaceSelect,
  placeholder,
  required = false,
  city = "",
}: AmapPlaceAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSearch = async (searchValue: string) => {
    if (!searchValue || searchValue.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);

    try {
      // Using Amap (Gaode Maps) Web Service API
      const apiKey = process.env.NEXT_PUBLIC_AMAP_WEB_SERVICE_KEY;

      if (!apiKey) {
        console.warn(
          "NEXT_PUBLIC_AMAP_WEB_SERVICE_KEY not configured. Please set it in your .env.local file"
        );
        // Fallback: mock data for development
        setTimeout(() => {
          const mockResults: PlaceSuggestion[] = [
            {
              name: `${searchValue} 酒店`,
              address: `北京市朝阳区${searchValue}路123号`,
              amapPoiId: "mock-1",
            },
            {
              name: `${searchValue} 宾馆`,
              address: `北京市海淀区${searchValue}街456号`,
              amapPoiId: "mock-2",
            },
          ];
          setOptions(mockResults);
          setLoading(false);
        }, 500);
        return;
      }

      // Use Amap Input Tips API for autocomplete
      const cityParam = city ? `&city=${encodeURIComponent(city)}` : "";
      const response = await fetch(
        `https://restapi.amap.com/v3/assistant/inputtips?key=${apiKey}&keywords=${encodeURIComponent(searchValue)}${cityParam}&type=&datatype=all`
      );

      const data = await response.json();

      if (data.status === "1" && data.tips) {
        const suggestions: PlaceSuggestion[] = (
          data.tips as Array<{
            location?: string;
            name: string;
            address?: string;
            district?: string;
            adcode?: string;
            citycode?: string;
            id?: string;
          }>
        )
          .filter((item) => item.location) // Only include results with location
          .map((item) => {
            const [lng, lat] = item.location!.split(",").map(Number);
            
            // Parse district to extract city and province
            // Format is usually: "省份省市区" or "直辖市区"
            const districtParts = item.district ? item.district.split(/省|市/) : [];
            const province = districtParts[0] || undefined;
            const city = districtParts[1] || districtParts[0] || undefined;
            const district = item.district || undefined;
            
            return {
              name: item.name,
              address: item.address || item.district || "",
              location: lng && lat ? { lat, lng } : undefined,
              city,
              district,
              province,
              adcode: item.adcode,
              citycode: item.citycode,
              amapPoiId: item.id,
            };
          });
        setOptions(suggestions);
      } else {
        // Handle specific error codes
        if (data.infocode === "USERKEY_PLAT_NOMATCH") {
          console.error(
            "Amap API Error: USERKEY_PLAT_NOMATCH\n" +
              "Your API key is not configured for Web Service API.\n" +
              "Solution:\n" +
              "1. Go to https://console.amap.com/dev/key/app\n" +
              '2. Check "应用管理" (Application Management)\n' +
              '3. Ensure your key has "Web服务" (Web Service) enabled\n' +
              "4. Add your domain to the whitelist if required\n" +
              '5. Or create a new key specifically for "Web服务API"'
          );
        } else {
          console.warn("Amap API error:", data.info || data.infocode);
        }
        setOptions([]);
      }
    } catch (error) {
      console.error("Amap search error:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      value={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);

        // Debounce the search
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
          handleSearch(newInputValue);
        }, 300);
      }}
      onChange={(event, newValue) => {
        if (typeof newValue === "object" && newValue !== null) {
          onPlaceSelect({
            name: newValue.name,
            address: newValue.address,
            location: newValue.location,
            city: newValue.city,
            district: newValue.district,
            province: newValue.province,
            adcode: newValue.adcode,
            citycode: newValue.citycode,
            amapPoiId: newValue.amapPoiId,
          });
        } else if (typeof newValue === "string") {
          // Handle manual text input
          onPlaceSelect({
            name: newValue,
            address: "",
          });
        }
      }}
      onBlur={() => {
        // Handle manual input when user leaves the field without selecting
        if (inputValue && inputValue !== value) {
          onPlaceSelect({
            name: inputValue,
            address: "",
          });
        }
      }}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        return option.name;
      }}
      renderOption={(props, option) => {
        if (typeof option === "string") return null;
        return (
          <li {...props} key={option.amapPoiId || option.name}>
            <div>
              <div style={{ fontWeight: 500 }}>{option.name}</div>
              <div style={{ fontSize: "0.875rem", color: "gray" }}>
                {option.address}
              </div>
            </div>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
