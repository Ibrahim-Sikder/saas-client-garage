/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { Box, Button, alpha, useTheme } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Table from "@/components/Table";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { useDeletePurchaseMutation } from "../../../redux/api/purchaseApi";
import { GlassCard, StatusChip } from "./supplier";
import Swal from "sweetalert2";
import SupplierPurchaseDetails from "./SupplierPurchaseDetails";
import { DeleteIcon, EditIcon, Eye } from "lucide-react";
import { getStatusColor } from "../../../utils/status";
import SupplierPurchaseModal from "./SupplierPurchaseModal";
import { purchaseBtn } from "../../../utils/customStyle";

const SupplierPurchaseTable = ({ purchaseData }) => {
  const theme = useTheme();
  const tenantDomain = useTenantDomain();
  const [, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletePurchase] = useDeletePurchaseMutation();

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (order) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deletePurchase({ tenantDomain, id: order._id }).unwrap();
        Swal.fire("Deleted!", "The purchase has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete purchase.", "error");
      }
    }
  };

  const calculateTotalItems = (products) =>
    products?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  const columns = [
    { key: "referenceNo", label: "Reference No" },
    {
      key: "date",
      label: "Order Date",
      render: (item) => new Date(item.date).toLocaleDateString(),
    },
    {
      key: "products",
      label: "Items",
      render: (item) => calculateTotalItems(item.products),
    },
    {
      key: "grandTotal",
      label: "Total Amount",
      render: (item) => `৳${item.grandTotal?.toLocaleString()}`,
    },
    {
      key: "purchaseStatus",
      label: "Status",
      render: (item) => (
        <StatusChip
          label={item.purchaseStatus}
          statuscolor={getStatusColor(item.purchaseStatus)}
          size="small"
        />
      ),
    },
  ];

  const actions = [
    {
      key: "view",
      label: "View",
      icon: Eye,
      tooltip: "View Order",
      onClick: handleOpenDialog,
    },
    {
      key: "edit",
      label: "Edit",
      icon: EditIcon,
      tooltip: "Edit Order",
      link: (item) => `/dashboard/update-purchase?id=${item._id}`,
      LinkComponent: Link,
    },
    {
      key: "delete",
      label: "Delete",
      icon: DeleteIcon,
      tooltip: "Delete Order",
      className: "text-red-500",
      onClick: handleDeleteOrder,
    },
  ];

  return (
    <div className="w-full mt-5 px-0">
      <GlassCard
        sx={{
          p: 4,
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.9),
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <Button
            onClick={() => setOpen(true)}
            sx={purchaseBtn}
            startIcon={<AddIcon />}
          >
            Create New Purchase
          </Button>
        </Box>

        <Table
          title="Purchase Orders"
          columns={columns}
          data={purchaseData || []}
          actions={actions}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSearch={handleSearch}
          searchPlaceholder="Search by ref no, status, or product..."
          emptyMessage="No purchase orders found"
        />
        <SupplierPurchaseDetails
          open={openDialog}
          onClose={handleCloseDialog}
          order={selectedOrder}
          getStatusColor={getStatusColor}
          calculateTotalItems={calculateTotalItems}
          setOpen={setOpenDialog}
        />

        {open && <SupplierPurchaseModal open={open} setOpen={setOpen} />}
      </GlassCard>
    </div>
  );
};

export default SupplierPurchaseTable;
