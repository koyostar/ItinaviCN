"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Stack
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh", textAlign: "center" }}
      >
        <FlightTakeoffIcon sx={{ fontSize: 80, color: "primary.main" }} />

        <Typography variant="h2" component="h1" fontWeight="bold">
          ItinaviCN
        </Typography>

        <Typography variant="h5" color="text.secondary">
          Plan your China trip with itineraries, maps, and expense tracking
        </Typography>

        <Box>
          <Button
            variant="contained"
            size="large"
            href="/trips"
            sx={{ px: 4, py: 1.5 }}
          >
            View My Trips
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
