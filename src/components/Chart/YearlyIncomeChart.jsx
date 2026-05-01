/* eslint-disable no-unused-vars */
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";
import { useGetAllIncomesQuery } from "../../redux/api/income";
import Loading from "../Loading/Loading";
import { useTenantDomain } from "../../hooks/useTenantDomain";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function YearlyIncomeChart() {
  const [radius, setRadius] = React.useState(50);
  const [itemNb, setItemNb] = React.useState(12);
  const [skipAnimation, setSkipAnimation] = React.useState(false);
  const { tenantDomain } = useTenantDomain();

  const { data: incomeData, isLoading: incomeLoading } = useGetAllIncomesQuery({
    tenantDomain,
    limit: 100,
    page: 1,
  });

  if (incomeLoading) {
    return <Loading />;
  }

  const incomeList = incomeData?.data?.incomes || [];

  if (incomeList.length === 0) {
    return (
      <Box textAlign="center" py={5}>
        <Typography variant="h6" color="textSecondary">
          No income data found.
        </Typography>
      </Box>
    );
  }

  // Initialize monthly totals with zeros
  const monthlyTotals = Array(12).fill(0);
  const currentYear = new Date().getFullYear();

  // Process each income record
  incomeList.forEach(income => {
    // Use date field if available, fallback to createdAt
    const dateStr = income.date || income.createdAt;
    if (!dateStr) return;

    const date = new Date(dateStr);
    if (isNaN(date)) return;

    // Only process records from current year
    if (date.getFullYear() === currentYear) {
      const monthIndex = date.getMonth();
      monthlyTotals[monthIndex] += income.totalAmount || 0;
    }
  });

  // Prepare chart data
  const dynamicData = monthlyTotals.map((amount, index) => ({
    id: index,
    label: monthNames[index],
    value: amount,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <PieChart
        height={400}
        series={[
          {
            data: dynamicData,
            outerRadius: radius,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
          }
        ]}
        skipAnimation={skipAnimation}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
          },
        }}
      />
    </Box>
  );
}