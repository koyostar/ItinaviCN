import { Box, Divider, Stack, Typography } from "@mui/material";
import { getUTCOffset } from "@/lib/utils/timezone";
import { formatUTCTime, calculateDuration } from "@/lib/dateUtils";

interface FlightDetails {
  flightNo?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureAirportAddress?: string;
  arrivalAirportAddress?: string;
  terminal?: string;
  airline?: string;
  seat?: string;
}

interface FlightCardProps {
  title: string;
  startDateTime: string;
  endDateTime?: string | null;
  startTimezone?: string | null;
  endTimezone?: string | null;
  status: string;
  details: FlightDetails | null;
  statusColor: "default" | "primary" | "success" | "error";
  typeColor: "primary" | "secondary" | "success" | "error" | "warning" | "info";
}

export function FlightCard({
  title,
  startDateTime,
  endDateTime,
  startTimezone,
  endTimezone,
  status,
  details,
  statusColor,
  typeColor,
}: FlightCardProps) {
  const cities = title.split(" - ");
  const departureCity = cities[0] || "Departure";
  const arrivalCity = cities[1] || "Arrival";

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 2, md: 3 }}
      alignItems={{ xs: "flex-start", md: "center" }}
    >
        {/* Departure */}
        <Box sx={{ textAlign: "left" }}>
        <Typography variant="subtitle1" fontWeight="600">
          {departureCity}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {details?.departureAirport || ""}
        </Typography>
        {startTimezone && (
          <Typography variant="caption" color="text.secondary">
            {formatUTCTime(startDateTime)} ({getUTCOffset(startTimezone)})
          </Typography>
        )}
      </Box>

      {/* Arrow with flight number */}
      <Box sx={{ 
        textAlign: "center", 
        minWidth: 100,
        alignSelf: { xs: "center", md: "auto" },
        mx: { xs: 0, md: 2 }
      }}>
        {details?.flightNo && (
          <Typography variant="caption" color="primary" fontWeight="600">
            ✈️ {details.flightNo}
          </Typography>
        )}
        <Divider variant="middle" flexItem sx={{ my: 1 }} />
        {endDateTime && (
          <Typography variant="caption" color="text.secondary" display="block">
            {calculateDuration(startDateTime, endDateTime)}
          </Typography>
        )}{" "}
      </Box>

      {/* Arrival */}
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="subtitle1" fontWeight="600">
          {arrivalCity}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {details?.arrivalAirport || ""}
        </Typography>
        {endTimezone && (
          <Typography variant="caption" color="text.secondary">
            {endDateTime ? formatUTCTime(endDateTime) : "TBD"} (
            {getUTCOffset(endTimezone)})
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
