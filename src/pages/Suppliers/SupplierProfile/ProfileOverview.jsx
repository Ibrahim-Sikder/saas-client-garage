"use client";

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import {
  Typography,
  IconButton,
  Box,

  Grid,

  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  LocationOn,
  Business,
  Assessment,
  AccountBalance,
  Category,
  ContactPhone,

} from "@mui/icons-material";
import { GlassCard2, StatusChip, SupplierScoreCard } from "../../../utils/customStyle";
import { getStatusColor, getStatusIcon } from "../../../constant/constant";

const ProfileOverview = ({ supplier }) => {
  // Add this after the useState declarations
  const performanceMetrics = [
    {
      label: "Quality",
      value: supplier?.supplier_rating
        ? (supplier?.supplier_rating * 20).toFixed(0)
        : "75",
      color: "#4CAF50",
    },
    { label: "Delivery", value: "80", color: "#2196F3" },
    { label: "Price", value: "70", color: "#FF9800" },
    { label: "Service", value: "85", color: "#9C27B0" },
  ];

  return (
    <Grid container spacing={3}>
      {/* Supplier Information */}
      <Grid item xs={12} md={4}>
        <GlassCard2 sx={{ height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
            >
              <Business sx={{ mr: 1, color: "#2196f3" }} /> Supplier Information
            </Typography>
            <IconButton size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Company Name"
                secondary={supplier?.vendor || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Contact Person"
                secondary={
                  supplier?.contact_person_name || supplier?.full_name || "N/A"
                }
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Email"
                secondary={supplier?.email || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Phone"
                secondary={supplier?.phone_number || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Alternate Phone"
                secondary={supplier?.full_Phone_number || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Business License"
                secondary={supplier?.tax_id || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Status"
                secondary={
                  <StatusChip
                    icon={getStatusIcon(supplier?.supplier_status)}
                    label={supplier?.supplier_status}
                    size="small"
                    statuscolor={getStatusColor(supplier?.supplier_status)}
                  />
                }
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
              />
            </ListItem>
          </List>
        </GlassCard2>
      </Grid>

      {/* Address & Payment Information */}
      <Grid item xs={12} md={4}>
        <GlassCard2 sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
            >
              <LocationOn sx={{ mr: 1, color: "#FF5722" }} /> Address
              Information
            </Typography>
            <IconButton size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Address"
                secondary={supplier?.street_address || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="City"
                secondary={supplier?.city || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="State"
                secondary={supplier?.state || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Country"
                secondary={supplier?.country || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Postal Code"
                secondary={supplier?.postal_code || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
          </List>
        </GlassCard2>

        <GlassCard2>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
            >
              <AccountBalance sx={{ mr: 1, color: "#4CAF50" }} /> Payment
              Information
            </Typography>
            <IconButton size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Bank Name"
                secondary={supplier?.bank_name || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Account Number"
                secondary={supplier?.account_number || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Account Holder"
                secondary={supplier?.full_name || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Swift Code"
                secondary={supplier?.swift_code || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
          </List>
        </GlassCard2>
      </Grid>

      {/* Categories & Emergency Contact */}
      <Grid item xs={12} md={4}>
        <GlassCard2 sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
            >
              <Category sx={{ mr: 1, color: "#9C27B0" }} /> Business Information
            </Typography>
            <IconButton size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Vendor Type"
                secondary={supplier?.vendor || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Supplier ID"
                secondary={supplier?.supplierId || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Tax ID"
                secondary={supplier?.tax_id || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
          </List>
        </GlassCard2>

        <GlassCard2 sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
            >
              <ContactPhone sx={{ mr: 1, color: "#F44336" }} /> Contact
              Information
            </Typography>
            <IconButton size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Primary Contact"
                secondary={supplier?.full_name || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Phone"
                secondary={supplier?.phone_number || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText
                primary="Email"
                secondary={supplier?.email || "N/A"}
                primaryTypographyProps={{
                  color: "text.secondary",
                  variant: "body2",
                }}
                secondaryTypographyProps={{
                  color: "text.primary",
                  variant: "body1",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
          </List>
        </GlassCard2>

        <GlassCard2>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
            >
              <Assessment sx={{ mr: 1, color: "#2196F3" }} /> Performance
              Metrics
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {performanceMetrics.map((metric, index) => (
              <Grid item xs={6} key={index}>
                <SupplierScoreCard score={Number.parseInt(metric.value) || 80}>
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                      variant="determinate"
                      value={Number.parseInt(metric.value) || 80}
                      size={80}
                      thickness={5}
                      sx={{ color: metric.color }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {metric.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontWeight: "medium" }}
                  >
                    {metric.label}
                  </Typography>
                </SupplierScoreCard>
              </Grid>
            ))}
          </Grid>
        </GlassCard2>
      </Grid>
    </Grid>
  );
};

export default ProfileOverview;
