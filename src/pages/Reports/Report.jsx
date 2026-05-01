"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Container,
  alpha,
  useTheme,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import CategoryIcon from "@mui/icons-material/Category";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import DownloadIcon from "@mui/icons-material/Download";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdfIcon"
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion";

// Mock data for report metrics
const reportMetrics = [
  {
    id: 1,
    title: "মোট বিক্রয়",
    value: "৳ 1,245,600",
    change: "+12.5%",
    isPositive: true,
  },
  {
    id: 2,
    title: "মোট ক্রয়",
    value: "৳ 876,300",
    change: "+8.3%",
    isPositive: true,
  },
  {
    id: 3,
    title: "মোট ইনভেন্টরি",
    value: "৳ 2,134,900",
    change: "-3.2%",
    isPositive: false,
  },
  {
    id: 4,
    title: "মোট লাভ",
    value: "৳ 369,300",
    change: "+15.7%",
    isPositive: true,
  },
];

// Report type definitions with icons and colors
const reportTypes = [
  {
    id: "sales",
    title: "সেলস রিপোর্ট",
    icon: <BarChartIcon />,
    color: "#4CAF50",
    description: "বিক্রয় সংক্রান্ত সমস্ত তথ্য এবং পরিসংখ্যান",
    hasSubItems: true,
  },
  {
    id: "purchase",
    title: "পারচেজ রিপোর্ট",
    icon: <ShoppingCartIcon />,
    color: "#2196F3",
    description: "ক্রয় সংক্রান্ত সমস্ত তথ্য এবং পরিসংখ্যান",
    hasSubItems: false,
  },
  {
    id: "inventory",
    title: "ইনভেন্টরি রিপোর্ট",
    icon: <InventoryIcon />,
    color: "#FF9800",
    description: "স্টক এবং ইনভেন্টরি সংক্রান্ত সমস্ত তথ্য",
    hasSubItems: true,
  },
  {
    id: "invoice",
    title: "ইনভয়েস রিপোর্ট",
    icon: <ReceiptIcon />,
    color: "#9C27B0",
    description: "সমস্ত ইনভয়েস এবং বিলিং সংক্রান্ত তথ্য",
    hasSubItems: false,
  },
  {
    id: "supplier",
    title: "সাপ্লায়ার রিপোর্ট",
    icon: <PersonIcon />,
    color: "#607D8B",
    description: "সাপ্লায়ার সংক্রান্ত সমস্ত তথ্য এবং লেনদেন",
    hasSubItems: true,
  },
  {
    id: "customer",
    title: "কাস্টমার রিপোর্ট",
    icon: <GroupIcon />,
    color: "#3F51B5",
    description: "কাস্টমার সংক্রান্ত সমস্ত তথ্য এবং লেনদেন",
    hasSubItems: true,
  },
  {
    id: "product",
    title: "প্রোডাক্ট রিপোর্ট",
    icon: <CategoryIcon />,
    color: "#F44336",
    description: "পণ্য সংক্রান্ত সমস্ত তথ্য এবং পরিসংখ্যান",
    hasSubItems: true,
  },
  {
    id: "expense",
    title: "এক্সপেন্স রিপোর্ট",
    icon: <MoneyOffIcon />,
    color: "#795548",
    description: "ব্যয় সংক্রান্ত সমস্ত তথ্য এবং পরিসংখ্যান",
    hasSubItems: false,
  },
  {
    id: "income",
    title: "ইনকাম রিপোর্ট",
    icon: <AttachMoneyIcon />,
    color: "#00BCD4",
    description: "আয় সংক্রান্ত সমস্ত তথ্য এবং পরিসংখ্যান",
    hasSubItems: false,
  },
  {
    id: "tax",
    title: "ট্যাক্স রিপোর্ট",
    icon: <ReceiptLongIcon />,
    color: "#673AB7",
    description: "কর সংক্রান্ত সমস্ত তথ্য এবং পরিসংখ্যান",
    hasSubItems: false,
  },
  {
    id: "profit",
    title: "প্রফিট এন্ড লস",
    icon: <ShowChartIcon />,
    color: "#009688",
    description: "লাভ-ক্ষতি সংক্রান্ত সমস্ত তথ্য এবং পরিসংখ্যান",
    hasSubItems: false,
  },
  {
    id: "annual",
    title: "বার্ষিক রিপোর্ট",
    icon: <AssessmentIcon />,
    color: "#FF5722",
    description: "বার্ষিক সমস্ত তথ্য এবং পরিসংখ্যান",
    hasSubItems: false,
  },
];

