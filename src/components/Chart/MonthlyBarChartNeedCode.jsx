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
  
  const data = [
    { month: "Jan", Earnings: 70000, Expense: 50000, Profit: 20000 },
    { month: "Feb", Earnings: 200000, Expense: 150000, Profit: 50000 },
    { month: "Mar", Earnings: 300000, Expense: 200000, Profit: 100000 },
    { month: "Apr", Earnings: 50000, Expense: 45000, Profit: 25000 },
    { month: "May", Earnings: 100000, Expense: 60000, Profit: 40000 },
  ];
  
  export default function StackBars() {
    const { data: expenseData } = useGetAllExpensesQuery({
      limit: 10,
      page: 1,
    });
  
  
    const { data: incomeData } = useGetAllIncomesQuery({
      limit: 10,
      page: 1,
    });
  
  
     // calculate total income
     const totalIncome =
     incomeData?.data?.incomes?.reduce(
       (sum, income) => sum + income.amount,
       0
     ) || 0;
   // calculate total expense
   const totalExpenses =
     expenseData?.data?.expenses?.reduce(
       (sum, expense) => sum + Number(expense.amount),
       0
     ) || 0;
  
   const profit = totalIncome - totalExpenses;
  
    return (
      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
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
  