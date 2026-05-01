/* eslint-disable react/prop-types */
"use client";

import {
  Box,
  Button,
  DialogActions,
  Typography,
  Grid,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { StatusChip } from "./supplier";
import GarageModal from "../../../components/Share/Modal/GarageModal";

const SupplierPurchaseDetails = ({ open, onClose, order, setOpen }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#4caf50";
      case "Unpaid":
        return "#f44336";
      case "Pending":
        return "#ff9800";
      default:
        return "#2196f3";
    }
  };

  const calculateTotalItems = (products) =>
    products?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title="Purchase Order Details"
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold" color="textSecondary">
              Reference No
            </Typography>
            <Typography variant="body1">{order.referenceNo}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold" color="textSecondary">
              Order Date
            </Typography>
            <Typography variant="body1">
              {new Date(order.date).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold" color="textSecondary">
              Total Items
            </Typography>
            <Typography variant="body1">
              {calculateTotalItems(order.products)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold" color="textSecondary">
              Grand Total
            </Typography>
            <Typography variant="body1">
              ৳{order.grandTotal.toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold" color="textSecondary">
              Paid Amount
            </Typography>
            <Typography variant="body1">
              ৳{order.paidAmount.toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold" color="textSecondary">
              Due Amount
            </Typography>
            <Typography variant="body1">
              ৳{order.dueAmount.toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold" color="textSecondary">
              Payment Method
            </Typography>
            <Typography variant="body1">
              {order.paymentMethod || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold" color="textSecondary">
              Status
            </Typography>
            <StatusChip
              label={order.purchaseStatus}
              statuscolor={getStatusColor(order.purchaseStatus)}
              size="small"
            />
          </Grid>
        </Grid>

        {order.note && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight="bold" color="textSecondary">
              Note
            </Typography>
            <Typography variant="body1">{order.note}</Typography>
          </Box>
        )}

        {order.products?.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Products
            </Typography>
            <MuiTable size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.products.map((product, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.productUnit}</TableCell>
                    <TableCell align="right">{product.quantity}</TableCell>
                    <TableCell align="right">
                      ৳{product.productPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ৳{(product.productPrice * product.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </MuiTable>
          </Box>
        )}
      </Box>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </GarageModal>
  );
};

export default SupplierPurchaseDetails;
