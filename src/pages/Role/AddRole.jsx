/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Divider,
  Grid,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  Badge,
  Fade,
} from "@mui/material"
import {
  Shield,
  CheckCircle,
  Warning,
  Person,
  AdminPanelSettings,
  Security,
  LockPerson,
  Add,
  Edit,
  Visibility,
  Delete,
  CheckBox,
  CheckBoxOutlineBlank,
  SupervisorAccount,
  ManageAccounts,
  PersonAdd,
  HelpOutline,
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
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
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
  },
})

// TabPanel component for the tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`permission-tabpanel-${index}`}
      aria-labelledby={`permission-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `permission-tab-${index}`,
    "aria-controls": `permission-tabpanel-${index}`,
  }
}

// Role icons mapping
const roleIcons = {
  admin: <SupervisorAccount fontSize="small" />,
  manager: <ManageAccounts fontSize="small" />,
  employee: <Person fontSize="small" />,
  user: <PersonAdd fontSize="small" />,
}

// Permission action icons
const actionIcons = {
  create: <Add fontSize="small" />,
  edit: <Edit fontSize="small" />,
  view: <Visibility fontSize="small" />,
  delete: <Delete fontSize="small" />,
}

export default function AddRole() {
  // Sample page access data with categories
  const pageAccessList = [
    { id: 1, name: "Add Job Card", category: "Job Cards" },
    { id: 2, name: "Job Card List", category: "Job Cards" },
    { id: 3, name: "Add Quotation Card", category: "Quotations" },
    { id: 4, name: "Quotation List", category: "Quotations" },
    { id: 5, name: "Add Invoice", category: "Invoices" },
    { id: 6, name: "Invoice List", category: "Invoices" },
    { id: 7, name: "Running Project", category: "Projects" },
    { id: 8, name: "Completed Project", category: "Projects" },
    { id: 9, name: "Product", category: "Inventory" },
    { id: 10, name: "Customer List", category: "Customers" },
    { id: 11, name: "Expense", category: "Finance" },
    { id: 12, name: "Add Role", category: "User Management" },
    { id: 13, name: "Role List", category: "User Management" },
    { id: 14, name: "Bill Pay", category: "Finance" },
    { id: 15, name: "Add Employee", category: "User Management" },
    { id: 16, name: "View Employee", category: "User Management" },
    { id: 17, name: "Profile", category: "Settings" },
    { id: 18, name: "Data Backup", category: "Settings" },
  ]

  // State for form fields
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [employeeName, setEmployeeName] = useState("")
  const [createdBy, setCreatedBy] = useState("")
  const [status, setStatus] = useState("")
  const [permissions, setPermissions] = useState(
    pageAccessList.map((page) => ({
      pageId: page.id,
      create: false,
      edit: false,
      view: false,
      delete: false,
    })),
  )
  const [selectAll, setSelectAll] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [showHelp, setShowHelp] = useState(false)

  // Get unique categories
  const categories = Array.from(new Set(pageAccessList.map((page) => page.category)))

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Handle select all checkbox
  const handleSelectAll = (event) => {
    const checked = event.target.checked
    setSelectAll(checked)
    setPermissions(
      permissions.map((perm) => ({
        ...perm,
        create: checked,
        edit: checked,
        view: checked,
        delete: checked,
      })),
    )
  }

  // Handle individual permission change
  const handlePermissionChange = (pageId, type, checked) => {
    setPermissions(permissions.map((perm) => (perm.pageId === pageId ? { ...perm, [type]: checked } : perm)))
  }

  // Handle row select all
  const handleRowSelectAll = (pageId, checked) => {
    setPermissions(
      permissions.map((perm) =>
        perm.pageId === pageId
          ? {
              ...perm,
              create: checked,
              edit: checked,
              view: checked,
              delete: checked,
            }
          : perm,
      ),
    )
  }

  // Handle column select all
  const handleColumnSelectAll = (type, checked) => {
    setPermissions(permissions.map((perm) => ({ ...perm, [type]: checked })))
  }

  // Filter pages by category
  const getFilteredPages = () => {
    if (tabValue === 0) return pageAccessList
    return pageAccessList.filter((page) => page.category === categories[tabValue - 1])
  }

  // Count active permissions
  const countActivePermissions = () => {
    let count = 0
    permissions.forEach((perm) => {
      if (perm.create) count++
      if (perm.edit) count++
      if (perm.view) count++
      if (perm.delete) count++
    })
    return count
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Create role object
    const roleData = {
      username,
      password,
      role,
      employeeName,
      createdBy,
      status,
      permissions,
    }

    // Show success message or redirect
    alert("Role created successfully!")
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
              <Shield sx={{ fontSize: 28 }} />
              <Typography variant="h5" component="h1">
                Create Role
              </Typography>
              <Chip label="RBAC" size="small" color="secondary" sx={{ ml: "auto !important", fontWeight: "bold" }} />
            </Stack>
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              Define user roles and permissions for your garage management system
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <CardContent sx={{ pt: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <LockPerson sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="role-label">Role Type</InputLabel>
                    <Select
                      labelId="role-label"
                      value={role}
                      label="Role Type"
                      onChange={(e) => setRole(e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {roleIcons[selected]}
                          <Box sx={{ ml: 1 }}>{selected.charAt(0).toUpperCase() + selected.slice(1)}</Box>
                        </Box>
                      )}
                    >
                      <MenuItem value="admin">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {roleIcons.admin}
                          <Box sx={{ ml: 1 }}>Admin</Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="manager">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {roleIcons.manager}
                          <Box sx={{ ml: 1 }}>Manager</Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="employee">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {roleIcons.employee}
                          <Box sx={{ ml: 1 }}>Employee</Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="user">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {roleIcons.user}
                          <Box sx={{ ml: 1 }}>User</Box>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Employee Name"
                    variant="outlined"
                    fullWidth
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Created By"
                    variant="outlined"
                    fullWidth
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      value={status}
                      label="Status"
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value="active">
                        <Chip label="Active" size="small" color="success" variant="outlined" />
                      </MenuItem>
                      <MenuItem value="inactive">
                        <Chip label="Inactive" size="small" color="error" variant="outlined" />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Security color="primary" />
                  <Typography variant="h6">Permission Management</Typography>
                  <Tooltip title="Learn about permissions">
                    <IconButton size="small" onClick={() => setShowHelp(!showHelp)}>
                      <HelpOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Badge
                  badgeContent={countActivePermissions()}
                  color="primary"
                  max={99}
                  sx={{ "& .MuiBadge-badge": { fontSize: "0.8rem", height: "22px", minWidth: "22px" } }}
                >
                  <FormControlLabel
                    control={<Switch checked={selectAll} onChange={handleSelectAll} color="primary" />}
                    label="Select All Permissions"
                  />
                </Badge>
              </Box>

              <Fade in={showHelp}>
                <Alert severity="info" sx={{ mb: 3 }} onClose={() => setShowHelp(false)}>
                  <AlertTitle>Permission Guide</AlertTitle>
                  <ul style={{ paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
                    <li>
                      <strong>Create:</strong> Allows adding new records
                    </li>
                    <li>
                      <strong>Edit:</strong> Allows modifying existing records
                    </li>
                    <li>
                      <strong>View:</strong> Allows viewing records (minimum required)
                    </li>
                    <li>
                      <strong>Delete:</strong> Allows removing records (use with caution)
                    </li>
                  </ul>
                  Best practice: Grant only the permissions needed for each role.
                </Alert>
              </Fade>

              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="permission categories"
                  sx={{
                    "& .MuiTab-root": {
                      minHeight: "48px",
                      fontWeight: "medium",
                    },
                    "& .Mui-selected": {
                      fontWeight: "bold",
                    },
                  }}
                >
                  <Tab
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <span>All Pages</span>
                        <Chip
                          label={pageAccessList.length}
                          size="small"
                          sx={{ ml: 1, height: "20px", fontSize: "0.7rem" }}
                        />
                      </Box>
                    }
                    {...a11yProps(0)}
                  />
                  {categories.map((category, index) => {
                    const count = pageAccessList.filter((page) => page.category === category).length
                    return (
                      <Tab
                        key={category}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <span>{category}</span>
                            <Chip label={count} size="small" sx={{ ml: 1, height: "20px", fontSize: "0.7rem" }} />
                          </Box>
                        }
                        {...a11yProps(index + 1)}
                      />
                    )
                  })}
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={tabValue}>
                <TableContainer
                  component={Paper}
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    "& .MuiTableCell-root": {
                      padding: "10px 16px",
                    },
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "primary.light" }}>
                        <TableCell padding="checkbox" align="center">
                          <Typography variant="subtitle2">All</Typography>
                        </TableCell>
                        <TableCell width={50} align="center">
                          <Typography variant="subtitle2">#</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">Page Access</Typography>
                        </TableCell>
                        <TableCell width={100} align="center">
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Tooltip title="Create Permission">
                              <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center" }}>
                                {actionIcons.create}
                                <span style={{ marginLeft: "4px" }}>Create</span>
                              </Typography>
                            </Tooltip>
                            <Checkbox
                              size="small"
                              color="primary"
                              icon={<CheckBoxOutlineBlank fontSize="small" />}
                              checkedIcon={<CheckBox fontSize="small" />}
                              onChange={(e) => handleColumnSelectAll("create", e.target.checked)}
                              checked={permissions.every((p) => p.create)}
                            />
                          </Box>
                        </TableCell>
                        <TableCell width={100} align="center">
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Tooltip title="Edit Permission">
                              <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center" }}>
                                {actionIcons.edit}
                                <span style={{ marginLeft: "4px" }}>Edit</span>
                              </Typography>
                            </Tooltip>
                            <Checkbox
                              size="small"
                              color="primary"
                              icon={<CheckBoxOutlineBlank fontSize="small" />}
                              checkedIcon={<CheckBox fontSize="small" />}
                              onChange={(e) => handleColumnSelectAll("edit", e.target.checked)}
                              checked={permissions.every((p) => p.edit)}
                            />
                          </Box>
                        </TableCell>
                        <TableCell width={100} align="center">
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Tooltip title="View Permission">
                              <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center" }}>
                                {actionIcons.view}
                                <span style={{ marginLeft: "4px" }}>View</span>
                              </Typography>
                            </Tooltip>
                            <Checkbox
                              size="small"
                              color="primary"
                              icon={<CheckBoxOutlineBlank fontSize="small" />}
                              checkedIcon={<CheckBox fontSize="small" />}
                              onChange={(e) => handleColumnSelectAll("view", e.target.checked)}
                              checked={permissions.every((p) => p.view)}
                            />
                          </Box>
                        </TableCell>
                        <TableCell width={100} align="center">
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Tooltip title="Delete Permission">
                              <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center" }}>
                                {actionIcons.delete}
                                <span style={{ marginLeft: "4px" }}>Delete</span>
                              </Typography>
                            </Tooltip>
                            <Checkbox
                              size="small"
                              color="primary"
                              icon={<CheckBoxOutlineBlank fontSize="small" />}
                              checkedIcon={<CheckBox fontSize="small" />}
                              onChange={(e) => handleColumnSelectAll("delete", e.target.checked)}
                              checked={permissions.every((p) => p.delete)}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFilteredPages().map((page, index) => {
                        const permission = permissions.find((p) => p.pageId === page.id)
                        const isAllSelected =
                          permission.create && permission.edit && permission.view && permission.delete

                        return (
                          <TableRow
                            key={page.id}
                            sx={{
                              "&:nth-of-type(odd)": { bgcolor: "rgba(0, 0, 0, 0.02)" },
                              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                              transition: "background-color 0.2s",
                            }}
                          >
                            <TableCell padding="checkbox" align="center">
                              <Checkbox
                                size="small"
                                color="primary"
                                checked={isAllSelected}
                                onChange={(e) => handleRowSelectAll(page.id, e.target.checked)}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={index + 1} size="small" variant="outlined" sx={{ minWidth: "28px" }} />
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {page.name}
                                </Typography>
                                <Chip
                                  label={page.category}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  sx={{ mt: 0.5, height: "20px", fontSize: "0.7rem" }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                size="small"
                                color="success"
                                checked={permission.create}
                                onChange={(e) => handlePermissionChange(page.id, "create", e.target.checked)}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                size="small"
                                color="info"
                                checked={permission.edit}
                                onChange={(e) => handlePermissionChange(page.id, "edit", e.target.checked)}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                size="small"
                                color="primary"
                                checked={permission.view}
                                onChange={(e) => handlePermissionChange(page.id, "view", e.target.checked)}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                size="small"
                                color="error"
                                checked={permission.delete}
                                onChange={(e) => handlePermissionChange(page.id, "delete", e.target.checked)}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </CardContent>

            <Divider />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 3,
                bgcolor: "grey.50",
              }}
            >
              <Button variant="outlined" color="inherit" sx={{ px: 3 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Shield />}
                sx={{
                  px: 4,
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
                }}
              >
                Create Role
              </Button>
            </Box>
          </form>
        </Card>

        <Card elevation={6} sx={{ mt: 4 }}>
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
              <Typography variant="h5" component="h2">
                Role Management Tips
              </Typography>
            </Stack>
          </Box>

          <CardContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Alert
                  severity="success"
                  variant="outlined"
                  icon={<CheckCircle fontSize="inherit" />}
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    borderWidth: 2,
                    "& .MuiAlert-icon": {
                      color: "success.main",
                    },
                  }}
                >
                  <AlertTitle sx={{ fontWeight: "bold" }}>Best Practices</AlertTitle>
                  <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                    <li>Follow the principle of least privilege</li>
                    <li>Regularly audit role permissions</li>
                    <li>Create roles based on job functions</li>
                    <li>Test roles before assigning to users</li>
                  </ul>
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <Alert
                  severity="warning"
                  variant="outlined"
                  icon={<Warning fontSize="inherit" />}
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    borderWidth: 2,
                    "& .MuiAlert-icon": {
                      color: "warning.main",
                    },
                  }}
                >
                  <AlertTitle sx={{ fontWeight: "bold" }}>Security Warnings</AlertTitle>
                  <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                    <li>Never assign admin roles unnecessarily</li>
                    <li>Avoid overlapping permissions between roles</li>
                    <li>Revoke permissions when no longer needed</li>
                    <li>Document all role changes for audit purposes</li>
                  </ul>
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  )
}

