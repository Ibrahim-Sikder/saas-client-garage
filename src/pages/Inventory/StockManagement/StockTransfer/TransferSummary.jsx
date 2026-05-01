/* eslint-disable react/prop-types */
import { Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";

export default function TransferSummary({
  transferItems,
  getWarehouseName,
  formData,
  theme,
}) {
  const totalItems = transferItems.reduce(
    (sum, item) => sum + (item && item.product ? item.quantity : 0),
    0
  );
  
  const totalValue = transferItems
    .reduce(
      (sum, item) =>
        sum +
        (item && item.product
          ? item.quantity * (item.product.purchasePrice || 0)
          : 0),
      0
    )
    .toFixed(2);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        mt: 2,
        backgroundColor: alpha(theme.palette.info.main, 0.05),
        display: "flex",
        alignItems: "center",
      }}
    >
      <InfoIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
      <Typography variant="body2">
        This will transfer {totalItems} items from{" "}
        {getWarehouseName(formData.fromLocation)} to{" "}
        {getWarehouseName(formData.toLocation)}. Total value: ৳{" "}
        {totalValue}
      </Typography>
    </Paper>
  );
}