/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  useDeleteSalaryMutation,
  useGetAllSalaryQuery,
} from "../../redux/api/salary";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  CalendarMonth,
  CheckCircle,
  Clear,
  Delete,
  Edit,
  MonetizationOn,
  Person,
  Add,
  Payment,
  History,
  HourglassEmpty,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import Loading from "../../components/Loading/Loading";

import { allMonths } from "../../utils/month";
import PaymentHistoryModal from "./EmployeeProfile/PaymentHistoryModal";
import Swal from "sweetalert2";
import Can from "../../components/Can";
import PartialPaymentModal from "./PartialSalaryPaymentModal";
import { Link } from "react-router-dom";

const generateYears = () => {
  const years = [{ value: "", label: "All Years" }];
  for (let year = 2020; year <= 2030; year++) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
};

const years = generateYears();

const EnhancedEmployeeSalaryListTable = ({
  tenantDomain,
  performActionWithPermission,
}) => {
  const theme = useTheme();
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterDay, setFilterDay] = useState(null);
  const [currentPage] = useState(1);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [selectedPaymentHistory, setSelectedPaymentHistory] = useState(null);
  const limit = 100;
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const [deleteSalary] = useDeleteSalaryMutation();

  const {
    data: getAllSalary,
    isLoading: salaryLoading,
    error: salaryError,
    refetch,
  } = useGetAllSalaryQuery({
    tenantDomain,
    searchTerm: "",
    month: filterMonth,
    year: filterYear,
    day: filterDay ? filterDay.getDate() : undefined,
    limit,
    page: currentPage,
  });

  useEffect(() => {
    refetch();
  }, [filterMonth, filterYear, filterDay, refetch]);

  const handleMonthChange = (event) => {
    setFilterMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setFilterYear(event.target.value);
  };

  const handleDayChange = (date) => {
    setFilterDay(date);
  };

  const handleRemoveFilters = () => {
    setFilterMonth("");
    setFilterYear("");
    setFilterDay(null);
  };

  const hasActiveFilters = () => {
    return filterMonth || filterYear || filterDay;
  };

  const handleOpenPaymentModal = (salary) => {
    const transformedSalary = {
      _id: salary._id,
      month_of_salary: salary.month_of_salary,
      year_of_salary: salary.year_of_salary,
      total_payment: salary.total_payment,
      paid_amount: salary.paid_amount || 0,
      due_amount: salary.due_amount || 0,
      payment_status: salary.payment_status,
      payment_history: salary.payment_history || [],
    };

    const employee = {
      _id: salary.employee?._id || salary.employee,
      full_name: salary.full_name,
      employeeId: salary.employeeId,
    };

    setSelectedSalary({ ...transformedSalary, employee });
    setModalOpen(true);
  };

  const handleClosePaymentHistory = () => {
    setPaymentHistoryOpen(false);
    setSelectedPaymentHistory(null);
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

  const handlePaymentSuccess = async () => {
    await refetch();
    handleCloseModal();
  };

  const getPaymentProgress = (paidAmount, totalAmount) => {
    if (!totalAmount || totalAmount === 0) return 0;
    return Math.min((paidAmount / totalAmount) * 100, 100);
  };

  const getPaymentStatusDisplay = (salary) => {
    const status = salary.payment_status || "pending";

    switch (status) {
      case "completed":
        return {
          status: "completed",
          label: "Fully Paid",
          color: "success",
          icon: <CheckCircle />,
        };
      case "partial":
        return {
          status: "partial",
          label: "Partial",
          color: "warning",
          icon: <Payment />,
        };
      case "pending":
      default:
        return {
          status: "pending",
          label: "Pending",
          color: "error",
          icon: <HourglassEmpty />,
        };
    }
  };

  const handleSalaryDelete = async (id) => {
    performActionWithPermission(
      "/dashboard/employee-salary",
      "delete",
      async () => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You want to delete this salary record?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
          try {
            await deleteSalary({ id, tenantDomain }).unwrap();
            await Swal.fire(
              "Deleted!",
              "Salary record has been deleted.",
              "success",
            );
            refetch();
          } catch (error) {
            Swal.fire("Error!", "Failed to delete salary record.", "error");
          }
        }
      },
      "You don't have permission to delete salary record.",
    );
  };

  if (salaryLoading) {
    return <Loading />;
  }

  if (salaryError) {
    return (
      <Typography color="error">
        Error loading salary data. Please try again.
      </Typography>
    );
  }

  const noSalaryData =
    !getAllSalary?.data?.salaries || getAllSalary.data.salaries.length === 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="7xl" sx={{ p: 0 }}>
        <Box sx={{ pt: 4, pb: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 1.5, md: 3 },
              mb: 4,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.background.paper})`,
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <MonetizationOn fontSize="large" color="primary" />
              </Grid>
              <Grid item xs>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  Employee Salary Sheet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hasActiveFilters()
                    ? `${filterMonth || "All Months"} ${filterYear || ""} ${
                        filterDay ? `- Day: ${filterDay.getDate()}` : ""
                      }`
                    : `${currentMonth} ${currentYear}`}{" "}
                  - Manage partial payments
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  component={Link}
                  to="/dashboard/add-salary"
                  sx={{ color: "white" }}
                >
                  {" "}
                  Add Salary
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="month-select-label">Select Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  value={filterMonth}
                  label="Select Month"
                  onChange={handleMonthChange}
                >
                  <MenuItem value="">All Months</MenuItem>
                  {allMonths.map((month) => (
                    <MenuItem value={month} key={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="year-select-label">Select Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  id="year-select"
                  value={filterYear}
                  label="Select Year"
                  onChange={handleYearChange}
                >
                  {years.map((year) => (
                    <MenuItem value={year.value} key={year.value}>
                      {year.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="Select Day"
                value={filterDay}
                onChange={handleDayChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleRemoveFilters}
                startIcon={<Clear />}
                fullWidth
                disabled={!hasActiveFilters()}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>

          {noSalaryData ? (
            <Card
              elevation={4}
              sx={{ borderRadius: 2, p: 4, textAlign: "center" }}
            >
              <Typography variant="h6" color="text.secondary">
                No salary data found for the selected criteria
              </Typography>
            </Card>
          ) : (
            <Card elevation={4} sx={{ borderRadius: 2, overflow: "auto" }}>
              <CardContent sx={{ p: 0 }}>
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 1400 }}>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: theme.palette.primary.main }}
                      >
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "180px",
                          }}
                        >
                          Employee
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "120px",
                          }}
                        >
                          Employee ID
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "120px",
                          }}
                        >
                          Month/Year
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "100px",
                          }}
                        >
                          Bonus
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "100px",
                          }}
                        >
                          Overtime
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "120px",
                          }}
                        >
                          Salary Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "120px",
                          }}
                        >
                          Total Payment
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "100px",
                          }}
                        >
                          Paid Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "100px",
                          }}
                        >
                          Due Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "150px",
                          }}
                        >
                          Payment Progress
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "120px",
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            width: "150px",
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getAllSalary?.data?.salaries?.map((salary, index) => {
                        const paidAmount = salary.paid_amount || 0;
                        const dueAmount = salary.due_amount || 0;
                        const totalPayment = salary.total_payment || 0;
                        const paymentProgress = getPaymentProgress(
                          paidAmount,
                          totalPayment,
                        );
                        const paymentStatus = getPaymentStatusDisplay(salary);

                        return (
                          <TableRow
                            key={salary._id}
                            sx={{
                              "&:nth-of-type(odd)": {
                                backgroundColor: theme.palette.action.hover,
                              },
                              "&:hover": {
                                backgroundColor: theme.palette.action.selected,
                              },
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Person color="primary" sx={{ mr: 1 }} />
                                <Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {salary.full_name}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Chip
                                size="small"
                                label={salary.employeeId}
                                variant="outlined"
                                color="primary"
                              />
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {salary.month_of_salary}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {salary.year_of_salary}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography
                                sx={{
                                  color: theme.palette.success.main,
                                  display: "flex",
                                  gap: "2px",
                                }}
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  ৳
                                </Typography>
                                {(salary.bonus || 0).toLocaleString()}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography
                                sx={{
                                  display: "flex",
                                  gap: "2px",
                                }}
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  ৳
                                </Typography>
                                {(salary.overtime_amount || 0).toLocaleString()}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography
                                sx={{
                                  display: "flex",
                                  gap: "2px",
                                }}
                                fontWeight="bold"
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  ৳
                                </Typography>
                                {(salary.salary_amount || 0).toLocaleString()}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography
                                fontWeight="bold"
                                sx={{
                                  color: theme.palette.primary.main,
                                  display: "flex",
                                  gap: "2px",
                                }}
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  ৳
                                </Typography>
                                {totalPayment.toLocaleString()}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography
                                sx={{
                                  color: theme.palette.success.main,
                                  display: "flex",
                                  gap: "2px",
                                }}
                                fontWeight="medium"
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  ৳
                                </Typography>
                                {paidAmount.toLocaleString()}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography
                                sx={{
                                  color:
                                    dueAmount > 0
                                      ? theme.palette.error.main
                                      : theme.palette.success.main,
                                  display: "flex",
                                  gap: "2px",
                                }}
                                fontWeight="medium"
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  ৳
                                </Typography>
                                {dueAmount.toLocaleString()}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Box sx={{ width: "120px" }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={paymentProgress}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    mb: 0.5,
                                  }}
                                  color={
                                    paymentStatus.status === "completed"
                                      ? "success"
                                      : "primary"
                                  }
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {Math.round(paymentProgress)}%
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Chip
                                icon={paymentStatus.icon}
                                label={paymentStatus.label}
                                color={paymentStatus.color}
                                size="small"
                                variant={
                                  paymentStatus.status === "completed"
                                    ? "filled"
                                    : "outlined"
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Tooltip
                                  title={
                                    dueAmount <= 0
                                      ? "Fully Paid"
                                      : "Add Payment"
                                  }
                                >
                                  <span>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        handleOpenPaymentModal(salary)
                                      }
                                      disabled={dueAmount <= 0}
                                      sx={{
                                        bgcolor:
                                          theme.palette.primary.light + "20",
                                        "&:hover": {
                                          bgcolor:
                                            theme.palette.primary.light + "40",
                                        },
                                        "&:disabled": {
                                          bgcolor: theme.palette.grey[200],
                                        },
                                      }}
                                    >
                                      <Add fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>

                                <Tooltip title="Payment History">
                                  <IconButton
                                    size="small"
                                    color="info"
                                    onClick={() =>
                                      handleOpenPaymentHistory(salary)
                                    }
                                    sx={{
                                      bgcolor: theme.palette.info.light + "20",
                                      "&:hover": {
                                        bgcolor:
                                          theme.palette.info.light + "40",
                                      },
                                    }}
                                  >
                                    <History fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit Salary">
                                  <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() => {
                                      window.location.href = `/dashboard/employee-salary-update?id=${salary._id}&month=${salary.month_of_salary}`;
                                    }}
                                    sx={{
                                      bgcolor:
                                        theme.palette.warning.light + "20",
                                      "&:hover": {
                                        bgcolor:
                                          theme.palette.warning.light + "40",
                                      },
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete Salary">
                                  <Can
                                    page="/dashboard/employee-salary"
                                    action="delete"
                                  >
                                    <IconButton
                                      onClick={() =>
                                        handleSalaryDelete(salary._id)
                                      }
                                      size="small"
                                      color="error"
                                      sx={{
                                        bgcolor:
                                          theme.palette.error.light + "20",
                                        "&:hover": {
                                          bgcolor:
                                            theme.palette.error.light + "40",
                                        },
                                      }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Can>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
          {selectedSalary && (
            <PartialPaymentModal
              performActionWithPermission={performActionWithPermission}
              tenantDomain={tenantDomain}
              open={modalOpen}
              onClose={handleCloseModal}
              employee={selectedSalary.employee}
              salaryRecord={selectedSalary}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {/* Payment History Modal */}
          {selectedPaymentHistory && (
            <PaymentHistoryModal
              tenantDomain={tenantDomain}
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
      </Container>
    </LocalizationProvider>
  );
};

export default EnhancedEmployeeSalaryListTable;
