/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Grid,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  LinearProgress,
} from "@mui/material"
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  Visibility,
  Add,
  SupervisorAccount,
  ManageAccounts,
  Person,
  PersonAdd,
  CheckCircle,
  Cancel,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Security,
  AdminPanelSettings,
  Download,
  Print,
  Refresh,
  VisibilityOff,
} from "@mui/icons-material"
import { ThemeProvider, createTheme } from "@mui/material/styles"

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#e3f2fd",
      dark: "#0d47a1",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f50057",
      light: "#fce4ec",
      dark: "#c51162",
      contrastText: "#fff",
    },
    success: {
      main: "#4caf50",
      light: "#e8f5e9",
      dark: "#2e7d32",
    },
    warning: {
      main: "#ff9800",
      light: "#fff3e0",
      dark: "#e65100",
    },
    info: {
      main: "#2196f3",
      light: "#e3f2fd",
      dark: "#0d47a1",
    },
    error: {
      main: "#f44336",
      light: "#ffebee",
      dark: "#b71c1c",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        contained: {
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: "hidden",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
  },
})

// Role icons mapping
const roleIcons = {
  admin: <SupervisorAccount fontSize="small" />,
  manager: <ManageAccounts fontSize="small" />,
  employee: <Person fontSize="small" />,
  user: <PersonAdd fontSize="small" />,
}

