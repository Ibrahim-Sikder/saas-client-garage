/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Table from "@/components/Table";
import { Avatar, Box, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaLock,
  FaTrash,
  FaUnlock,
  FaUserShield,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  useDeleteTenantMutation,
  useGetAllTenantQuery,
  useRenewSubscriptionMutation,
  useUpdateTenantMutation,
} from "../../redux/api/tenantApi";

import { wrapBoxStyle } from "../../utils/customStyle";
import { formatDate } from "../../utils/formateDate";

import CreateTenantModal from "./CreateTenantModal";
import TenantFilterPanel from "./TenantFilterPanel";
import TenantStatsCards from "./TenantStatsCards";
import UpdateTenantModal from "./UpdateTenantModal";
import ViewDetailsModal from "./ViewTenantModal";
import Loading from "../../components/Loading/Loading";

const AllTenantList = () => {
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createTenantModalOpen, setCreateTenantModalOpen] = useState(false);

  const { data: tenantData, isLoading, refetch } = useGetAllTenantQuery({});
  const [updateTenant, { isLoading: updateLoading }] =
    useUpdateTenantMutation();
  const [renewSubscription, { isLoading: renewLoading }] =
    useRenewSubscriptionMutation();
  const [deleteTenant] = useDeleteTenantMutation();
  const tenants = tenantData?.data?.tenants || [];
  useEffect(() => {
    const filtered = tenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.businessType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && tenant.isActive) ||
        (filterStatus === "blocked" && !tenant.isActive);

      const matchesPayment =
        filterPayment === "all" ||
        (filterPayment === "paid" && tenant.subscription?.isPaid) ||
        (filterPayment === "unpaid" && !tenant.subscription?.isPaid);

      return matchesSearch && matchesStatus && matchesPayment;
    });
    setFilteredTenants(filtered);
    setPage(0);
  }, [searchTerm, filterStatus, filterPayment, tenants]);

  const handleEditTenant = (tenant) => {
    setSelectedTenant(tenant);
    setEditModalOpen(true);
  };

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setViewModalOpen(true);
  };

  const handleUpdateTenant = async (updatedTenant) => {
    try {
      const result = await updateTenant({
        id: updatedTenant._id,
        data: updatedTenant,
      }).unwrap();
      toast.success(result.message || "Tenant updated successfully!");
      setEditModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update tenant!");
    }
  };

  const handleTenantBlock = async (tenantId, isCurrentlyActive) => {
    const action = isCurrentlyActive ? "block" : "unblock";
    const confirmResult = await Swal.fire({
      title: `Are you sure you want to ${action} this tenant?`,
      text: `The tenant will be ${action}ed immediately.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isCurrentlyActive ? "#d33" : "#4CAF50",
      cancelButtonColor: "#aaa",
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await updateTenant({
        id: tenantId,
        data: { isActive: !isCurrentlyActive },
      }).unwrap();

      toast.success(
        `Tenant ${isCurrentlyActive ? "blocked" : "unblocked"} successfully!`,
      );
      refetch();
    } catch (error) {
      toast.error(
        `Failed to ${
          isCurrentlyActive ? "block" : "unblock"
        } tenant. Please try again.`,
      );
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteTenant({ id: tenantId }).unwrap();
        toast.success("Tenant deleted successfully!");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete tenant.");
      }
    }
  };

  const handleRenewSubscription = async (tenantId, plan) => {
    try {
      await renewSubscription({ id: tenantId, plan }).unwrap();
      toast.success(`Subscription renewed! New ${plan} plan is active.`);
      setViewModalOpen(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to renew subscription");
    }
  };

  const handleTenantCreated = (newTenant) => {
    refetch();
    toast.success(`Tenant ${newTenant.name} created successfully!`);
  };

  const tenantColumns = [
    { key: "_id", label: "#", type: "index" },
    {
      key: "name",
      label: "Tenant",
      render: (tenant) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: tenant.isActive ? "#4CAF50" : "#f44336" }}>
            {tenant.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Box fontWeight="bold">{tenant.name}</Box>
            <Box fontSize={12} color="text.secondary">
              {tenant.businessType || "N/A"}
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      key: "domain",
      label: "Domain",
      render: (tenant) => (
        <Box>
          <Box fontWeight="bold">{tenant.domain}.app</Box>
          <Box fontSize={12} color="text.secondary">
            Database: {tenant.dbUri ? "Connected" : "Not Connected"}
          </Box>
        </Box>
      ),
    },
    {
      key: "subscription.plan",
      label: "Subscription",
      render: (tenant) => (
        <Box>
          <Box fontWeight="bold">
            {tenant.subscription?.plan || "No Plan"} - $
            {tenant.subscription?.amount || 0}
          </Box>
          <Box fontSize={12} color="text.secondary">
            Expires: {formatDate(tenant.subscription?.endDate)}
          </Box>
        </Box>
      ),
    },
    {
      key: "subscription.isPaid",
      label: "Payment Status",
      render: (tenant) =>
        tenant.subscription?.isPaid ? (
          <Chip
            label="Paid"
            size="small"
            sx={{ bgcolor: "#4CAF50", color: "white" }}
          />
        ) : (
          <Chip
            label="Unpaid"
            size="small"
            sx={{ bgcolor: "#f44336", color: "white" }}
          />
        ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (tenant) => (
        <Chip
          label={tenant.isActive ? "Active" : "Blocked"}
          size="small"
          sx={{
            bgcolor: tenant.isActive ? "#4CAF50" : "#f44336",
            color: "white",
          }}
        />
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (tenant) => formatDate(tenant.createdAt),
    },
  ];

  const tenantActions = [
    {
      key: "edit",
      icon: FaEdit,
      tooltip: "Edit Tenant",
      onClick: handleEditTenant,
      color: "#2196F3",
    },
    {
      key: "block",
      icon: FaLock,
      tooltip: "Block Tenant or Unblock Tenant",
      onClick: (tenant) => handleTenantBlock(tenant._id, tenant.isActive),
      color: "f44336",
      dynamicIcon: (tenant) => (tenant.isActive ? FaLock : FaUnlock),
    },
    {
      key: "delete",
      icon: FaTrash,
      tooltip: "Delete Tenant",
      onClick: (tenant) => handleDeleteTenant(tenant._id),
      color: "#f44336",
    },
    {
      key: "view",
      icon: FaEye,
      tooltip: "View Details",
      onClick: handleViewTenant,
      color: "#FF9800",
    },
  ];

  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.isActive).length,
    blocked: tenants.filter((t) => !t.isActive).length,
    unpaid: tenants.filter((t) => !t.subscription?.isPaid).length,
  };

  if (isLoading) return <Loading />;

  return (
    <Box sx={wrapBoxStyle}>
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          fontSize={28}
          fontWeight="bold"
        >
          <FaUserShield color="#667eea" /> Tenant Management
        </Box>
        <Box color="text.secondary" fontSize={16}>
          Manage all tenant users, subscriptions, and access controls
        </Box>
      </Box>

      <TenantStatsCards stats={stats} />
      <TenantFilterPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPayment={filterPayment}
        setFilterPayment={setFilterPayment}
        onAddTenant={() => setCreateTenantModalOpen(true)}
      />
      <Table
        title="Tenant List"
        columns={tenantColumns}
        data={filteredTenants.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        )}
        actions={tenantActions}
        loading={isLoading}
        currentPage={page + 1}
        totalPages={Math.ceil(filteredTenants.length / rowsPerPage)}
        onPageChange={(newPage) => setPage(newPage - 1)}
      />

      <UpdateTenantModal
        setOpen={setEditModalOpen}
        open={editModalOpen}
        tenant={selectedTenant}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleUpdateTenant}
        loading={updateLoading}
      />
      <ViewDetailsModal
        setOpen={setViewModalOpen}
        open={viewModalOpen}
        tenant={selectedTenant}
        onClose={() => setViewModalOpen(false)}
        onRenewSubscription={handleRenewSubscription}
        renewLoading={renewLoading}
      />
      <CreateTenantModal
        setOpen={setCreateTenantModalOpen}
        open={createTenantModalOpen}
        onClose={() => setCreateTenantModalOpen(false)}
        onTenantCreated={handleTenantCreated}
      />
    </Box>
  );
};

export default AllTenantList;
