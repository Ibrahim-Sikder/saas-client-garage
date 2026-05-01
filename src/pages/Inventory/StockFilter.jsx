/* eslint-disable react/prop-types */
"use client";

import React from "react";
import { Box, Button, Chip, Tooltip, Badge, Menu, MenuItem, Typography } from "@mui/material";
import { alpha } from "@mui/material";
import { ClearAll as ClearAllIcon, FilterAlt as FilterAltIcon } from "@mui/icons-material";

export default function StockFilter({ statusFilter, setStatusFilter }) {
    const [filterMenuAnchor, setFilterMenuAnchor] = React.useState(null);

    const clearFilters = () => setStatusFilter("all");
    const handleFilterMenuOpen = (e) => setFilterMenuAnchor(e.currentTarget);
    const handleFilterMenuClose = () => setFilterMenuAnchor(null);

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, flexWrap: "wrap", gap: 1 }}>
            {statusFilter !== "all" && <Chip label={`Status: ${statusFilter}`} onDelete={clearFilters} />}
            {statusFilter !== "all" && (
                <Button startIcon={<ClearAllIcon />} onClick={clearFilters} variant="outlined" size="small">
                    Clear All
                </Button>
            )}

            <Tooltip title="Filter">
                <Button
                    variant="outlined"
                    startIcon={<FilterAltIcon />}
                    onClick={handleFilterMenuOpen}
                    sx={{
                        borderColor: statusFilter !== "all" ? "#6366f1" : "#e2e8f0",
                        color: statusFilter !== "all" ? "#6366f1" : "#64748b",
                        backgroundColor: statusFilter !== "all" ? alpha("#6366f1", 0.05) : "transparent",
                        "&:hover": {
                            borderColor: statusFilter !== "all" ? "#4f46e5" : "#cbd5e1",
                            backgroundColor: statusFilter !== "all" ? alpha("#6366f1", 0.1) : "#f8fafc",
                        },
                    }}
                >
                    Filter
                    {statusFilter !== "all" && <Badge badgeContent={1} color="primary" sx={{ ml: 1 }} />}
                </Button>
            </Tooltip>

            <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleFilterMenuClose}
                PaperProps={{ sx: { mt: 1, borderRadius: "10px", minWidth: 220 } }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography fontWeight={600}>Filter By</Typography>
                </Box>
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2">Status</Typography>
                    {["all", "in-stock", "low-stock", "out-of-stock"].map((status) => (
                        <MenuItem
                            key={status}
                            selected={statusFilter === status}
                            onClick={() => {
                                setStatusFilter(status);
                                handleFilterMenuClose();
                            }}
                        >
                            {status.replace("-", " ").toUpperCase()}
                        </MenuItem>
                    ))}
                </Box>
            </Menu>
        </Box>
    );
}
