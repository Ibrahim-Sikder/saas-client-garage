/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import SummaryCards from "../../components/SummaryCard";

const RoleStats = ({ totalRoles, activeRoles, totalUsers, roleTypes }) => {
  const cards = [
    {
      title: "Total Roles",
      value: totalRoles,
      color: "#1976d2",
      bgColor: "#1976d2",
      icon: null,
    },
    {
      title: "Active Roles",
      value: activeRoles,
      color: "#2e7d32",
      bgColor: "#2e7d32",
      icon: null,
    },
    {
      title: "Total Users",
      value: totalUsers,
      color: "#ed6c02",
      bgColor: "#ed6c02",
      icon: null,
    },
    {
      title: "Role Types",
      value: roleTypes,
      color: "#0288d1",
      bgColor: "#0288d1",
      icon: null,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Role Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Create and manage user roles with specific permissions and access levels
      </Typography>

      <SummaryCards cards={cards} singleRow />
    </Box>
  );
};

export default RoleStats;
