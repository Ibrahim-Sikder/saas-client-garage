/* eslint-disable no-unused-vars */
import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { useGetAllIncomesQuery } from "../../redux/api/income";
import dayjs from "dayjs";

export default function YearlyIncomeChart() {
  const [radius, setRadius] = React.useState(50);
  const [itemNb, setItemNb] = React.useState(12);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const { data: incomeData } = useGetAllIncomesQuery({
    limit: 10000,
    page: 1,
  });

  const groupByMonth = (data, key) => {
    return data.reduce((acc, curr) => {
      const month = dayjs(curr.date).isValid()
        ? dayjs(curr.date).format("MMMM")
        : null;
      if (month) {
        if (!acc[month]) acc[month] = 0;
        acc[month] += Number(curr[key]);
      }
      return acc;
    }, {});
  };

  const monthlyIncome = groupByMonth(incomeData?.data?.incomes || [], "amount");

  const dynamicData = Object.keys(monthlyIncome).map((month) => ({
    label: month,
    value: monthlyIncome[month],
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <PieChart
        height={400}
        series={[
          { data: dynamicData, outerRadius: radius },
          {
            data: dynamicData.slice(0, itemNb),
            innerRadius: radius,
            arcLabel: (params) => params.label ?? "",
          },
        ]}
        skipAnimation={skipAnimation}
      />
    </Box>
  );
}
