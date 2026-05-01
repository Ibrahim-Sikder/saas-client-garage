/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Tooltip,
  Badge,
  Fade,
  Zoom,
  Alert,
  CircularProgress,
  Backdrop,
  Drawer,
  TextField,
  InputAdornment,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  InventoryOutlined,
  ShoppingCartOutlined,
  LocalShippingOutlined,
  WarningAmberOutlined,
  TrendingDownOutlined,
  AddCircleOutlineOutlined,
  MoreVertOutlined,
  PrintOutlined,
  QrCodeOutlined,
  FilterListOutlined,
  SearchOutlined,
  RefreshOutlined,
  DownloadOutlined,
  NotificationsOutlined,
  DashboardOutlined,
  SettingsOutlined,
  HelpOutlineOutlined,
  CloseOutlined,
  TrendingUpOutlined,
  BarChartOutlined,
  PieChartOutlined,
  TimelineOutlined,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  CategoryOutlined,
  StorefrontOutlined,
  AccountBalanceWalletOutlined,
  SpeedOutlined,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { useGetAllStocksQuery } from "../../redux/api/stocksApi";
import {
  AnimatedAvatar,
  AnimatedChip,
  EnhancedProgress,
  GradientBox,
  GradientButton,
  GradientCard,
  StyledBadge,
  StyledCardHeader,
  StyledTableHead,
  StyledTableRow,
} from "../../utils/customStyle";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6B6B",
];

