"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  alpha,
  Avatar,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";

import Table from "../../../components/Table";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import {
  useDeleteProductMutation,
  useGetAllIProductQuery,
} from "../../../redux/api/productApi";
import { AnimatedChip, wrapBoxStyle } from "../../../utils/customStyle";
import ExpiredAlert from "./ExpiredAlert";
import ExpiredBreadcrumb from "./ExpiredBreadcrumb";
import ExpiredStatsCards from "./ExpiredStatsCards";
import ProductDetailsDialog from "./ProductDetailsDialog";

export default function ExpiredProduct() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alertOpen, setAlertOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { tenantDomain } = useTenantDomain();

  const queryParams = {
    tenantDomain,
    page: currentPage,
    searchTerm: searchTerm, // Use the actual search term
    limit: 10,
  };

  const {
    data: productData,
    isLoading,
    refetch,
  } = useGetAllIProductQuery(queryParams);
  const [deleteProduct] = useDeleteProductMutation();

  const processedProducts = useMemo(() => {
    if (!productData?.data?.products) return [];

    const today = new Date();
    const alertDays = 30;

    return productData.data.products
      .map((product) => {
        if (!product.expiryDate) return null;

        const expiryDate = new Date(product.expiryDate);
        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        let status = "active";
        let daysExpired = 0;

        if (daysDiff < 0) {
          status = "expired";
          daysExpired = Math.abs(daysDiff);
        } else if (daysDiff <= (product.expiryAlertDays || alertDays)) {
          status = "expiring-soon";
          daysExpired = daysDiff;
        } else {
          return null;
        }

        return {
          id: product._id,
          code: product.product_code || "N/A",
          name: product.product_name || "N/A",
          category: product.category?.main_category || "N/A",
          brand: product.brand?.brand || "N/A",
          expiryDate: product.expiryDate,
          quantity: product.product_quantity || 0,
          daysExpired,
          status,
          image: product.image || "/placeholder.svg?height=50&width=50",
          location: product.storageLocation || "N/A",
          batchNumber: product.batchNumber || "N/A",
          purchaseDate: product.createdAt
            ? new Date(product.createdAt).toISOString().split("T")[0]
            : "N/A",
          supplier: product.suppliers?.full_name || "N/A",
          disposalMethod: "Return to Supplier",
          productDescription: product.productDescription,
          price: product.product_price,
          originalData: product,
        };
      })
      .filter(Boolean);
  }, [productData]);

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6a1b9a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct({ tenantDomain, id }).unwrap();
        refetch();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Product has been deleted successfully.",
          showConfirmButton: false,
          timer: 2000,
          background: "#fff",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete product.",
          confirmButtonColor: "#6a1b9a",
        });
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // Remove client-side filtering since API handles it
  const displayProducts = processedProducts;

  const totalExpired = processedProducts.filter(
    (p) => p.status === "expired"
  ).length;
  const totalExpiringSoon = processedProducts.filter(
    (p) => p.status === "expiring-soon"
  ).length;
  const totalQuantity = processedProducts.reduce(
    (sum, p) => sum + p.quantity,
    0
  );

  // Get total pages from API response or calculate based on total count
  const totalPages =
    productData?.data?.meta?.totalPage ||
    Math.ceil((productData?.data?.meta?.totalCount || 0) / 10);

  const getStatusChip = (status, daysExpired) => {
    switch (status) {
      case "expired":
        return (
          <AnimatedChip
            icon={<ErrorOutlineIcon />}
            label={`Expired ${daysExpired} days ago`}
            color="error"
            size="small"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
              color: "white",
              fontWeight: 500,
              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}`,
            }}
          />
        );
      case "expiring-soon":
        return (
          <AnimatedChip
            icon={<WarningAmberIcon />}
            label={`Expires in ${daysExpired} days`}
            color="warning"
            size="small"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
              color: "white",
              fontWeight: 500,
              boxShadow: `0 2px 8px ${alpha(theme.palette.warning.main, 0.4)}`,
            }}
          />
        );
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  const tableColumns = [
    {
      key: "code",
      label: "Code",
      render: (item) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={item.image}
            alt={item.name}
            variant="rounded"
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          {item.code}
        </Box>
      ),
    },
    { key: "name", label: "Name" },
    ...(!isMobile
      ? [
          { key: "category", label: "Category" },
          { key: "brand", label: "Brand" },
        ]
      : []),
    { key: "expiryDate", label: "Expiry Date" },
    {
      key: "quantity",
      label: "Quantity",
      render: (item) => (
        <Box
          sx={{
            fontWeight: "bold",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            px: 1,
            borderRadius: 1,
          }}
        >
          {item.quantity}
        </Box>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => getStatusChip(item.status, item.daysExpired),
    },
  ];

  const tableActions = [
    {
      key: "view",
      icon: VisibilityIcon,
      tooltip: "View Details",
      color: theme.palette.primary.main,
      onClick: (item) => handleOpenDialog(item),
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete",
      color: theme.palette.error.main,
      onClick: (item) => handleDeleteProduct(item.id),
    },
  ];

  return (
    <Box sx={{ ...wrapBoxStyle, paddingBottom: "50px" }}>
      <ExpiredBreadcrumb />
      <ExpiredAlert
        alertOpen={alertOpen}
        setAlertOpen={setAlertOpen}
        totalExpired={totalExpired}
        totalExpiringSoon={totalExpiringSoon}
      />
      <ExpiredStatsCards
        totalExpired={totalExpired}
        totalExpiringSoon={totalExpiringSoon}
        totalQuantity={totalQuantity}
        processedProducts={processedProducts}
      />
      <Table
        title="Expired Products"
        columns={tableColumns}
        data={displayProducts}
        actions={tableActions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchPlaceholder="Search expired products..."
        emptyMessage="No expired products found"
        getRowClass={(item) => item.status}
      />
      <ProductDetailsDialog
        setOpen={setOpenDialog}
        open={openDialog}
        handleCloseDialog={handleCloseDialog}
        selectedProduct={selectedProduct}
        getStatusChip={getStatusChip}
      />
    </Box>
  );
}
