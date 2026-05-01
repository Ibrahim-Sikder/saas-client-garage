import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Link, Typography, useTheme } from "@mui/material";
import { GradientBreadcrumbs } from "../../../utils/customStyle";

export default function ExpiredBreadcrumb() {
  const theme = useTheme();

  return (
    <GradientBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 3 }}
    >
      <Link
        color="inherit"
        href="/dashboard"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <InventoryIcon fontSize="small" sx={{ mr: 0.5 }} />
        Dashboard
      </Link>
      <Link
        color="inherit"
        href="/inventory"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <LocalShippingIcon fontSize="small" sx={{ mr: 0.5 }} />
        Inventory
      </Link>
      <Typography
        color="text.primary"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <WarningAmberIcon
          fontSize="small"
          sx={{ mr: 0.5, color: theme.palette.error.main }}
        />
        Expired Products
      </Typography>
    </GradientBreadcrumbs>
  );
}
