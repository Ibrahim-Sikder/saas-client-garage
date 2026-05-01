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
  Alert,
  AlertTitle,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CategoryIcon from "@mui/icons-material/Category";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import InventoryIcon from "@mui/icons-material/Inventory";

// Mock data for expired products
const expiredProductsData = [
  {
    id: 1,
    product: "ইঞ্জিন অয়েল",
    category: "লুব্রিকেন্টস",
    batch: "BT-2023-001",
    quantity: 15,
    expiryDate: "১৫/০৩/২০২৫",
    daysExpired: 38,
    unitPrice: 250,
    value: 3750,
    supplier: "অটো পার্টস লিমিটেড",
    status: "ডিসপোজাল বাকি",
  },
  {
    id: 2,
    product: "ব্রেক ফ্লুইড",
    category: "ব্রেক সিস্টেম",
    batch: "BT-2023-045",
    quantity: 8,
    expiryDate: "২০/০৩/২০২৫",
    daysExpired: 33,
    unitPrice: 350,
    value: 2800,
    supplier: "অটো পার্টস লিমিটেড",
    status: "ডিসপোজাল বাকি",
  },
  {
    id: 3,
    product: "কুলেন্ট",
    category: "কুলিং সিস্টেম",
    batch: "BT-2023-078",
    quantity: 12,
    expiryDate: "০৫/০৪/২০২৫",
    daysExpired: 17,
    unitPrice: 180,
    value: 2160,
    supplier: "কুলিং টেক",
    status: "ডিসপোজাল করা হয়েছে",
  },
  {
    id: 4,
    product: "পাওয়ার স্টিয়ারিং ফ্লুইড",
    category: "স্টিয়ারিং সিস্টেম",
    batch: "BT-2023-102",
    quantity: 5,
    expiryDate: "১০/০৪/২০২৫",
    daysExpired: 12,
    unitPrice: 450,
    value: 2250,
    supplier: "অটো পার্টস লিমিটেড",
    status: "ডিসপোজাল বাকি",
  },
  {
    id: 5,
    product: "ট্রান্সমিশন ফ্লুইড",
    category: "ট্রান্সমিশন",
    batch: "BT-2023-156",
    quantity: 7,
    expiryDate: "১৮/০৪/২০২৫",
    daysExpired: 4,
    unitPrice: 320,
    value: 2240,
    supplier: "ট্রান্সমিশন পার্টস",
    status: "ডিসপোজাল করা হয়েছে",
  },
  {
    id: 6,
    product: "এসি রেফ্রিজারেন্ট",
    category: "এসি সিস্টেম",
    batch: "BT-2023-189",
    quantity: 3,
    expiryDate: "২২/০৪/২০২৫",
    daysExpired: 0,
    unitPrice: 550,
    value: 1650,
    supplier: "এসি সলিউশনস",
    status: "ডিসপোজাল বাকি",
  },
  {
    id: 7,
    product: "ওয়াইপার ফ্লুইড",
    category: "এক্সটেরিয়র",
    batch: "BT-2023-210",
    quantity: 10,
    expiryDate: "০৫/০৪/২০২৫",
    daysExpired: 17,
    unitPrice: 120,
    value: 1200,
    supplier: "অটো পার্টস লিমিটেড",
    status: "ডিসপোজাল বাকি",
  },
  {
    id: 8,
    product: "গ্রিস",
    category: "লুব্রিকেন্টস",
    batch: "BT-2023-245",
    quantity: 6,
    expiryDate: "১২/০৪/২০২৫",
    daysExpired: 10,
    unitPrice: 200,
    value: 1200,
    supplier: "অটো পার্টস লিমিটেড",
    status: "ডিসপোজাল করা হয়েছে",
  },
];

// Summary data
const summaryData = {
  totalExpiredProducts: expiredProductsData.length,
  totalExpiredItems: expiredProductsData.reduce(
    (sum, item) => sum + item.quantity,
    0
  ),
  totalValue: expiredProductsData.reduce((sum, item) => sum + item.value, 0),
  disposalPending: expiredProductsData.filter(
    (item) => item.status === "ডিসপোজাল বাকি"
  ).length,
  disposalComplete: expiredProductsData.filter(
    (item) => item.status === "ডিসপোজাল করা হয়েছে"
  ).length,
};

