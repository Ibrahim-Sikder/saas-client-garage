/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { Typography, Box } from "@mui/material";
import {
  Business,
  Dashboard,
  Inventory,
  LocalShipping,
  Payments,
} from "@mui/icons-material";
import { StyledTab, StyledTabs } from "./supplier";
import {
  useGetSingleSupplierQuery,
  useGetSupplierWithBillPayQuery,
} from "../../../redux/api/supplier";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import SupplierHeaderActions from "./SupplierHeaderActions";
import SupplierMetrics from "./SupplierMetrics";
import SupplierProfileHeader from "./SupplierProfileHeader";
import SupplierTabsContent from "./SupplierTabsContent";
import PurchaseOrderModal from "../../Inventory/PurchaseOrder/PurchaseOrderModal";
export default function SupplierProfile() {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);

  const id = new URLSearchParams(location.search).get("id");
  const { tenantDomain } = useTenantDomain();

  const { data: supplierWithBillPay } = useGetSupplierWithBillPayQuery({
    tenantDomain,
    id,
  });
  const { data: singleSupplierResponse } = useGetSingleSupplierQuery({
    tenantDomain,
    id,
  });

  const singleSupplier = singleSupplierResponse?.data;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenPurchaseModal = () => setOpenPurchaseModal(true);
  const handleClosePurchaseModal = () => setOpenPurchaseModal(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
          >
            <Business sx={{ mr: 1 }} /> Supplier Profile
          </Typography>
          <SupplierHeaderActions
            anchorEl={anchorEl}
            onMenuClick={handleMenuClick}
            onMenuClose={handleMenuClose}
          />
        </Box>
        <SupplierProfileHeader
          supplier={singleSupplier}
          onNewOrder={handleOpenPurchaseModal}
        />
        {openPurchaseModal && (
          <PurchaseOrderModal
            open={openPurchaseModal}
            onClose={handleClosePurchaseModal}
            tenantDomain={tenantDomain}
          />
        )}
        <SupplierMetrics
          supplier={singleSupplier}
          paymentStats={supplierWithBillPay?.data?.paymentStats}
        />
        <Box sx={{ mb: 3 }}>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#2196f3",
              },
            }}
          >
            <StyledTab icon={<Dashboard sx={{ mb: 0.5 }} />} label="Overview" />
            <StyledTab
              icon={<LocalShipping sx={{ mb: 0.5 }} />}
              label="Orders"
            />
            <StyledTab icon={<Inventory sx={{ mb: 0.5 }} />} label="Products" />
            <StyledTab icon={<Payments sx={{ mb: 0.5 }} />} label="Purchase" />
            <StyledTab
              icon={<Payments sx={{ mb: 0.5 }} />}
              label="Purchase Return"
            />
            <StyledTab icon={<Payments sx={{ mb: 0.5 }} />} label="Bill Pay" />
          </StyledTabs>
        </Box>
        <SupplierTabsContent tabValue={tabValue} supplier={singleSupplier} />
      </Box>
    </Box>
  );
}
