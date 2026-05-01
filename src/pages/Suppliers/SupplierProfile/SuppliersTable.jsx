/* eslint-disable react/prop-types */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Typography,
  Grid,
  IconButton,
  Box,
  Collapse,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";


const SuppliersTable = ({
  supplierPaymentData,
  onRecordPayment,
  onViewHistory,
}) => {
  const theme = useTheme();
  const [openPayments, setOpenPayments] = useState(false);

  // Format currency with Bangladeshi Taka symbol
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "৳0";
    return `৳${Number(value).toLocaleString()}`;
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return theme.palette.error.main;
    if (balance < 0) return theme.palette.success.main;
    return theme.palette.text.secondary;
  };

  const getPaymentMethodDetails = (payment) => {
    switch (payment.method) {
      case "Bank Transfer":
        return `Bank: ${payment.bankName || "N/A"}, Account: ${payment.accountNumber || "N/A"}`;
      case "Card":
        return `Card: ${payment.cardNumber ? `****${payment.cardNumber.slice(-4)}` : "N/A"}, Holder: ${payment.cardHolder || "N/A"}`;
      case "Check":
        return `Check #: ${payment.checkNumber || "N/A"}, Bank: ${payment.bankName || "N/A"}`;
      case "Bkash":
      case "Nagad":
      case "Rocket":
        return `Mobile: ${payment.mobileNumber || "N/A"}`;
      default:
        return payment.method;
    }
  };

  const supplier = supplierPaymentData;

  if (!supplier) {
    return <Typography>No payment data available</Typography>;
  }

  return (
    <Grid item xs={12}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Total Due (৳)
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Total Paid (৳)
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Balance (৳)
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: "bold" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={supplier._id} hover>
                <TableCell>{formatCurrency(supplier?.purchasesSummary?.dueAmount)}</TableCell>
                <TableCell>{formatCurrency(supplier?.purchasesSummary?.totalPaid)}</TableCell>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    color={getBalanceColor(supplier?.purchasesSummary?.balance)}
                  >
                    {formatCurrency(supplier?.purchasesSummary?.balance)}
                    {supplier?.purchasesSummary?.balance < 0 ? " (Overpayment)" : supplier?.purchasesSummary?.balance > 0 ? " (Due)" : ""}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={supplier.supplier_status || "Unknown"}
                    color={
                      supplier.supplier_status === "active"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PaymentIcon />}
                      onClick={() => onRecordPayment(supplier)}
                      // disabled={(supplier.balance || 0) <= 0}
                    >
                      Pay
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={() => onViewHistory(supplier)}
                      size="small"
                    >
                      <HistoryIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setOpenPayments(!openPayments)}
                    >
                      {openPayments ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>

              {/* Expandable Payment Details */}
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{ p: 0, border: "none", bgcolor: "#fafafa" }}
                >
                  <Collapse in={openPayments} timeout="auto" unmountOnExit>
                    <Box p={2}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Payment History
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount (৳)</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Transaction ID</TableCell>
                            <TableCell>Note</TableCell>
                            <TableCell>Type</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {supplier.payments?.length > 0 ? (
                            supplier.payments.map((payment) => (
                              <TableRow key={payment._id}>
                                <TableCell>
                                  {payment.date
                                    ? new Date(payment.date).toLocaleDateString()
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(payment.amount)}
                                </TableCell>
                                <TableCell>{payment.method || "N/A"}</TableCell>
                                <TableCell>
                                  {getPaymentMethodDetails(payment)}
                                </TableCell>
                                <TableCell>{payment.transactionId || "N/A"}</TableCell>
                                <TableCell>{payment.note || "N/A"}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={payment.isPartial ? "Partial" : "Full"}
                                    size="small"
                                    color={payment.isPartial ? "warning" : "success"}
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                No payments found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
};

export default SuppliersTable;