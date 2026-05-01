/* eslint-disable react/prop-types */
import {
  ErrorOutline as ErrorOutlineIcon,
  Inventory as InventoryIcon,
  WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import SummaryCards from "../../../components/SummaryCard";

export default function ExpiredStatsCards({
  totalExpired,
  totalExpiringSoon,
  totalQuantity,
  processedProducts,
}) {
  const theme = useTheme();

  const cards = [
    {
      title: "Expired",
      value: totalExpired,
      subtitle: "Needs immediate attention",
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light,
      icon: <ErrorOutlineIcon />,
    },
    {
      title: "Expiring Soon",
      value: totalExpiringSoon,
      subtitle: "Monitor closely",
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      icon: <WarningAmberIcon />,
    },
    {
      title: "Total Quantity",
      value: totalQuantity,
      subtitle: `Total of ${processedProducts.length} products`,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light,
      icon: <InventoryIcon />,
    },
  ];

  return <SummaryCards cards={cards} singleRow={false} />;
}
