/* eslint-disable react/prop-types */
"use client";

import { Box, Typography, CardContent, Divider, Chip } from "@mui/material";
import { InfoCard } from "./customStyle";

export const InfoSection = ({ title, icon: Icon, children }) => (
  <InfoCard>
    <CardContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Icon /> {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </CardContent>
  </InfoCard>
);

export const StatBox = ({ label, value, color = "primary" }) => (
  <Box
    sx={{ textAlign: "center", p: 2, bgcolor: "#f5f5f5", borderRadius: "12px" }}
  >
    <Typography variant="h4" fontWeight="bold" color={color}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

export const StatusChip = ({ label, status }) => (
  <Chip
    label={label}
    size="small"
    color={
      status === "success"
        ? "success"
        : status === "error"
        ? "error"
        : "warning"
    }
    sx={{ mt: 0.5, fontWeight: "bold" }}
  />
);
