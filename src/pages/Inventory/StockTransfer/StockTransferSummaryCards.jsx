/* eslint-disable react/prop-types */
"use client";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SummaryCards from "../../../components/SummaryCard";

export default function StockTransferSummaryCards({ transfers, loading, getStatusCount }) {
    const cards = [
        {
            title: "Total Transfers",
            value: loading ? "..." : transfers.length,
            subtitle: "Total number of stock transfers",
            color: "#2196f3",
            bgColor: "#2196f3",
            icon: <SwapHorizIcon />,
        },
        {
            title: "Completed",
            value: loading ? "..." : getStatusCount("completed"),
            subtitle: "Number of completed transfers",
            color: "#4caf50",
            bgColor: "#4caf50",
            icon: <CheckCircleIcon />,
        },
        {
            title: "Pending",
            value: loading ? "..." : getStatusCount("pending"),
            subtitle: "Number of pending transfers",
            color: "#ff9800",
            bgColor: "#ff9800",
            icon: <PendingIcon />,
        },
        {
            title: "In-Transit",
            value: loading ? "..." : getStatusCount("in-transit"),
            subtitle: "Number of in-transit transfers",
            color: "#00bcd4",
            bgColor: "#00bcd4",
            icon: <LocalShippingIcon />,
        },
    ];

    return <SummaryCards cards={cards} />;
}
