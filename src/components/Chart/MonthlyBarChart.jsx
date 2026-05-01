/* eslint-disable no-unused-vars */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetAllExpensesQuery } from "../../redux/api/expense";
import { useGetAllIncomesQuery } from "../../redux/api/income";
import Loading from "../Loading/Loading";
import { Box, Typography } from "@mui/material";
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

export default function StackBars() {
  const { tenantDomain } = useTenantDomain();
  const { data: expenseData, isLoading: expenseLoading } =
    useGetAllExpensesQuery({
      tenantDomain,
      limit: 100,
      page: 1,
    });

  const { data: incomeData, isLoading: incomeLoading } = useGetAllIncomesQuery({
    tenantDomain,
    limit: 100,
    page: 1,
  });

  if (incomeLoading || expenseLoading) {
    return <Loading />;
  }

  const incomeList = incomeData?.data?.incomes || [];
  const expenseList = expenseData?.data?.expenses || [];

  if (incomeList.length === 0 && expenseList.length === 0) {
    return (
      <Box textAlign="center" py={5}>
        <Typography variant="h6" color="textSecondary">
          No data found for income and expense.
        </Typography>
      </Box>
    );
  }

  const aggregateData = () => {
    const currentDate = new Date();
    const dataMap = new Map();
    for (let i = 4; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      dataMap.set(key, {
        monthLabel: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        Earnings: 0,
        Expense: 0,
        Profit: 0,
        sortKey: date.getTime(),
      });
    }
    incomeList.forEach((income) => {
      const dateStr = income.date || income.createdAt;
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (isNaN(date)) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!dataMap.has(key)) return;

      const current = dataMap.get(key);
      current.Earnings += income.totalAmount || 0;
      current.Profit = current.Earnings - current.Expense;
      dataMap.set(key, current);
    });

    expenseList.forEach((expense) => {
      const dateStr = expense.date || expense.createdAt;
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (isNaN(date)) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!dataMap.has(key)) return;

      const current = dataMap.get(key);
      current.Expense += expense.totalAmount || 0;
      current.Profit = current.Earnings - current.Expense;
      dataMap.set(key, current);
    });
    return Array.from(dataMap.values()).sort((a, b) => a.sortKey - b.sortKey);
  };

  const dynamicData = aggregateData();

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart
        data={dynamicData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthLabel" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Earnings" fill="#8884d8" barSize={40} />
        <Bar dataKey="Expense" fill="#82ca9d" barSize={40} />
        <Bar dataKey="Profit" fill="#ffc658" barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
