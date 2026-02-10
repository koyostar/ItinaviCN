"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage } = useUserPreferences();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push("/");
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => router.push(isAuthenticated ? "/trips" : "/")}
          >
            ItinaviCN
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            {isAuthenticated && (
              <Button
                color={pathname === "/trips" ? "primary" : "inherit"}
                onClick={() => router.push("/trips")}
              >
                My Trips
              </Button>
            )}

            <Box sx={{ borderLeft: 1, borderColor: "divider", height: 24 }} />

            <Button
              size="small"
              variant={language === "zh" ? "contained" : "outlined"}
              onClick={() => setLanguage("zh")}
              sx={{ minWidth: 50 }}
            >
              中文
            </Button>
            <Button
              size="small"
              variant={language === "en" ? "contained" : "outlined"}
              onClick={() => setLanguage("en")}
              sx={{ minWidth: 50 }}
            >
              EN
            </Button>

            <Box sx={{ borderLeft: 1, borderColor: "divider", height: 24 }} />

            {isAuthenticated ? (
              <>
                <IconButton onClick={handleMenuOpen} color="primary">
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {user?.displayName || user?.username}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => router.push("/register")}
                >
                  Register
                </Button>
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