export default function ExpiredProductsReportPage() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

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

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    handleFilterClose();
  };

  const filteredData = expiredProductsData.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || item.category === selectedCategory) &&
      (!selectedStatus || item.status === selectedStatus)
  );

  return (
    <Box sx={{ pb: 6, margin:'30px 0px' }}>
      {/* Header with gradient background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
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
          <Typography color="white">
            মেয়াদোত্তীর্ণ প্রোডাক্ট রিপোর্ট
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EventBusyIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                মেয়াদোত্তীর্ণ প্রোডাক্ট রিপোর্ট
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                মেয়াদোত্তীর্ণ সব পণ্যের তালিকা
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Alert */}
      <Alert
        severity="error"
        variant="outlined"
        sx={{
          mb: 4,
          borderRadius: 2,
          borderColor: alpha(theme.palette.error.main, 0.5),
          bgcolor: alpha(theme.palette.error.main, 0.05),
        }}
      >
        <AlertTitle sx={{ fontWeight: "bold" }}>সতর্কতা!</AlertTitle>
        <Typography variant="body2">
          আপনার ইনভেন্টরিতে {summaryData.totalExpiredItems} টি মেয়াদোত্তীর্ণ
          আইটেম রয়েছে, যার মোট মূল্য ৳{" "}
          {summaryData.totalValue.toLocaleString()}। এর মধ্যে{" "}
          {summaryData.disposalPending} টি আইটেমের ডিসপোজাল এখনো বাকি আছে।
          অনুগ্রহ করে দ্রুত ব্যবস্থা নিন।
        </Typography>
      </Alert>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
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
                <CategoryIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  মোট মেয়াদোত্তীর্ণ প্রোডাক্ট
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold">
                {summaryData.totalExpiredProducts}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                <InventoryIcon
                  sx={{ color: theme.palette.error.main, mr: 1 }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  মোট মেয়াদোত্তীর্ণ আইটেম
                </Typography>
              </Box>
              <Typography
                variant="h5"
                component="div"
                fontWeight="bold"
                color={theme.palette.error.main}
              >
                {summaryData.totalExpiredItems}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                <DeleteIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  ডিসপোজাল বাকি
                </Typography>
              </Box>
              <Typography
                variant="h5"
                component="div"
                fontWeight="bold"
                color={theme.palette.warning.main}
              >
                {summaryData.disposalPending}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                  মোট মূল্য
                </Typography>
              </Box>
              <Typography
                variant="h5"
                component="div"
                fontWeight="bold"
                color={theme.palette.error.main}
              >
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
              <MenuItem onClick={() => handleCategorySelect("কুলিং সিস্টেম")}>
                <ListItemText primary="কুলিং সিস্টেম" />
              </MenuItem>
              <MenuItem
                onClick={() => handleCategorySelect("স্টিয়ারিং সিস্টেম")}
              >
                <ListItemText primary="স্টিয়ারিং সিস্টেম" />
              </MenuItem>
              <MenuItem onClick={() => handleCategorySelect("ট্রান্সমিশন")}>
                <ListItemText primary="ট্রান্সমিশন" />
              </MenuItem>
            </Box>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                স্ট্যাটাস দ্বারা ফিল্টার
              </Typography>
              <MenuItem onClick={() => handleStatusSelect(null)}>
                <ListItemText primary="সকল স্ট্যাটাস" />
              </MenuItem>
              <MenuItem onClick={() => handleStatusSelect("ডিসপোজাল বাকি")}>
                <ListItemText primary="ডিসপোজাল বাকি" />
              </MenuItem>
              <MenuItem
                onClick={() => handleStatusSelect("ডিসপোজাল করা হয়েছে")}
              >
                <ListItemText primary="ডিসপোজাল করা হয়েছে" />
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
              <ListItemText primary="মেয়াদোত্তীর্ণ দিন (কম থেকে বেশি)" />
            </MenuItem>
            <MenuItem onClick={handleSortClose}>
              <ListItemIcon>
                <ArrowDownwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="মেয়াদোত্তীর্ণ দিন (বেশি থেকে কম)" />
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

          {selectedStatus && (
            <Chip
              label={`স্ট্যাটাস: ${selectedStatus}`}
              onDelete={() => setSelectedStatus(null)}
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
          <Table sx={{ minWidth: 650 }} aria-label="expired products table">
            <TableHead sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>প্রোডাক্ট</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ক্যাটাগরি</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ব্যাচ</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  পরিমাণ
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  মেয়াদ শেষ তারিখ
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  মেয়াদোত্তীর্ণ দিন
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  মোট মূল্য
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>স্ট্যাটাস</TableCell>
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
                        bgcolor: alpha(theme.palette.error.main, 0.02),
                      },
                      bgcolor:
                        row.daysExpired > 30
                          ? alpha(theme.palette.error.main, 0.05)
                          : "transparent",
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
                    <TableCell>{row.batch}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell>{row.expiryDate}</TableCell>
                    <TableCell align="right">
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: "medium",
                          color:
                            row.daysExpired > 30
                              ? theme.palette.error.main
                              : row.daysExpired > 15
                              ? theme.palette.warning.main
                              : theme.palette.error.light,
                        }}
                      >
                        {row.daysExpired}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">৳ {row.value}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          bgcolor:
                            row.status === "ডিসপোজাল করা হয়েছে"
                              ? alpha(theme.palette.success.main, 0.1)
                              : alpha(theme.palette.warning.main, 0.1),
                          color:
                            row.status === "ডিসপোজাল করা হয়েছে"
                              ? theme.palette.success.main
                              : theme.palette.warning.main,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
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
