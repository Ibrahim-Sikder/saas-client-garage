/* eslint-disable react/prop-types */
// components/EmployeeSalaryTableRow.jsx
import {
  TableRow,
  TableCell,
  Box,
  Chip,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CalendarMonth,
  TimerOutlined,
  Add,
  History,
  CheckCircle,
  Payment,
  HourglassEmpty,
} from "@mui/icons-material";

const EmployeeSalaryTableRow = ({
  salary,
  theme,
  onOpenPaymentModal,
  onOpenPaymentHistory,
}) => {
  const paidAmount = salary.paid_amount || 0;
  const dueAmount = salary.due_amount || 0;
  
  const getPaymentProgress = (paidAmount, totalAmount) => {
    if (!totalAmount || totalAmount === 0) return 0;
    return Math.min((paidAmount / totalAmount) * 100, 100);
  };
  
  const paymentProgress = getPaymentProgress(paidAmount, salary.total_payment);
  
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
  
  const paymentStatus = getPaymentStatusDisplay(salary);

  return (
    <TableRow
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
        <Chip
          size="small"
          label={salary.employeeId}
          variant="outlined"
          color="primary"
        />
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CalendarMonth fontSize="small" color="primary" sx={{ mr: 1 }} />
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {salary.month_of_salary}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {salary.year_of_salary}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          ৳
          <Typography
            variant="body2"
            sx={{
              fontWeight: salary.bonus > 0 ? "bold" : "normal",
            }}
          >
            {salary.bonus || "0"}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Chip
            size="small"
            icon={<TimerOutlined />}
            label={`${salary.total_overtime || "0"}h`}
            color={salary.total_overtime > 0 ? "success" : "default"}
          />
          <Typography variant="caption" color="text.secondary">
            ৳{salary.overtime_amount || "0"}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          ৳
          <Typography variant="body2" fontWeight="bold">
            {salary.salary_amount || "0"}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "primary.light",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            color: "#fff",
          }}
        >
          ৳
          <Typography variant="body2" fontWeight="bold" sx={{ marginLeft: "2px" }}>
            {salary.total_payment || "0"}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          fontWeight="bold"
          color="success.main"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          ৳
          {paidAmount.toLocaleString()}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          fontWeight="bold"
          color={dueAmount > 0 ? "error.main" : "success.main"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          ৳
          {dueAmount.toLocaleString()}
        </Typography>
      </TableCell>

      <TableCell>
        {salary.payment_date ? (
          <Typography variant="body2">
            {new Date(salary.payment_date).toLocaleDateString()}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not paid
          </Typography>
        )}
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
            color={paymentStatus.status === "completed" ? "success" : "primary"}
          />
          <Typography variant="caption" color="text.secondary">
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
          variant={paymentStatus.status === "completed" ? "filled" : "outlined"}
        />
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Tooltip title={dueAmount <= 0 ? "Fully Paid" : "Add Payment"}>
            <span>
              <IconButton
                size="small"
                color="primary"
                onClick={() => onOpenPaymentModal(salary)}
                disabled={dueAmount <= 0}
                sx={{
                  bgcolor: theme.palette.primary.light + "20",
                  "&:hover": {
                    bgcolor: theme.palette.primary.light + "40",
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
              onClick={() => onOpenPaymentHistory(salary)}
              sx={{
                bgcolor: theme.palette.info.light + "20",
                "&:hover": {
                  bgcolor: theme.palette.info.light + "40",
                },
              }}
            >
              <History fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeSalaryTableRow;