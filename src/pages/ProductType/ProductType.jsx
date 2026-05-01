/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
} from "@mui/material";
import {
  Category as CategoryIcon,
} from "@mui/icons-material";
import ProductTypeForm from "./ProductTypeForm";
import ProductTypeTable from "./ProductTypeTable";
import { CreateProductTypeModal } from "./CreateProductTypeModal";

const ProductType = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProductType, setEditingProductType] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingProductType(null);
    setIsCreateModalOpen(true);
  };

  const handleEditProductType = (productType) => {
    setEditingProductType(productType);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="mt-10 ">
      <Container maxWidth="xl" sx={{ p: { xs: 0 } }}>
        <Box
          sx={{
            background: "#499CCC",
            color: "white",
            py: 3,
            mb: 4,
            borderRadius: { xs: "0 0 20px 20px", md: "0 0 20px 20px" },
            boxShadow: "0 4px 20px rgba(106, 27, 154, 0.4)",
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CategoryIcon sx={{ fontSize: 40, mr: 2 }} />
              <p className="text-2xl md:text-4xl font-bold">Product Types</p>
              {/* <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Product Types
              </Typography>  */}
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 700 }}>
              Manage your product types to better organize and categorize your
              inventory.
            </Typography>
          </Container>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <ProductTypeForm />
          </Grid>
          <Grid item xs={12} md={7}>
            <ProductTypeTable
              onEditProductType={handleEditProductType}
              onOpenCreateModal={handleOpenCreateModal}
            />
          </Grid>
        </Grid>

        <CreateProductTypeModal
          open={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          editingProductType={editingProductType}
        />
      </Container>
    </div>
  );
};

export default ProductType;