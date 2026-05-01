
"use client";
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  useTheme,
} from "@mui/material";

import StockTransferHeader from "./StockTransferHeader";
import StockTransferSummaryCards from "./StockTransferSummaryCards";
import StockTransferModal from "../StockManagement/StockTransfer/StockTransferModal";

import { useAppOptions } from "../../../hooks/useAppOptions";
import { useGetAllStockTransfersQuery, useDeleteStockTransferMutation } from "../../../redux/api/stocktransferApi";

import Swal from "sweetalert2";
import Table from "../../../components/Table";
import { DeleteIcon, EditIcon, Eye } from "lucide-react";
import StockTransferActions from "./StockTransferActions";



export default function StockTransfer() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage,] = useState(1);
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const queryParams = {
    tenantDomain,
    page: currentPage,
    limit: 100,
    searchTerm,
  };

  const { data: stockTransferData, refetch } = useGetAllStockTransfersQuery(queryParams);
  const [deleteStockTransfer] = useDeleteStockTransferMutation();


  const transfers = stockTransferData?.data || [];
  const loading = !stockTransferData;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    refetch();
  };

  const handleDeleteTransfer = async (id) => {
    performActionWithPermission(
      "/dashboard/stock-transfer",
      "delete",
      async () => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "This will permanently delete the stock transfer record.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          try {
            await deleteStockTransfer({ tenantDomain, id }).unwrap();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Stock transfer has been deleted successfully.",
              showConfirmButton: false,
              timer: 2000,
            });
            refetch();
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "An error occurred while deleting the stock transfer.",
            });
          }
        }
      },
      "You don't have permission to delete stock transfer"
    );
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromWarehouse?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toWarehouse?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.product?.product_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const getStatusCount = (status) => {
    if (status === "all") return transfers.length;
    return transfers.filter((t) => t.status === status).length;
  };

  const products = transfers
    .map((transfer) => ({
      id: transfer.product?._id,
      code: transfer.product?.product_code,
      name: transfer.product?.product_name,
      category: transfer.product?.category,
      currentStock: transfer.product?.product_quantity,
      unit: transfer.product?.unit,
      location: transfer.fromWarehouse?.name,
    }))
    .filter((product, index, self) => index === self.findIndex((p) => p.id === product.id));

  const columns = [
    { key: "createdAt", label: "Date", render: (row) => formatDate(row.createdAt) },
    { key: "batchNumber", label: "Batch Number" },
    { key: "product.product_name", label: "Product" },
    { key: "fromWarehouse.name", label: "From" },
    { key: "toWarehouse.name", label: "To" },
    { key: "quantity", label: "Quantity" },
    { key: "status", label: "Status", render: (row) => row.status },
  ];

  const actions = [
    {
      key: "view",
      icon: Eye,
      tooltip: "View",
      requirePermission: true,
      permissionPage: "/dashboard/stock-transfer",
      permissionAction: "view",
      onClick: (row) => {
        performActionWithPermission(
          "/dashboard/stock-transfer",
          "view",
          () => window.alert(`View transfer ${row._id}`),
          "You don't have permission to view"
        );
      },
    },
    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit",
      requirePermission: true,
      permissionPage: "/dashboard/stock-transfer",
      permissionAction: "edit",
      onClick: (row) => {
        performActionWithPermission(
          "/dashboard/stock-transfer",
          "edit",
          () => window.alert(`Edit transfer ${row._id}`),
          "You don't have permission to edit"
        );
      },
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete",
      requirePermission: true,
      permissionPage: "/dashboard/stock-transfer",
      permissionAction: "delete",
      onClick: (row) => handleDeleteTransfer(row._id),
    },
  ];

  return (
    <Box>
      <StockTransferHeader />

      <StockTransferSummaryCards
        transfers={transfers}
        loading={loading}
        theme={theme}
        getStatusCount={getStatusCount}
      />

      <StockTransferActions
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        getStatusCount={getStatusCount}
        handleClickOpen={handleClickOpen}
      />
      {loading ? (
        <Paper sx={{ p: 5, borderRadius: 2, textAlign: "center" }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading...</Typography>
        </Paper>
      ) : (
        <Table
          title="Stock Transfers"
          columns={columns}
          data={filteredTransfers}
          actions={actions}
          loading={loading}
          onSearch={setSearchTerm}
          searchPlaceholder="Search transfers..."
        />
      )}

      <StockTransferModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        products={products}
        tenantDomain={tenantDomain}
        performActionWithPermission={performActionWithPermission}
      />
    </Box>
  );
}
