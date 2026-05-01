import { Cancel, CheckCircle, Info, Timelapse } from "@mui/icons-material";

export const getStatusColor = (status) => {
  if (
    status === "Active" ||
    status === "active" ||
    status === "Delivered" ||
    status === "Completed" ||
    status === "Paid" ||
    status === "Verified" ||
    status === "In Stock"
  ) {
    return "green";
  } else if (status === "Pending" || status === "Low Stock") {
    return "orange";
  } else if (
    status === "Inactive" ||
    status === "Cancelled" ||
    status === "Failed" ||
    status === "Out of Stock"
  ) {
    return "red";
  }
  return "blue";
};

// Function to get status icon
export const getStatusIcon = (status) => {
  if (
    status === "Active" ||
    status === "active" ||
    status === "Delivered" ||
    status === "Completed" ||
    status === "Paid" ||
    status === "Verified" ||
    status === "In Stock"
  ) {
    return <CheckCircle fontSize="small" />;
  } else if (status === "Pending" || status === "Low Stock") {
    return <Timelapse fontSize="small" />;
  } else if (
    status === "Inactive" ||
    status === "Cancelled" ||
    status === "Failed" ||
    status === "Out of Stock"
  ) {
    return <Cancel fontSize="small" />;
  }
  return <Info fontSize="small" />;
};

export const returnStatuses = [
  { value: "pending", label: "Pending", color: "warning" },
  { value: "completed", label: "Completed", color: "success" },
  { value: "cancelled", label: "Cancelled", color: "error" },
];


export const statusColors = {
  Received: { bg: "#10b981", color: "#fff" },
  Pending: { bg: "#f59e0b", color: "#fff" },
  Ordered: { bg: "#3b82f6", color: "#fff" },
  Canceled: { bg: "#ef4444", color: "#fff" },
  Partial: { bg: "#8b5cf6", color: "#fff" },
  Paid: { bg: "#10b981", color: "#fff" },
};