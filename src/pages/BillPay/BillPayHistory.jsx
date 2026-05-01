/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Divider,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
  LocalAtm as LocalAtmIcon,
  Phone as PhoneIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { FaFileInvoiceDollar, FaHistory, FaCalendarAlt } from "react-icons/fa"
import { toast } from "react-toastify"
import dayjs from "dayjs"

// Mock data for demonstration
const mockPaymentHistory = [
  {
    id: "PAY-001",
    billNumber: "BILL-2023-001",
    supplierName: "ABC Electronics",
    supplierLogo: null,
    amount: 1250.0,
    paymentDate: "2023-03-15",
    dueDate: "2023-03-30",
    paymentMethod: "Credit Card",
    paymentStatus: "completed",
    category: "Electronics",
    transactionId: "TXN-78945612",
    description: "Payment for quarterly electronics supplies",
  },
  {
    id: "PAY-002",
    billNumber: "BILL-2023-002",
    supplierName: "Office Supplies Co.",
    supplierLogo: null,
    amount: 450.75,
    paymentDate: "2023-03-10",
    dueDate: "2023-03-25",
    paymentMethod: "Bank Transfer",
    paymentStatus: "completed",
    category: "Office Supplies",
    transactionId: "TXN-45678912",
    description: "Monthly office supplies",
  },
  {
    id: "PAY-003",
    billNumber: "BILL-2023-003",
    supplierName: "Internet Services Ltd",
    supplierLogo: null,
    amount: 89.99,
    paymentDate: "2023-03-05",
    dueDate: "2023-03-15",
    paymentMethod: "bKash",
    paymentStatus: "completed",
    category: "Utilities",
    transactionId: "TXN-12345678",
    description: "Monthly internet service payment",
  },
  {
    id: "PAY-004",
    billNumber: "BILL-2023-004",
    supplierName: "Furniture Depot",
    supplierLogo: null,
    amount: 3500.0,
    paymentDate: "2023-02-28",
    dueDate: "2023-03-15",
    paymentMethod: "Check",
    paymentStatus: "pending",
    category: "Furniture",
    transactionId: "TXN-98765432",
    description: "Office furniture purchase",
  },
  {
    id: "PAY-005",
    billNumber: "BILL-2023-005",
    supplierName: "Marketing Agency",
    supplierLogo: null,
    amount: 2000.0,
    paymentDate: "2023-02-25",
    dueDate: "2023-03-10",
    paymentMethod: "Credit Card",
    paymentStatus: "failed",
    category: "Marketing",
    transactionId: "TXN-45612378",
    description: "Monthly marketing services",
  },
  {
    id: "PAY-006",
    billNumber: "BILL-2023-006",
    supplierName: "Cleaning Services",
    supplierLogo: null,
    amount: 350.0,
    paymentDate: "2023-02-20",
    dueDate: "2023-03-05",
    paymentMethod: "Nagad",
    paymentStatus: "completed",
    category: "Services",
    transactionId: "TXN-78912345",
    description: "Weekly office cleaning service",
  },
  {
    id: "PAY-007",
    billNumber: "BILL-2023-007",
    supplierName: "Software Solutions",
    supplierLogo: null,
    amount: 1200.0,
    paymentDate: "2023-02-15",
    dueDate: "2023-03-01",
    paymentMethod: "Bank Transfer",
    paymentStatus: "completed",
    category: "Software",
    transactionId: "TXN-36925814",
    description: "Annual software license renewal",
  },
  {
    id: "PAY-008",
    billNumber: "BILL-2023-008",
    supplierName: "Electricity Company",
    supplierLogo: null,
    amount: 275.5,
    paymentDate: "2023-02-10",
    dueDate: "2023-02-25",
    paymentMethod: "bKash",
    paymentStatus: "completed",
    category: "Utilities",
    transactionId: "TXN-14725836",
    description: "Monthly electricity bill",
  },
]

// Summary data for dashboard cards
const summaryData = {
  totalPayments: 8,
  totalAmount: 9116.24,
  pendingPayments: 1,
  completedPayments: 6,
  failedPayments: 1,
  thisMonthAmount: 5640.74,
  lastMonthAmount: 3475.5,
}

