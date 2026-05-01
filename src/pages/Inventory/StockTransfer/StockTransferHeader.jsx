/* eslint-disable react/prop-types */
"use client";

import { Box, Typography } from "@mui/material";
import { wrapBoxStyle } from "../../../utils/customStyle";
import Breadcrumb from "../../../components/Breadcrumb";

export default function StockTransferHeader() {
    const breadcrumbItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Inventory", href: "/inventory" },
        { label: "Stock Transfer" },
    ];

    return (
        <Box sx={wrapBoxStyle}>
            <Breadcrumb items={breadcrumbItems} />

            <Box sx={{ mb: 4, px: 3 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                        mb: 1,
                    }}
                >
                    Stock Transfer
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Transfer stock between different locations and view transfer history
                </Typography>
            </Box>
        </Box>
    );
}
