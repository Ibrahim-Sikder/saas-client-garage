"use client";
import { useState } from "react";
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
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import InventoryIcon from "@mui/icons-material/Inventory";
import SortIcon from "@mui/icons-material/Sort";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { motion } from "framer-motion";

// Mock data for product stock
const productStockData = [
  {
    id: 1,
    product: "ইঞ্জিন অয়েল",
    category: "লুব্রিকেন্টস",
    stockIn: 50,
    stockOut: 12,
    available: 38,
    unitPrice: 250,
    value: 9500,
    lastUpdated: "২৩/০৪/২০২৫",
  },
  {
    id: 2,
    product: "ব্রেক প্যাড",
    category: "ব্রেক সিস্টেম",
    stockIn: 80,
    stockOut: 45,
    available: 35,
    unitPrice: 400,
    value: 14000,
    lastUpdated: "২২/০৪/২০২৫",
  },
  {
    id: 3,
    product: "এয়ার ফিল্টার",
    category: "ফিল্টার",
    stockIn: 120,
    stockOut: 78,
    available: 42,
    unitPrice: 150,
    value: 6300,
    lastUpdated: "২১/০৪/২০২৫",
  },
  {
    id: 4,
    product: "স্পার্ক প্লাগ",
    category: "ইগনিশন",
    stockIn: 200,
    stockOut: 165,
    available: 35,
    unitPrice: 100,
    value: 3500,
    lastUpdated: "২০/০৪/২০২৫",
  },
  {
    id: 5,
    product: "ব্যাটারি",
    category: "ইলেকট্রিক্যাল",
    stockIn: 50,
    stockOut: 32,
    available: 18,
    unitPrice: 1500,
    value: 27000,
    lastUpdated: "১৯/০৪/২০২৫",
  },
  {
    id: 6,
    product: "হেডলাইট",
    category: "লাইটিং",
    stockIn: 30,
    stockOut: 22,
    available: 8,
    unitPrice: 500,
    value: 4000,
    lastUpdated: "১৮/০৪/২০২৫",
  },
  {
    id: 7,
    product: "টায়ার",
    category: "হুইল এন্ড টায়ার",
    stockIn: 40,
    stockOut: 28,
    available: 12,
    unitPrice: 3000,
    value: 36000,
    lastUpdated: "১৭/০৪/২০২৫",
  },
  {
    id: 8,
    product: "ওয়াইপার ব্লেড",
    category: "এক্সটেরিয়র",
    stockIn: 100,
    stockOut: 67,
    available: 33,
    unitPrice: 100,
    value: 3300,
    lastUpdated: "১৬/০৪/২০২৫",
  },
  {
    id: 9,
    product: "রেডিয়েটর",
    category: "কুলিং সিস্টেম",
    stockIn: 25,
    stockOut: 18,
    available: 7,
    unitPrice: 1500,
    value: 10500,
    lastUpdated: "১৫/০৪/২০২৫",
  },
  {
    id: 10,
    product: "ফুয়েল পাম্প",
    category: "ফুয়েল সিস্টেম",
    stockIn: 15,
    stockOut: 9,
    available: 6,
    unitPrice: 1200,
    value: 7200,
    lastUpdated: "১৪/০৪/২০২৫",
  },
];

// Summary data
const summaryData = {
  totalProducts: productStockData.length,
  totalStockIn: productStockData.reduce((sum, item) => sum + item.stockIn, 0),
  totalStockOut: productStockData.reduce((sum, item) => sum + item.stockOut, 0),
  totalAvailable: productStockData.reduce(
    (sum, item) => sum + item.available,
    0
  ),
  totalValue: productStockData.reduce((sum, item) => sum + item.value, 0),
};

export default function ProductStockReportPage() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleFilterClose();
  };

  const filteredData = productStockData.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || item.category === selectedCategory)
  );

  return (
    <Box sx={{ pb: 6, margin:'30px 0px',  }}>
      {/* Header with gradient background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: 4,
          px: 3,
          borderRadius: "0 0 16px 16px",
          mb: 4,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" sx={{ color: "white" }} />
          }
          aria-label="breadcrumb"
          sx={{ mb: 2, "& .MuiBreadcrumbs-li": { color: "white" } }}
        >
          <Link
            color="inherit"
            href="/dashboard"
            sx={{ color: "white", opacity: 0.8 }}
          >
            ড্যাশবোর্ড
          </Link>
          <Link
            color="inherit"
            href="/reports"
            sx={{ color: "white", opacity: 0.8 }}
          >
            রিপোর্টস
          </Link>
          <Typography color="white">প্রোডাক্ট স্টক রিপোর্ট</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InventoryIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                প্রোডাক্ট স্টক রিপোর্ট
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                প্রোডাক্ট ওয়াইজ ইন/আউট হিসাব ও বর্তমান স্টক
              </Typography>
            </Box>
          </Box>
        </Box>
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
                <CategoryIcon
                  sx={{ color: theme.palette.primary.main, mr: 1 }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  মোট প্রোডাক্ট
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold">
                {summaryData.totalProducts}
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
                <LocalShippingIcon
                  sx={{ color: theme.palette.success.main, mr: 1 }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  মোট স্টক ইন
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold">
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
                <ShoppingCartIcon
                  sx={{ color: theme.palette.error.main, mr: 1 }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  মোট স্টক আউট
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold">
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
                <WarehouseIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  মোট অবশিষ্ট
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold">
                {summaryData.totalAvailable}
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
                  মোট মূল্য
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold">
                ৳ {summaryData.totalValue.toLocaleString()}
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
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
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
                তারিখ দ্বারা ফিল্টার
              </Typography>
              <Box sx={{ mb: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="শুরুর তারিখ"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: { mb: 1 },
                      },
                    }}
                  />
                  <DatePicker
                    label="শেষের তারিখ"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }}>
                ফিল্টার প্রয়োগ করুন
              </Button>
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
              <ListItemText primary="স্টক (কম থেকে বেশি)" />
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <ListItemIcon>
                <ArrowDownwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="স্টক (বেশি থেকে কম)" />
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <ListItemIcon>
                <ArrowUpwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="মূল্য (কম থেকে বেশি)" />
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <ListItemIcon>
                <ArrowDownwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="মূল্য (বেশি থেকে কম)" />
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
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="রিফ্রেশ">
            <IconButton
              size="small"
              sx={{
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
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
          <Table sx={{ minWidth: 650 }} aria-label="product stock table">
            <TableHead
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>প্রোডাক্ট</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ক্যাটাগরি</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  স্টক ইন
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  স্টক আউট
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  অবশিষ্ট
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ইউনিট মূল্য
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  মোট মূল্য
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>আপডেট তারিখ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
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
                    <TableCell align="right">{row.stockIn}</TableCell>
                    <TableCell align="right">{row.stockOut}</TableCell>
                    <TableCell align="right">
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: "medium",
                          color:
                            row.available < 10
                              ? theme.palette.warning.main
                              : theme.palette.success.main,
                        }}
                      >
                        {row.available}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">৳ {row.unitPrice}</TableCell>
                    <TableCell align="right">৳ {row.value}</TableCell>
                    <TableCell>{row.lastUpdated}</TableCell>
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
  );
}
