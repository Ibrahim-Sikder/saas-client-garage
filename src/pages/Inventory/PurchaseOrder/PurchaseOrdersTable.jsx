/* eslint-disable react/prop-types */
import { CalendarToday, MoreVert } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Chip,
  Avatar,
  Pagination,
  LinearProgress,
} from "@mui/material";

import { useTheme, alpha } from "@mui/material/styles";
import { formatCurrency } from "../../../utils/formateCurrency";

const PurchaseOrdersTable = ({
  purchaseOrderData,
  isLoading,
  onMenuOpen,
  page,
  onPageChange,
}) => {
  const theme = useTheme();

  const getAvatarColor = (initial) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];

    const charCode = initial.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const calculateTotalQuantity = (products) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.reduce(
      (total, product) => total + (product.quantity || 0),
      0
    );
  };




  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        mb: 3,
      }}
    >
      {isLoading && <LinearProgress />}

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Order No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Supplier</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Total Quantity
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Product Price (৳)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Total Amount (৳)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Order Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Expected Delivery
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrderData?.data?.orders?.map((order) => (
              <TableRow
                key={order._id}
                sx={{
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    cursor: "pointer",
                  },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    {order.referenceNo}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        mr: 1,
                        fontSize: "0.875rem",
                        bgcolor: getAvatarColor(
                          order.suppliers?.[0]?.full_name?.charAt(0) || "U"
                        ),
                      }}
                    >
                      {order.suppliers?.[0]?.full_name?.charAt(0) || "U"}
                    </Avatar>
                    {order.suppliers?.[0]?.full_name || "Unknown Supplier"}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${calculateTotalQuantity(order.products)}`}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      borderRadius: "6px",
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  {order.products?.[0]?.unit_price
                    ? formatCurrency(order.products[0].unit_price)
                    : "-"}
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: "bold" }}>
                    {formatCurrency(order.grandTotal)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "Approved"
                        ? "success"
                        : order.status === "Cancelled"
                          ? "error"
                          : order.status === "Pending"
                            ? "warning"
                            : order.status === "Shipped"
                              ? "info"
                              : order.status === "Received"
                                ? "primary"
                                : "default"
                    }
                    size="small"
                    sx={{ fontWeight: "medium", borderRadius: "6px" }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarToday
                      fontSize="small"
                      sx={{
                        mr: 1,
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                      }}
                    />
                    {new Date(order.orderDate).toLocaleDateString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarToday
                      fontSize="small"
                      sx={{
                        mr: 1,
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                      }}
                    />
                    {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuOpen(e, order)}
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Pagination
          count={purchaseOrderData?.data?.meta?.totalPage || 1}
          page={page}
          onChange={onPageChange}
          color="primary"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 1,
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default PurchaseOrdersTable;