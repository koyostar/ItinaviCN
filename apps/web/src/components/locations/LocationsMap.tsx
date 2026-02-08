"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { LocationResponse } from "@itinavi/schema";
import { Box, Paper, Typography } from "@mui/material";

interface LocationsMapProps {
  locations: LocationResponse[];
}

// Declare global AMap types
declare global {
  interface Window {
    AMap?: any;
    _AMapSecurityConfig?: {
      securityJsCode: string;
    };
  }
}

export function LocationsMap({ locations }: LocationsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapError, setMapError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Filter locations that have valid coordinates - memoize to prevent recalculation
  const locationsWithCoords = useMemo(() => {
    return locations.filter((loc) => {
      if (loc.latitude === null || loc.longitude === null) return false;
      const lat = Number(loc.latitude);
      const lng = Number(loc.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });
  }, [locations]);

  const updateMarkers = useCallback(() => {
    if (!mapInstance.current || !window.AMap) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (locationsWithCoords.length === 0) return;

    // Add new markers - filter and validate coordinates
    const newMarkers = locationsWithCoords
      .filter((location) => {
        const lng = Number(location.longitude);
        const lat = Number(location.latitude);
        return !isNaN(lng) && !isNaN(lat);
      })
      .map((location) => {
        const lng = Number(location.longitude);
        const lat = Number(location.latitude);
        
        const marker = new window.AMap.Marker({
          position: [lng, lat],
          title: location.name,
          map: mapInstance.current,
        });

        // Add info window on click
        const infoWindow = new window.AMap.InfoWindow({
          content: `
          <div style="padding: 8px; max-width: 200px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${location.name}</div>
            <div style="font-size: 12px; color: #666;">
              <div>${location.category}</div>
              ${location.address ? `<div style="margin-top: 4px;">${location.address}</div>` : ""}
            </div>
          </div>
        `,
        });

        marker.on("click", () => {
          infoWindow.open(mapInstance.current, marker.getPosition());
        });

        return marker;
      });

    markersRef.current = newMarkers;

    // Fit map to show all markers
    if (newMarkers.length > 1) {
      // Use setFitView to automatically fit all markers with padding
      mapInstance.current.setFitView(newMarkers, false, [50, 50, 50, 50]);
    } else if (newMarkers.length === 1) {
      // Center on single location
      const position = newMarkers[0].getPosition();
      mapInstance.current.setCenter(position);
      mapInstance.current.setZoom(14);
    }
  }, [locationsWithCoords]);

  const initMap = useCallback(() => {
    if (!mapContainer.current || !window.AMap) return;

    try {
      // Default center (Beijing)
      let center: [number, number] = [116.397428, 39.90923];
      let zoom = 10;

      // If we have locations with coordinates, center on the first one
      if (locationsWithCoords.length > 0) {
        const firstLoc = locationsWithCoords[0];
        const lng = Number(firstLoc.longitude);
        const lat = Number(firstLoc.latitude);
        
        // Validate coordinates are valid numbers
        if (!isNaN(lng) && !isNaN(lat)) {
          center = [lng, lat];
          zoom = 12;
        }
      }

      // Create map instance
      const map = new window.AMap.Map(mapContainer.current, {
        zoom: zoom,
        center: center,
        viewMode: "3D",
        pitch: 0,
      });

      mapInstance.current = map;
      setIsLoading(false);

      // Add markers after map is initialized
      if (locationsWithCoords.length > 0) {
        updateMarkers();
      }
    } catch (error) {
      console.error("Failed to initialize map:", error);
      setMapError("Failed to initialize map");
      setIsLoading(false);
    }
  }, [locationsWithCoords, updateMarkers]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_AMAP_JS_API_KEY;
    const securityCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_JSCODE;

    if (!apiKey) {
      setMapError(
        "Amap JS API key not configured. Please set NEXT_PUBLIC_AMAP_JS_API_KEY in your .env.local file."
      );
      setIsLoading(false);
      return;
    }

    // Set security code if available
    if (securityCode) {
      window._AMapSecurityConfig = {
        securityJsCode: securityCode,
      };
    }

    // Load Amap script if not already loaded
    if (!window.AMap) {
      const script = document.createElement("script");
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}`;
      script.async = true;
      script.onload = () => {
        initMap();
      };
      script.onerror = () => {
        setMapError("Failed to load Amap JS API");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Cleanup markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
      }
    };
  }, [initMap]);

  // Update markers when locations change
  useEffect(() => {
    if (mapInstance.current && window.AMap) {
      updateMarkers();
    }
  }, [updateMarkers]);

  if (mapError) {
    return (
      <Paper
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          bgcolor: "error.light",
        }}
      >
        <Typography color="error.dark" align="center">
          {mapError}
        </Typography>
      </Paper>
    );
  }

  if (locationsWithCoords.length === 0) {
    return (
      <Paper
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          bgcolor: "grey.50",
        }}
      >
        <Typography color="text.secondary" align="center">
          No locations with coordinates to display on map.
          <br />
          Add locations with latitude and longitude to see them here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "8px",
          }}
        >
          <Typography>Loading map...</Typography>
        </Box>
      )}
    </Box>
  );
}
