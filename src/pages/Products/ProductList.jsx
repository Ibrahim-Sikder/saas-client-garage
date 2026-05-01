"use client";

import { Add as AddIcon, Visibility } from "@mui/icons-material";
import { Box, Button, Grid, Paper, Stack } from "@mui/material";
import { DeleteIcon, EditIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../components/Table";
import { useAppOptions } from "../../hooks/useAppOptions";
import { useFormController } from "../../hooks/useFormController";
import {
  useDeleteProductMutation,
  useGetAllIProductQuery,
} from "../../redux/api/productApi";
import { purchaseBtn, wrapBoxStyle } from "../../utils/customStyle";
import ProductDetailsModal from "./ProductDetailsModal";
import { ProductHeader } from "./ProductHeader";

export default function ProductList() {
  const { currentPage, setCurrentPage, search, setSearch, theme } =
    useFormController();
  const navigate = useNavigate();
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const queryParams = {
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: search,
  };

  const { data, isLoading, refetch } = useGetAllIProductQuery(queryParams);
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (productId) => {
    performActionWithPermission(
      "/dashboard/product-list",
      "delete",
      async () => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: theme.palette.primary.main,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            try {
              await deleteProduct({
                tenantDomain,
                id: productId,
              }).unwrap();
              return true;
            } catch (error) {
              Swal.showValidationMessage(
                `Delete failed: ${error?.data?.message || "Unknown error"}`,
              );
              return false;
            }
          },
        });

        if (result.isConfirmed && result.value) {
          Swal.fire({
            title: "Deleted!",
            text: "The product has been deleted successfully.",
            icon: "success",
            confirmButtonColor: theme.palette.primary.main,
            timer: 2000,
            showConfirmButton: false,
          });
          refetch();
        }
      },
      "You don't have permission to delete product",
    );
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearch = (searchValue) => {
    setSearch(searchValue);
    setCurrentPage(1);
  };

  const products = data?.data?.products || [];
  const { meta } = data?.data || { meta: {} };
  const { totalPage = 10 } = meta || {};
  const columns = [
    { key: "product_code", label: "Product Code" },
    { key: "product_name", label: "Product Name" },
    {
      key: "category.main_category",
      label: "Category",
      render: (item) => item.category?.main_category || "N/A",
    },
    {
      key: "brand.brand",
      label: "Brand",
      render: (item) => item.brand?.brand || "N/A",
    },
    {
      key: "product_quantity",
      label: "Stock",
      render: (item) =>
        `${item.product_quantity} ${item.unit?.short_name || ""}`,
    },
    {
      key: "purchasePrice",
      label: "Purchase Price",
      render: (item) => `৳ ${item.purchasePrice}`,
    },
    {
      key: "sellingPrice",
      label: "Selling Price",
      render: (item) => `৳ ${item.sellingPrice}`,
    },
    {
      key: "productStatus",
      label: "Status",
      render: (item) => (
        <span
          style={{
            color: item.productStatus === "active" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {item.productStatus}
        </span>
      ),
    },
  ];

  const actions = [
    {
      key: "view",
      icon: Visibility,
      tooltip: "View Details",
      onClick: (product) => handleViewProduct(product),
      requirePermission: true,
      permissionPage: "/dashboard/product-list",
      permissionAction: "view",
      permissionMessage: "You don't have permission to view product details",
    },
    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit Product",
      onClick: (product) =>
        navigate(`/dashboard/update-product/?id=${product._id}`),
      requirePermission: true,
      permissionPage: "/dashboard/product-list",
      permissionAction: "edit",
      permissionMessage: "You don't have permission to edit product",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete Product",
      onClick: (product) => handleDelete(product._id),
      requirePermission: true,
      permissionPage: "/dashboard/product-list",
      permissionAction: "delete",
      permissionMessage: "You don't have permission to delete product",
    },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <ProductHeader />

      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}></Grid>

        <Grid item xs={12} md={4}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
          >
            <Button
              component={Link}
              to="/dashboard/add-product"
              variant="contained"
              startIcon={<AddIcon />}
              sx={purchaseBtn}
            >
              Add Product
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, md: 2 },
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      ></Paper>

      <Table
        title={`Products List ${data?.data?.meta?.total || 0}`}
        columns={columns}
        data={products}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={handleSearch}
        searchPlaceholder="Search products..."
      />

      <ProductDetailsModal
        setOpen={setModalOpen}
        open={modalOpen}
        onClose={handleCloseModal}
        selectedProduct={selectedProduct}
        theme={theme}
      />
    </Box>
  );
}
