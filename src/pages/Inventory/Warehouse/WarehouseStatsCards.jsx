/* eslint-disable react/prop-types */
import { Warehouse, Inventory } from "@mui/icons-material";
import SummaryCards from "../../../components/SummaryCard";

export default function WarehouseStatsCards({ totalWarehouses, totalQuantity }) {
    const cards = [
        {
            title: "Total Warehouses",
            value: totalWarehouses,
            color: "#3B82F6",
            bgColor: "#6366F1",
            icon: <Warehouse fontSize="large" />,
        },
        {
            title: "Total Quantity",
            value: totalQuantity,
            color: "#10B981",
            bgColor: "#059669",
            icon: <Inventory fontSize="large" />,
        },

    ];

    return <SummaryCards cards={cards} columns={3} />;
}
