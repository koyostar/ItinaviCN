"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
  Alert,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRegisterForm } from "@/hooks";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    email,
    setEmail,
    displayName,
    setDisplayName,
    error,
    loading,
    handleSubmit,
  } = useRegisterForm();

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/trips");
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Stack spacing={3}>
            <Typography variant="h4" component="h1" textAlign="center">
              Create Account
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                  disabled={loading}
                  helperText="At least 3 characters"
                />

                <TextField
                  label="Email (optional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  disabled={loading}
                />

                <TextField
                  label="Display Name (optional)"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  fullWidth
                  disabled={loading}
                />

                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  disabled={loading}
                  helperText="At least 6 characters"
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  fullWidth
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Register"}
                </Button>
              </Stack>
            </form>

            <Typography textAlign="center" variant="body2">
              Already have an account?{" "}
              <MuiLink component={Link} href="/login">
                Login here
              </MuiLink>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
