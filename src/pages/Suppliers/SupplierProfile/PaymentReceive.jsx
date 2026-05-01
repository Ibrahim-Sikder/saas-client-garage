/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { supplierApi } from "../api/supplierApi";
import SummaryCards from "./SummaryCards";
import SuppliersTable from "./SuppliersTable";
import PaymentModal from "./PaymentModal";

const PaymentHistory = ({ payments, supplierId, onUpdatePayment, onDeletePayment }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    amount: "",
    method: "",
    transactionId: "",
    accountNumber: "",
    note: "",
    date: "",
  });
  const theme = useTheme();

  const handleEditClick = (payment) => {
    setCurrentPayment(payment);
    setEditFormData({
      amount: payment.amount.toString(),
      method: payment.method,
      transactionId: payment.transactionId || "",
      accountNumber: payment.accountNumber || "",
      note: payment.note || "",
      date: format(new Date(payment.date), "yyyy-MM-dd'T'HH:mm"),
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    onUpdatePayment(supplierId, currentPayment._id, {
      ...editFormData,
      amount: parseFloat(editFormData.amount),
      date: new Date(editFormData.date).toISOString(),
    });
    setEditModalOpen(false);
  };

  const handleDeleteClick = (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      onDeletePayment(supplierId, paymentId);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "PPpp");
  };

  const getMethodColor = (method) => {
    const colors = {
      Cash: "success",
      "Bank Transfer": "primary",
      Card: "secondary",
      Bkash: "info",
      Nagad: "warning",
      Rocket: "error",
      Other: "default",
    };
    return colors[method] || "default";
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Payment History
      </Typography>
      
      {(!payments || payments.length === 0) ? (
        <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
          No payment history available
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.method}
                      color={getMethodColor(payment.method)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{payment.transactionId || "-"}</TableCell>
                  <TableCell>{payment.accountNumber || "-"}</TableCell>
                  <TableCell>{payment.note || "-"}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(payment)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(payment._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Payment Dialog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <EditIcon /> Edit Payment
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={editFormData.amount}
                onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={editFormData.method}
                  label="Payment Method"
                  onChange={(e) => setEditFormData({ ...editFormData, method: e.target.value })}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Bkash">Bkash</MenuItem>
                  <MenuItem value="Nagad">Nagad</MenuItem>
                  <MenuItem value="Rocket">Rocket</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID"
                value={editFormData.transactionId}
                onChange={(e) => setEditFormData({ ...editFormData, transactionId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Number"
                value={editFormData.accountNumber}
                onChange={(e) => setEditFormData({ ...editFormData, accountNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date & Time"
                type="datetime-local"
                value={editFormData.date}
                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Note"
                value={editFormData.note}
                onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Update Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const PaymentReceive = ({ supplier }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const theme = useTheme();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await supplierApi.getAll();
      setSuppliers(response.data);
    } catch (error) {
      showNotification("Error fetching suppliers", "error");
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleRecordPayment = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleViewHistory = (supplier) => {
    setSelectedSupplier(supplier);
    setHistoryModalOpen(true);
  };

  const handleSavePayment = async (paymentData) => {
    try {
      const payload = {
        ...paymentData,
        supplierId: selectedSupplier._id,
      };

      const response = await supplierApi.recordPayment(payload);

      // Update local state with the response data
      setSuppliers((prev) =>
        prev.map((supplier) => {
          if (supplier._id === selectedSupplier._id) {
            return response.data;
          }
          return supplier;
        })
      );

      setIsModalOpen(false);
      showNotification("Payment recorded successfully");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Error recording payment",
        "error"
      );
    }
  };

  const handleUpdatePayment = async (supplierId, paymentId, paymentData) => {
    try {
      const response = await supplierApi.updatePayment(supplierId, paymentId, paymentData);
      
      // Update local state
      setSuppliers(prev => prev.map(s => {
        if (s._id === supplierId) {
          return {
            ...s,
            payments: s.payments.map(p => 
              p._id === paymentId ? response.data : p
            )
          };
        }
        return s;
      }));
      
      showNotification("Payment updated successfully");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Error updating payment",
        "error"
      );
    }
  };

  const handleDeletePayment = async (supplierId, paymentId) => {
    try {
      await supplierApi.deletePayment(supplierId, paymentId);
      
      // Update local state
      setSuppliers(prev => prev.map(s => {
        if (s._id === supplierId) {
          return {
            ...s,
            payments: s.payments.filter(p => p._id !== paymentId)
          };
        }
        return s;
      }));
      
      showNotification("Payment deleted successfully");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Error deleting payment",
        "error"
      );
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        background: alpha(theme.palette.primary.light, 0.05),
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color="primary"
        >
          Supplier Payments
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Supplier
        </Button>
      </Box>

      <Grid container spacing={3}>
        <SummaryCards suppliers={suppliers} />
        <SuppliersTable
          suppliers={suppliers}
          onRecordPayment={handleRecordPayment}
          onViewHistory={handleViewHistory}
        />
      </Grid>

      <PaymentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePayment}
        supplier={selectedSupplier}
      />

      {/* Payment History Modal */}
      <Dialog 
        open={historyModalOpen} 
        onClose={() => setHistoryModalOpen(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center">
            <HistoryIcon sx={{ mr: 1 }} />
            Payment History - {selectedSupplier?.full_name}
          </Box>
          <IconButton onClick={() => setHistoryModalOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedSupplier && (
            <PaymentHistory
              payments={selectedSupplier.payments || []}
              supplierId={selectedSupplier._id}
              onUpdatePayment={handleUpdatePayment}
              onDeletePayment={handleDeletePayment}
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentReceive;