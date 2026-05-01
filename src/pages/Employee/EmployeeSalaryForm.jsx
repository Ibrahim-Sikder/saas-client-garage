/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
"use client";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { toast } from "react-toastify";
import "react-circular-progressbar/dist/styles.css";
import "./Employee.css";
import { useGetAllEmployeesQuery } from "../../redux/api/employee";
import {
  useCreateSalaryMutation,
  useGetSalaryByMonthQuery,
  useUpdateSalaryMutation,
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
  InputAdornment,
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
  TextField,
  Typography,
  useTheme,
  Alert,
  Autocomplete,
  Avatar,
} from "@mui/material";
import {
  CalendarMonth,
  CheckCircle,
  MonetizationOn,
  Person,
  Save,
  TimerOutlined,
  Warning,
  Edit,
  Add,
  FilterList,
  Clear,
  Group,
} from "@mui/icons-material";
import { allMonths } from "../../utils/month";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import Can from "../../components/Can";

const years = [];
for (let year = 2024; year <= 2030; year++) {
  years.push({ value: String(year), label: String(year) });
}

const initialSelectedOption = allMonths[new Date().getMonth()];
const currentYear = new Date().getFullYear().toString();

// ── Consolidated row state shape ─────────────────────────────────────────────
// Instead of 13 separate arrays, one Map<employeeId, rowData>
const buildDefaultRow = (employee) => {
  const summary = employee.overtimeSummary?.find(
    (s) =>
      s.month === initialSelectedOption && s.year === parseInt(currentYear),
  );
  return {
    month_of_salary: initialSelectedOption,
    year_of_salary: currentYear,
    bonus: 0,
    overtime_hours: summary ? parseFloat(summary.totalOvertime) : 0,
    overtime_rate: 0,
    salary_amount: 0,
    previous_due: 0,
    cut_salary: 0,
    advance: 0,
    pay: 0,
    // derived — recomputed on change
    total_payment: 0,
    due: 0,
    paid: false,
  };
};

const buildRowFromSalary = (salaryData) => {
  const paidAmount = (salaryData.advance || 0) + (salaryData.pay || 0);
  const total = salaryData.total_payment || 0;
  return {
    month_of_salary: salaryData.month_of_salary || initialSelectedOption,
    year_of_salary: salaryData.year_of_salary || currentYear,
    bonus: salaryData.bonus || 0,
    overtime_hours: salaryData.total_overtime || 0,
    overtime_rate: salaryData.overtime_rate || 0,
    salary_amount: salaryData.salary_amount || 0,
    previous_due: salaryData.previous_due || 0,
    cut_salary: salaryData.cut_salary || 0,
    advance: salaryData.advance || 0,
    pay: salaryData.pay || 0,
    total_payment: total,
    due: salaryData.due_amount ?? salaryData.due ?? 0,
    paid: salaryData.payment_status === "completed",
  };
};

const calcTotal = (row) =>
  (row.bonus || 0) +
  (row.overtime_hours || 0) * (row.overtime_rate || 0) +
  (row.salary_amount || 0) +
  (row.previous_due || 0) -
  (row.cut_salary || 0);

const deriveRow = (row) => {
  const total_payment = calcTotal(row);
  const paidAmount = (row.advance || 0) + (row.pay || 0);
  const due = total_payment - paidAmount;
  return { ...row, total_payment, due, paid: due <= 0 };
};

