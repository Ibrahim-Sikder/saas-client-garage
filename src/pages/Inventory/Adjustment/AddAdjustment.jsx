"use client";
import { Box } from "@mui/material";

import AddAdjustmentForm from "./AddJustmentForm";
import Breadcrumb from "../../../components/Breadcrumb";

const AddAdjustment = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Inventory" },
    { label: "Add Adjustment" },
  ];
  return (
    <Box sx={{ py: 2, px: { md: 4 } }}>
      <Breadcrumb items={breadcrumbItems} />

      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        <AddAdjustmentForm />
      </Box>
    </Box>
  );
};

export default AddAdjustment;