export default function InventoryDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
  const [period, setPeriod] = useState("this-month");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const queryParams = { page: currentPage, limit: 100, searchTerm: searchTerm };
  const {
    data: stockData,
    isLoading: productLoading,
    refetch,
  } = useGetAllStocksQuery(queryParams);
  const processedData = useMemo(() => {
    if (!stockData?.data) {
      return {
        totalProducts: 0,
        totalCategories: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        totalInventoryValue: 0,
        totalPurchaseValue: 0,
        totalSellingValue: 0,
        categoryDistribution: [],
        lowStockProducts: [],
        topSellingProducts: [],
        stockStatusByCategory: [],
        recentActivities: [],
      };
    }

    const stocks = stockData.data;
    const totalProducts = stocks.length;

    // Calculate categories
    const categories = new Set();
    const brands = new Set();
    let totalInventoryValue = 0;
    let totalPurchaseValue = 0;
    let totalSellingValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    // Category distribution for pie chart
    const categoryMap = new Map();

    // Process each stock item
    const processedStocks = stocks.map((stock) => {
      const product = stock.product || {};
      const currentStock = stock.stock || 0;
      const categoryName =
        product.category?.main_category || product.category?.name || "Others";
      const brandName =
        product.brand?.brand || product.brand?.name || "Unknown Brand";

      categories.add(categoryName);
      brands.add(brandName);

      // Calculate values
      totalPurchaseValue += stock.totalPurchaseValue || 0;
      totalSellingValue += stock.totalSellingValue || 0;
      totalInventoryValue +=
        (stock.avgSellingPrice || stock.avgPurchasePrice || 0) * currentStock;

      // Stock status
      if (currentStock === 0) {
        outOfStockCount++;
      } else if (currentStock <= 5) {
        lowStockCount++;
      }

      // Category distribution
      if (categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, categoryMap.get(categoryName) + 1);
      } else {
        categoryMap.set(categoryName, 1);
      }

      return {
        ...stock,
        categoryName,
        brandName,
        currentStock,
        status:
          currentStock === 0
            ? "out-of-stock"
            : currentStock <= 5
              ? "low-stock"
              : "in-stock",
      };
    });

    // Create category distribution for pie chart
    const categoryDistribution = Array.from(categoryMap.entries()).map(
      ([name, count]) => ({
        name,
        value: Math.round((count / totalProducts) * 100),
        count,
      })
    );

    // Get low stock products
    const lowStockProducts = processedStocks
      .filter((stock) => stock.currentStock <= 10)
      .sort((a, b) => a.currentStock - b.currentStock)
      .slice(0, 10);

    // Create mock top selling products (since we don't have sales data)
    const topSellingProducts = processedStocks
      .filter((stock) => stock.outQuantity > 0)
      .sort((a, b) => b.outQuantity - a.outQuantity)
      .slice(0, 5)
      .map((stock) => ({
        ...stock,
        salesCount: stock.outQuantity,
        totalValue: (stock.avgSellingPrice || 0) * stock.outQuantity,
      }));

    // Stock status by category
    const stockStatusByCategory = Array.from(categories).map((category) => {
      const categoryStocks = processedStocks.filter(
        (stock) => stock.categoryName === category
      );
      const totalCategoryStock = categoryStocks.reduce(
        (sum, stock) => sum + stock.currentStock,
        0
      );
      const maxPossibleStock = categoryStocks.length * 100;
      const percentage =
        maxPossibleStock > 0
          ? Math.round((totalCategoryStock / maxPossibleStock) * 100)
          : 0;

      return {
        category,
        percentage,
        status:
          percentage > 70 ? "good" : percentage > 40 ? "warning" : "critical",
        totalItems: categoryStocks.length,
        totalStock: totalCategoryStock,
      };
    });

    // Recent activities (mock data based on stock movements)
    const recentActivities = processedStocks
      .filter((stock) => stock.inQuantity > 0 || stock.outQuantity > 0)
      .slice(0, 5)
      .map((stock, index) => ({
        id: index,
        type: stock.inQuantity > stock.outQuantity ? "purchase" : "issue",
        product: stock.product?.product_name || "Unknown Product",
        quantity: Math.max(stock.inQuantity, stock.outQuantity),
        time: `${index + 1} hours ago`,
      }));

    return {
      totalProducts,
      totalCategories: categories.size,
      totalBrands: brands.size,
      lowStockItems: lowStockCount,
      outOfStockItems: outOfStockCount,
      totalInventoryValue,
      totalPurchaseValue,
      totalSellingValue,
      categoryDistribution,
      lowStockProducts,
      topSellingProducts,
      stockStatusByCategory,
      recentActivities,
      processedStocks,
    };
  }, [stockData]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
      setSnackbar({
        open: true,
        message: "Dashboard refreshed successfully",
        severity: "info",
      });
    }, 1000);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleFilterDrawerToggle = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    setNotificationCount(0);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddProductDialogOpen = () => {
    setAddProductDialogOpen(true);
  };

  const handleAddProductDialogClose = () => {
    setAddProductDialogOpen(false);
  };

  const handleAddProduct = () => {
    setAddProductDialogOpen(false);
    setSnackbar({
      open: true,
      message: "Product added successfully",
      severity: "success",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isLoading = productLoading || loading;

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.default,
          0.9
        )}, ${alpha(
          theme.palette.background.paper,
          0.8
        )}), url('/placeholder.svg?height=1080&width=1920') no-repeat center center`,
        backgroundSize: "cover",
        minHeight: "100vh",
        p: { xs: 0, md: 2 },
        borderRadius: 2,
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Backdrop>

      <Fade in={!isLoading} timeout={800}>
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-2 mt-3">
            <div>
              <h3
                className="text-xl md:text-3xl font-bold inline-block mb-2"
                style={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <DashboardOutlined className="mr-1 align-middle" sx={{ color: "#0088FE" }} />
                Inventory Dashboard
              </h3>
              <p className="text-sm md:text-base text-subtitle text-gray-500">
                Last Updated: Today, {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <TextField
                placeholder="Search..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    "&:hover": {
                      boxShadow: `0 0 0 1px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                    },
                  },
                }}
                sx={{ width: { xs: "100%", sm: 220 } }}
              />

              <Tooltip title="Filter">
                <IconButton
                  onClick={handleFilterDrawerToggle}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <FilterListOutlined />
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh">
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  {refreshing ? (
                    <CircularProgress size={24} />
                  ) : (
                    <RefreshOutlined />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleNotificationsOpen}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <StyledBadge
                    badgeContent={
                      processedData.lowStockItems +
                      processedData.outOfStockItems
                    }
                    color="error"
                  >
                    <NotificationsOutlined />
                  </StyledBadge>
                </IconButton>
              </Tooltip>

              <GradientButton
                variant="contained"
                startIcon={<AddCircleOutlineOutlined />}
                onClick={handleAddProductDialogOpen}
              >
                Add Product
              </GradientButton>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<PrintOutlined />}
              sx={{
                borderRadius: 2,
                borderWidth: 1.5,
                transition: "all 0.3s",
                "&:hover": {
                  borderWidth: 1.5,
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Print Barcode
            </Button>
            <Button
              variant="outlined"
              startIcon={<QrCodeOutlined />}
              sx={{
                borderRadius: 2,
                borderWidth: 1.5,
                transition: "all 0.3s",
                "&:hover": {
                  borderWidth: 1.5,
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Print QR Code
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlined />}
              sx={{
                borderRadius: 2,
                borderWidth: 1.5,
                transition: "all 0.3s",
                "&:hover": {
                  borderWidth: 1.5,
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Download Report
            </Button>
          </Box>

          {/* Tab Navigation */}
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 2,
                "& .MuiTab-root": {
                  minWidth: 120,
                  fontWeight: 500,
                  borderRadius: "8px 8px 0 0",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                },
                "& .Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: 1.5,
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <DashboardOutlined sx={{ mr: 1 }} />
                    Overview
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InventoryOutlined sx={{ mr: 1 }} />
                    Inventory
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WarningAmberOutlined
                      sx={{ mr: 1, color: theme.palette.error.main }}
                    />
                    Expired Items
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <BarChartOutlined sx={{ mr: 1 }} />
                    Reports
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                <GradientBox gradientColors={["primary", "info"]}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 600 }}
                    >
                      Total Products
                    </Typography>
                    <AnimatedAvatar
                      sx={{
                        bgcolor: alpha(theme.palette.common.white, 0.2),
                        color: theme.palette.common.white,
                      }}
                    >
                      <InventoryOutlined />
                    </AnimatedAvatar>
                  </Box>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{ mt: 2, fontWeight: 700 }}
                  >
                    {processedData.totalProducts.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <ArrowUpwardOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      <strong>+{Math.round(Math.random() * 10)}%</strong> from
                      last month
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Active:{" "}
                    {processedData.totalProducts -
                      processedData.outOfStockItems}{" "}
                    | Out of Stock: {processedData.outOfStockItems}
                  </Typography>
                </GradientBox>
              </Zoom>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <GradientBox gradientColors={["success", "primary"]}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 600 }}
                    >
                      Total Categories
                    </Typography>
                    <AnimatedAvatar
                      sx={{
                        bgcolor: alpha(theme.palette.common.white, 0.2),
                        color: theme.palette.common.white,
                      }}
                    >
                      <CategoryOutlined />
                    </AnimatedAvatar>
                  </Box>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{ mt: 2, fontWeight: 700 }}
                  >
                    {processedData.totalCategories}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <ArrowUpwardOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      <strong>+{Math.round(Math.random() * 5)}</strong> newly
                      added
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Brands: {processedData.totalBrands} | Products:{" "}
                    {processedData.totalProducts}
                  </Typography>
                </GradientBox>
              </Zoom>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} style={{ transitionDelay: "300ms" }}>
                <GradientBox gradientColors={["warning", "error"]}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 600 }}
                    >
                      Low Stock Items
                    </Typography>
                    <AnimatedAvatar
                      sx={{
                        bgcolor: alpha(theme.palette.common.white, 0.2),
                        color: theme.palette.common.white,
                      }}
                    >
                      <TrendingDownOutlined />
                    </AnimatedAvatar>
                  </Box>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{ mt: 2, fontWeight: 700 }}
                  >
                    {processedData.lowStockItems}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <ArrowDownwardOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      <strong>-{Math.round(Math.random() * 15)}%</strong> from
                      last week
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Out of Stock: {processedData.outOfStockItems} | Need Order:{" "}
                    {processedData.lowStockItems}
                  </Typography>
                </GradientBox>
              </Zoom>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} style={{ transitionDelay: "400ms" }}>
                <GradientBox gradientColors={["info", "primary"]}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 600 }}
                    >
                      Inventory Value
                    </Typography>
                    <AnimatedAvatar
                      sx={{
                        bgcolor: alpha(theme.palette.common.white, 0.2),
                        color: theme.palette.common.white,
                      }}
                    >
                      <AccountBalanceWalletOutlined />
                    </AnimatedAvatar>
                  </Box>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{ mt: 2, fontWeight: 700 }}
                  >
                    {formatCurrency(processedData.totalInventoryValue).slice(
                      0,
                      -3
                    )}
                    K
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <ArrowUpwardOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      <strong>+{Math.round(Math.random() * 20)}%</strong> from
                      last month
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Purchase:{" "}
                    {formatCurrency(processedData.totalPurchaseValue).slice(
                      0,
                      -3
                    )}
                    K | Sales:{" "}
                    {formatCurrency(processedData.totalSellingValue).slice(
                      0,
                      -3
                    )}
                    K
                  </Typography>
                </GradientBox>
              </Zoom>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Inventory Value */}
            <Grid item xs={12} md={6}>
              <GradientCard>
                <StyledCardHeader
                  title="Inventory Value"
                  subheader="Last Updated: Today, 10:30 AM"
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <AccountBalanceWalletOutlined />
                    </Avatar>
                  }
                  action={
                    <Tooltip title="More Options">
                      <IconButton onClick={handleMenuOpen}>
                        <MoreVertOutlined />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: "center", p: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {formatCurrency(
                            processedData.totalInventoryValue
                          ).slice(0, -3)}
                          K
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Inventory Value
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: "center", p: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.success.main,
                          }}
                        >
                          {formatCurrency(
                            processedData.totalPurchaseValue
                          ).slice(0, -3)}
                          K
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Purchase Value
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: "center", p: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.info.main,
                          }}
                        >
                          {formatCurrency(
                            processedData.totalInventoryValue -
                            processedData.totalPurchaseValue
                          ).slice(0, -3)}
                          K
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Potential Profit
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: "center", p: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.warning.main,
                          }}
                        >
                          {processedData.totalPurchaseValue > 0
                            ? Math.round(
                              ((processedData.totalInventoryValue -
                                processedData.totalPurchaseValue) /
                                processedData.totalPurchaseValue) *
                              100
                            )
                            : 0}
                          %
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average Margin
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </GradientCard>
            </Grid>

            {/* Recent Activities */}
            <Grid item xs={12} md={6}>
              <GradientCard>
                <StyledCardHeader
                  title="Recent Activities"
                  subheader="Last 24 hours activities"
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <TimelineOutlined />
                    </Avatar>
                  }
                  action={
                    <Button
                      size="small"
                      endIcon={<ArrowDownwardOutlined />}
                      sx={{ borderRadius: 2, fontWeight: 500 }}
                    >
                      View All
                    </Button>
                  }
                />
                <Divider />
                <List sx={{ maxHeight: 350, overflow: "auto" }}>
                  {processedData.recentActivities.map((activity, index) => (
                    <ListItem
                      key={activity.id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          transform: "translateX(5px)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(
                              activity.type === "purchase"
                                ? theme.palette.primary.main
                                : theme.palette.success.main,
                              0.1
                            ),
                            color:
                              activity.type === "purchase"
                                ? theme.palette.primary.main
                                : theme.palette.success.main,
                          }}
                        >
                          {activity.type === "purchase" ? (
                            <ShoppingCartOutlined />
                          ) : (
                            <LocalShippingOutlined />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          activity.type === "purchase"
                            ? "New Purchase Order"
                            : "Product Issued"
                        }
                        secondary={`${activity.product} - ${activity.quantity} Pcs`}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      <AnimatedChip
                        label={activity.time}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))}
                  {processedData.recentActivities.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No recent activities"
                        secondary="No stock movement today"
                      />
                    </ListItem>
                  )}
                </List>
              </GradientCard>
            </Grid>

            {/* Category Distribution */}
            <Grid item xs={12} md={6}>
              <GradientCard>
                <StyledCardHeader
                  title="Category Distribution"
                  subheader="Distribution by product categories"
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <PieChartOutlined />
                    </Avatar>
                  }
                />
                <Divider />
                <CardContent>
                  <Box
                    sx={{
                      height: 300,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={processedData.categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {processedData.categoryDistribution.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      {processedData.categoryDistribution.map((item, index) => (
                        <Grid item xs={6} sm={4} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: COLORS[index % COLORS.length],
                                mr: 1,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.875rem" }}
                            >
                              {item.name}: {item.count}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardContent>
              </GradientCard>
            </Grid>

            {/* Top Selling Products */}
            <Grid item xs={12} md={6}>
              <GradientCard>
                <StyledCardHeader
                  title="Top Selling Products"
                  subheader="This month"
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <StorefrontOutlined />
                    </Avatar>
                  }
                  action={
                    <IconButton>
                      <MoreVertOutlined />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent>
                  <TableContainer>
                    <Table size="small">
                      <StyledTableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Sales Count</TableCell>
                          <TableCell align="right">Total Value</TableCell>
                          <TableCell align="center">Trend</TableCell>
                        </TableRow>
                      </StyledTableHead>
                      <TableBody>
                        {processedData.topSellingProducts.map(
                          (product, index) => {
                            return (
                              <StyledTableRow key={index}>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Avatar
                                      src={
                                        product.product?.image ||
                                        "/placeholder.svg?height=40&width=40"
                                      }
                                      variant="rounded"
                                      sx={{ width: 32, height: 32, mr: 1 }}
                                    />
                                    {product.product?.product_name ||
                                      "Unknown Product"}
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  {product.salesCount}
                                </TableCell>
                                <TableCell align="right">
                                  {formatCurrency(product.totalValue)}
                                </TableCell>
                                <TableCell align="center">
                                  <TrendingUpOutlined
                                    sx={{ color: theme.palette.success.main }}
                                  />
                                </TableCell>
                              </StyledTableRow>
                            );
                          }
                        )}
                        {processedData.topSellingProducts.length === 0 && (
                          <StyledTableRow>
                            <TableCell colSpan={4} align="center">
                              No sales data found
                            </TableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </GradientCard>
            </Grid>

            {/* Stock Status */}
            <Grid item xs={12} md={6}>
              <GradientCard>
                <StyledCardHeader
                  title="Stock Status"
                  subheader="By Category"
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <SpeedOutlined />
                    </Avatar>
                  }
                  action={
                    <IconButton>
                      <MoreVertOutlined />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent>
                  {processedData.stockStatusByCategory.map(
                    (category, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2">
                            {category.category} ({category.percentage}%)
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color={
                              category.status === "good"
                                ? "success.main"
                                : category.status === "warning"
                                  ? "warning.main"
                                  : "error.main"
                            }
                          >
                            {category.status === "good"
                              ? "In Stock"
                              : category.status === "warning"
                                ? "Low Stock"
                                : "Critical"}
                          </Typography>
                        </Box>
                        <EnhancedProgress
                          variant="determinate"
                          value={category.percentage}
                          color={
                            category.status === "good"
                              ? "success"
                              : category.status === "warning"
                                ? "warning"
                                : "error"
                          }
                          sx={{
                            "& .MuiLinearProgress-bar": {
                              background: `linear-gradient(90deg, ${category.status === "good"
                                  ? theme.palette.success.main
                                  : category.status === "warning"
                                    ? theme.palette.warning.main
                                    : theme.palette.error.main
                                }, ${category.status === "good"
                                  ? theme.palette.success.light
                                  : category.status === "warning"
                                    ? theme.palette.warning.light
                                    : theme.palette.error.light
                                })`,
                            },
                          }}
                        />
                      </Box>
                    )
                  )}
                </CardContent>
              </GradientCard>
            </Grid>

            {/* Low Stock Items */}
            <Grid item xs={12}>
              <GradientCard>
                <StyledCardHeader
                  title="Low Stock Items"
                  subheader="Immediate ordering required"
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <TrendingDownOutlined />
                    </Avatar>
                  }
                  action={
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        borderWidth: 1.5,
                        transition: "all 0.3s",
                        "&:hover": {
                          borderWidth: 1.5,
                          boxShadow: `0 4px 12px ${alpha(
                            theme.palette.primary.main,
                            0.1
                          )}`,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      View All
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  <TableContainer>
                    <Table>
                      <StyledTableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Current Stock</TableCell>
                          <TableCell align="right">Average Price</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </StyledTableHead>
                      <TableBody>
                        {processedData.lowStockProducts.map(
                          (product, index) => (
                            <StyledTableRow key={index}>
                              <TableCell>
                                {product.product?._id?.slice(-6) || "N/A"}
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Avatar
                                    src={
                                      product.product?.image ||
                                      "/placeholder.svg?height=40&width=40"
                                    }
                                    variant="rounded"
                                    sx={{ width: 32, height: 32, mr: 1 }}
                                  />
                                  {product.product?.name || "Unknown Product"}
                                </Box>
                              </TableCell>
                              <TableCell>{product.categoryName}</TableCell>
                              <TableCell align="right">
                                {product.currentStock}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(product.avgPurchasePrice || 0)}
                              </TableCell>
                              <TableCell>
                                <AnimatedChip
                                  label={
                                    product.status === "out-of-stock"
                                      ? "Out of Stock"
                                      : "Low Stock"
                                  }
                                  size="small"
                                  sx={{
                                    background: `linear-gradient(45deg, ${product.status === "out-of-stock"
                                        ? theme.palette.error.dark
                                        : theme.palette.warning.dark
                                      }, ${product.status === "out-of-stock"
                                        ? theme.palette.error.main
                                        : theme.palette.warning.main
                                      })`,
                                    color: "white",
                                    fontWeight: 500,
                                    boxShadow: `0 2px 8px ${alpha(
                                      product.status === "out-of-stock"
                                        ? theme.palette.error.main
                                        : theme.palette.warning.main,
                                      0.4
                                    )}`,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <GradientButton
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                >
                                  Place Order
                                </GradientButton>
                              </TableCell>
                            </StyledTableRow>
                          )
                        )}
                        {processedData.lowStockProducts.length === 0 && (
                          <StyledTableRow>
                            <TableCell colSpan={7} align="center">
                              No low stock items
                            </TableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </GradientCard>
            </Grid>
          </Grid>

          {/* Filter Drawer */}
          <Drawer
            anchor="right"
            open={filterDrawerOpen}
            onClose={handleFilterDrawerToggle}
            PaperProps={{
              sx: {
                width: 320,
                borderRadius: "16px 0 0 16px",
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.background.paper,
                  0.95
                )}, ${alpha(theme.palette.background.paper, 0.85)})`,
                backdropFilter: "blur(10px)",
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  <FilterListOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
                  Filter Options
                </Typography>
                <IconButton onClick={handleFilterDrawerToggle}>
                  <CloseOutlined />
                </IconButton>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Time Period
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Select time period</InputLabel>
                  <Select
                    value={period}
                    label="Select time period"
                    onChange={(e) => setPeriod(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="yesterday">Yesterday</MenuItem>
                    <MenuItem value="this-week">This Week</MenuItem>
                    <MenuItem value="this-month">This Month</MenuItem>
                    <MenuItem value="last-month">Last Month</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Categories
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {processedData.categoryDistribution.map((category, index) => (
                    <Chip
                      key={index}
                      label={category.name}
                      onClick={() => { }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Stock Status
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip label="In Stock" color="success" onClick={() => { }} />
                  <Chip label="Low Stock" color="warning" onClick={() => { }} />
                  <Chip label="Out of Stock" color="error" onClick={() => { }} />
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button variant="outlined" sx={{ borderRadius: 2 }}>
                  Reset
                </Button>
                <GradientButton
                  variant="contained"
                  onClick={handleFilterDrawerToggle}
                >
                  Apply Filters
                </GradientButton>
              </Box>
            </Box>
          </Drawer>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.text.primary,
                  0.1
                )}`,
                width: 320,
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Notifications
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List sx={{ p: 0 }}>
                {processedData.outOfStockItems > 0 && (
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.error.main, 0.15),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                        <WarningAmberOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Out of Stock Alert"
                      secondary={`${processedData.outOfStockItems}  products out of stock`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                )}
                {processedData.lowStockItems > 0 && (
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.warning.main, 0.15),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                        <InventoryOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Low Stock Alert"
                      secondary={`${processedData.lowStockItems}  products low stock`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                )}
              </List>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ textAlign: "center" }}>
                <Button
                  size="small"
                  sx={{ borderRadius: 2, fontWeight: 500 }}
                  onClick={handleNotificationsClose}
                >
                  View All
                </Button>
              </Box>
            </Box>
          </Menu>

          {/* Add Product Dialog */}
          <Dialog
            open={addProductDialogOpen}
            onClose={handleAddProductDialogClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              },
            }}
          >
            <DialogTitle
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: theme.palette.common.white,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AddCircleOutlineOutlined /> Add New Product
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Product Code"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: `0 0 0 1px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: `0 0 0 1px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      sx={{
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: `0 0 0 1px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      }}
                    >
                      {processedData.categoryDistribution.map(
                        (category, index) => (
                          <MenuItem key={index} value={category.name}>
                            {category.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Brand"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: `0 0 0 1px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Purchase Price"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="number"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: `0 0 0 1px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Selling Price"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="number"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: `0 0 0 1px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Quantity"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="number"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: `0 0 0 1px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Minimum Stock Level"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="number"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: `0 0 0 1px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={3}
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: `0 0 0 1px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                variant="outlined"
                onClick={handleAddProductDialogClose}
                sx={{
                  borderRadius: 2,
                  borderWidth: 1.5,
                  "&:hover": {
                    borderWidth: 1.5,
                  },
                }}
              >
                Cancel
              </Button>
              <GradientButton variant="contained" onClick={handleAddProduct}>
                Add
              </GradientButton>
            </DialogActions>
          </Dialog>

          {/* More Options Menu */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.text.primary,
                  0.1
                )}`,
              },
            }}
          >
            <MenuItem
              onClick={handleMenuClose}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PrintOutlined fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Print</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <DownloadOutlined fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Export (CSV)</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <RefreshOutlined fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Refresh</Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleMenuClose}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <SettingsOutlined fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <HelpOutlineOutlined fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Help</Typography>
            </MenuItem>
          </Menu>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: "100%", borderRadius: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </div>
      </Fade>
    </Box>
  );
}
