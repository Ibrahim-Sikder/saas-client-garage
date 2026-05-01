/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Box, Button, Fade } from "@mui/material";
import Swal from "sweetalert2";
import Table from "../../components/Table";
import {
  useDeleteBrandMutation,
  useGetAllIBrandQuery,
} from "../../redux/api/brandApi";
import { CreateBrandModal } from "./CreateBrandModal";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { usePermissions } from "../../context/PermissionContext";
import { DeleteIcon, EditIcon, Home } from "lucide-react";
import { Add, Storefront } from "@mui/icons-material";
import { purchaseBtn, wrapBoxStyle } from "../../utils/customStyle";
import Breadcrumb from "../../components/Breadcrumb";

export default function BrandList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageSize] = useState(12);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState();

  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const { data, isLoading, refetch } = useGetAllIBrandQuery({
    tenantDomain,
    limit: pageSize,
    page: currentPage,
    searchTerm: debouncedSearch,
  });

  const [deleteBrand] = useDeleteBrandMutation();
  const brands = data?.data?.brands || [];
  const meta = data?.data?.meta || {};
  const totalPages = Math.ceil((meta.total || 0) / (meta.limit || pageSize));

  const handleDeleteBrand = async (brand) => {
    performActionWithPermission(
      "/dashboard/brand",
      "delete",
      async () => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won’t be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
          try {
            await deleteBrand({ tenantDomain, id: brand._id }).unwrap();
            Swal.fire("Deleted!", "Brand deleted successfully.", "success");
            refetch();
          } catch {
            Swal.fire("Error!", "Failed to delete brand.", "error");
          }
        }
      },
      "You don’t have permission to delete this brand!"
    );
  };

  const columns = [
    { key: "index", label: "No", type: "index" },

    { key: "brand", label: "Brand Name" },
  ];

  const actions = [
    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit",
      color: "#2563EB",
      onClick: (brand) => setUpdateOpen(brand._id),
      requirePermission: true,
      permissionPage: "/dashboard/brand",
      permissionAction: "update",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete",
      color: "red",
      onClick: (brand) => handleDeleteBrand(brand),
      requirePermission: true,
      permissionPage: "/dashboard/brand",
      permissionAction: "delete",
    },
  ];
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Brand", icon: Storefront },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <Breadcrumb items={breadcrumbItems} />
      <Box sx={{ p: 3 }}>
        <div className="flex justify-end items-center mb-4">
          <Button
            sx={purchaseBtn}
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Create Brand
          </Button>
        </div>

        <Table
          title="Brand List"
          columns={columns}
          data={brands}
          actions={actions}
          loading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onSearch={setSearch}
          searchPlaceholder="Search brands..."
          emptyMessage="No brands found."
        />

        <CreateBrandModal open={open} setOpen={setOpen} />
        <CreateBrandModal
          brandId={updateOpen}
          open={Boolean(updateOpen)}
          setOpen={() => setUpdateOpen(null)}
        />
      </Box>
    </Box>
  );
}
