/* eslint-disable react/prop-types */
// components/AttendanceStats.jsx
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  WatchLater,
  TrendingUp,
} from "@mui/icons-material";
import React from "react";

const AttendanceStats = ({ summary }) => {
  const theme = useTheme();

  const stats = [
    {
      label: "Present",
      value: summary?.totalPresent,
      icon: <CheckCircle />,
      color: "success",
    },
    {
      label: "Absent",
      value: summary?.totalAbsent,
      icon: <Cancel />,
      color: "error",
    },
    {
      label: "Late",
      value: summary?.totalLate,
      icon: <WatchLater />,
      color: "warning",
    },
    {
      label: "Total Records",
      value: summary?.total,
      icon: <TrendingUp />,
      color: "info",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.label}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              background: `linear-gradient(135deg, ${alpha(
                theme.palette[stat.color].main,
                0.9
              )} 0%, ${theme.palette[stat.color].dark} 100%)`,
              color: "white",
            }}
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2">{stat.label}</Typography>
                </Box>
                {stat.icon &&
                  React.cloneElement(stat.icon, {
                    sx: { fontSize: 40, opacity: 0.8 },
                  })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AttendanceStats;
