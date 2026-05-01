/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  InputAdornment,
  Alert,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  MonetizationOn,
  Person,
  CalendarMonth,
  Payment,
} from "@mui/icons-material";
import { usePartialyPaymentMutation } from "../../redux/api/salary";
import { toast } from "react-toastify";
import Can from "../../components/Can";

const PartialPaymentModal = ({
  tenantDomain,
  open,
  onClose,
  employee,
  salaryRecord,
  onPaymentSuccess,
  performActionWithPermission
}) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [error, setError] = useState("");
  const [partialyPayment, { isLoading }] = usePartialyPaymentMutation();

  const handleSubmit = async () => {
    performActionWithPermission('/dashboard/employee-salary', 'edit', async () => {
      const amount = Number.parseFloat(paymentAmount);
      if (!amount || amount <= 0) {
        setError("Please enter a valid payment amount");
        return;
      }

      if (amount > salaryRecord.due_amount) {
        setError("Payment amount cannot exceed due amount");
        return;
      }

      try {
        const result = await partialyPayment({
          id: salaryRecord._id,
          data: {
            tenantDomain,
            amount,
            note: note.trim() || undefined,
            payment_method: paymentMethod,
          },
        }).unwrap();
        toast.success("Payment added successfully!");
        setPaymentAmount("");
        setNote("");
        setPaymentMethod("cash");
        setError("");
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }

        onClose();
      } catch (error) {
        console.error("Error adding payment:", error);

        if (error.data && error.data.message) {
          setError(error.data.message);
          toast.error(error.data.message);
        } else if (error.message) {
          setError(error.message);
          toast.error(error.message);
        } else {
          setError("An error occurred while adding payment");
          toast.error("An error occurred while adding payment");
        }
      }
    }, "You don't have permission to add a payment.");
  };

  const handleClose = () => {
    setPaymentAmount("");
    setNote("");
    setPaymentMethod("cash");
    setError("");
    onClose();
  };

  // Calculate paid amount and due amount with fallbacks
  const paidAmount = salaryRecord.paid_amount || 0;
  const dueAmount = salaryRecord.due_amount || 0;
  const totalPayment = salaryRecord.total_payment || 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Payment color="primary" />
          <Typography variant="h6">Add Partial Payment</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Employee Info */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Employee
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {employee.full_name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarMonth color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Month
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {salaryRecord.month_of_salary}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Employee ID
                    </Typography>
                    <Chip
                      label={employee.employeeId}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Payment Summary */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    border: 1,
                    borderColor: "grey.300",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Total Salary
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    ৳{totalPayment.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    border: 1,
                    borderColor: "grey.300",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Paid Amount
                  </Typography>
                  <Typography
                    variant="h6"
                    color="success.main"
                    fontWeight="bold"
                  >
                    ৳{paidAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    border: 1,
                    borderColor: "grey.300",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Due Amount
                  </Typography>
                  <Typography variant="h6" color="error.main" fontWeight="bold">
                    ৳{dueAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Payment History */}
          {salaryRecord.payment_history &&
            salaryRecord.payment_history.length > 0 && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                >
                  Payment History
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                  {salaryRecord.payment_history.map((payment, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        mb: 1,
                        border: 1,
                        borderColor: "grey.200",
                        borderRadius: 1,
                        bgcolor: "grey.50",
                      }}
                    >
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Typography variant="body2" fontWeight="medium">
                            ৳{payment.amount.toLocaleString()}
                          </Typography>
                          {payment.note && (
                            <Typography variant="body2" color="text.secondary">
                              {payment.note}
                            </Typography>
                          )}
                          {payment.payment_method && (
                            <Chip
                              label={payment.payment_method}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Grid>
                        <Grid item>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(payment.date).toLocaleDateString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Payment Form */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Add New Payment
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Payment Amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => {
                setPaymentAmount(e.target.value);
                setError("");
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOn color="primary" />
                  </InputAdornment>
                ),
              }}
              error={!!error}
              helperText={error || `Maximum: ৳${dueAmount.toLocaleString()}`}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isLoading}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                label="Payment Method"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="check">Check</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Note (Optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., First installment, Advance payment"
              multiline
              rows={2}
              disabled={isLoading}
            />
          </Grid>

          {dueAmount === 0 && (
            <Grid item xs={12}>
              <Alert severity="success">
                This employee's salary for {salaryRecord.month_of_salary} has
                been fully paid.
              </Alert>
            </Grid>
          )}

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Can page='/dashboard/employee-salary' action='edit'>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading || dueAmount === 0}
            startIcon={<Payment />}
          >
            {isLoading ? "Processing..." : "Add Payment"}
          </Button>
        </Can>
      </DialogActions>
    </Dialog>
  );
};

export default PartialPaymentModal;
