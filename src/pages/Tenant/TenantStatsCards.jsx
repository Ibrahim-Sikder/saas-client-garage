/* eslint-disable react/prop-types */

import { Grid, Card, CardContent, Typography } from "@mui/material";
import {
  FaUsers,
  FaCheckCircle,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";

const TenantStatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Tenants",
      value: stats.total,
      icon: <FaUsers size={32} style={{ marginBottom: 8 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Active Tenants",
      value: stats.active,
      icon: <FaCheckCircle size={32} style={{ marginBottom: 8 }} />,
      gradient: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    },
    {
      title: "Blocked Tenants",
      value: stats.blocked,
      icon: <FaLock size={32} style={{ marginBottom: 8 }} />,
      gradient: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
    },
    {
      title: "Unpaid Tenants",
      value: stats.unpaid,
      icon: <FaExclamationTriangle size={32} style={{ marginBottom: 8 }} />,
      gradient: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <Card sx={{ borderRadius: "16px", background: card.gradient }}>
            <CardContent sx={{ color: "white", textAlign: "center" }}>
              {card.icon}
              <Typography variant="h4" fontWeight="bold">
                {card.value}
              </Typography>
              <Typography variant="body1">{card.title}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TenantStatsCards;
