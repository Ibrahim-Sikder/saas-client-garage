/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import WarningIcon from "@mui/icons-material/Warning";
import { useGetAllStocksQuery } from "../../redux/api/stocksApi";
import { useAppOptions } from "../../hooks/useAppOptions";
import Table from "../../components/Table";
import StockSummaryCards from "./StockSummaryCards";

export default function LowStocksPage() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { tenantDomain } = useAppOptions();

  const queryParams = {
    tenantDomain,
    page: currentPage,
    limit: 100,
    searchTerm: searchTerm,
  };

  const { data: stockData, isLoading: stockLoading } =
    useGetAllStocksQuery(queryParams);

  const criticalStocks =
    stockData?.data?.filter(
      (stock) => stock.stock <= stock.product?.stock_alert,
    ) || [];

  const lowStockColumns = [
    {
      key: "slNo",
      label: "SL No",
      type: "index",
    },
    {
      key: "product.product_name",
      label: "Product Name",
      render: (stock) => stock.product?.product_name || "N/A",
    },
    {
      key: "product.product_code",
      label: "Product Code",
      render: (stock) => stock.product?.product_code || "N/A",
    },
    {
      key: "product.brand.brand",
      label: "Brand",
      render: (stock) => stock.product?.brand?.brand || "N/A",
    },
    {
      key: "product.category.main_category",
      label: "Category",
      render: (stock) => stock.product?.category?.main_category || "N/A",
    },
    {
      key: "warehouse.name",
      label: "Warehouse",
      render: (stock) => stock.warehouse?.name || "N/A",
    },
    {
      key: "stock",
      label: "Current Stock",
      render: (stock) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color:
              stock.stock <= stock.product?.stock_alert
                ? "error.main"
                : "warning.main",
          }}
        >
          {stock.stock}
        </Typography>
      ),
    },
    {
      key: "product.stock_alert",
      label: "Alert Level",
      render: (stock) => stock.product?.stock_alert || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (stock) => {
        const currentStock = stock.stock;
        const alertLevel = stock.product?.stock_alert || 0;

        if (currentStock === 0) {
          return (
            <Typography
              variant="body2"
              sx={{
                color: "error.main",
                fontWeight: "bold",
                bgcolor: alpha(theme.palette.error.main, 0.1),
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              Out of Stock
            </Typography>
          );
        } else if (currentStock <= alertLevel) {
          return (
            <Typography
              variant="body2"
              sx={{
                color: "warning.main",
                fontWeight: "bold",
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              Low Stock
            </Typography>
          );
        } else {
          return (
            <Typography
              variant="body2"
              sx={{
                color: "success.main",
                fontWeight: "bold",
                bgcolor: alpha(theme.palette.success.main, 0.1),
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              In Stock
            </Typography>
          );
        }
      },
    },
    {
      key: "product.reorderLevel",
      label: "Reorder Level",
      render: (stock) => stock.product?.reorderLevel || "N/A",
    },
    {
      key: "product.unit.unit",
      label: "Unit",
      render: (stock) => stock.product?.unit?.unit || "N/A",
    },
    {
      key: "product.sellingPrice",
      label: "Selling Price",
      render: (stock) =>
        `৳${stock.product?.sellingPrice?.toFixed(2) || "0.00"}`,
    },
  ];
  const lowStockActions = [
    {
      key: "view_details",
      icon: WarningIcon,
      label: "View Details",
      tooltip: "View Product Details",
      className: "flex flex-col items-center edit2",
      onClick: (stock) => {},
    },
  ];

  const getLowStockRowClass = (stock) => {
    const currentStock = stock.stock;
    const alertLevel = stock.product?.stock_alert || 0;

    if (currentStock === 0) {
      return "bg-red-50 border-l-4 border-red-500";
    } else if (currentStock <= alertLevel) {
      return "bg-orange-50 border-l-4 border-orange-500";
    }
    return "";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 1,
        borderRadius: 2,
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3, p: 3 }}
        className="shadow-lg"
      >
        <Link color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link color="inherit" href="/inventory">
          Inventory
        </Link>
        <Typography color="text.primary">Low Stock</Typography>
      </Breadcrumbs>

      <StockSummaryCards
        stockData={stockData?.data}
        criticalStocks={criticalStocks}
      />

      <Table
        title="Low Stock Alert"
        columns={lowStockColumns}
        data={criticalStocks}
        actions={lowStockActions}
        loading={stockLoading}
        currentPage={currentPage}
        totalPages={Math.ceil(criticalStocks.length / 10)}
        onPageChange={setCurrentPage}
        onSearch={setSearchTerm}
        searchPlaceholder="Search low stock items..."
        emptyMessage="No low stock items found. Great job!"
        getRowClass={getLowStockRowClass}
      />
    </Box>
  );
}