// Sample data for roles
const sampleRoles = [
  {
    id: 1,
    name: "Super Admin",
    type: "admin",
    username: "admin",
    employeeName: "John Smith",
    createdBy: "System",
    createdAt: "2023-05-15",
    status: "active",
    permissionCount: {
      total: 72,
      create: 18,
      edit: 18,
      view: 18,
      delete: 18,
    },
    permissions: [
      { category: "Job Cards", create: true, edit: true, view: true, delete: true },
      { category: "Quotations", create: true, edit: true, view: true, delete: true },
      { category: "Invoices", create: true, edit: true, view: true, delete: true },
      { category: "Projects", create: true, edit: true, view: true, delete: true },
      { category: "Inventory", create: true, edit: true, view: true, delete: true },
      { category: "Customers", create: true, edit: true, view: true, delete: true },
      { category: "Finance", create: true, edit: true, view: true, delete: true },
      { category: "User Management", create: true, edit: true, view: true, delete: true },
      { category: "Settings", create: true, edit: true, view: true, delete: true },
    ],
  },
  {
    id: 2,
    name: "Garage Manager",
    type: "manager",
    username: "manager",
    employeeName: "Emily Johnson",
    createdBy: "John Smith",
    createdAt: "2023-06-20",
    status: "active",
    permissionCount: {
      total: 60,
      create: 16,
      edit: 16,
      view: 18,
      delete: 10,
    },
    permissions: [
      { category: "Job Cards", create: true, edit: true, view: true, delete: true },
      { category: "Quotations", create: true, edit: true, view: true, delete: true },
      { category: "Invoices", create: true, edit: true, view: true, delete: true },
      { category: "Projects", create: true, edit: true, view: true, delete: true },
      { category: "Inventory", create: true, edit: true, view: true, delete: true },
      { category: "Customers", create: true, edit: true, view: true, delete: true },
      { category: "Finance", create: true, edit: true, view: true, delete: false },
      { category: "User Management", create: false, edit: false, view: true, delete: false },
      { category: "Settings", create: false, edit: false, view: true, delete: false },
    ],
  },
  {
    id: 3,
    name: "Service Technician",
    type: "employee",
    username: "technician",
    employeeName: "Michael Brown",
    createdBy: "Emily Johnson",
    createdAt: "2023-07-10",
    status: "active",
    permissionCount: {
      total: 32,
      create: 6,
      edit: 8,
      view: 16,
      delete: 2,
    },
    permissions: [
      { category: "Job Cards", create: true, edit: true, view: true, delete: true },
      { category: "Quotations", create: true, edit: true, view: true, delete: true },
      { category: "Invoices", create: false, edit: true, view: true, delete: false },
      { category: "Projects", create: true, edit: true, view: true, delete: false },
      { category: "Inventory", create: true, edit: true, view: true, delete: false },
      { category: "Customers", create: true, edit: true, view: true, delete: false },
      { category: "Finance", create: false, edit: false, view: true, delete: false },
      { category: "User Management", create: false, edit: false, view: true, delete: false },
      { category: "Settings", create: false, edit: false, view: true, delete: false },
    ],
  },
  {
    id: 4,
    name: "Front Desk",
    type: "employee",
    username: "frontdesk",
    employeeName: "Sarah Wilson",
    createdBy: "Emily Johnson",
    createdAt: "2023-08-05",
    status: "active",
    permissionCount: {
      total: 28,
      create: 4,
      edit: 6,
      view: 18,
      delete: 0,
    },
    permissions: [
      { category: "Job Cards", create: true, edit: true, view: true, delete: false },
      { category: "Quotations", create: true, edit: true, view: true, delete: false },
      { category: "Invoices", create: true, edit: true, view: true, delete: false },
      { category: "Projects", create: false, edit: true, view: true, delete: false },
      { category: "Inventory", create: false, edit: false, view: true, delete: false },
      { category: "Customers", create: true, edit: true, view: true, delete: false },
      { category: "Finance", create: false, edit: false, view: true, delete: false },
      { category: "User Management", create: false, edit: false, view: true, delete: false },
      { category: "Settings", create: false, edit: false, view: true, delete: false },
    ],
  },
  {
    id: 5,
    name: "Inventory Manager",
    type: "manager",
    username: "inventory",
    employeeName: "David Lee",
    createdBy: "John Smith",
    createdAt: "2023-09-15",
    status: "active",
    permissionCount: {
      total: 36,
      create: 8,
      edit: 8,
      view: 16,
      delete: 4,
    },
    permissions: [
      { category: "Job Cards", create: false, edit: false, view: true, delete: false },
      { category: "Quotations", create: false, edit: false, view: true, delete: false },
      { category: "Invoices", create: false, edit: false, view: true, delete: false },
      { category: "Projects", create: false, edit: false, view: true, delete: false },
      { category: "Inventory", create: true, edit: true, view: true, delete: true },
      { category: "Customers", create: true, edit: true, view: true, delete: false },
      { category: "Finance", create: true, edit: true, view: true, delete: false },
      { category: "User Management", create: false, edit: false, view: true, delete: false },
      { category: "Settings", create: false, edit: false, view: true, delete: false },
    ],
  },
  {
    id: 6,
    name: "Customer",
    type: "user",
    username: "customer",
    employeeName: "Guest User",
    createdBy: "System",
    createdAt: "2023-10-01",
    status: "inactive",
    permissionCount: {
      total: 9,
      create: 0,
      edit: 0,
      view: 9,
      delete: 0,
    },
    permissions: [
      { category: "Job Cards", create: false, edit: false, view: true, delete: false },
      { category: "Quotations", create: false, edit: false, view: true, delete: false },
      { category: "Invoices", create: false, edit: false, view: true, delete: false },
      { category: "Projects", create: false, edit: false, view: true, delete: false },
      { category: "Inventory", create: false, edit: false, view: true, delete: false },
      { category: "Customers", create: false, edit: false, view: true, delete: false },
      { category: "Finance", create: false, edit: false, view: true, delete: false },
      { category: "User Management", create: false, edit: false, view: false, delete: false },
      { category: "Settings", create: false, edit: false, view: true, delete: false },
    ],
  },
]

