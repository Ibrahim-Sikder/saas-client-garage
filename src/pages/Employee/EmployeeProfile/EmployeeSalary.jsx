// EmployeeSalary.jsx
/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { useGetSalaryForProfileQuery } from "../../../redux/api/salary";
import {
  Box,
  Card,
  Paper,
  Typography,
  useTheme,
  Grid,
  Chip,
  LinearProgress,
} from "@mui/material";
import { CalendarMonth, Payments, History } from "@mui/icons-material";
import Loading from "../../../components/Loading/Loading";
import PaymentHistoryModal from "./PaymentHistoryModal.jsx";
import EmployeeSalaryFilters from "./EmployeeSalaryFilters";
import PartialPaymentModal from "../PartialSalaryPaymentModal.jsx";
import Table from "../../../components/Table"; // Importing your reusable Table

const EmployeeSalary = ({ id, tenantDomain }) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterDay, setFilterDay] = useState("");
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [selectedPaymentHistory, setSelectedPaymentHistory] = useState(null);
  const limit = 10;

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  const { data, isLoading, refetch } = useGetSalaryForProfileQuery({
    tenantDomain,
    id,
    limit,
    page: currentPage,
    month: filterMonth,
    year: filterYear,
    day: filterDay,
  });

  const handleMonthChange = (event) => {
    setFilterMonth(event.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (event) => {
    setFilterYear(event.target.value);
    setCurrentPage(1);
  };

  const handleDayChange = (event) => {
    setFilterDay(event.target.value);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setFilterMonth("");
    setFilterYear(currentYear);
    setFilterDay("");
    setCurrentPage(1);
  };

  const handleOpenPaymentModal = (salary) => {
    const transformedSalary = {
      _id: salary._id,
      month_of_salary: salary.month_of_salary,
      year_of_salary: salary.year_of_salary,
      total_payment: salary.total_payment,
      paid_amount: salary.paid_amount,
      due_amount: salary.due_amount,
      payment_status: salary.payment_status,
      payment_history: salary.payment_history || [],
    };

    const employee = {
      _id: salary.employee?._id || id,
      full_name: salary.full_name,
      employeeId: salary.employeeId,
    };

    setSelectedSalary({ ...transformedSalary, employee });
    setModalOpen(true);
  };

  const handleOpenPaymentHistory = (salary) => {
    setSelectedPaymentHistory({
      paymentHistory: salary.payment_history || [],
      employeeName: salary.full_name,
      employeeId: salary.employeeId,
      month: salary.month_of_salary,
      year: salary.year_of_salary,
    });
    setPaymentHistoryOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSalary(null);
  };

  const handleClosePaymentHistory = () => {
    setPaymentHistoryOpen(false);
    setSelectedPaymentHistory(null);
  };

  const handlePaymentSuccess = async () => {
    await refetch();
    handleCloseModal();
  };

  // Columns definition using the 'render' prop to keep the original design style
  const columns = [
    { key: "employeeId", label: "Employee ID" },
    {
      key: "month_year",
      label: "Month of Salary",
      render: (item) => `${item.month_of_salary} ${item.year_of_salary}`,
    },
    { key: "bonus", label: "Bonus" },
    { key: "total_overtime", label: "Overtime" },
    { key: "salary_amount", label: "Salary Amount" },
    { key: "total_payment", label: "Total Payment" },
    { key: "paid_amount", label: "Paid Amount" },
    { key: "due_amount", label: "Due Amount" },
    {
      key: "payment_date",
      label: "Payment Date",
      render: (item) => {
        const history = item.payment_history || [];
        if (history.length === 0) return "N/A";
        const lastPayment = history[history.length - 1];
        return lastPayment.date || "N/A";
      },
    },
    {
      key: "progress",
      label: "Payment Progress",
      render: (item) => {
        const percent =
          item.total_payment > 0
            ? (item.paid_amount / item.total_payment) * 100
            : 0;
        return (
          <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    backgroundColor:
                      percent === 100 ? "#4caf50" : theme.palette.primary.main,
                  },
                }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="bold"
              >{`${Math.round(percent)}%`}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Chip
          label={item.payment_status}
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "0.75rem",
          }}
          color={
            item.payment_status === "Paid"
              ? "success"
              : item.payment_status === "Partial"
                ? "warning"
                : "default"
          }
          variant="outlined"
        />
      ),
    },
  ];

  // Actions definition
  const actions = [
    {
      key: "pay",
      icon: Payments,
      tooltip: "Pay Salary",
      onClick: handleOpenPaymentModal,
      color: "#2e7d32", // Custom green matching design
    },
    {
      key: "history",
      icon: History,
      tooltip: "Payment History",
      onClick: handleOpenPaymentHistory,
      color: "#1565c0", // Custom blue matching design
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ pt: 2, pb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.background.paper})`,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>৳</Grid>
          <Grid item xs>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Salary History with Payment Management
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              icon={<CalendarMonth />}
              label={`${currentMonth} ${currentYear}`}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <EmployeeSalaryFilters
        filterMonth={filterMonth}
        filterYear={filterYear}
        filterDay={filterDay}
        currentYear={currentYear}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onDayChange={handleDayChange}
        onResetFilters={handleResetFilter}
      />

      <Card elevation={4} sx={{ mb: 4, borderRadius: 2 }}>
        <Table
          title="Salary Records"
          columns={columns}
          data={data?.data?.salaries || []}
          actions={actions}
          loading={isLoading}
          currentPage={currentPage}
          totalPages={data?.data?.meta?.totalPages || 1}
          onPageChange={setCurrentPage}
          onSearch={() => {}}
          searchPlaceholder="Search..."
          emptyMessage="No salary records found for the selected filters."
        />
      </Card>

      {selectedSalary && (
        <PartialPaymentModal
          tenantDomain={tenantDomain}
          open={modalOpen}
          onClose={handleCloseModal}
          employee={selectedSalary.employee}
          salaryRecord={selectedSalary}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {selectedPaymentHistory && (
        <PaymentHistoryModal
          open={paymentHistoryOpen}
          onClose={handleClosePaymentHistory}
          paymentHistory={selectedPaymentHistory.paymentHistory}
          employeeName={selectedPaymentHistory.employeeName}
          employeeId={selectedPaymentHistory.employeeId}
          month={selectedPaymentHistory.month}
          year={selectedPaymentHistory.year}
        />
      )}
    </Box>
  );
};

export default EmployeeSalary;
