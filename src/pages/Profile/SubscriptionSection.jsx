/* eslint-disable react/prop-types */

import {

  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Grid,
  Chip,
} from "@mui/material";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaCog,
  FaRocket,
  FaChartLine,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { formatDate } from "../../utils/formateDate";
import { PaymentStatusCard } from "../../utils/customStyle";
import { StyledPaper } from "../../utils";

const SubscriptionSection = ({
  subscription,
  getSubscriptionProgress,
  getDaysRemaining,
  getSubscriptionStatusColor
}) => {
  return (
    <>
      {/* Payment Status Card */}
      <PaymentStatusCard ispaid={subscription?.isPaid?.toString()}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              <FaMoneyBillWave style={{ marginRight: 8 }} />
              Payment Status
            </Typography>
            {subscription?.isPaid ? <FaCheckCircle /> : <FaTimes />}
          </Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            ${subscription?.amount || 0}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {subscription?.isPaid ? "Payment Completed" : "Payment Required"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Method: {subscription?.paymentMethod || "N/A"}
          </Typography>
        </CardContent>
      </PaymentStatusCard>

      {/* Subscription Status */}
      <StyledPaper sx={{ mt: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          <FaCreditCard style={{ marginRight: 8 }} />
          Subscription Status
        </Typography>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={getSubscriptionProgress()}
              size={120}
              thickness={6}
              sx={{
                color: getSubscriptionStatusColor(subscription?.status),
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {Math.round(getSubscriptionProgress())}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getDaysRemaining()} days left
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Plan:</strong> {subscription?.plan || "Free"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Status:</strong>
            <Chip
              label={subscription?.status || "Unknown"}
              size="small"
              sx={{
                ml: 1,
                bgcolor: getSubscriptionStatusColor(subscription?.status),
                color: "white",
              }}
            />
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Amount:</strong> ${subscription?.amount || 0}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Started:</strong> {formatDate(subscription?.startDate)}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Expires:</strong> {formatDate(subscription?.endDate)}
          </Typography>
          <Typography variant="body1">
            <strong>Active:</strong>
            <Chip
              label={subscription?.isActive ? "Yes" : "No"}
              size="small"
              sx={{
                ml: 1,
                bgcolor: subscription?.isActive ? "#4CAF50" : "#f44336",
                color: "white",
              }}
            />
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            subscription?.status === "Expired" ? <FaRocket /> : <FaCog />
          }
          
         
          sx={{
            background:
              subscription?.status === "Expired"
                ? "linear-gradient(45deg, #FF6B6B, #4ECDC4)"
                : "linear-gradient(45deg, #667eea, #764ba2)",
            borderRadius: "12px",
            py: 1.5,
            fontSize: {xs:"13px", sm:"20px"},
            fontWeight: "bold",
            "&:hover": {
              background:
                subscription?.status === "Expired"
                  ? "linear-gradient(45deg, #FF5252, #26C6DA)"
                  : "linear-gradient(45deg, #5a67d8, #6b46c1)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(255,107,107,0.3)",
            },
          }}
        >
          {subscription?.status === "Expired"
            ? "Renew Subscription"
            : "Manage Subscription"}
        </Button>
      </StyledPaper>

      {/* Quick Stats */}
      <StyledPaper sx={{ mt: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          <FaChartLine style={{ marginRight: 8 }} />
          Quick Stats
        </Typography>

        <Grid container spacing={2}>
          {/* Stat cards */}
        </Grid>
      </StyledPaper>

      {/* Quick Actions */}
      <StyledPaper sx={{ mt: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {/* Action buttons */}
        </Grid>
      </StyledPaper>
    </>
  );
};

export default SubscriptionSection;