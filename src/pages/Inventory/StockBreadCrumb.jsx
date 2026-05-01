/* eslint-disable react/prop-types */

import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumb from "../../components/Breadcrumb";
import { purchaseBtn } from "../../utils/customStyle";

export const StockBreadCrumb = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Inventory", href: "/inventory" },
    { label: "Stock Management" },
  ];

  return (
    <Box sx={{ mb: 4 }}>

      <Breadcrumb items={breadcrumbItems} />

      <Box
        sx={{
          display: { md: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
            }}
          >
            Stock Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all your product inventory and monitor stock levels
          </Typography>
        </Box>



        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={purchaseBtn}
          >
            Add New Product
          </Button>

        </Box>
      </Box>
    </Box>
  );
};
