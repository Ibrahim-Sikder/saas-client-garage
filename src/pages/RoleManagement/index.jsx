"use client";

import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Chip,
  Badge,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Add, Person } from "@mui/icons-material";
import AddRoleModal from "./AddRoleModal";
import {
  useGetAllRolesQuery,
  useDeleteRoleMutation,
} from "../../redux/api/roleApi";
import { useAppOptions } from "../../hooks/useAppOptions";
import swal from "sweetalert";
import Table from "../../components/Table";
import { purchaseBtn } from "../../utils/customStyle";
import RoleStats from "./RoleStats";
import { DeleteIcon, EditIcon } from "lucide-react";

const RoleManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const {
    data: rolesData,
    isLoading,
    refetch,
  } = useGetAllRolesQuery({ tenantDomain });
  const [deleteRole] = useDeleteRoleMutation();

  const roles = rolesData?.data || [];
  const handleOpenDialog = () => {
    setEditMode(false);
    setSelectedRole(null);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRole(null);
    setEditMode(false);
  };
  const handleEditRole = (role) => {
    setEditMode(true);
    setSelectedRole(role);
    setOpenDialog(true);
  };
  const handleDeleteRole = async (role) => {
    performActionWithPermission(
      "/dashboard/role-management",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "Are you sure you want to delete this role?",
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancel", "Delete"],
        });

        if (willDelete) {
          try {
            await deleteRole({ id: role._id, tenantDomain }).unwrap();
            swal("Deleted!", "Role has been deleted successfully.", "success");
            refetch();
          } catch (error) {
            console.error("Delete role error:", error);
            swal(
              "Error",
              "An error occurred while deleting the role.",
              "error"
            );
          }
        }
      },
      "You don't have permission to delete roles!"
    );
  };
  const getRoleColor = (type) => {
    const colors = {
      admin: "error",
      manager: "warning",
      employee: "info",
      user: "success",
      superadmin: "secondary",
    };
    return colors[type] || "default";
  };

  const getStatusColor = (status) =>
    status === "active" ? "success" : "error";

  const filteredRoles = roles.filter(
    (role) =>
      role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalRoles = roles.length;
  const activeRoles = roles.filter((r) => r.status === "active").length;
  const totalUsers = roles.reduce((sum, role) => sum + (role.users || 0), 0);
  const roleTypes = [...new Set(roles.map((role) => role.type))].length;

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading roles...</Typography>
      </Box>
    );
  }
  const columns = [
    {
      key: "name",
      label: "Role",
      render: (role) => (
        <Box display="flex" alignItems="center">
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {role.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(role.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (role) => (
        <Chip
          label={role.type?.charAt(0).toUpperCase() + role.type?.slice(1)}
          size="small"
          color={getRoleColor(role.type)}
          variant="outlined"
        />
      ),
    },

    {
      key: "users",
      label: "Users",
      render: (role) => (
        <Badge badgeContent={role.users || 0} color="primary">
          <Person />
        </Badge>
      ),
    },
    { key: "createdBy", label: "Created By" },
    {
      key: "status",
      label: "Status",
      render: (role) => (
        <Box display="flex" alignItems="center" gap={1}>
          <FormControlLabel
            control={
              <Switch
                checked={role.status === "active"}
                color="success"
                size="small"
              />
            }
            label=""
          />
          <Chip
            label={role.status}
            size="small"
            color={getStatusColor(role.status)}
            variant="outlined"
          />
        </Box>
      ),
    },
  ];

  const actions = [
    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit Role",
      onClick: handleEditRole,
      requirePermission: true,
      permissionPage: "/dashboard/role-management",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete Role",
      onClick: handleDeleteRole,
      requirePermission: true,
      permissionPage: "/dashboard/role-management",
      permissionAction: "delete",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <RoleStats
        totalRoles={totalRoles}
        activeRoles={activeRoles}
        totalUsers={totalUsers}
        roleTypes={roleTypes}
      />

      {/* Roles Table */}
      <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenDialog}
            sx={purchaseBtn}
          >
            Add New Role
          </Button>
        </Box>

        <Table
          title="Roles"
          columns={columns}
          data={filteredRoles}
          actions={actions}
          loading={isLoading}
          onSearch={setSearchTerm}
          searchPlaceholder="Search roles..."
          emptyMessage="No roles found"
        />
      </Card>

      {/* Add/Edit Role Modal */}
      <AddRoleModal
        performActionWithPermission={performActionWithPermission}
        open={openDialog}
        onClose={handleCloseDialog}
        editMode={editMode}
        roleData={selectedRole}
        refetchRoles={refetch}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default RoleManagement;