// ── Memoized table row ───────────────────────────────────────────────────────
const SalaryRow = memo(({ employee, row, hasSalaryData, theme, onChange }) => {
  const overtimePayment = (row.overtime_hours || 0) * (row.overtime_rate || 0);

  const field = useCallback(
    (key) => (e) => onChange(employee._id, key, e.target.value),
    [employee._id, onChange],
  );

  const numField = (key, width = "120px", extra = {}) => (
    <TextField
      size="small"
      type="number"
      placeholder="0"
      value={row[key] || ""}
      onChange={field(key)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="body2" fontWeight="medium">
              ৳
            </Typography>
          </InputAdornment>
        ),
        ...extra,
      }}
      sx={{ width, "& input": { textAlign: "right", paddingRight: "8px" } }}
    />
  );

  const readonlyField = (value, color, width = "120px") => (
    <TextField
      size="small"
      type="number"
      placeholder="0"
      value={value || ""}
      InputProps={{
        readOnly: true,
        startAdornment: (
          <InputAdornment position="start">
            <Typography variant="body2" fontWeight="medium">
              ৳
            </Typography>
          </InputAdornment>
        ),
      }}
      sx={{
        width,
        "& input": {
          textAlign: "right",
          paddingRight: "8px",
          fontWeight: "bold",
          color,
        },
      }}
    />
  );

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
        "&:hover": { backgroundColor: theme.palette.action.selected },
        ...(hasSalaryData && {
          backgroundColor: theme.palette.success.light + "15",
          border: `1px solid ${theme.palette.success.main}`,
        }),
      }}
    >
      {/* Employee name */}
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Person color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight="medium">
            {employee.full_name}
            {hasSalaryData && (
              <Chip
                size="small"
                label="HAS DATA"
                color="success"
                sx={{ ml: 1, fontSize: "0.7rem" }}
              />
            )}
          </Typography>
        </Box>
      </TableCell>

      {/* Employee ID */}
      <TableCell>
        <Chip
          size="small"
          label={employee.employeeId}
          variant="outlined"
          color="primary"
        />
      </TableCell>

      {/* Month */}
      <TableCell>
        <FormControl fullWidth size="small">
          <InputLabel>Month</InputLabel>
          <Select
            value={row.month_of_salary || initialSelectedOption}
            label="Month"
            onChange={(e) =>
              onChange(employee._id, "month_of_salary", e.target.value)
            }
            startAdornment={
              <InputAdornment position="start">
                <CalendarMonth fontSize="small" />
              </InputAdornment>
            }
          >
            {allMonths.map((m) => (
              <MenuItem value={m} key={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>

      {/* Year */}
      <TableCell>
        <FormControl fullWidth size="small">
          <InputLabel>Year</InputLabel>
          <Select
            value={row.year_of_salary || currentYear}
            label="Year"
            onChange={(e) =>
              onChange(employee._id, "year_of_salary", e.target.value)
            }
          >
            {years.map((y) => (
              <MenuItem value={y.value} key={y.value}>
                {y.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>

      {/* Basic Amount */}
      <TableCell>{numField("salary_amount")}</TableCell>

      {/* Bonus */}
      <TableCell>{numField("bonus")}</TableCell>

      {/* Overtime Hours */}
      <TableCell>
        <TextField
          size="small"
          type="number"
          placeholder="0"
          label="Hours"
          value={row.overtime_hours ?? ""}
          onChange={field("overtime_hours")}
          inputProps={{ step: "0.5", min: "0" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TimerOutlined fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="text.secondary">
                  hrs
                </Typography>
              </InputAdornment>
            ),
          }}
          helperText="e.g., 5.5 for 5½ hrs"
          sx={{ width: "140px", "& input": { textAlign: "center" } }}
        />
      </TableCell>

      {/* Overtime Rate */}
      <TableCell>{numField("overtime_rate")}</TableCell>

      {/* Total Overtime Payment (read-only) */}
      <TableCell>
        {readonlyField(overtimePayment, theme.palette.info.main)}
      </TableCell>

      {/* Cut Salary */}
      <TableCell>{numField("cut_salary")}</TableCell>

      {/* Total Payment (read-only) */}
      <TableCell>
        {readonlyField(row.total_payment, theme.palette.success.main)}
      </TableCell>

      {/* Advance */}
      <TableCell>{numField("advance")}</TableCell>

      {/* Pay */}
      <TableCell>{numField("pay")}</TableCell>

      {/* Due (read-only) */}
      <TableCell>
        {readonlyField(
          row.due,
          row.due > 0 ? theme.palette.error.main : theme.palette.success.main,
        )}
      </TableCell>

      {/* Status */}
      <TableCell>
        <Chip
          size="small"
          icon={row.due <= 0 ? <CheckCircle /> : <Warning />}
          label={row.due <= 0 ? "Paid" : "Due"}
          color={row.due <= 0 ? "success" : "error"}
          variant={row.due <= 0 ? "filled" : "outlined"}
        />
      </TableCell>
    </TableRow>
  );
});

SalaryRow.displayName = "SalaryRow";

// ── Main component ────────────────────────────────────────────────────────────
const EmployeeSalaryForm = ({
  id,
  performActionWithPermission,
  tenantDomain,
}) => {
  const location = useLocation();
  const month = new URLSearchParams(location.search).get("month");

  const theme = useTheme();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm] = useState("");

  // ── Single consolidated state map: { [employeeId]: rowData } ──────────────
  const [rows, setRows] = useState({});
  const [initialized, setInitialized] = useState(false);

  const { data: getAllEmployee, isLoading: employeesLoading } =
    useGetAllEmployeesQuery({ tenantDomain, limit: 100, page: 1, searchTerm });

  const { data: singleSalary, isLoading: singleSalaryLoading } =
    useGetSalaryByMonthQuery({ tenantDomain, month });

  const [createSalary, { isLoading: createLoading }] =
    useCreateSalaryMutation();
  const [updateSalary, { isLoading: updateLoading }] =
    useUpdateSalaryMutation();

  // ── Initialize rows when data arrives ────────────────────────────────────
  useEffect(() => {
    if (!getAllEmployee?.data?.employees) return;
    if (isEditMode && singleSalaryLoading) return;
    if (initialized) return;

    const employees = getAllEmployee.data.employees;

    // Build salary lookup map (by employee _id)
    const salaryMap = {};
    if (isEditMode && singleSalary?.data) {
      singleSalary.data.forEach((s) => {
        let empId = null;
        if (s.employee?._id) empId = s.employee._id;
        else if (typeof s.employee === "string") empId = s.employee;
        else if (s.employeeId) {
          const found = employees.find((e) => e.employeeId === s.employeeId);
          empId = found?._id;
        }
        if (empId) salaryMap[empId] = s;
      });
    }

    const newRows = {};
    employees.forEach((emp) => {
      newRows[emp._id] = salaryMap[emp._id]
        ? buildRowFromSalary(salaryMap[emp._id])
        : buildDefaultRow(emp);
    });

    setRows(newRows);
    setInitialized(true);
  }, [
    getAllEmployee?.data?.employees,
    singleSalary?.data,
    singleSalaryLoading,
    isEditMode,
    initialized,
  ]);

  // Reset when id changes (navigating between create/edit)
  useEffect(() => {
    setInitialized(false);
    setRows({});
  }, [id]);

  // ── Single onChange handler for any field in any row ──────────────────────
  const handleFieldChange = useCallback((employeeId, key, rawValue) => {
    setRows((prev) => {
      const current = prev[employeeId] || {};
      const isNumeric = !["month_of_salary", "year_of_salary"].includes(key);
      const parsed = isNumeric
        ? key === "overtime_hours"
          ? parseFloat(rawValue) || 0
          : parseInt(rawValue, 10) || 0
        : rawValue;
      const updated = deriveRow({ ...current, [key]: parsed });
      return { ...prev, [employeeId]: updated };
    });
  }, []);

  // ── Filtered employees (memoized) ─────────────────────────────────────────
  const allEmployees = useMemo(
    () => getAllEmployee?.data?.employees || [],
    [getAllEmployee?.data?.employees],
  );

  const filteredEmployees = useMemo(() => {
    if (selectedEmployees.length === 0) return allEmployees;
    const ids = new Set(selectedEmployees.map((e) => e._id));
    return allEmployees.filter((e) => ids.has(e._id));
  }, [allEmployees, selectedEmployees]);

  // ── Employees that already have salary data (memoized) ───────────────────
  const employeesWithSalaryData = useMemo(() => {
    if (!isEditMode || !singleSalary?.data) return new Set();
    const employees = allEmployees;
    const ids = new Set();
    singleSalary.data.forEach((s) => {
      if (s.employee?._id) ids.add(s.employee._id);
      else if (typeof s.employee === "string") ids.add(s.employee);
      else if (s.employeeId) {
        const found = employees.find((e) => e.employeeId === s.employeeId);
        if (found) ids.add(found._id);
      }
    });
    return ids;
  }, [isEditMode, singleSalary?.data, allEmployees]);

  // ── Submit handlers ───────────────────────────────────────────────────────
  const getPaymentStatus = (total, paid) => {
    if (paid <= 0) return "pending";
    if (paid >= total) return "completed";
    return "partial";
  };

  const handleCreateSalary = useCallback(async () => {
    const salaries = filteredEmployees.map((emp) => {
      const row = rows[emp._id] || buildDefaultRow(emp);
      const paidAmount = (row.advance || 0) + (row.pay || 0);
      const overtimePayment =
        (row.overtime_hours || 0) * (row.overtime_rate || 0);
      return {
        employee: emp._id,
        full_name: emp.full_name,
        employeeId: emp.employeeId,
        month_of_salary: row.month_of_salary,
        year_of_salary: row.year_of_salary,
        bonus: row.bonus,
        total_overtime: row.overtime_hours,
        overtime_rate: row.overtime_rate,
        overtime_amount: overtimePayment,
        salary_amount: row.salary_amount,
        previous_due: row.previous_due,
        cut_salary: row.cut_salary,
        total_payment: row.total_payment,
        advance: row.advance,
        pay: row.pay,
        due: row.due,
        paid: paidAmount,
        paid_amount: paidAmount,
        due_amount: row.due,
        payment_status: getPaymentStatus(row.total_payment, paidAmount),
      };
    });

    try {
      const response = await createSalary({ tenantDomain, salaries }).unwrap();
      if (response.success) {
        toast.success(response.message);
        navigate("/dashboard/salary-list");
      }
    } catch (error) {
      handleApiError(error);
    }
  }, [filteredEmployees, rows, createSalary, tenantDomain, navigate]);

  const handleUpdateAllSalaries = useCallback(async () => {
    if (!singleSalary?.data) return toast.error("Invalid salary data");

    const updatePromises = singleSalary.data
      .map((salaryRecord) => {
        let empId = null;
        if (salaryRecord.employee?._id) empId = salaryRecord.employee._id;
        else if (typeof salaryRecord.employee === "string")
          empId = salaryRecord.employee;
        else if (salaryRecord.employeeId) {
          const found = allEmployees.find(
            (e) => e.employeeId === salaryRecord.employeeId,
          );
          empId = found?._id;
        }
        if (!empId) return null;

        const row = rows[empId];
        if (!row) return null;

        const paidAmount = (row.advance || 0) + (row.pay || 0);
        const overtimePayment =
          (row.overtime_hours || 0) * (row.overtime_rate || 0);

        return updateSalary({
          tenantDomain,
          id: salaryRecord._id,
          data: {
            month_of_salary: row.month_of_salary,
            year_of_salary: row.year_of_salary,
            bonus: row.bonus,
            total_overtime: row.overtime_hours,
            overtime_rate: row.overtime_rate,
            overtime_amount: overtimePayment,
            salary_amount: row.salary_amount,
            previous_due: row.previous_due,
            cut_salary: row.cut_salary,
            total_payment: row.total_payment,
            advance: row.advance,
            pay: row.pay,
            due: row.due,
            paid: paidAmount,
            paid_amount: paidAmount,
            due_amount: row.due,
            payment_status: getPaymentStatus(row.total_payment, paidAmount),
          },
        }).unwrap();
      })
      .filter(Boolean);

    const results = await Promise.allSettled(updatePromises);
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const errorCount = results.filter((r) => r.status === "rejected").length;

    if (successCount > 0) {
      toast.success(`Successfully updated ${successCount} salary record(s)`);
      navigate("/dashboard/salary-list");
    }
    if (errorCount > 0)
      toast.error(`Failed to update ${errorCount} salary record(s)`);
  }, [
    singleSalary?.data,
    rows,
    allEmployees,
    updateSalary,
    tenantDomain,
    navigate,
  ]);

  const handleSubmitSalary = () => {
    performActionWithPermission(
      "/dashboard/employee-salary",
      isEditMode ? "edit" : "create",
      async () => {
        if (isEditMode) await handleUpdateAllSalaries();
        else await handleCreateSalary();
      },
      `You don't have permission to ${isEditMode ? "edit" : "create"} salary`,
    );
  };

  const handleApiError = (error) => {
    const msg = error?.data?.message || error?.message;
    toast.error(
      msg ||
        `An error occurred while ${isEditMode ? "updating" : "adding"} salary`,
    );
    error?.data?.errorSources?.forEach(
      (src) => src.message && toast.error(src.message),
    );
  };

  // ── Filter handlers (stable refs) ─────────────────────────────────────────
  const handleEmployeeFilterChange = useCallback((_, newValue) => {
    setSelectedEmployees(newValue);
  }, []);

  const clearEmployeeFilter = useCallback(() => setSelectedEmployees([]), []);

  // ── Loading / guard ───────────────────────────────────────────────────────
  if (employeesLoading || (isEditMode && singleSalaryLoading))
    return <Loading />;
  if (!allEmployees.length) {
    return (
      <Container maxWidth="7xl">
        <Alert severity="warning" sx={{ mt: 4 }}>
          No employee data available. Please ensure employees are loaded.
        </Alert>
      </Container>
    );
  }

  const tableCellStyle = {
    color: "white",
    fontWeight: "bold",
    width: "180px",
    backgroundColor: theme.palette.primary.main,
    position: "sticky",
    top: 0,
    zIndex: 1,
  };

  return (
    <Container maxWidth="7xl" sx={{ p: 0 }}>
      <Box sx={{ pt: 4, pb: 8 }}>
        {/* Header */}
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
                {isEditMode
                  ? "Update Employee Salaries"
                  : "Employee Salary Management"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dashboard / Employee Salary {isEditMode ? "/ Update" : ""}
              </Typography>
              {isEditMode && singleSalary?.data && (
                <Chip
                  icon={<Edit />}
                  label={`Editing ${singleSalary.data.length} salary record(s)`}
                  color="warning"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>
            <Grid item>
              <Chip
                icon={isEditMode ? <Edit /> : <Add />}
                label={isEditMode ? "Edit Mode" : "Create Mode"}
                color={isEditMode ? "warning" : "primary"}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Filter */}
        <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <FilterList color="primary" />
              </Grid>
              <Grid item xs={12} md={8}>
                <Autocomplete
                  multiple
                  options={allEmployees}
                  getOptionLabel={(o) => `${o.full_name} (${o.employeeId})`}
                  value={selectedEmployees}
                  onChange={handleEmployeeFilterChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filter Employees"
                      placeholder="Select employees to add salary for..."
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Group color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Avatar
                        sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                      >
                        {option.full_name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {option.full_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {option.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option._id}
                        label={`${option.full_name} (${option.employeeId})`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  }
                  sx={{ minWidth: 300 }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Clear />}
                  onClick={clearEmployeeFilter}
                  disabled={selectedEmployees.length === 0}
                >
                  Clear Filter
                </Button>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing:
                  </Typography>
                  <Chip
                    label={`${filteredEmployees.length} of ${allEmployees.length} employees`}
                    size="small"
                    color={selectedEmployees.length > 0 ? "primary" : "default"}
                    variant="outlined"
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {isEditMode && singleSalary?.data && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You are editing{" "}
            <strong>{singleSalary.data.length} salary record(s)</strong> for{" "}
            <strong>
              {singleSalary.data[0]?.month_of_salary}{" "}
              {singleSalary.data[0]?.year_of_salary}
            </strong>
            . All loaded salary data will be updated.
          </Alert>
        )}

        {selectedEmployees.length > 0 && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Filter Active:</strong> Working with{" "}
              {selectedEmployees.length} selected employee(s). Only these
              employees will be processed on submit.
            </Typography>
          </Alert>
        )}

        {/* Table */}
        <Card elevation={4} sx={{ mb: 4, borderRadius: 2, overflow: "auto" }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                "& .MuiTableCell-root": {
                  padding: "8px",
                  whiteSpace: "nowrap",
                },
                maxHeight: 600,
                overflow: "auto",
              }}
            >
              <Table sx={{ minWidth: 1400 }} stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.main }}
                  >
                    {[
                      "Employee",
                      "Employee ID",
                      "Month of Salary",
                      "Year",
                      "Basic Amount",
                      "Bonus",
                      "Overtime Hours",
                      "Overtime Rate (per hour)",
                      "Total Overtime Payment",
                      "Cut Salary",
                      "Total Payment",
                      "Advance",
                      "Pay",
                      "Due",
                      "Status",
                    ].map((label) => (
                      <TableCell key={label} sx={tableCellStyle}>
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <SalaryRow
                      key={employee._id}
                      employee={employee}
                      row={rows[employee._id] || buildDefaultRow(employee)}
                      hasSalaryData={employeesWithSalaryData.has(employee._id)}
                      theme={theme}
                      onChange={handleFieldChange}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Submit */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Can
            page="/dashboard/employee-salary"
            action={isEditMode ? "edit" : "add"}
          >
            <Button
              variant="contained"
              color={isEditMode ? "warning" : "primary"}
              size="large"
              disabled={createLoading || updateLoading}
              onClick={handleSubmitSalary}
              startIcon={isEditMode ? <Edit /> : <Save />}
              sx={{ px: 4, py: 1.5, borderRadius: 2, boxShadow: 3 }}
            >
              {createLoading || updateLoading
                ? isEditMode
                  ? "Updating..."
                  : "Submitting..."
                : isEditMode
                  ? "Update All Salaries"
                  : `Submit Salary${selectedEmployees.length > 0 ? ` (${selectedEmployees.length} employees)` : ""}`}
            </Button>
          </Can>
        </Box>
      </Box>
    </Container>
  );
};

export default EmployeeSalaryForm;
