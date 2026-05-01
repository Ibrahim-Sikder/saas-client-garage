/* eslint-disable react/prop-types */
import { CalendarMonth, AccountBalance, ShowChart } from "@mui/icons-material";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import SummaryCards from "../../components/SummaryCard";

const IncomeStatisticsCard = ({ accountSummary }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const incomeData = accountSummary?.data?.income || {};
  const monthly = incomeData.monthly || {};
  const yearly = incomeData.yearly || {};
  const total = incomeData.total || {};

  const cards = [
    {
      title: "Monthly Income",
      value: `৳${monthly.totalAmount?.toLocaleString() || 0}`,
      subtitle: `Other Income: ৳${
        monthly.totalOtherIncome?.toLocaleString() || 0
      }`,
      color: "#10b981",
      bgColor: "#ecfdf5",
      icon: <CalendarMonth />,
    },
    {
      title: "Yearly Income",
      value: `৳${yearly.totalAmount?.toLocaleString() || 0}`,
      subtitle: `Other Income: ৳${
        yearly.totalOtherIncome?.toLocaleString() || 0
      }`,
      color: "#3b82f6",
      bgColor: "#eff6ff",
      icon: <AccountBalance />,
    },
    {
      title: "Total Income",
      value: `৳${total.totalAmount?.toLocaleString() || 0}`,
      subtitle: `Other Income: ৳${
        total.totalOtherIncome?.toLocaleString() || 0
      }`,
      color: "#f59e0b",
      bgColor: "#fef3c7",
      icon: <ShowChart />,
    },
  ];

  return (
    <Box sx={{ p: isMobile ? 0 : 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 3, color: "#2c3e50", textAlign: "center" }}
      >
        Income Statistics
      </Typography>

      <SummaryCards cards={cards} />
    </Box>
  );
};

export default IncomeStatisticsCard;
