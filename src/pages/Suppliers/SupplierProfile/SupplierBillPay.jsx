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
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import SummaryCards from "./SummaryCards";
import SuppliersTable from "./SuppliersTable";
import PaymentModal from "./PaymentModal";
import PaymentHistoryModal from "./PaymentHistory";

const SupplierBillPay = ({ supplier }) => {
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
    setSuppliers([]);
  }, []);

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

  const handleSavePayment = (paymentData) => {
    if (!selectedSupplier) return;

    const newPayment = {
      _id: `p${Date.now()}`,
      ...paymentData,
      date: new Date(),
    };

    setSuppliers((prev) =>
      prev.map((supplier) => {
        if (supplier._id === selectedSupplier._id) {
          return {
            ...supplier,
            payments: [newPayment, ...supplier.payments],
            totalPaid: supplier.totalPaid + paymentData.amount,
            balance: supplier.balance - paymentData.amount,
          };
        }
        return supplier;
      })
    );

    setIsModalOpen(false);
    showNotification("Payment recorded successfully");
  };

  const handleUpdatePayment = (supplierId, paymentId, paymentData) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s._id === supplierId) {
          const updatedPayments = s.payments.map((p) =>
            p._id === paymentId ? { ...p, ...paymentData } : p
          );
          const totalPaid = updatedPayments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );
          const balance = s.totalDue - totalPaid;

          return {
            ...s,
            payments: updatedPayments,
            totalPaid,
            balance,
          };
        }
        return s;
      })
    );

    showNotification("Payment updated successfully");
  };

  const handleDeletePayment = (supplierId, paymentId) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s._id === supplierId) {
          const updatedPayments = s.payments.filter((p) => p._id !== paymentId);
          const totalPaid = updatedPayments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );
          const balance = s.totalDue - totalPaid;

          return {
            ...s,
            payments: updatedPayments,
            totalPaid,
            balance,
          };
        }
        return s;
      })
    );

    showNotification("Payment deleted successfully");
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
        <SummaryCards supplier={supplier} suppliers={suppliers} />
        <SuppliersTable
          suppliers={suppliers}
          supplierPaymentData={supplier}
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

      <PaymentHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        supplier={selectedSupplier}
        onUpdatePayment={handleUpdatePayment}
        onDeletePayment={handleDeletePayment}
      />
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

export default SupplierBillPay;
