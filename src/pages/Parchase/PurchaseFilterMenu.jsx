/* eslint-disable react/prop-types */
import { Box, Button, Divider, Menu, MenuItem, Typography } from "@mui/material";

export default function PurchaseFilterMenu({
    anchorEl,
    open,
    onClose,
    filterStatus,
    filterPayment,
    handleFilterStatus,
    handleFilterPayment,
    clearFilters,
}) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    mt: 1.5,
                    borderRadius: "10px",
                    boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    minWidth: "200px",
                    overflow: "hidden",
                },
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                }}
            >
                <Typography variant="subtitle2" fontWeight="600" color="#1e293b">
                    Filter Purchases
                </Typography>
            </Box>

            <MenuItem sx={{ fontWeight: "bold", color: "#1e293b" }}>Status</MenuItem>
            <MenuItem
                onClick={() => handleFilterStatus("Received")}
                sx={{
                    color: filterStatus === "Received" ? "#6366f1" : "#64748b",
                    fontWeight: filterStatus === "Received" ? "600" : "normal",
                    pl: 3,
                }}
            >
                Received
            </MenuItem>
            <MenuItem
                onClick={() => handleFilterStatus("Pending")}
                sx={{
                    color: filterStatus === "Pending" ? "#6366f1" : "#64748b",
                    fontWeight: filterStatus === "Pending" ? "600" : "normal",
                    pl: 3,
                }}
            >
                Pending
            </MenuItem>
            <MenuItem
                onClick={() => handleFilterStatus("Ordered")}
                sx={{
                    color: filterStatus === "Ordered" ? "#6366f1" : "#64748b",
                    fontWeight: filterStatus === "Ordered" ? "600" : "normal",
                    pl: 3,
                }}
            >
                Ordered
            </MenuItem>

            <Divider />

            <MenuItem sx={{ fontWeight: "bold", color: "#1e293b" }}>Payment</MenuItem>
            <MenuItem
                onClick={() => handleFilterPayment("Paid")}
                sx={{
                    color: filterPayment === "Paid" ? "#6366f1" : "#64748b",
                    fontWeight: filterPayment === "Paid" ? "600" : "normal",
                    pl: 3,
                }}
            >
                Paid
            </MenuItem>
            <MenuItem
                onClick={() => handleFilterPayment("Unpaid")}
                sx={{
                    color: filterPayment === "Unpaid" ? "#6366f1" : "#64748b",
                    fontWeight: filterPayment === "Unpaid" ? "600" : "normal",
                    pl: 3,
                }}
            >
                Unpaid
            </MenuItem>
            <MenuItem
                onClick={() => handleFilterPayment("Partial")}
                sx={{
                    color: filterPayment === "Partial" ? "#6366f1" : "#64748b",
                    fontWeight: filterPayment === "Partial" ? "600" : "normal",
                    pl: 3,
                }}
            >
                Partial
            </MenuItem>

            <Divider />

            <Box sx={{ p: 1.5, display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={clearFilters}
                    sx={{
                        borderRadius: "6px",
                        borderColor: "#e2e8f0",
                        color: "#64748b",
                        mr: 1,
                    }}
                >
                    Clear
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={onClose}
                    sx={{
                        borderRadius: "6px",
                        backgroundColor: "#6366f1",
                    }}
                >
                    Apply
                </Button>
            </Box>
        </Menu>
    );
}
