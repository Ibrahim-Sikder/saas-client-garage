"use client";

import { useState, useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import StockStateCard from "./StockStateCard";
import { StockBreadCrumb } from "./StockBreadCrumb";
import { StockDetailsDialog } from "./StockManagement/StockDetailsDialog";
import { useGetAllStocksQuery } from "../../redux/api/stocksApi";
import { useAppOptions } from "../../hooks/useAppOptions";
import Table from "../../components/Table";
import StockFilter from "./StockFilter";

export default function StockManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage] = useState(10);
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [openStockDetails, setOpenStockDetails] = useState(false);

  const { tenantDomain } = useAppOptions();
  const queryParams = {
    tenantDomain,
    page: currentPage,
    limit: 100,
    searchTerm,
  };
  const {
    data: stockData,
    isLoading: productLoading,
    isFetching,
  } = useGetAllStocksQuery(queryParams);
  const isLoading = productLoading || isFetching;

  const handleOpenStockDetails = () => setOpenStockDetails(true);
  const handleCloseDialogs = () => setOpenStockDetails(false);

  const formatCurrency = (amount) => amount.toLocaleString("en-US") + " ৳";

  const products = useMemo(() => {
    if (!stockData?.success || !stockData.data) return [];
    return stockData.data.map((stock) => {
      const product = stock.product || {};
      const currentStock = stock.stock || 0;
      const reorderLevel = product.reorderLevel ?? 10;
      let status = "in-stock";
      if (currentStock === 0) status = "out-of-stock";
      else if (currentStock <= reorderLevel) status = "low-stock";

      return {
        id: stock._id?.product ?? stock._id ?? Math.random().toString(),
        stockId: stock._id, // Keep the original stock ID
        code: product.product_code ?? "N/A",
        name: product.product_name ?? "Unnamed Product",
        unit: product.unit?.unit ?? "pcs",
        shortUnit: product.unit?.short_name ?? "pcs",
        inQuantity: stock.inQuantity ?? 0,
        outQuantity: stock.outQuantity ?? 0,
        currentStock,
        purchasePrice: product.purchasePrice ?? 0,
        sellingPrice: product.sellingPrice ?? 0,
        minimumSalePrice: product.minimumSalePrice ?? 0,
        totalPurchaseValue: stock.totalPurchaseValue ?? 0,
        totalSellingValue: stock.totalSellingValue ?? 0,
        warehouse: stock.warehouse?.name ?? "N/A",
        warehouseId: stock.warehouse?._id ?? "N/A",
        status,
        minimumStock: product.stock_alert ?? 5,
        image: product.image ?? "/placeholder.svg?height=60&width=60",

        // Additional product details for the dialog
        productDescription: product.productDescription ?? "",
        brand: product.brand?.brand ?? "N/A",
        category: product.category?.main_category ?? "N/A",
        subCategory: product.category?.sub_category ?? "N/A",
        productType: product.product_type?.product_type ?? "N/A",
        supplier: product.suppliers?.[0]?.full_name ?? "N/A",
        supplierCompany: product.suppliers?.[0]?.company_name ?? "N/A",
        batchNumber: product.batchNumber ?? "N/A",
        expiryDate: product.expiryDate ?? "N/A",
        manufacturingDate: product.manufacturingDate ?? "N/A",
        storageLocation: product.storageLocation ?? "N/A",
        specifications: product.specifications ?? "",
        tags: product.tags ?? [],
        tax: product.product_tax ?? 0,
        discount: product.discount ?? 0,
        shipping: product.shipping ?? 0,
        expense: product.expense ?? 0,
        taxMethod: product.tax_method ?? "",
        productStatus: product.productStatus ?? "active",
        reorderLevel: product.reorderLevel ?? 0,
        initialStock: product.initialStock ?? 0,
        shelfLife: product.shelfLife ?? 0,
        shelfLifeUnit: product.shelfLifeUnit ?? "Days",
        expiryAlertDays: product.expiryAlertDays ?? 30,
        expiryDateType: product.expiryDateType ?? "none",
        warranties: product.warranties ?? "N/A",
        lastPurchaseDate: product.lastPurchaseDate ?? "N/A",
        lastSoldDate: product.lastSoldDate ?? "N/A",

        // Stock specific data
        allPurchasePrices: stock.allPurchasePrices ?? [],
        allSellingPrices: stock.allSellingPrices ?? [],
        avgPurchasePrice: stock.avgPurchasePrice ?? 0,
        avgSellingPrice: stock.avgSellingPrice ?? 0,
        lastPurchasePrice: stock.lastPurchasePrice ?? 0,
        lastSellingPrice: stock.lastSellingPrice ?? 0,
        productPurchasePrice: stock.productPurchasePrice ?? 0,
        productSellingPrice: stock.productSellingPrice ?? 0,

        // Complete raw data for dialog
        completeStockData: stock,
        completeProductData: product,
      };
    });
  }, [stockData]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouse.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedStockId),
    [selectedStockId, products],
  );

  const summaryStats = useMemo(() => {
    const totalItems = products.reduce(
      (sum, item) => sum + item.currentStock,
      0,
    );
    const totalPurchaseValue = products.reduce(
      (sum, item) => sum + item.totalPurchaseValue,
      0,
    );
    return {
      totalItems,
      totalPurchaseValue,
      lowStockItems: products.filter((i) => i.status === "low-stock").length,
      outOfStockItems: products.filter((i) => i.status === "out-of-stock")
        .length,
    };
  }, [products]);

  const getStockColor = (item) => {
    if (item.currentStock === 0) return "#f44336";
    if (item.currentStock <= item.minimumStock) return "#ff9800";
    return "#4caf50";
  };

  const columns = [
    {
      key: "image",
      label: "Picture",
      render: (item) => <img src={item.image} className="w-10 h-10 rounded" />,
    },
    { key: "name", label: "Name" },
    {
      key: "purchasePrice",
      label: "Purchase Price",
      render: (item) => (
        <Typography sx={{ fontWeight: 600, color: "#1976d2" }}>
          {formatCurrency(item.purchasePrice)}
        </Typography>
      ),
    },
    {
      key: "sellingPrice",
      label: "Selling Price",
      render: (item) => (
        <Typography sx={{ fontWeight: 600, color: "#2e7d32" }}>
          {formatCurrency(item.sellingPrice)}
        </Typography>
      ),
    },
    {
      key: "minimumSalePrice",
      label: "Min Sale Price",
      render: (item) => (
        <Typography sx={{ fontWeight: 500, color: "#f57c00" }}>
          {formatCurrency(item.minimumSalePrice)}
        </Typography>
      ),
    },
    {
      key: "inQuantity",
      label: "In Quantity",
      render: (item) => (
        <Chip
          label={`${item.inQuantity} ${item.unit}`}
          size="small"
          color={item.inQuantity === 0 ? "error" : "success"}
          variant="outlined"
        />
      ),
    },
    {
      key: "outQuantity",
      label: "Out Quantity",
      render: (item) => (
        <Chip
          label={`${item.outQuantity} ${item.unit}`}
          size="small"
          color={item.outQuantity === 0 ? "default" : "warning"}
          variant="outlined"
        />
      ),
    },
    {
      key: "currentStock",
      label: "Stock",
      render: (item) => (
        <Chip
          label={`${item.currentStock} ${item.shortUnit}`}
          size="small"
          sx={{
            fontWeight: 600,
            color: "#fff",
            backgroundColor: getStockColor(item),
          }}
        />
      ),
    },
    {
      key: "totalPurchaseValue",
      label: "Stock P.P.",
      render: (item) => (
        <Typography sx={{ fontWeight: 600, color: "#1565c0" }}>
          {formatCurrency(item.totalPurchaseValue)}
        </Typography>
      ),
    },
    {
      key: "totalSellingValue",
      label: "Stock S.P.",
      render: (item) => (
        <Typography sx={{ fontWeight: 600, color: "#2e7d32" }}>
          {formatCurrency(item.totalSellingValue)}
        </Typography>
      ),
    },
  ];

  const actions = [
    {
      key: "view",
      icon: Visibility,
      onClick: (item) => {
        setSelectedStockId(item.id);
        handleOpenStockDetails();
      },
      tooltip: "View Details",
    },
  ];

  return (
    <Box sx={{ m: { xs: 0, md: "30px" } }}>
      <StockBreadCrumb />
      <StockStateCard
        summaryStats={summaryStats}
        isLoading={isLoading}
        formatCurrency={formatCurrency}
      />
      <StockFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <Table
        title="Products"
        columns={columns}
        data={filteredProducts}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProducts.length / rowsPerPage)}
        onPageChange={setCurrentPage}
        onSearch={setSearchTerm}
        searchPlaceholder="Search products..."
      />

      {openStockDetails && selectedProduct && (
        <StockDetailsDialog
          open={openStockDetails}
          setOpen={setOpenStockDetails}
          onClose={handleCloseDialogs}
          product={selectedProduct}
          tenantDomain={tenantDomain}
        />
      )}
    </Box>
  );
}