// Featured reports
const featuredReports = [
  {
    id: 1,
    title: "মাসিক বিক্রয় বিশ্লেষণ",
    description: "গত ৬ মাসের বিক্রয় ট্রেন্ড এবং তুলনামূলক বিশ্লেষণ",
    type: "sales",
    icon: <BarChartIcon />,
    color: "#4CAF50",
  },
  {
    id: 2,
    title: "টপ সেলিং প্রোডাক্টস",
    description: "সর্বাধিক বিক্রিত পণ্য এবং তাদের পরিসংখ্যান",
    type: "product",
    icon: <CategoryIcon />,
    color: "#F44336",
  },
  {
    id: 3,
    title: "ইনভেন্টরি স্ট্যাটাস",
    description: "বর্তমান স্টক স্ট্যাটাস এবং লো স্টক আইটেম",
    type: "inventory",
    icon: <InventoryIcon />,
    color: "#FF9800",
  },
  {
    id: 4,
    title: "প্রফিট মার্জিন এনালাইসিস",
    description: "পণ্য এবং বিভাগ অনুসারে লাভের মার্জিন বিশ্লেষণ",
    type: "profit",
    icon: <ShowChartIcon />,
    color: "#009688",
  },
];

// Recent reports
const recentReports = [
  {
    id: 1,
    title: "দৈনিক বিক্রয় রিপোর্ট",
    date: "২৩ এপ্রিল, ২০২৫",
    type: "sales",
  },
  {
    id: 2,
    title: "মাসিক ইনভেন্টরি রিপোর্ট",
    date: "২০ এপ্রিল, ২০২৫",
    type: "inventory",
  },
  {
    id: 3,
    title: "সাপ্তাহিক ক্রয় রিপোর্ট",
    date: "১৮ এপ্রিল, ২০২৫",
    type: "purchase",
  },
  {
    id: 4,
    title: "ত্রৈমাসিক ট্যাক্স রিপোর্ট",
    date: "১৫ এপ্রিল, ২০২৫",
    type: "tax",
  },
];

