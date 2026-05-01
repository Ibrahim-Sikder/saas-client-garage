/* eslint-disable react/prop-types */
import { CheckIcon, ShoppingCartIcon } from "lucide-react";
import { Inventory } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import SummaryCards from "../../../components/SummaryCard";

const ParentComponent = ({ purchaseOrderData }) => {
  const theme = useTheme();

  const cards = [
    {
      title: "Total Orders",
      value: purchaseOrderData?.data?.meta?.total || 0,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light,
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Pending Orders",
      value: purchaseOrderData?.data?.orders?.filter(o => o.status === "Pending").length || 0,
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Confirmed Orders",
      value: purchaseOrderData?.data?.orders?.filter(o => o.status === "Approved").length || 0,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light,
      icon: <CheckIcon />,
    },
    {
      title: "Shipped Orders",
      value: purchaseOrderData?.data?.orders?.filter(o => o.status === "Shipped").length || 0,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
      icon: <Inventory />,
    },
  ];

  return <SummaryCards cards={cards} />;
};

export default ParentComponent;
