"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
  TablePagination,
  Divider,
} from "@mui/material"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import SortIcon from "@mui/icons-material/Sort"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import PrintIcon from "@mui/icons-material/Print"
import RefreshIcon from "@mui/icons-material/Refresh"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import ArticleIcon from "@mui/icons-material/Article"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { motion } from "framer-motion"

// Mock data for daily stock movement
const stockMovementData = [
  {
    id: 1,
    product: "ইঞ্জিন অয়েল",
    category: "লুব্রিকেন্টস",
    type: "স্টক ইন",
    quantity: 20,
    source: "সাপ্লায়ার: অটো পার্টস লিমিটেড",
    reference: "PO-2025-042",
    time: "১০:১৫ AM",
    user: "আব্দুল করিম",
  },
  {
    id: 2,
    product: "ব্রেক প্যাড",
    category: "ব্রেক সিস্টেম",
    type: "স্টক আউট",
    quantity: 4,
    source: "সার্ভিস: #SV-2025-156",
    reference: "SV-2025-156",
    time: "১১:৩০ AM",
    user: "মোহাম্মদ আলী",
  },
  {
    id: 3,
    product: "এয়ার ফিল্টার",
    category: "ফিল্টার",
    type: "স্টক ইন",
    quantity: 15,
    source: "সাপ্লায়ার: ফিল্টার সাপ্লাই কোং",
    reference: "PO-2025-043",
    time: "১২:০০ PM",
    user: "আব্দুল করিম",
  },
  {
    id: 4,
    product: "স্পার্ক প্লাগ",
    category: "ইগনিশন",
    type: "স্টক আউট",
    quantity: 8,
    source: "সার্ভিস: #SV-2025-157",
    reference: "SV-2025-157",
    time: "০১:১৫ PM",
    user: "মোহাম্মদ আলী",
  },
  {
    id: 5,
    product: "ব্যাটারি",
    category: "ইলেকট্রিক্যাল",
    type: "স্টক ইন",
    quantity: 5,
    source: "সাপ্লায়ার: পাওয়ার সলিউশনস",
    reference: "PO-2025-044",
    time: "০২:৩০ PM",
    user: "আব্দুল করিম",
  },
  {
    id: 6,
    product: "হেডলাইট",
    category: "লাইটিং",
    type: "স্টক আউট",
    quantity: 2,
    source: "সার্ভিস: #SV-2025-158",
    reference: "SV-2025-158",
    time: "০৩:৪৫ PM",
    user: "মোহাম্মদ আলী",
  },
  {
    id: 7,
    product: "টায়ার",
    category: "হুইল এন্ড টায়ার",
    type: "স্টক ইন",
    quantity: 10,
    source: "সাপ্লায়ার: টায়ার হাউস",
    reference: "PO-2025-045",
    time: "০৪:০০ PM",
    user: "আব্দুল করিম",
  },
  {
    id: 8,
    product: "ওয়াইপার ব্লেড",
    category: "এক্সটেরিয়র",
    type: "স্টক আউট",
    quantity: 5,
    source: "সার্ভিস: #SV-2025-159",
    reference: "SV-2025-159",
    time: "০৫:১৫ PM",
    user: "মোহাম্মদ আলী",
  },
]

// Summary data
const summaryData = {
  totalMovements: stockMovementData.length,
  totalStockIn: stockMovementData.filter((item) => item.type === "স্টক ইন").length,
  totalStockOut: stockMovementData.filter((item) => item.type === "স্টক আউট").length,
  totalItemsIn: stockMovementData
    .filter((item) => item.type === "স্টক ইন")
    .reduce((sum, item) => sum + item.quantity, 0),
  totalItemsOut: stockMovementData
    .filter((item) => item.type === "স্টক আউট")
    .reduce((sum, item) => sum + item.quantity, 0),
}

