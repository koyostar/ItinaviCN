"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to trips if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/trips");
    }
  }, [isAuthenticated, router]);

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

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="large"
            href="/login"
            sx={{ px: 4, py: 1.5 }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            size="large"
            href="/register"
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
