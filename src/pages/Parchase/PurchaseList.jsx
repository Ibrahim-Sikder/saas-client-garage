/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { Box, Button, Typography, Card, Chip, Tooltip, Badge, Breadcrumbs, Link as MuiLink, alpha } from "@mui/material";
import { Add as AddIcon, ShoppingCart as ShoppingCartIcon, Home as HomeIcon, NavigateNext as NavigateNextIcon, FilterAlt as FilterAltIcon, ClearAll as ClearAllIcon, Visibility } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useGetAllPurchasesQuery, useDeletePurchaseMutation } from "../../redux/api/purchaseApi";
import { useAppOptions } from "../../hooks/useAppOptions";
import PurchaseSummaryCard from "./PurchaseSummaryCard";
import PurchaseFilterMenu from "./PurchaseFilterMenu";
import PurchaseDetailsModal from "./PurchaseDetailsModal";
import { formatCurrency } from "../../utils/formatter";
import { formatDate } from "../../utils/formateDate";
import { statusColors } from "../../constant/constant";
import Table from "../../components/Table";
import { DeleteIcon, EditIcon } from "lucide-react";

export default function PurchaseList() {
  const navigate = useNavigate();
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { data, refetch, isLoading } = useGetAllPurchasesQuery({
    tenantDomain,
    limit: rowsPerPage,
    page: page + 1,
    searchTerm: search,
    payment: filterPayment,
  });

  const [deletePurchase] = useDeletePurchaseMutation();

  const purchases = data?.data?.purchases || [];
  const purchaseSummary = data?.data?.purchaseSummary || {};
  const total = data?.data?.meta?.total || 0;

  const handleFilterMenuOpen = (e) => setFilterMenuAnchor(e.currentTarget);
  const handleFilterMenuClose = () => setFilterMenuAnchor(null);
  const handleFilterStatus = (status) => { setFilterStatus(status === filterStatus ? "" : status); handleFilterMenuClose(); };
  const handleFilterPayment = (payment) => { setFilterPayment(payment === filterPayment ? "" : payment); handleFilterMenuClose(); };
  const clearFilters = () => { setFilterStatus(""); setFilterPayment(""); setSearch(""); setPage(0); };

  const handleDeletePurchase = async (id) => {
    performActionWithPermission('/dashboard/purchase-list', 'delete', async () => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          await deletePurchase({ tenantDomain, id }).unwrap();
          await Swal.fire({
            title: "Deleted!",
            text: "Purchase deleted successfully.",
            icon: "success",
            confirmButtonColor: "#6366f1",
          });
          refetch();
        } catch (error) {
          const message =
            error?.data?.message ||
            error?.message ||
            "An error occurred while deleting the purchase.";

          await Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    }, "You don't have permission to delete purchase");
  };


  const handleEditPurchase = (purchase) => navigate(`/dashboard/update-purchase?id=${purchase._id}`);
  const handleViewPurchase = (purchase) => { setSelectedPurchase(purchase); setDetailsModalOpen(true); };
  const handleCloseDetailsModal = () => { setDetailsModalOpen(false); setSelectedPurchase(null); };
  const handleSearch = (value) => { setSearch(value); setPage(0); };

  const getSupplierName = (supplier) => {
    if (!supplier) return "N/A";
    if (typeof supplier === "string") return supplier;
    if (Array.isArray(supplier) && supplier.length > 0) supplier = supplier[0];
    if (supplier && typeof supplier === "object") return supplier.full_name || supplier.name || `Supplier ${supplier._id?.substring(0, 6) || "Unknown"}`;
    return "N/A";
  };
  const columns = [
    { key: "referenceNo", label: "Reference" },
    { key: "date", label: "Date", render: (item) => item.date ? formatDate(item.date) : "No date" },
    {
      key: "supplier", label: "Supplier", render: (item) => {
        const name = getSupplierName(item.suppliers);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              backgroundColor: "rgba(99,102,241,0.1)", color: "#6366f1",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
            }}>{name.charAt(0).toUpperCase()}</div>
            <span>{name}</span>
          </div>
        );
      }
    },
    {
      key: "purchaseStatus", label: "Status", render: (item) => {
        const color = statusColors[item.purchaseStatus] || { bg: "#64748b", color: "#fff" };
        return <span style={{ backgroundColor: color.bg, color: color.color, padding: "2px 6px", borderRadius: 6, fontWeight: 600, fontSize: 12 }}>{item.purchaseStatus || "Pending"}</span>;
      }
    },
    { key: "grandTotal", label: "Total", render: (item) => formatCurrency(item.grandTotal || 0) },
    { key: "paidAmount", label: "Paid", render: (item) => formatCurrency(item.paidAmount || 0) },
    { key: "dueAmount", label: "Due", render: (item) => formatCurrency(item.dueAmount || 0) },
  ];


  const actions = [
    {
      key: "view",
      label: "View",
      icon: Visibility,
      onClick: handleViewPurchase,
      requirePermission: true,
      permissionPage: "dashboard/purchase-list",
      permissionAction: "view",
    },
    {
      key: "edit",
      label: "Edit",
      icon: EditIcon,
      onClick: handleEditPurchase,
      requirePermission: true,
      permissionPage: "dashboard/purchase-list",
      permissionAction: "edit",
    },
    {
      key: "delete",
      label: "Delete",
      icon: DeleteIcon,
      onClick: (item) => handleDeletePurchase(item._id),
      requirePermission: true,
      permissionPage: "dashboard/purchase-list",
      permissionAction: "delete",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/dashboard" sx={{ display: "flex", alignItems: "center" }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
        </MuiLink>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Purchases
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} mb={1}>Purchase Management</Typography>
          <Typography variant="body1" color="text.secondary">Track and manage your inventory purchases</Typography>
        </Box>
        <Button variant="contained" component={Link} to="/dashboard/add-purchase" startIcon={<AddIcon />} sx={{
          color: "#fff", height

            : '45px',
          borderRadius: '5px'

        }}>Add Purchase</Button>

      </Box>

      <PurchaseSummaryCard purchaseSummary={purchaseSummary} meta={{ total }} />

      <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid #e2e8f0", mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {(filterStatus || filterPayment || search) && (
              <>
                {filterStatus && <Chip label={`Status: ${filterStatus}`} onDelete={() => setFilterStatus("")} />}
                {filterPayment && <Chip label={`Payment: ${filterPayment}`} onDelete={() => setFilterPayment("")} />}
                {search && <Chip label={`Search: ${search}`} onDelete={() => setSearch("")} />}
                <Button startIcon={<ClearAllIcon />} onClick={clearFilters}>Clear All</Button>
              </>
            )}
          </Box>
          <Tooltip title="Filter">
            <Button variant="outlined" startIcon={<FilterAltIcon />} onClick={handleFilterMenuOpen}
              sx={{
                borderColor: filterStatus || filterPayment ? "#6366f1" : "#e2e8f0",
                color: filterStatus || filterPayment ? "#6366f1" : "#64748b",
                backgroundColor: filterStatus || filterPayment ? alpha("#6366f1", 0.05) : "transparent",
                "&:hover": { borderColor: filterStatus || filterPayment ? "#4f46e5" : "#cbd5e1", backgroundColor: filterStatus || filterPayment ? alpha("#6366f1", 0.1) : "#f8fafc" }
              }}
            >
              {filterStatus || filterPayment ? "Filtered" : "Filter"}
              {(filterStatus || filterPayment) && <Badge badgeContent={(filterStatus ? 1 : 0) + (filterPayment ? 1 : 0)} color="primary" sx={{ ml: 1 }} />}
            </Button>
          </Tooltip>
        </Box>

        <Table
          title="Purchases"
          columns={columns}
          data={purchases}
          actions={actions}
          loading={isLoading}
          currentPage={page + 1}
          totalPages={Math.ceil(total / rowsPerPage)}
          onPageChange={(newPage) => setPage(newPage - 1)}
          onSearch={handleSearch}
          searchPlaceholder="Search purchases..."
        />
      </Card>

      <PurchaseFilterMenu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
        filterStatus={filterStatus}
        filterPayment={filterPayment}
        handleFilterStatus={handleFilterStatus}
        handleFilterPayment={handleFilterPayment}
        clearFilters={clearFilters}
      />

      <PurchaseDetailsModal
        setOpen={setDetailsModalOpen}
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        purchase={selectedPurchase}
      />
    </Box>
  );
}
