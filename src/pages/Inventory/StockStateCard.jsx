/* eslint-disable react/prop-types */
import { ErrorOutline, Inventory, MonetizationOn, WarningAmber } from "@mui/icons-material";
import SummaryCards from "../../components/SummaryCard";

const StockStateCard = ({ summaryStats, isLoading, formatCurrency }) => {

    const cards = [
        {
            title: "Total Stock",
            value: summaryStats?.totalItems,
            icon: <Inventory />,
            description: "Total items in inventory",
            color: "#1976d2",
            bgColor: "#e3f2fd",
        },
        {
            title: "Purchase Value",
            value: formatCurrency(summaryStats?.totalPurchaseValue),
            icon: <MonetizationOn />,
            description: "Total purchase value",
            color: "#4caf50",
            bgColor: "#e8f5e9",
        },
        {
            title: "Low Stock",
            value: summaryStats?.lowStockItems,
            icon: <WarningAmber />,
            description: "Items with low stock",
            color: "#ff9800",
            bgColor: "#fff3e0",
        },
        {
            title: "Out of Stock",
            value: summaryStats?.outOfStockItems,
            icon: <ErrorOutline />,
            description: "Items out of stock",
            color: "#f44336",
            bgColor: "#ffebee",
        },
    ];

    return <SummaryCards cards={cards} isLoading={isLoading} />;
};

export default StockStateCard;
