/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Typography,
  Checkbox,
  Box,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Button,
  Grid,
  TablePagination,
} from "@mui/material";
import { Edit, Delete, LibraryBooks, Save, Person } from "@mui/icons-material";
import { useState } from "react";

import Swal from "sweetalert2";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useCreateMultiplePermissionsMutation } from "../../redux/api/permissionApi.js";
import { usePermissionFormData } from "../../hooks/usePermissionFormData.js";
import { useForm, FormProvider } from "react-hook-form";
import PermissionAutoComplete from "../../components/form/PermissionAutoComplete.jsx";

const MultipleAccess = ({
  handleDialogOpen,
  handleDeletePermission,
  getRoleColor,
  loading,
}) => {
  const theme = useTheme();
  const [selectedRows, setSelectedRows] = useState([]);
  const [permissionChanges, setPermissionChanges] = useState({});
  const [createMultiplePermissions, { isLoading: isCreating }] =
    useCreateMultiplePermissionsMutation();
  const { tenantDomain } = useTenantDomain();
  const { roleOptions, pageData, userOptions } = usePermissionFormData();

  const methods = useForm({
    defaultValues: {
      user: [],
      role: [],
      permissions: {},
    },
  });

  const getAllPages = () => {
    if (!pageData || !pageData.data) return [];
    return pageData.data;
  };

  const allPages = getAllPages();
  const transformPageDataToPermissions = () => {
    if (!pageData || !pageData.data) return [];

    return allPages.map((page) => ({
      id: `page-${page._id}`,
      pageId: page._id,
      pageName: page.name,
      pagePath: page.path,
      pageCategory: page.category,
      create: false,
      edit: false,
      view: false,
      delete: false,
      hasPermission: false,
      userId: null,
      userName: "All Users",
      userEmail: "N/A",
      roleName: "Assign Role",
    }));
  };

  const pagePermissions = transformPageDataToPermissions();

  // Group permissions by category
  const groupedPermissions = pagePermissions.reduce((acc, permission) => {
    const category = permission.pageCategory || "Uncategorized";
    if (!acc[category]) acc[category] = { category, permissions: [] };
    acc[category].permissions.push(permission);
    return acc;
  }, {});
  const categoriesArray = Object.values(groupedPermissions);

  // --- Pagination state ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Flatten grouped permissions for pagination
  const flattenedPermissions = categoriesArray.flatMap((group) =>
    group.permissions.map((perm) => ({ ...perm, categoryName: group.category }))
  );

  const paginatedPermissions = flattenedPermissions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectRow = (permissionId) => {
    setSelectedRows((prev) => {
      const isSelected = prev.includes(permissionId);

      if (isSelected) {
        setPermissionChanges((current) => {
          const newChanges = { ...current };
          delete newChanges[permissionId];
          return newChanges;
        });
        return prev.filter((id) => id !== permissionId);
      } else {
        setPermissionChanges((current) => ({
          ...current,
          [permissionId]: {
            create: true,
            edit: true,
            view: true,
            delete: true,
          },
        }));
        return [...prev, permissionId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = pagePermissions.map((p) => p.id);
      setSelectedRows(allIds);

      const allChanges = {};
      pagePermissions.forEach((permission) => {
        allChanges[permission.id] = {
          create: true,
          edit: true,
          view: true,
          delete: true,
        };
      });
      setPermissionChanges(allChanges);
    } else {
      setSelectedRows([]);
      setPermissionChanges({});
    }
  };

  const handlePermissionChange = (permissionId, permissionType) => {
    setPermissionChanges((prev) => {
      const currentChanges = prev[permissionId] || {};
      const currentValue =
        currentChanges[permissionType] !== undefined
          ? currentChanges[permissionType]
          : pagePermissions.find((p) => p.id === permissionId)[permissionType];

      return {
        ...prev,
        [permissionId]: { ...currentChanges, [permissionType]: !currentValue },
      };
    });
  };

  const handleMultiplePermissions = async (e) => {
    if (e) e.preventDefault();

    try {
      const formData = methods.getValues();
      const selectedUsers = formData.user || [];
      const selectedRoles = formData.role || [];

      if (selectedUsers.length === 0 && selectedRoles.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Selection Required!",
          text: "Please select at least one user or role to assign permissions.",
          confirmButtonColor: theme.palette.primary.main,
          background: "#fff",
        });
        return;
      }
      const allPermissionIds = new Set([
        ...selectedRows,
        ...Object.keys(permissionChanges),
      ]);

      if (allPermissionIds.size === 0) {
        Swal.fire({
          icon: "warning",
          title: "No Permissions Selected!",
          text: "Please select at least one page to assign permissions.",
          confirmButtonColor: theme.palette.primary.main,
          background: "#fff",
        });
        return;
      }

      const allPermissionsData = [];

      allPermissionIds.forEach((permissionId) => {
        const permission = pagePermissions.find((p) => p.id === permissionId);
        const changes = permissionChanges[permissionId] || {};
        allPermissionsData.push({
          pageId: [permission.pageId],
          create: changes.create ?? permission.create,
          edit: changes.edit ?? permission.edit,
          view: changes.view ?? permission.view,
          delete: changes.delete ?? permission.delete,
          userId: selectedUsers.length > 0 ? selectedUsers : [null],
          roleId: selectedRoles.length > 0 ? selectedRoles : [null],
        });
      });

      const result = await createMultiplePermissions({
        tenantDomain,
        permissionData: allPermissionsData,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `${result.length} permissions processed successfully.`,
        showConfirmButton: false,
        timer: 2000,
        background: "#fff",
      });
      setSelectedRows([]);
      setPermissionChanges({});
      methods.reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error?.data?.message ||
          "An error occurred while processing permissions.",
        confirmButtonColor: theme.palette.primary.main,
        background: "#fff",
      });
    }
  };

  const isAllSelected =
    pagePermissions.length > 0 &&
    selectedRows.length === pagePermissions.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < pagePermissions.length;

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleMultiplePermissions} noValidate>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <PermissionAutoComplete
              fullWidth
              name="user"
              label="Select User"
              options={userOptions}
              multiple
              freeSolo
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PermissionAutoComplete
              fullWidth
              name="role"
              label="Select Role"
              options={roleOptions}
              multiple
              freeSolo
            />
          </Grid>
        </Grid>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={6}
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Table>
                <TableHead
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                >
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={isIndeterminate}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Page</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>
                      Create
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Edit</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>View</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>
                      Delete
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPermissions.length > 0 ? (
                    paginatedPermissions.map((permission) => (
                      <TableRow
                        key={permission.id}
                        hover
                        selected={selectedRows.includes(permission.id)}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.02
                            ),
                          },
                          "&.Mui-selected": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={selectedRows.includes(permission.id)}
                            onChange={() => handleSelectRow(permission.id)}
                          />
                        </TableCell>

                        <TableCell sx={{ py: 2 }}>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                mr: 1.5,
                                bgcolor: alpha(theme.palette.info.main, 0.15),
                                color: theme.palette.info.main,
                              }}
                            >
                              <LibraryBooks />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {permission.pageName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {permission.pagePath}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={permission.pageCategory}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>

                        {["create", "edit", "view", "delete"].map((perm) => (
                          <TableCell key={perm} sx={{ py: 2 }}>
                            <Checkbox
                              checked={
                                permissionChanges[permission.id]?.[perm] ??
                                selectedRows.includes(permission.id) ??
                                permission[perm]
                              }
                              color={
                                perm === "create"
                                  ? "success"
                                  : perm === "edit"
                                  ? "warning"
                                  : perm === "view"
                                  ? "info"
                                  : "error"
                              }
                              size="small"
                              onChange={() =>
                                handlePermissionChange(permission.id, perm)
                              }
                            />
                          </TableCell>
                        ))}

                        <TableCell align="right" sx={{ py: 2 }}>
                          <Tooltip title="Edit Permission">
                            <IconButton
                              size="small"
                              onClick={() => handleDialogOpen(permission.id)}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {permission.hasPermission && (
                            <Tooltip title="Delete Permission">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleDeletePermission(permission.id)
                                }
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          No pages found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={flattenedPermissions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
              />
            </TableContainer>
          </>
        )}

        {(selectedRows.length > 0 ||
          Object.keys(permissionChanges).length > 0) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="body2">
              {selectedRows.length} page(s) and{" "}
              {Object.keys(permissionChanges).length} permission(s) selected
            </Typography>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={isCreating}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)",
                boxShadow: "0 4px 10px rgba(156, 39, 176, 0.3)",
              }}
            >
              {isCreating ? "Creating..." : "Create Permissions"}
            </Button>
          </Box>
        )}
      </Box>
    </FormProvider>
  );
};

export default MultipleAccess;
