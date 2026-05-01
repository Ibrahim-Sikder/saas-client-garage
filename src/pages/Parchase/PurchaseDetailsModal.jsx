/* eslint-disable react/prop-types */

import { alpha, Avatar, Box, Chip, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import GarageModal from "../../components/Share/Modal/GarageModal";
import { formatCurrency } from "../../utils/formateCurrency";
import { formatDate } from "../../utils/formateDate";
import { statusColors } from "../../constant/constant";


function PurchaseDetailsModal({ open, onClose, purchase, setOpen }) {

    const getSupplierName = (supplier) => {
        if (!supplier) return "N/A";
        if (typeof supplier === "string") return supplier;
        if (Array.isArray(supplier)) {
            if (supplier.length === 0) return "N/A";
            const firstSupplier = supplier[0];
            if (typeof firstSupplier === "string") return firstSupplier;
            if (typeof firstSupplier === "object" && firstSupplier !== null) {
                return (
                    firstSupplier.full_name ||
                    firstSupplier.name ||
                    `Supplier ${firstSupplier._id?.substring(0, 6) || "Unknown"}`
                );
            }
            return "N/A";
        }
        if (typeof supplier === "object" && supplier !== null) {
            return (
                supplier.full_name ||
                supplier.name ||
                `Supplier ${supplier._id?.substring(0, 6) || "Unknown"}`
            );
        }
        return "N/A";
    };


    const supplierName = getSupplierName(purchase?.suppliers);
    const statusColor = statusColors[purchase?.purchaseStatus] || {
        bg: "#64748b",
        color: "#fff",
    };

    if (!purchase) return null;

    return (
        <GarageModal
            open={open}
            onClose={onClose}
            setOpen={setOpen}
            maxWidth="md"
            title="Purchase Details "

        >

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                            Purchase Information
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Date:
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                {purchase.date ? formatDate(purchase.date) : "No date"}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Status:
                            </Typography>
                            <Chip
                                label={purchase.purchaseStatus || "N/A"}
                                size="small"
                                sx={{
                                    backgroundColor: statusColor.bg,
                                    color: statusColor.color,
                                    fontWeight: 600,
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Supplier:
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                {supplierName}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                            Payment Information
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Payment Method:
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                {purchase.paymentMethod || "N/A"}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Paid Amount:
                            </Typography>
                            <Typography variant="body2" fontWeight="500" color="#10b981">
                                {formatCurrency(purchase.paidAmount || 0)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Due Amount:
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight="500"
                                color={purchase.dueAmount > 0 ? "#ef4444" : "#10b981"}
                            >
                                {formatCurrency(purchase.dueAmount || 0)}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom>
                Products
            </Typography>
            <TableContainer sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchase.products?.map((product, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                mr: 1.5,
                                                backgroundColor: alpha("#6366f1", 0.1),
                                                color: "#6366f1",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {product.productName?.charAt(0).toUpperCase() || "P"}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="500">
                                                {product.productName || "Unknown Product"}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Unit: {product.productUnit || "N/A"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{product.quantity || 0}</TableCell>
                                <TableCell align="right">
                                    {formatCurrency(product.productPrice || 0)}
                                </TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight="600">
                                        {formatCurrency(
                                            (product.productPrice || 0) * (product.quantity || 0)
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                            Order Summary
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Subtotal:
                            </Typography>
                            <Typography variant="body2">
                                {formatCurrency(purchase.totalAmount || 0)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Discount:
                            </Typography>
                            <Typography variant="body2" color="#ef4444">
                                -{formatCurrency(purchase.totalDiscount || 0)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Tax:
                            </Typography>
                            <Typography variant="body2">
                                +{formatCurrency(purchase.totalTax || 0)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Shipping:
                            </Typography>
                            <Typography variant="body2">
                                +{formatCurrency(purchase.shipping || 0)}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" fontWeight="600">
                                Grand Total:
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                                {formatCurrency(purchase.grandTotal || 0)}
                            </Typography>
                        </Box>
                        {purchase.note && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Notes:
                                </Typography>
                                <Typography variant="body2">{purchase.note}</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

        </GarageModal>
    );
}

export default PurchaseDetailsModal