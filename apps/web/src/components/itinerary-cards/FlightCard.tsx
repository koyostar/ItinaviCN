import { Box, Chip, Stack, Typography } from "@mui/material";

function getUTCOffset(timezone: string): string {
  try {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(
      date.toLocaleString("en-US", { timeZone: timezone }),
    );
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    const sign = offset >= 0 ? "+" : "";
    return `UTC${sign}${offset}`;
  } catch {
    return timezone;
  }
}

interface FlightDetails {
  flightNo?: string;
  departAirport?: string;
  arriveAirport?: string;
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
  // Calculate flight duration
  const calculateDuration = (): string => {
    if (!endDateTime) return '';
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip label="Flight" size="small" color={typeColor} />
        <Chip
          label={status}
          size="small"
          color={statusColor}
          variant="outlined"
        />
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
        {/* Departure */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="600">
            {departureCity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {details?.departAirport || ""}
          </Typography>
          {startTimezone && (
            <Typography variant="caption" color="text.secondary">
              {new Date(startDateTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              ({getUTCOffset(startTimezone)})
            </Typography>
          )}
        </Box>

        {/* Arrow with flight number */}
        <Box sx={{ textAlign: "center", minWidth: 100 }}>
          {details?.flightNo && (
            <Typography variant="caption" color="primary" fontWeight="600">
              ✈️ {details.flightNo}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            ————→
          </Typography>          {endDateTime && (
            <Typography variant="caption" color="text.secondary" display="block">
              {calculateDuration()}
            </Typography>
          )}        </Box>

        {/* Arrival */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="600">
            {arrivalCity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {details?.arriveAirport || ""}
          </Typography>
          {endTimezone && (
            <Typography variant="caption" color="text.secondary">
              {endDateTime
                ? new Date(endDateTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "TBD"}{" "}
              ({getUTCOffset(endTimezone)})
            </Typography>
          )}
        </Box>
      </Box>

      {details?.terminal && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          Terminal {details.terminal}
        </Typography>
      )}
    </Box>
  );
}
