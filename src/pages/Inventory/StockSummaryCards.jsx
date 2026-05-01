/* eslint-disable react/prop-types */
"use client";
import { useTheme } from "@mui/material/styles";
import WarningIcon from "@mui/icons-material/Warning";
import SummaryCards from "../../components/SummaryCard";

export default function StockSummaryCards({ stockData = [], criticalStocks = [] }) {
    const theme = useTheme();

    const outOfStockCount = criticalStocks.filter(stock => stock.stock === 0).length;
    const totalProducts = stockData?.length || 0;

    const cards = [
        {
            title: "Critical Stock Items",
            value: criticalStocks.length,
            subtitle: "Needs Immediate Attention",
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light,
            icon: <WarningIcon fontSize="large" />,
        },
        {
            title: "Out of Stock",
            value: outOfStockCount,
            subtitle: "Zero Inventory",
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light,
            icon: <WarningIcon fontSize="large" />,
        },
        {
            title: "Total Products",
            value: totalProducts,
            subtitle: "All Inventory Items",
            color: theme.palette.info.main,
            bgColor: theme.palette.info.light,
            icon: <WarningIcon fontSize="large" />,
        },
    ];

    return <SummaryCards cards={cards} />;
}
