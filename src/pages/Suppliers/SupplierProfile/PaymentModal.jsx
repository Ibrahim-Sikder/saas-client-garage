/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Slider,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Smartphone as MobileIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useRecordPaymentMutation } from "../../../redux/api/supplier";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { toast } from "react-toastify";

const PaymentModal = ({ open, onClose, onSave, supplier }) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [transactionId, setTransactionId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const { tenantDomain } = useTenantDomain();
  const [recordPayment] = useRecordPaymentMutation();

  useEffect(() => {
    if (supplier && open) {
      setAmount(supplier.balance > 0 ? supplier.balance.toString() : "");
      setMethod("Bank Transfer");
      setTransactionId("");
      setAccountNumber("");
      setCardNumber("");
      setCardHolder("");
      setExpiryDate("");
      setCvv("");
      setCheckNumber("");
      setBankName("");
      setMobileNumber("");
      setNote("");
      setErrors({});
    }
  }, [supplier, open]);

  const handleSubmit = async () => {
    if (!amount || !method) {
      setErrors({
        amount: !amount ? "Amount is required" : "",
        method: !method ? "Payment method is required" : "",
      });
      return;
    }
    const paymentData = {
      supplierId: supplier._id,
      amount: parseFloat(amount),
      method,
      transactionId,
      accountNumber,
      note,
      cardNumber: method === "Card" ? cardNumber : undefined,
      cardHolder: method === "Card" ? cardHolder : undefined,
      expiryDate: method === "Card" ? expiryDate : undefined,
      cvv: method === "Card" ? cvv : undefined,
      checkNumber: method === "Check" ? checkNumber : undefined,
      bankName: method === "Check" ? bankName : undefined,
      mobileNumber: ["Bkash", "Nagad", "Rocket"].includes(method)
        ? mobileNumber
        : undefined,
    };



    try {
      const res = await recordPayment({
        data: paymentData,
        tenantDomain,
      }).unwrap();

      if (res.success) {
        toast.success("Payment recorded successfully!");
        onClose();
      }
    } catch (error) {
      let errorMessage = "Something went wrong";

      if (error && error.data) {
        const errorData = error.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (
          errorData.errorSources &&
          errorData.errorSources.length > 0
        ) {
          errorMessage = errorData.errorSources[0].message;
        }
      } else if (error && error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, "");

    if (v.length <= 2) {
      return v;
    }

    return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
  };

  const formatMobileNumber = (value) => {
    const v = value.replace(/\D/g, "");
    return v.slice(0, 11);
  };

  const handleSliderChange = (event, newValue) => {
    setAmount(newValue.toString());
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PaymentIcon /> Record Payment
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {supplier?.balance > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Outstanding Balance: ${supplier.balance.toFixed(2)}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Supplier"
              value={supplier?.full_name || ""}
              disabled
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Payment Amount</Typography>
            <Slider
              value={parseFloat(amount) || 0}
              onChange={handleSliderChange}
              aria-labelledby="payment-amount-slider"
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value}`}
              step={1}
              min={0}
              max={supplier?.balance || 0}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              variant="outlined"
              error={!!errors.amount}
              helperText={errors.amount}
              InputProps={{
                startAdornment: (
                  <MoneyIcon
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.method}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={method}
                label="Payment Method"
                onChange={(e) => setMethod(e.target.value)}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Bkash">Bkash</MenuItem>
                <MenuItem value="Nagad">Nagad</MenuItem>
                <MenuItem value="Rocket">Rocket</MenuItem>
                <MenuItem value="Check">Check</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {errors.method && (
                <Box sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>
                  {errors.method}
                </Box>
              )}
            </FormControl>
          </Grid>

          {method === "Card" && (
            <>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CreditCardIcon
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                  <Typography variant="h6">Card Information</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  variant="outlined"
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Card Holder Name"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  variant="outlined"
                  error={!!errors.cardHolder}
                  helperText={errors.cardHolder}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expiry Date (MM/YY)"
                  value={expiryDate}
                  onChange={(e) =>
                    setExpiryDate(formatExpiryDate(e.target.value))
                  }
                  variant="outlined"
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                  placeholder="MM/YY"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  variant="outlined"
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  type="password"
                />
              </Grid>
            </>
          )}

          {method === "Check" && (
            <>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BankIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">Check Information</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Check Number"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                  variant="outlined"
                  error={!!errors.checkNumber}
                  helperText={errors.checkNumber}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  variant="outlined"
                  error={!!errors.bankName}
                  helperText={errors.bankName}
                />
              </Grid>
            </>
          )}

          {method === "Bank Transfer" && (
            <>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <BankIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">
                    Bank Transfer Information
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </>
          )}

          {["Bkash", "Nagad", "Rocket"].includes(method) && (
            <>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <MobileIcon
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                  <Typography variant="h6">{method} Information</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(formatMobileNumber(e.target.value))
                  }
                  variant="outlined"
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                  placeholder="01XXXXXXXXX"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  variant="outlined"
                  error={!!errors.transactionId}
                  helperText={errors.transactionId}
                />
              </Grid>
            </>
          )}

          {method === "Other" && (
            <Grid item xs={12}>
              <Alert severity="info">
                Please provide details about the payment method in the note
                section below.
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!amount || !method}
          startIcon={<PaymentIcon />}
        >
          Record Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
