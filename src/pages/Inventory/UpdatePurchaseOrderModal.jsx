/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import PurchaseOrderForm from "./PurchaseOrder/PurchaseOrderForm";

const UpdatePurchaseOrderModal = ({ tenantDomain, open, onClose, orderId }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{ padding: "30px" }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <InventoryIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight="bold">
            New Purchase Order
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 8 }}>
        <PurchaseOrderForm tenantDomain={tenantDomain} orderId={orderId} onClose={onClose} />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePurchaseOrderModal;
