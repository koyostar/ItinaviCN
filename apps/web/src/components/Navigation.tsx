"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage } = useUserPreferences();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => router.push("/trips")}
          >
            ItinaviCN
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              color={pathname === "/trips" ? "primary" : "inherit"}
              onClick={() => router.push("/trips")}
            >
              My Trips
            </Button>

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
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