const BillPayHistory = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterMethod, setFilterMethod] = useState("all")
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  })
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Categories and payment methods for filters
  const categories = ["Utilities", "Office Supplies", "Electronics", "Furniture", "Marketing", "Services", "Software"]
  const paymentMethods = ["Credit Card", "Bank Transfer", "bKash", "Nagad", "Check"]
  const statuses = ["completed", "pending", "failed"]

  // Handle menu open
  const handleMenuOpen = (event, payment) => {
    setAnchorEl(event.currentTarget)
    setSelectedPayment(payment)
  }

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)

    // Filter based on tab
    if (newValue === 0) {
      setFilterStatus("all")
    } else if (newValue === 1) {
      setFilterStatus("completed")
    } else if (newValue === 2) {
      setFilterStatus("pending")
    } else if (newValue === 3) {
      setFilterStatus("failed")
    }
  }

  // Handle view details
  const handleViewDetails = () => {
    setOpenDetailDialog(true)
    handleMenuClose()
  }

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDetailDialog(false)
  }

  // Handle print receipt
  const handlePrintReceipt = () => {
    toast.info("Printing receipt...")
    handleMenuClose()
  }

  // Handle download receipt
  const handleDownloadReceipt = () => {
    toast.success("Receipt downloaded successfully")
    handleMenuClose()
  }

  // Handle email receipt
  const handleEmailReceipt = () => {
    toast.info("Sending receipt via email...")
    handleMenuClose()
  }

  // Handle delete payment
  const handleDeletePayment = () => {
    toast.warning("This feature is not implemented yet")
    handleMenuClose()
  }

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  // Handle category filter
  const handleCategoryFilter = (event) => {
    setFilterCategory(event.target.value)
    setCurrentPage(1)
  }

  // Handle status filter
  const handleStatusFilter = (event) => {
    setFilterStatus(event.target.value)
    setCurrentPage(1)
  }

  // Handle payment method filter
  const handleMethodFilter = (event) => {
    setFilterMethod(event.target.value)
    setCurrentPage(1)
  }

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setCurrentPage(1)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMM D, YYYY")
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "failed":
        return "error"
      default:
        return "default"
    }
  }

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Credit Card":
        return <CreditCardIcon />
      case "Bank Transfer":
        return <AccountBalanceIcon />
      case "bKash":
      case "Nagad":
        return <PhoneIcon />
      case "Check":
        return <LocalAtmIcon />
      default:
        return <AttachMoneyIcon />
    }
  }

  // Filter and sort payments
  const filteredPayments = mockPaymentHistory
    .filter((payment) => {
      const matchesSearch =
        payment.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = filterCategory === "all" || payment.category === filterCategory
      const matchesStatus = filterStatus === "all" || payment.paymentStatus === filterStatus
      const matchesMethod = filterMethod === "all" || payment.paymentMethod === filterMethod

      const paymentDate = dayjs(payment.paymentDate)
      const isInDateRange =
        paymentDate.isAfter(dayjs(dateRange.startDate).subtract(1, "day")) &&
        paymentDate.isBefore(dayjs(dateRange.endDate).add(1, "day"))

      return matchesSearch && matchesCategory && matchesStatus && matchesMethod && isInDateRange
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? dayjs(a.paymentDate).diff(dayjs(b.paymentDate))
          : dayjs(b.paymentDate).diff(dayjs(a.paymentDate))
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      } else if (sortBy === "supplier") {
        return sortOrder === "asc"
          ? a.supplierName.localeCompare(b.supplierName)
          : b.supplierName.localeCompare(a.supplierName)
      }
      return 0
    })

  // Paginate payments
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  // Calculate total pages
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage)

  // Simulate loading effect
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [searchTerm, filterCategory, filterStatus, filterMethod, dateRange, sortBy, sortOrder, currentPage, rowsPerPage])

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          p: 2,
          borderRadius: 2,
          background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
          color: "white",
          gap: 2,
        }}
      >
        <FaHistory size={40} color="#fff" />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Payment History
          </Typography>
          <Typography variant="body1">Track and manage all your bill payments</Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Total Payments
                </Typography>
                <Avatar sx={{ bgcolor: "#42A1DA" }}>
                  <FaFileInvoiceDollar />
                </Avatar>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summaryData.totalPayments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(summaryData.totalAmount)} total amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  This Month
                </Typography>
                <Avatar sx={{ bgcolor: "#4CAF50" }}>
                  <FaCalendarAlt />
                </Avatar>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(summaryData.thisMonthAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {summaryData.completedPayments} completed payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Pending
                </Typography>
                <Avatar sx={{ bgcolor: "#FF9800" }}>
                  <AccessTimeIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summaryData.pendingPayments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Awaiting processing
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Failed
                </Typography>
                <Avatar sx={{ bgcolor: "#F44336" }}>
                  <CancelIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {summaryData.failedPayments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Require attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by supplier, bill number or payment ID"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="From Date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="To Date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              Filters
            </Button>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("all")
                setFilterStatus("all")
                setFilterMethod("all")
                setDateRange({
                  startDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
                  endDate: dayjs().format("YYYY-MM-DD"),
                })
                setSortBy("date")
                setSortOrder("desc")
                setCurrentPage(1)
              }}
            >
              Reset
            </Button>
          </Grid>

          {isFilterOpen && (
            <>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select value={filterCategory} onChange={handleCategoryFilter} label="Category">
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Method</InputLabel>
                  <Select value={filterMethod} onChange={handleMethodFilter} label="Payment Method">
                    <MenuItem value="all">All Methods</MenuItem>
                    {paymentMethods.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={filterStatus} onChange={handleStatusFilter} label="Status">
                    <MenuItem value="all">All Statuses</MenuItem>
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                          {sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="supplier">Supplier</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Payments" />
          <Tab label="Completed" />
          <Tab label="Pending" />
          <Tab label="Failed" />
        </Tabs>
      </Paper>

      {/* Payment List */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : paginatedPayments.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No payment records found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        ) : (
          <>
            {paginatedPayments.map((payment, index) => (
              <Box key={payment.id}>
                <Box sx={{ p: 2, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: { xs: "100%", md: "30%" },
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#42A1DA",
                        mr: 2,
                        width: 50,
                        height: 50,
                      }}
                    >
                      {payment.supplierLogo ? (
                        <img src={payment.supplierLogo || "/placeholder.svg"} alt={payment.supplierName} width="100%" />
                      ) : (
                        payment.supplierName.charAt(0)
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {payment.supplierName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {payment.billNumber} • {payment.id}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: { xs: "50%", md: "15%" },
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    <Tooltip title={payment.paymentMethod}>
                      <Avatar
                        sx={{ bgcolor: "background.default", color: "text.primary", mr: 1, width: 30, height: 30 }}
                      >
                        {getPaymentMethodIcon(payment.paymentMethod)}
                      </Avatar>
                    </Tooltip>
                    <Chip label={payment.paymentStatus} size="small" color={getStatusColor(payment.paymentStatus)} />
                  </Box>

                  <Box
                    sx={{
                      width: { xs: "50%", md: "15%" },
                      textAlign: { xs: "right", md: "left" },
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formatCurrency(payment.amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {payment.category}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: { xs: "100%", md: "30%" },
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="body2">
                        <CalendarIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                        Paid: {formatDate(payment.paymentDate)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Due: {formatDate(payment.dueDate)}
                      </Typography>
                    </Box>

                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, payment)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
                {index < paginatedPayments.length - 1 && <Divider />}
              </Box>
            ))}
          </>
        )}
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows</InputLabel>
          <Select value={rowsPerPage?.toString()} onChange={handleRowsPerPageChange} label="Rows">
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="25">25</MenuItem>
            <MenuItem value="50">50</MenuItem>
          </Select>
        </FormControl>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />

        <Typography variant="body2" color="text.secondary">
          Showing {filteredPayments.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * rowsPerPage, filteredPayments.length)} of {filteredPayments.length} entries
        </Typography>
      </Box>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handlePrintReceipt}>
          <PrintIcon fontSize="small" sx={{ mr: 1 }} />
          Print Receipt
        </MenuItem>
        <MenuItem onClick={handleDownloadReceipt}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Download PDF
        </MenuItem>
        <MenuItem onClick={handleEmailReceipt}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
          Email Receipt
        </MenuItem>
        <MenuItem onClick={handleDeletePayment}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Payment Details Dialog */}
      <Dialog open={openDetailDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedPayment && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">Payment Details</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2, position: "relative", overflow: "hidden" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "6px",
                    height: "100%",
                    background: "linear-gradient(to bottom, #42A1DA, #2980b9)",
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Payment Receipt
                  </Typography>
                  <Chip label={selectedPayment.paymentStatus} color={getStatusColor(selectedPayment.paymentStatus)} />
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Supplier Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1">{selectedPayment.supplierName}</Typography>
                      <Typography variant="body2">Category: {selectedPayment.category}</Typography>
                    </Box>

                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Payment Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Payment ID:</strong> {selectedPayment.id}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Bill Number:</strong> {selectedPayment.billNumber}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Payment Method:</strong> {selectedPayment.paymentMethod}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Transaction ID:</strong> {selectedPayment.transactionId}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Dates
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Payment Date:</strong> {formatDate(selectedPayment.paymentDate)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Due Date:</strong> {formatDate(selectedPayment.dueDate)}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Amount Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {formatCurrency(selectedPayment.amount)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2">{selectedPayment.description}</Typography>
              </Paper>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrintReceipt}>
                  Print
                </Button>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadReceipt}>
                  Download
                </Button>
                <Button variant="outlined" startIcon={<EmailIcon />} onClick={handleEmailReceipt}>
                  Email
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default BillPayHistory

