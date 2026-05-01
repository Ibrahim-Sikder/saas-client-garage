/* eslint-disable react/prop-types */
import { Inventory, Payments } from "@mui/icons-material";
import { ReceiptIcon, ShoppingCartIcon } from "lucide-react";
import { formatCurrency } from "../../utils/formatter";
import SummaryCards from "../../components/SummaryCard";

const PurchaseSummaryCard = ({ purchaseSummary, meta }) => {
  const cards = [
    {
      title: "Total Purchases",
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.1)",
      icon: <ShoppingCartIcon />,
      value: meta?.total,
    },
    {
      title: "Total Amount",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
      icon: <Inventory />,
      value: formatCurrency(purchaseSummary.totalAmount),
    },
    {
      title: "Total Paid",
      value: formatCurrency(purchaseSummary.paidAmount),
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      icon: <Payments />,
    },
    {
      title: "Total Due",
      value: formatCurrency(purchaseSummary.dueAmount),
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      icon: <ReceiptIcon />,
    },
  ];

  return <SummaryCards cards={cards} />;
};

export default PurchaseSummaryCard;
