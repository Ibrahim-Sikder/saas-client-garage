/* eslint-disable react/prop-types */
import { Grid, Typography, Box } from "@mui/material";
import {
  LocalShippingOutlined,
  InventoryOutlined,
  ReceiptLongOutlined,
  AssessmentOutlined,
  ArrowUpward,
  CheckCircle as ReceivedIcon,
  Cancel as CancelledIcon,
  LocalShipping as ShippedIcon,
  Schedule as PendingIcon,
} from "@mui/icons-material";
import { GradientBox } from "./supplier";

const SupplierMetrics = ({ supplier, paymentStats }) => {
  // Format currency with Bangladeshi Taka symbol
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "৳0";
    return `৳${Number(value).toLocaleString()}`;
  };

  // Status configuration with icons and colors
  const statusConfig = {
    Received: {
      icon: <ReceivedIcon />,
      color: "#4CAF50",
      bgColor: "rgba(76, 175, 80, 0.2)",
    },
    Cancelled: {
      icon: <CancelledIcon />,
      color: "#F44336",
      bgColor: "rgba(244, 67, 54, 0.2)",
    },
    Shipped: {
      icon: <ShippedIcon />,
      color: "#2196F3",
      bgColor: "rgba(33, 150, 243, 0.2)",
    },
    Pending: {
      icon: <PendingIcon />,
      color: "#FF9800",
      bgColor: "rgba(255, 152, 0, 0.2)",
    },
  };

  // Calculate total orders and total purchase
  const totalOrders = supplier?.orderStatusSummary
    ? Object.values(supplier.orderStatusSummary).reduce(
        (sum, count) => sum + count,
        0
      )
    : supplier?.orders?.length || 0;

  const totalGrandTotal = supplier?.purchases?.reduce(
    (sum, purchase) => sum + (purchase?.grandTotal || 0),
    0
  );

  // Dynamic cards configuration
  const cards = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <LocalShippingOutlined sx={{ fontSize: 40, opacity: 0.8 }} />,
      gradientColors: "#4CAF50 0%, #8BC34A 100%",
      statusSummary: supplier?.orderStatusSummary,
    },
    {
      title: "Products",
      value: supplier?.products?.length || 0,
      icon: <InventoryOutlined sx={{ fontSize: 40, opacity: 0.8 }} />,
      gradientColors: "#2196F3 0%, #03A9F4 100%",
    },
    {
      title: "Total Purchase",
      value: supplier?.purchases?.length || 0,
      icon: <ReceiptLongOutlined sx={{ fontSize: 40, opacity: 0.8 }} />,
      gradientColors: "#FF9800 0%, #FFC107 100%",
      subtitle: `${formatCurrency(paymentStats?.paidAmount || 0)} paid`,
    },
    {
      title: "Total Spent",
      value: formatCurrency(totalGrandTotal),
      icon: <AssessmentOutlined sx={{ fontSize: 40, opacity: 0.8 }} />,
      gradientColors: "#9C27B0 0%, #673AB7 100%",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} md={3} key={index}>
          <GradientBox gradientColors={card.gradientColors}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                {card.title}
              </Typography>
              {card.icon}
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "white", my: 1 }}
            >
              {card.value}
            </Typography>

            {card.subtitle && (
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.9)" }}
              >
                {card.subtitle}
              </Typography>
            )}

            {/* Render dynamic status summary for Total Orders */}
            {card.statusSummary && (
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                {Object.entries(card.statusSummary).map(([status, count]) => (
                  <Box
                    key={status}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 0.8,
                      borderRadius: 1,
                      backgroundColor:
                        statusConfig[status]?.bgColor ||
                        "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          color: statusConfig[status]?.color || "white",
                          mr: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {statusConfig[status]?.icon || <PendingIcon />}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "white", fontWeight: "medium" }}
                      >
                        {status}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </GradientBox>
        </Grid>
      ))}
    </Grid>
  );
};

export default SupplierMetrics;
