/* eslint-disable react/prop-types */
"use client";

import { Box, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { purchaseBtn } from "../../../utils/customStyle";

export default function StockTransferActions({
    statusFilter,
    setStatusFilter,
    getStatusCount,
    handleClickOpen,
}) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <FormControl sx={{ minWidth: 220 }}>
                <InputLabel>Status Filter</InputLabel>
                <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <MenuItem value="all">All Transfers ({getStatusCount("all")})</MenuItem>
                    <MenuItem value="pending">Pending ({getStatusCount("pending")})</MenuItem>
                    <MenuItem value="in-transit">In-Transit ({getStatusCount("in-transit")})</MenuItem>
                    <MenuItem value="completed">Completed ({getStatusCount("completed")})</MenuItem>
                    <MenuItem value="cancelled">Cancelled ({getStatusCount("cancelled")})</MenuItem>
                </Select>
            </FormControl>

            <Box>
                <Button
                    sx={purchaseBtn}
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                    variant="contained"
                >
                    New Transfer
                </Button>
            </Box>
        </Box>
    );
}