export default function RoleList() {
  // State for data and UI
  const [roles, setRoles] = useState(sampleRoles)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [expandedRow, setExpandedRow] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [actionAnchorEl, setActionAnchorEl] = useState(null)
  const [actionRole, setActionRole] = useState(null)
  const [loading, setLoading] = useState(false)

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
    setPage(0)
  }

  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    setPage(0)
    handleFilterClose()
  }

  // Handle type filter
  const handleTypeFilter = (type) => {
    setTypeFilter(type)
    setPage(0)
    handleFilterClose()
  }

  // Handle row expansion
  const handleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  // Handle action menu
  const handleActionClick = (event, role) => {
    setActionAnchorEl(event.currentTarget)
    setActionRole(role)
  }

  const handleActionClose = () => {
    setActionAnchorEl(null)
    setActionRole(null)
  }

  // Handle view role
  const handleViewRole = (role) => {
    setSelectedRole(role)
    setViewDialogOpen(true)
    handleActionClose()
  }

  // Handle edit role
  const handleEditRole = (role) => {

    handleActionClose()
  }

  // Handle delete role
  const handleDeleteClick = (role) => {
    setSelectedRole(role)
    setDeleteDialogOpen(true)
    handleActionClose()
  }

  const handleDeleteConfirm = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setRoles(roles.filter((role) => role.id !== selectedRole.id))
      setDeleteDialogOpen(false)
      setSelectedRole(null)
      setLoading(false)
    }, 1000)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSelectedRole(null)
  }

  // Handle duplicate role
  const handleDuplicateRole = (role) => {
    const newRole = {
      ...role,
      id: Math.max(...roles.map((r) => r.id)) + 1,
      name: `${role.name} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setRoles([...roles, newRole])
    handleActionClose()
  }

  // Filter and search roles
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.employeeName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || role.status === statusFilter
    const matchesType = typeFilter === "all" || role.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Calculate permission percentage
  const calculatePermissionPercentage = (permissionCount) => {
    const maxPermissions = 72 // 18 pages * 4 permission types
    return (permissionCount.total / maxPermissions) * 100
  }

  // Get permission color based on percentage
  const getPermissionColor = (percentage) => {
    if (percentage >= 75) return "error"
    if (percentage >= 50) return "warning"
    if (percentage >= 25) return "info"
    return "success"
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Refresh roles
  const handleRefresh = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 'xl', mx: "auto", py: 4, px: 2 }}>
        <Card elevation={6}>
          <Box
            sx={{
              bgcolor: "primary.main",
              py: 2.5,
              px: 3,
              color: "primary.contrastText",
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AdminPanelSettings sx={{ fontSize: 28 }} />
              <Typography variant="h5" component="h1">
                Role Management
              </Typography>
              <Chip
                label={`${roles.length} Roles`}
                size="small"
                color="secondary"
                sx={{ ml: "auto !important", fontWeight: "bold" }}
              />
            </Stack>
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              Manage user roles and permissions for your garage management system
            </Typography>
          </Box>

          {loading && <LinearProgress />}

          <CardContent sx={{ pt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
              <TextField
                placeholder="Search roles..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearch}
                sx={{ minWidth: 240 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" startIcon={<FilterList />} onClick={handleFilterClick} size="small">
                  Filter
                </Button>

                <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: "bold" }}>
                    Status
                  </Typography>
                  <MenuItem onClick={() => handleStatusFilter("all")} selected={statusFilter === "all"}>
                    All
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusFilter("active")} selected={statusFilter === "active"}>
                    <Chip label="Active" size="small" color="success" variant="outlined" sx={{ mr: 1 }} />
                    Active
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusFilter("inactive")} selected={statusFilter === "inactive"}>
                    <Chip label="Inactive" size="small" color="error" variant="outlined" sx={{ mr: 1 }} />
                    Inactive
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: "bold" }}>
                    Role Type
                  </Typography>
                  <MenuItem onClick={() => handleTypeFilter("all")} selected={typeFilter === "all"}>
                    All Types
                  </MenuItem>
                  <MenuItem onClick={() => handleTypeFilter("admin")} selected={typeFilter === "admin"}>
                    <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>{roleIcons.admin}</Box>
                    Admin
                  </MenuItem>
                  <MenuItem onClick={() => handleTypeFilter("manager")} selected={typeFilter === "manager"}>
                    <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>{roleIcons.manager}</Box>
                    Manager
                  </MenuItem>
                  <MenuItem onClick={() => handleTypeFilter("employee")} selected={typeFilter === "employee"}>
                    <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>{roleIcons.employee}</Box>
                    Employee
                  </MenuItem>
                  <MenuItem onClick={() => handleTypeFilter("user")} selected={typeFilter === "user"}>
                    <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>{roleIcons.user}</Box>
                    User
                  </MenuItem>
                </Menu>

                <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh} size="small">
                  Refresh
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
                  }}
                >
                  Add Role
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.light" }}>
                    <TableCell width={50} />
                    <TableCell>Role Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Permissions</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role) => {
                    const permissionPercentage = calculatePermissionPercentage(role.permissionCount)
                    const permissionColor = getPermissionColor(permissionPercentage)
                    const isExpanded = expandedRow === role.id

                    return (
                      <>
                        <TableRow
                          key={role.id}
                          sx={{
                            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                            transition: "background-color 0.2s",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRowExpand(role.id)}
                        >
                          <TableCell>
                            <IconButton size="small">
                              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  width: 36,
                                  height: 36,
                                  bgcolor:
                                    role.type === "admin"
                                      ? "error.main"
                                      : role.type === "manager"
                                        ? "warning.main"
                                        : role.type === "employee"
                                          ? "info.main"
                                          : "success.main",
                                  mr: 1.5,
                                }}
                              >
                                {roleIcons[role.type]}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">{role.name}</Typography>
                                <Chip
                                  label={role.type.charAt(0).toUpperCase() + role.type.slice(1)}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: "0.7rem" }}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{role.username}</TableCell>
                          <TableCell>{role.employeeName}</TableCell>
                          <TableCell>
                            <Tooltip title={`Created by: ${role.createdBy}`}>
                              <Typography variant="body2">{formatDate(role.createdAt)}</Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={role.status === "active" ? "Active" : "Inactive"}
                              size="small"
                              color={role.status === "active" ? "success" : "error"}
                              icon={
                                role.status === "active" ? (
                                  <CheckCircle fontSize="small" />
                                ) : (
                                  <Cancel fontSize="small" />
                                )
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                              }}
                            >
                              <Box sx={{ width: "100%", mr: 1, mb: 0.5 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={permissionPercentage}
                                  color={permissionColor}
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Tooltip title="Create permissions">
                                  <Chip
                                    label={role.permissionCount.create}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    icon={<Add fontSize="small" />}
                                    sx={{ height: 20, minWidth: 40 }}
                                  />
                                </Tooltip>
                                <Tooltip title="Edit permissions">
                                  <Chip
                                    label={role.permissionCount.edit}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                    icon={<Edit fontSize="small" />}
                                    sx={{ height: 20, minWidth: 40 }}
                                  />
                                </Tooltip>
                                <Tooltip title="View permissions">
                                  <Chip
                                    label={role.permissionCount.view}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    icon={<Visibility fontSize="small" />}
                                    sx={{ height: 20, minWidth: 40 }}
                                  />
                                </Tooltip>
                                <Tooltip title="Delete permissions">
                                  <Chip
                                    label={role.permissionCount.delete}
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    icon={<Delete fontSize="small" />}
                                    sx={{ height: 20, minWidth: 40 }}
                                  />
                                </Tooltip>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleActionClick(e, role)
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>

                        <TableRow key={`expansion-${role.id}`}>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 2 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                  Permission Details
                                </Typography>
                                <Table size="small" aria-label="permissions">
                                  <TableHead>
                                    <TableRow sx={{ bgcolor: "grey.100" }}>
                                      <TableCell>Category</TableCell>
                                      <TableCell align="center">Create</TableCell>
                                      <TableCell align="center">Edit</TableCell>
                                      <TableCell align="center">View</TableCell>
                                      <TableCell align="center">Delete</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {role.permissions.map((permission, index) => (
                                      <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                          {permission.category}
                                        </TableCell>
                                        <TableCell align="center">
                                          {permission.create ? (
                                            <CheckCircle fontSize="small" color="success" />
                                          ) : (
                                            <Cancel fontSize="small" color="error" />
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {permission.edit ? (
                                            <CheckCircle fontSize="small" color="info" />
                                          ) : (
                                            <Cancel fontSize="small" color="error" />
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {permission.view ? (
                                            <CheckCircle fontSize="small" color="primary" />
                                          ) : (
                                            <Cancel fontSize="small" color="error" />
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {permission.delete ? (
                                            <CheckCircle fontSize="small" color="error" />
                                          ) : (
                                            <Cancel fontSize="small" color="error" />
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    )
                  })}

                  {filteredRoles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          No roles found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your search or filter criteria
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRoles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, bgcolor: "grey.50" }}>
            <Button variant="outlined" startIcon={<Download />} >
              Export
            </Button>
            <Button variant="outlined" startIcon={<Print />}>
              Print
            </Button>
          </Box>
        </Card>
      </Box>

      {/* Action Menu */}
      <Menu anchorEl={actionAnchorEl} open={Boolean(actionAnchorEl)} onClose={handleActionClose}>
        <MenuItem onClick={() => handleViewRole(actionRole)}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleEditRole(actionRole)}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Role
        </MenuItem>
        <MenuItem onClick={() => handleDuplicateRole(actionRole)}>
          <ContentCopy fontSize="small" sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteClick(actionRole)} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Role
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Delete color="error" />
            <Typography variant="h6">Delete Role</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRole && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to delete the role <strong>{selectedRole.name}</strong>?
              </Typography>
              <Typography variant="body2" color="error">
                This action cannot be undone. All permissions associated with this role will be permanently removed.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Role Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedRole && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Security color="primary" />
                <Typography variant="h6">Role Details</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Basic Information
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor:
                              selectedRole.type === "admin"
                                ? "error.main"
                                : selectedRole.type === "manager"
                                  ? "warning.main"
                                  : selectedRole.type === "employee"
                                    ? "info.main"
                                    : "success.main",
                            mr: 2,
                          }}
                        >
                          {roleIcons[selectedRole.type]}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{selectedRole.name}</Typography>
                          <Chip
                            label={selectedRole.type.charAt(0).toUpperCase() + selectedRole.type.slice(1)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Username
                          </Typography>
                          <Typography variant="body1">{selectedRole.username}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Employee
                          </Typography>
                          <Typography variant="body1">{selectedRole.employeeName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Created By
                          </Typography>
                          <Typography variant="body1">{selectedRole.createdBy}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Created Date
                          </Typography>
                          <Typography variant="body1">{formatDate(selectedRole.createdAt)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <Chip
                            label={selectedRole.status === "active" ? "Active" : "Inactive"}
                            color={selectedRole.status === "active" ? "success" : "error"}
                            icon={
                              selectedRole.status === "active" ? (
                                <CheckCircle fontSize="small" />
                              ) : (
                                <Cancel fontSize="small" />
                              )
                            }
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Permission Summary
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2">Total Permissions</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {selectedRole.permissionCount.total} / 72
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(selectedRole.permissionCount.total / 72) * 100}
                          color={getPermissionColor(calculatePermissionPercentage(selectedRole.permissionCount))}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper variant="outlined" sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                            <Add fontSize="small" color="success" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Create
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedRole.permissionCount.create} permissions
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper variant="outlined" sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                            <Edit fontSize="small" color="info" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Edit
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedRole.permissionCount.edit} permissions
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper variant="outlined" sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                            <Visibility fontSize="small" color="primary" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                View
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedRole.permissionCount.view} permissions
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper variant="outlined" sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                            <Delete fontSize="small" color="error" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Delete
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedRole.permissionCount.delete} permissions
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Detailed Permissions
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "grey.100" }}>
                          <TableCell>Category</TableCell>
                          <TableCell align="center">Create</TableCell>
                          <TableCell align="center">Edit</TableCell>
                          <TableCell align="center">View</TableCell>
                          <TableCell align="center">Delete</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedRole.permissions.map((permission, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {permission.category}
                            </TableCell>
                            <TableCell align="center">
                              {permission.create ? (
                                <CheckCircle fontSize="small" color="success" />
                              ) : (
                                <VisibilityOff fontSize="small" color="disabled" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {permission.edit ? (
                                <CheckCircle fontSize="small" color="info" />
                              ) : (
                                <VisibilityOff fontSize="small" color="disabled" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {permission.view ? (
                                <CheckCircle fontSize="small" color="primary" />
                              ) : (
                                <VisibilityOff fontSize="small" color="disabled" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {permission.delete ? (
                                <CheckCircle fontSize="small" color="error" />
                              ) : (
                                <VisibilityOff fontSize="small" color="disabled" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => handleEditRole(selectedRole)} variant="outlined" startIcon={<Edit />}>
                Edit Role
              </Button>
              <Button onClick={() => setViewDialogOpen(false)} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ThemeProvider>
  )
}

