export const getStatusColor = (status, theme) => {
  const defaultColors = {
    Paid: "#4caf50",
    Pending: "#ff9800",
    Cancelled: "#f44336",
    Unpaid: "#f44336",
  };

  if (!theme) {
    return defaultColors[status] || "#2196f3";
  }

  switch (status) {
    case "Paid":
      return theme.palette.success.main;
    case "Pending":
      return theme.palette.warning.main;
    case "Cancelled":
      return theme.palette.error.main;
    case "Unpaid":
      return theme.palette.error.main;
    default:
      return theme.palette.info.main;
  }
};

import { CheckCircle, Warning, Cancel } from "@mui/icons-material";

export const getStatusIcon = (status) => {
  switch (status) {
    case "Paid":
      return <CheckCircle fontSize="small" />;
    case "Pending":
      return <Warning fontSize="small" />;
    case "Cancelled":
    case "Unpaid":
      return <Cancel fontSize="small" />;
    default:
      return null;
  }
};