export default function ReportsPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ pb: 6 }}>
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
        <Container maxWidth="lg">
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
            <Typography color="white">রিপোর্টস</Typography>
          </Breadcrumbs>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                রিপোর্টস ড্যাশবোর্ড
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
                আপনার ব্যবসার সমস্ত গুরুত্বপূর্ণ রিপোর্ট এবং বিশ্লেষণ এক
                জায়গায়
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="প্রিন্ট করুন">
                <IconButton sx={{ color: "white" }}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="ডাউনলোড করুন">
                <IconButton sx={{ color: "white" }}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="শেয়ার করুন">
                <IconButton sx={{ color: "white" }}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {reportMetrics.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: metric.id * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
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
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {metric.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {metric.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: metric.isPositive ? "success.main" : "error.main",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "medium",
                    }}
                  >
                    {metric.change}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      গত মাস থেকে
                    </Typography>
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Tabs for different report views */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                minWidth: 120,
                fontWeight: 500,
              },
            }}
          >
            <Tab label="সকল রিপোর্ট" />
            <Tab label="ফিচার্ড" />
            <Tab label="সাম্প্রতিক" />
            <Tab label="সেভড" />
          </Tabs>

          {/* All Reports */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {reportTypes.map((report) => (
                <Grid item xs={12} sm={6} md={4} key={report.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        },
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "5px",
                          bgcolor: report.color,
                        }}
                      />
                      <CardActionArea
                        component={Link}
                        href={`/reports/${report.id}`}
                        sx={{ height: "100%", textDecoration: "none" }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha(report.color, 0.1),
                                color: report.color,
                                width: 48,
                                height: 48,
                              }}
                            >
                              {report.icon}
                            </Avatar>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="h6"
                                component="div"
                                fontWeight="bold"
                              >
                                {report.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {report.description}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: report.color,
                                fontWeight: "medium",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {report.hasSubItems
                                ? "সাব-রিপোর্ট আছে"
                                : "ভিউ রিপোর্ট"}
                            </Typography>
                            <ArrowForwardIosIcon
                              sx={{
                                fontSize: 14,
                                color: alpha(theme.palette.text.primary, 0.5),
                              }}
                            />
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Featured Reports */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              {featuredReports.map((report) => (
                <Grid item xs={12} sm={6} key={report.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        },
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "5px",
                          bgcolor: report.color,
                        }}
                      />
                      <CardActionArea
                        component={Link}
                        href={`/reports/${report.type}/${report.id}`}
                        sx={{ height: "100%", textDecoration: "none" }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha(report.color, 0.1),
                                color: report.color,
                                width: 48,
                                height: 48,
                              }}
                            >
                              {report.icon}
                            </Avatar>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="h6"
                                component="div"
                                fontWeight="bold"
                              >
                                {report.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {report.description}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: report.color,
                                fontWeight: "medium",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              ফিচার্ড রিপোর্ট
                            </Typography>
                            <ArrowForwardIosIcon
                              sx={{
                                fontSize: 14,
                                color: alpha(theme.palette.text.primary, 0.5),
                              }}
                            />
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Recent Reports */}
          {tabValue === 2 && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              {recentReports.map((report, index) => (
                <Box key={report.id}>
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: alpha(
                            reportTypes.find((r) => r.id === report.type)
                              ?.color || "#000",
                            0.1
                          ),
                          color: reportTypes.find((r) => r.id === report.type)
                            ?.color,
                        }}
                      >
                        {reportTypes.find((r) => r.id === report.type)?.icon}
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1">
                          {report.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {report.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Tooltip title="ডাউনলোড করুন">
                        <IconButton size="small">
                          {/* <PictureAsPdfIcon fontSize="small" /> */}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="ভিউ রিপোর্ট">
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/reports/${report.type}/${report.id}`}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  {index < recentReports.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>
          )}

          {/* Saved Reports */}
          {tabValue === 3 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
              }}
            >
              <FavoriteIcon
                sx={{
                  fontSize: 60,
                  color: alpha(theme.palette.primary.main, 0.2),
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                কোন সেভড রিপোর্ট নেই
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3, maxWidth: 400 }}
              >
                আপনি যখন কোন রিপোর্ট সেভ করবেন, তখন সেগুলি এখানে দেখা যাবে।
              </Typography>
            </Box>
          )}
        </Box>

        {/* Help Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.info.light,
              0.2
            )} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            display: "flex",
            alignItems: "center",
            mt: 4,
          }}
        >
          <InfoIcon
            sx={{ color: theme.palette.info.main, mr: 2, fontSize: 24 }}
          />
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              color="info.main"
            >
              রিপোর্ট সম্পর্কে সাহায্য প্রয়োজন?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              আমাদের{" "}
              <Link
                href="/help/reports"
                color="inherit"
                sx={{ textDecoration: "underline" }}
              >
                হেল্প সেন্টার
              </Link>{" "}
              ভিজিট করুন অথবা{" "}
              <Link
                href="/support"
                color="inherit"
                sx={{ textDecoration: "underline" }}
              >
                সাপোর্ট টিমের
              </Link>{" "}
              সাথে যোগাযোগ করুন।
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
