/* eslint-disable react/prop-types */
import { Chip } from "@mui/material";

const PurchaseReturnStatusChip = ({ status }) => {
  switch (status) {
    case "pending":
      return (
        <Chip
          label="Pending"
          color="warning"
          size="small"
          sx={{ fontWeight: "medium", borderRadius: "6px" }}
        />
      );
    case "completed":
      return (
        <Chip
          label="Completed"
          color="success"
          size="small"
          sx={{ fontWeight: "medium", borderRadius: "6px" }}
        />
      );
    case "cancelled":
      return (
        <Chip
          label="Cancelled"
          color="error"
          size="small"
          sx={{ fontWeight: "medium", borderRadius: "6px" }}
        />
      );
    default:
      return (
        <Chip
          label="Unknown"
          color="default"
          size="small"
          sx={{ fontWeight: "medium", borderRadius: "6px" }}
        />
      );
  }
};
export default PurchaseReturnStatusChip;
