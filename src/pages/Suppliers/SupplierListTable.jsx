/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { Box, Button, alpha, useTheme } from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Home, Store } from "lucide-react";

import Table from "@/components/Table";
import { useGetAllSuppliersQuery } from "@/redux/api/supplier";
import { useTenantDomain } from "@/hooks/useTenantDomain";
import { StatusChip, SupplierAvatar } from "@/utils/customStyle";
import { purchaseBtn } from "../../utils/customStyle";
import Breadcrumb from "../../components/Breadcrumb";

const SupplierListTable = ({ isRecycled, handleDeleteSupplier, title }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 15;
  const { tenantDomain } = useTenantDomain();

  const { data: allSuppliers, isLoading } = useGetAllSuppliersQuery({
    tenantDomain,
    limit,
    page: currentPage,
    isRecycled,
    searchTerm,
  });

  const totalPages = allSuppliers?.data?.meta?.totalPage || 1;
  const totalCount = allSuppliers?.data?.meta?.total || 0;

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircleIcon fontSize="small" />;
      case "inactive":
        return <CancelIcon fontSize="small" />;
      case "pending":
        return <WarningIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      key: "supplierId",
      label: "ID",
      render: (item) => item.supplierId || "N/A",
    },
    {
      key: "full_name",
      label: "Supplier",
      render: (item) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SupplierAvatar src={item.supplier_photo} alt={item.full_name}>
            {item.full_name?.charAt(0) || "S"}
          </SupplierAvatar>
          <Box sx={{ ml: 2 }}>
            <span className="font-semibold">{item.full_name || "Unknown"}</span>
            <p className="text-xs text-gray-500">{item.vendor || "N/A"}</p>
          </Box>
        </Box>
      ),
    },
    {
      key: "shop_name",
      label: "Company",
      render: (item) => item.shop_name || "N/A",
    },
    {
      key: "contact",
      label: "Contact",
      render: (item) => (
        <div>
          <p className="flex items-center text-sm">
            <PhoneIcon fontSize="small" className="mr-1 text-gray-500" />
            {item.full_Phone_number || item.phone_number || "N/A"}
          </p>
          <p className="flex items-center text-sm">
            <EmailIcon fontSize="small" className="mr-1 text-gray-500" />
            {item.email || "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "supplier_status",
      label: "Status",
      render: (item) => (
        <StatusChip
          icon={getStatusIcon(item.supplier_status)}
          label={item.supplier_status || "Active"}
          size="small"
          status={item.supplier_status}
        />
      ),
    },
  ];

  const actions = isRecycled
    ? [
        {
          key: "restoreOrDelete",
          label: "Restore/Delete",
          icon: DeleteIcon,
          onClick: (item) => handleDeleteSupplier(item._id), // ✅ fixed
          tooltip: "Restore or Permanently Delete Supplier",
          className: "text-red-500 hover:text-red-700",
        },
      ]
    : [
        {
          key: "view",
          label: "View",
          icon: VisibilityIcon,
          link: (item) => `/dashboard/supplier-profile?id=${item._id}`,
          LinkComponent: Link,
          tooltip: "View Details",
        },
        {
          key: "edit",
          label: "Edit",
          icon: EditIcon,
          link: (item) => `/dashboard/update-supplier?id=${item._id}`,
          LinkComponent: Link,
          tooltip: "Edit Supplier",
        },
        {
          key: "delete",
          label: "Delete",
          icon: DeleteIcon,
          onClick: (item) => handleDeleteSupplier(item._id),
          tooltip: "Move to Recycle Bin",
          className: "text-red-500 hover:text-red-700",
        },
      ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const breadcrumbItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Suppliers", icon: Store },
  ];

  return (
    <div className="w-full mt-5 px-0">
      <Breadcrumb items={breadcrumbItems} />
      <Box
        sx={{
          p: 4,
          borderRadius: "16px",
          background: alpha(theme.palette.background.paper, 0.9),
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {!isRecycled && (
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <h2 className="text-2xl font-bold flex items-center">
              <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              Supplier Management
            </h2>

            <Button
              sx={purchaseBtn}
              to="/dashboard/add-supplier"
              component={Link}
              startIcon={<AddIcon />}
            >
              Add Supplier
            </Button>
          </div>
        )}

        <Table
          title={title || "Suppliers"}
          columns={columns}
          data={allSuppliers?.data?.suppliers || []}
          actions={actions}
          loading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          searchPlaceholder="Search supplier..."
          onSearch={handleSearch}
          emptyMessage="No suppliers found"
        />
        <p className="text-xs text-gray-500 mt-3">
          Showing page {currentPage} of {totalPages} — Total {totalCount}{" "}
          suppliers
        </p>
      </Box>
    </div>
  );
};

export default SupplierListTable;