export default function DailyStockMovementReportPage() {
  const theme = useTheme()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [exportAnchorEl, setExportAnchorEl] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleSortClose = () => {
    setSortAnchorEl(null)
  }

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget)
  }

  const handleExportClose = () => {
    setExportAnchorEl(null)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    handleFilterClose()
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    handleFilterClose()
  }

  const filteredData = stockMovementData.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || item.category === selectedCategory) &&
      (!selectedType || item.type === selectedType),
  )

  return (
    <Box sx={{ pb: 6, margin:'30px 0px' }}>
      {/* Header with gradient background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
          color: "white",
          py: 4,
          px: 3,
          borderRadius: "0 0 16px 16px",
          mb: 4,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: "white" }} />}
          aria-label="breadcrumb"
          sx={{ mb: 2, "& .MuiBreadcrumbs-li": { color: "white" } }}
        >
          <Link color="inherit" href="/dashboard" sx={{ color: "white", opacity: 0.8 }}>
            ড্যাশবোর্ড
          </Link>
          <Link color="inherit" href="/reports" sx={{ color: "white", opacity: 0.8 }}>
            রিপোর্টস
          </Link>
          <Typography color="white">দৈনিক স্টক মুভমেন্ট</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarTodayIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                দৈনিক স্টক মুভমেন্ট
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                নির্দিষ্ট দিনে কোন পণ্য ইন/আউট হয়েছে
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Date Selector */}
      <Box sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                তারিখ নির্বাচন করুন
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                যে তারিখের স্টক মুভমেন্ট দেখতে চান সেই তারিখ নির্বাচন করুন
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="তারিখ"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: theme.palette.info.main, "&:hover": { bgcolor: theme.palette.info.dark } }}
              >
                রিপোর্ট দেখুন
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 2,
                background: "white",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CalendarTodayIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  মোট মুভমেন্ট
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold">
                {summaryData.totalMovements}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 2,
                background: "white",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocalShippingIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  স্টক ইন
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold" color={theme.palette.success.main}>
                {summaryData.totalStockIn}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 2,
                background: "white",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ShoppingCartIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  স্টক আউট
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold" color={theme.palette.warning.main}>
                {summaryData.totalStockOut}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 2,
                background: "white",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  মোট আইটেম ইন
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold" color={theme.palette.success.main}>
                {summaryData.totalItemsIn}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 2,
                background: "white",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  মোট আইটেম আউট
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold" color={theme.palette.warning.main}>
                {summaryData.totalItemsOut}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            placeholder="প্রোডাক্ট সার্চ করুন..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            size="small"
            sx={{ borderRadius: 1 }}
          >
            ফিল্টার
          </Button>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            PaperProps={{
              sx: { width: 250, maxHeight: 400, mt: 1 },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                ক্যাটাগরি দ্বারা ফিল্টার
              </Typography>
              <MenuItem onClick={() => handleCategorySelect(null)}>
                <ListItemText primary="সকল ক্যাটাগরি" />
              </MenuItem>
              <MenuItem onClick={() => handleCategorySelect("লুব্রিকেন্টস")}>
                <ListItemText primary="লুব্রিকেন্টস" />
              </MenuItem>
              <MenuItem onClick={() => handleCategorySelect("ব্রেক সিস্টেম")}>
                <ListItemText primary="ব্রেক সিস্টেম" />
              </MenuItem>
              <MenuItem onClick={() => handleCategorySelect("ফিল্টার")}>
                <ListItemText primary="ফিল্টার" />
              </MenuItem>
              <MenuItem onClick={() => handleCategorySelect("ইগনিশন")}>
                <ListItemText primary="ইগনিশন" />
              </MenuItem>
              <MenuItem onClick={() => handleCategorySelect("ইলেকট্রিক্যাল")}>
                <ListItemText primary="ইলেকট্রিক্যাল" />
              </MenuItem>
            </Box>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                টাইপ দ্বারা ফিল্টার
              </Typography>
              <MenuItem onClick={() => handleTypeSelect(null)}>
                <ListItemText primary="সকল টাইপ" />
              </MenuItem>
              <MenuItem onClick={() => handleTypeSelect("স্টক ইন")}>
                <ListItemText primary="স্টক ইন" />
              </MenuItem>
              <MenuItem onClick={() => handleTypeSelect("স্টক আউট")}>
                <ListItemText primary="স্টক আউট" />
              </MenuItem>
            </Box>
          </Menu>

          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={handleSortClick}
            size="small"
            sx={{ borderRadius: 1 }}
          >
            সর্ট
          </Button>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortClose}
            PaperProps={{
              sx: { width: 200, maxHeight: 300, mt: 1 },
            }}
          >
            <MenuItem onClick={handleSortClose}>
              <ListItemIcon>
                <ArrowUpwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="নাম (A-Z)" />
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <ListItemIcon>
                <ArrowDownwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="নাম (Z-A)" />
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <ListItemIcon>
                <ArrowUpwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="সময় (আগে থেকে পরে)" />
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <ListItemIcon>
                <ArrowDownwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="সময় (পরে থেকে আগে)" />
            </MenuItem>
          </Menu>

          {selectedCategory && (
            <Chip
              label={`ক্যাটাগরি: ${selectedCategory}`}
              onDelete={() => setSelectedCategory(null)}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}

          {selectedType && (
            <Chip
              label={`টাইপ: ${selectedType}`}
              onDelete={() => setSelectedType(null)}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="রিফ্রেশ">
            <IconButton size="small" sx={{ border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportClick}
            size="small"
            sx={{ borderRadius: 1 }}
          >
            এক্সপোর্ট
          </Button>
          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={handleExportClose}
            PaperProps={{
              sx: { width: 150, mt: 1 },
            }}
          >
            <MenuItem onClick={handleExportClose}>
              <ListItemIcon>
                <PictureAsPdfIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="PDF" />
            </MenuItem>
            <MenuItem onClick={handleExportClose}>
              <ListItemIcon>
                <ArticleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Excel" />
            </MenuItem>
            <MenuItem onClick={handleExportClose}>
              <ListItemIcon>
                <PrintIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="প্রিন্ট" />
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Data Table */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="stock movement table">
            <TableHead sx={{ bgcolor: alpha(theme.palette.info.main, 0.05) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>প্রোডাক্ট</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ক্যাটাগরি</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>টাইপ</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  পরিমাণ
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>সোর্স/ডেস্টিনেশন</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>রেফারেন্স</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>সময়</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ইউজার</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: alpha(theme.palette.info.main, 0.02) },
                    bgcolor:
                      row.type === "স্টক ইন"
                        ? alpha(theme.palette.success.main, 0.05)
                        : alpha(theme.palette.warning.main, 0.05),
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.product}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.category}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.type}
                      size="small"
                      sx={{
                        bgcolor:
                          row.type === "স্টক ইন"
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.warning.main, 0.1),
                        color: row.type === "স্টক ইন" ? theme.palette.success.main : theme.palette.warning.main,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell>{row.source}</TableCell>
                  <TableCell>{row.reference}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="প্রতি পেজে রো"
        />
      </Card>
    </Box>
  )
}
