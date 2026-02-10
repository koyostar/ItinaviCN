"use client";

import type { LocationResponse } from "@itinavi/schema";
import { Box, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface LocationsMapProps {
  locations: LocationResponse[];
  onLocationClick?: (locationId: string) => void;
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

export function LocationsMap({
  locations,
  onLocationClick,
}: LocationsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const markersByLocationId = useRef<Map<string, any>>(new Map());
  const markerClickHandlers = useRef<Map<string, () => void>>(new Map());
  const placeSearchRef = useRef<any>(null);
  const [mapError, setMapError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Filter locations that have valid coordinates OR amapPoiId - memoize to prevent recalculation
  const validLocations = useMemo(() => {
    console.log("[LocationsMap] Received locations:", locations);
    const valid = locations.filter((loc) => {
      console.log("[LocationsMap] Checking location:", {
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        amapPoiId: loc.amapPoiId,
        city: loc.city,
      });

      // Has valid coordinates
      if (loc.latitude !== null && loc.longitude !== null) {
        const lat = Number(loc.latitude);
        const lng = Number(loc.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          return true;
        }
      }

      // Or has amapPoiId (we can fetch coordinates)
      if (loc.amapPoiId) {
        return true;
      }

      return false;
    });
    console.log(
      "[LocationsMap] Valid locations (with coords or amapPoiId):",
      valid
    );
    return valid;
  }, [locations]);

  // Resolve amapPoiId to coordinates and display POIs natively on map
  const resolveAndDisplayPois = useCallback(async () => {
    if (!window.AMap || !placeSearchRef.current || !mapInstance.current) return;

    const locationsWithPoiId = validLocations.filter((loc) => loc.amapPoiId);
    const locationsWithCoords = validLocations.filter(
      (loc) => !loc.amapPoiId && loc.latitude !== null && loc.longitude !== null
    );

    console.log("[LocationsMap] Locations with amapPoiId:", locationsWithPoiId);
    console.log(
      "[LocationsMap] Locations with coords only:",
      locationsWithCoords
    );

    // Display POIs using Amap's native search - this shows official POI markers
    for (const loc of locationsWithPoiId) {
      try {
        placeSearchRef.current.getDetails(
          loc.amapPoiId,
          (status: string, result: any) => {
            if (
              status === "complete" &&
              result.info === "OK" &&
              result.poiList?.pois?.[0]
            ) {
              const poi = result.poiList.pois[0];
              console.log(`[LocationsMap] Found POI for ${loc.name}:`, poi);

              // Create marker for this POI using Amap's native display
              if (poi.location) {
                // Validate coordinates before creating marker
                const lng = Number(poi.location.lng);
                const lat = Number(poi.location.lat);

                if (isNaN(lng) || isNaN(lat)) {
                  console.warn(
                    `[LocationsMap] Invalid coordinates for POI ${loc.name}:`,
                    { lng: poi.location.lng, lat: poi.location.lat }
                  );
                  return;
                }

                const marker = new window.AMap.Marker({
                  position: [lng, lat],
                  title: poi.name,
                  map: mapInstance.current,
                });

                // Store marker by location ID
                markersByLocationId.current.set(loc.id, marker);

                // Show info window with link to open Amap native view
                const clickHandler = () => {
                  // Extract rating and cost from biz_ext if available
                  const rating = poi.biz_ext?.rating || poi.rating;
                  const cost = poi.biz_ext?.cost || poi.cost;
                  const photos = poi.photos || [];
                  const opentime = poi.opentime2 || poi.open_time;

                  // Debug: log the entire poi object to see what fields are available
                  console.log(
                    "[LocationsMap] POI details for",
                    poi.name,
                    ":",
                    poi
                  );
                  console.log("[LocationsMap] biz_ext:", poi.biz_ext);
                  console.log("[LocationsMap] opentime found:", opentime);

                  const infoWindow = new window.AMap.InfoWindow({
                    content: `
                    <div style="padding: 12px; max-width: 300px;">
                      ${
                        photos.length > 0
                          ? `
                        <div style="margin: 8px 0;">
                          <div style="font-size: 11px; color: #999; margin-bottom: 4px;">📷 Photos (${photos.length})</div>
                          <div style="display: flex; gap: 4px; overflow-x: auto;">
                            ${photos
                              .slice(0, 3)
                              .map(
                                (photo: any) => `
                              <img src="${photo.url || photo}" alt="POI photo" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
                            `
                              )
                              .join("")}
                            ${photos.length > 3 ? `<div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 4px; font-size: 11px; color: #999;">+${photos.length - 3}</div>` : ""}
                          </div>
                        </div>
                      `
                          : ""
                      }
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <div style="font-weight: 600; font-size: 15px;">${poi.name}</div>
                        ${rating ? `<div style="font-size: 12px; color: #faad14; white-space: nowrap; margin-left: 8px;">⭐ ${rating}</div>` : ""}
                      </div>
                      ${poi.address ? `<div style="font-size: 12px; color: #666; margin-bottom: 6px;">📍 ${poi.address}</div>` : ""}
                      ${cost ? `<div style="font-size: 12px; color: #ff4d4f; margin-bottom: 6px;">💰 ${cost}</div>` : ""}                      
                      ${poi.tel ? `<div style="font-size: 12px; color: #666; margin-bottom: 6px;">📞 ${poi.tel}</div>` : ""}
                      ${poi.website ? `<div style="font-size: 12px; margin-bottom: 6px;">🌐 <a href="${poi.website}" target="_blank" style="color: #1890ff; text-decoration: none;">${poi.website.length > 30 ? poi.website.substring(0, 30) + "..." : poi.website}</a></div>` : ""}
                      ${opentime ? `<div style="font-size: 12px; color: #666; margin-bottom: 6px;">🕐 ${opentime}</div>` : ""}
                      
                      ${loc.category ? `<div style="font-size: 12px; color: #52c41a; margin-bottom: 6px;">📂 Category: ${loc.category}</div>` : ""}

                      
                      ${loc.notes ? `<div style="font-size: 12px; color: #999; margin: 10px 0; padding: 8px; background: #f9f9f9; border-radius: 4px; border-left: 3px solid #1890ff;">📝 ${loc.notes}</div>` : ""}
                      
                      <a href="https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(poi.name)}&src=itinavi&coordinate=gaode&callnative=1" 
                         target="_blank" 
                         style="display: inline-block; width: 100%; padding: 10px 16px; background: #1890ff; color: white; text-decoration: none; border-radius: 4px; font-size: 13px; text-align: center; margin-top: 8px; font-weight: 500;">
                        Open in Amap App
                      </a>
                    </div>
                  `,
                  });
                  infoWindow.open(mapInstance.current, marker.getPosition());
                };

                marker.on("click", clickHandler);
                markerClickHandlers.current.set(loc.id, clickHandler);

                markersRef.current.push(marker);
              }
            } else {
              console.warn(
                `[LocationsMap] Failed to find POI ${loc.amapPoiId} for ${loc.name}`
              );
            }
          }
        );
      } catch (error) {
        console.error(
          `[LocationsMap] Error displaying POI for ${loc.name}:`,
          error
        );
      }
    }

    // For locations without amapPoiId, create markers from coordinates
    const coordMarkers = locationsWithCoords
      .filter((location) => {
        const lng = Number(location.longitude);
        const lat = Number(location.latitude);
        return !isNaN(lng) && !isNaN(lat);
      })
      .map((location) => {
        const lng = Number(location.longitude);
        const lat = Number(location.latitude);
        console.log(
          "[LocationsMap] Creating marker for:",
          location.name,
          "at",
          [lng, lat]
        );

        const marker = new window.AMap.Marker({
          position: [lng, lat],
          title: location.name,
          map: mapInstance.current,
        });

        const infoWindow = new window.AMap.InfoWindow({
          content: `
          <div style="padding: 12px; max-width: 280px;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px;">${location.name}</div>
            <div style="font-size: 12px; color: #1890ff; margin-bottom: 4px;">🏷️ ${location.category}</div>
            ${location.province || location.city || location.district ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">📌 ${[location.province, location.city, location.district].filter(Boolean).join(" ")}</div>` : ""}
            ${location.address ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">📍 ${location.address}</div>` : ""}
            ${location.latitude && location.longitude ? `<div style="font-size: 11px; color: #999; margin-bottom: 4px;">📍 ${Number(location.latitude).toFixed(6)}, ${Number(location.longitude).toFixed(6)}</div>` : ""}
            ${location.notes ? `<div style="font-size: 12px; color: #999; margin-top: 6px; padding-top: 6px; border-top: 1px solid #eee;">📝 ${location.notes}</div>` : ""}
          </div>
        `,
        });

        const clickHandler = () => {
          infoWindow.open(mapInstance.current, marker.getPosition());
        };

        marker.on("click", clickHandler);

        // Store marker by location ID
        markersByLocationId.current.set(location.id, marker);
        markerClickHandlers.current.set(location.id, clickHandler);

        return marker;
      });

    markersRef.current.push(...coordMarkers);

    // Fit map to show all markers after a brief delay to ensure all POI markers are added
    setTimeout(() => {
      if (markersRef.current.length > 1) {
        mapInstance.current.setFitView(
          markersRef.current,
          false,
          [50, 50, 50, 50]
        );
      } else if (markersRef.current.length === 1) {
        const position = markersRef.current[0].getPosition();
        mapInstance.current.setCenter(position);
        mapInstance.current.setZoom(14);
      }
    }, 500);
  }, [validLocations]);

  const updateMarkers = useCallback(() => {
    if (!mapInstance.current || !window.AMap || !placeSearchRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    markersByLocationId.current.clear();
    markerClickHandlers.current.clear();

    if (validLocations.length === 0) return;

    // Display all locations (POIs and coordinate-based)
    resolveAndDisplayPois();
  }, [validLocations, resolveAndDisplayPois]);

  // Handle location click from outside (e.g., from location card)
  useEffect(() => {
    if (!onLocationClick) return;

    const handleLocationClick = (locationId: string) => {
      const marker = markersByLocationId.current.get(locationId);
      const clickHandler = markerClickHandlers.current.get(locationId);

      if (marker && clickHandler && mapInstance.current) {
        // Pan to marker and trigger its click handler
        mapInstance.current.setCenter(marker.getPosition());
        mapInstance.current.setZoom(16);
        setTimeout(() => {
          clickHandler();
        }, 300);
      }
    };

    // Expose the handler to parent via callback
    (window as any).__mapLocationClickHandler = handleLocationClick;
  }, [onLocationClick]);

  const initMap = useCallback(() => {
    if (!mapContainer.current || !window.AMap) return;

    try {
      // Default center (Beijing)
      let center: [number, number] = [116.397428, 39.90923];
      let zoom = 10;

      // If we have locations with coordinates, center on the first one
      const locationsWithCoords = validLocations.filter(
        (loc) => loc.latitude !== null && loc.longitude !== null
      );

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

      // Initialize PlaceSearch service for resolving amapPoiId
      window.AMap.plugin("AMap.PlaceSearch", () => {
        placeSearchRef.current = new window.AMap.PlaceSearch({
          extensions: "all",
        });

        setIsLoading(false);

        // Display locations after PlaceSearch is ready
        if (validLocations.length > 0) {
          updateMarkers();
        }
      });
    } catch (error) {
      console.error("Failed to initialize map:", error);
      setMapError("Failed to initialize map");
      setIsLoading(false);
    }
  }, [validLocations, updateMarkers]);

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
    if (mapInstance.current && window.AMap && placeSearchRef.current) {
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

  if (validLocations.length === 0) {
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
          No locations with coordinates or Amap POI IDs to display on map.
          <br />
          Add locations with latitude/longitude or select from Amap autocomplete
          to see them here.
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
