/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import {
  FaCreditCard,
  FaDatabase,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGlobe,
  FaUser,
  FaMoneyBillWave,
  FaSync,
} from "react-icons/fa";

import GarageModal from "../../components/Share/Modal/GarageModal";
import { InfoSection, StatBox, StatusChip } from "../../utils/InfoComponents";

const ViewDetailsModal = ({
  open,
  tenant,
  onRenewSubscription,
  renewLoading,
  setOpen,
}) => {
  const [selectedPlan, setSelectedPlan] = useState("");

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const diffTime = new Date(endDate) - new Date();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const handleRenew = () => {
    if (selectedPlan && tenant) {
      onRenewSubscription(tenant._id, selectedPlan);
      setSelectedPlan("");
    }
  };

  const getPlanPrice = (plan) =>
    ({ Monthly: 2000, HalfYearly: 12000, Yearly: 24000 }[plan] || 0);

  if (!tenant) return null;

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title="Tenant Details"
      maxWidth="md"
    >
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <InfoSection title="Basic Information" icon={FaBuilding}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <FaUser />
                </ListItemIcon>
                <ListItemText primary="Name" secondary={tenant.name} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FaGlobe />
                </ListItemIcon>
                <ListItemText
                  primary="Domain"
                  secondary={`${tenant.domain}.app`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FaBuilding />
                </ListItemIcon>
                <ListItemText
                  primary="Business Type"
                  secondary={tenant.businessType || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FaDatabase />
                </ListItemIcon>
                <ListItemText
                  primary="Database Status"
                  secondary={
                    <StatusChip
                      label={tenant.dbUri ? "Connected" : "Not Connected"}
                      status={tenant.dbUri ? "success" : "error"}
                    />
                  }
                />
              </ListItem>
            </List>
          </InfoSection>
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoSection title="Payment Information" icon={FaMoneyBillWave}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  {tenant.subscription?.isPaid ? (
                    <FaCheckCircle color="#4CAF50" />
                  ) : (
                    <FaExclamationTriangle color="#f44336" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Payment Status"
                  secondary={
                    <StatusChip
                      label={tenant.subscription?.isPaid ? "Paid" : "Unpaid"}
                      status={tenant.subscription?.isPaid ? "success" : "error"}
                    />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FaCreditCard />
                </ListItemIcon>
                <ListItemText
                  primary="Payment Method"
                  secondary={tenant.subscription?.paymentMethod || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FaCalendarAlt />
                </ListItemIcon>
                <ListItemText
                  primary="Subscription Active"
                  secondary={
                    <StatusChip
                      label={tenant.subscription?.isActive ? "Yes" : "No"}
                      status={
                        tenant.subscription?.isActive ? "success" : "error"
                      }
                    />
                  }
                />
              </ListItem>
            </List>
          </InfoSection>
        </Grid>
        <Grid item xs={12}>
          <InfoSection title="Subscription Details" icon={FaCreditCard}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatBox
                  label="Subscription Plan"
                  value={tenant.subscription?.plan || "No Plan"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatBox
                  label="Amount"
                  value={`$${tenant.subscription?.amount || 0}`}
                  color="success.main"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatusChip
                  label={tenant.subscription?.status || "No Status"}
                  status={
                    tenant.subscription?.status === "Active"
                      ? "success"
                      : tenant.subscription?.status === "Expired"
                      ? "error"
                      : "warning"
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatBox
                  label="Days Remaining"
                  value={getDaysRemaining(tenant.subscription?.endDate)}
                  color="warning.main"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: "12px" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <FaSync /> Renew Subscription
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Plan</InputLabel>
                    <Select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                    >
                      <MenuItem value="Monthly">Monthly - ৳2000</MenuItem>
                      <MenuItem value="HalfYearly">
                        Half Yearly - ৳12,000
                      </MenuItem>
                      <MenuItem value="Yearly">Yearly - ৳24,000</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    onClick={handleRenew}
                    disabled={!selectedPlan || renewLoading}
                    startIcon={
                      renewLoading ? <CircularProgress size={20} /> : <FaSync />
                    }
                    sx={{
                      borderRadius: "8px",
                      background: "linear-gradient(45deg, #4CAF50, #45a049)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #45a049, #4CAF50)",
                      },
                    }}
                    fullWidth
                  >
                    {renewLoading ? "Renewing..." : "Renew Subscription"}
                  </Button>
                </Grid>
              </Grid>

              {selectedPlan && (
                <Box
                  sx={{ mt: 2, p: 2, bgcolor: "#e8f5e8", borderRadius: "8px" }}
                >
                  <Typography variant="body2" color="success.main">
                    <strong>Selected Plan:</strong> {selectedPlan} - ৳
                    {getPlanPrice(selectedPlan)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This will extend the subscription from today for the
                    selected duration.
                  </Typography>
                </Box>
              )}
            </Box>
          </InfoSection>
        </Grid>
      </Grid>
    </GarageModal>
  );
};

export default ViewDetailsModal;
