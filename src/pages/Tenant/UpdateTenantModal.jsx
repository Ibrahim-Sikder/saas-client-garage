/* eslint-disable react/prop-types */

"use client";

import { useState, useEffect } from "react";

import { FaCreditCard, FaLock } from "react-icons/fa";

import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";
import GarageModal from "../../components/Share/Modal/GarageModal";
import { purchaseBtn } from "../../utils/customStyle";

const UpdateTenantModal = ({
  open,
  tenant,
  onUpdate,
  loading,
  activeTab,
  setActiveTab,
  setOpen,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        domain: tenant.domain,
        businessType: tenant.businessType,
        isActive: tenant.isActive,
        dbUri: tenant.dbUri,
        subscription: {
          plan: tenant.subscription?.plan || "",
          amount: tenant.subscription?.amount || 0,
          status: tenant.subscription?.status || "",
          isPaid: tenant.subscription?.isPaid || false,
          isActive: tenant.subscription?.isActive || false,
          paymentMethod: tenant.subscription?.paymentMethod || "",
          startDate: tenant.subscription?.startDate || "",
          endDate: tenant.subscription?.endDate || "",
        },
      });
    }
  }, [tenant]);

  const handleSubmit = () => {
    onUpdate({ ...tenant, ...formData });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubscriptionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        [field]: value,
      },
    }));
  };

  if (!tenant) return null;

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title="Edit Tenant"
      maxWidth="md"
    >
      <Box sx={{ mt: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Tenant Details" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* Tenant Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Domain"
                value={formData.domain || ""}
                onChange={(e) => handleInputChange("domain", e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Business Type</InputLabel>
                <Select
                  value={formData.businessType || ""}
                  onChange={(e) =>
                    handleInputChange("businessType", e.target.value)
                  }
                >
                  <MenuItem value="independent">Independent</MenuItem>
                  <MenuItem value="startup">Startup</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                  <MenuItem value="small_business">Small Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Subscription Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <FaCreditCard style={{ marginRight: 8 }} />
                Subscription Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Plan</InputLabel>
                <Select
                  value={formData.subscription?.plan || ""}
                  onChange={(e) =>
                    handleSubscriptionChange("plan", e.target.value)
                  }
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="HalfYearly">HalfYearly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.subscription?.amount || ""}
                onChange={(e) =>
                  handleSubscriptionChange(
                    "amount",
                    Number.parseInt(e.target.value)
                  )
                }
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Subscription Status</InputLabel>
                <Select
                  value={formData.subscription?.status || ""}
                  onChange={(e) =>
                    handleSubscriptionChange("status", e.target.value)
                  }
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.subscription?.paymentMethod || ""}
                  onChange={(e) =>
                    handleSubscriptionChange("paymentMethod", e.target.value)
                  }
                >
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Manual">Manual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                value={formData.subscription?.startDate?.slice(0, 16) || ""}
                onChange={(e) =>
                  handleSubscriptionChange("startDate", e.target.value)
                }
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                value={formData.subscription?.endDate?.slice(0, 16) || ""}
                onChange={(e) =>
                  handleSubscriptionChange("endDate", e.target.value)
                }
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Access Control */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <FaLock style={{ marginRight: 8 }} />
                Access Control
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.subscription?.isPaid || false}
                    onChange={(e) =>
                      handleSubscriptionChange("isPaid", e.target.checked)
                    }
                  />
                }
                label="Payment Completed"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.subscription?.isActive || false}
                    onChange={(e) =>
                      handleSubscriptionChange("isActive", e.target.checked)
                    }
                  />
                }
                label="Subscription Active"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive || false}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                  />
                }
                label="Tenant Active"
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={purchaseBtn}
        >
          {loading ? "Updating..." : "Update Tenant"}
        </Button>
      </DialogActions>
    </GarageModal>
  );
};

export default UpdateTenantModal;
