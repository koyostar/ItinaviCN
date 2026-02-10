"use client";

import { Box, Typography, Stack } from "@mui/material";
import { ROLE_DESCRIPTIONS } from "@/lib/trip-helpers";
import type { TripRole } from "@itinavi/schema";

const ROLES: TripRole[] = ["OWNER", "EDITOR", "VIEWER"];

export function RolePermissionsInfo() {
  return (
    <Box sx={{ bgcolor: "action.hover", p: 2, borderRadius: 1 }}>
      <Typography 
        variant="caption" 
        sx={{ fontWeight: 600 }} 
        gutterBottom 
        display="block"
        component="h3"
      >
        Role Permissions:
      </Typography>
      <Stack spacing={0.5} component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {ROLES.map((role) => (
          <Typography 
            key={role} 
            variant="caption" 
            color="text.secondary"
            component="li"
          >
            • <strong>{role.charAt(0) + role.slice(1).toLowerCase()}:</strong> {ROLE_DESCRIPTIONS[role]}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}
