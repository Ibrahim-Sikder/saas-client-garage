"use client";

/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  alpha,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import {

  TrendingUp,
  TrendingDown,
  Receipt,
  AccountBalance,
  AccountTree,
  Payments,
  VolunteerActivism,
  InfoOutlined,
  CalendarMonth,
  ShowChart,
  PieChart,
  StackedLineChart,
} from "@mui/icons-material";

const DashboardSummary = ({ accountSummary }) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [timeRange, setTimeRange] = useState("monthly");

  const getDataByTimeRange = (category, subCategory = null) => {
    if (!accountSummary?.data?.[category]) return subCategory ? 0 : {};

    const categoryData = accountSummary.data[category];

    if (typeof categoryData[timeRange] === "number") {
      return subCategory ? categoryData[timeRange] : categoryData[timeRange];
    }

    if (typeof categoryData[timeRange] === "object") {
      if (subCategory) {
        return categoryData[timeRange]?.[subCategory] || 0;
      }
      return categoryData[timeRange] || {};
    }

    return subCategory ? 0 : {};
  };
  const incomeData = getDataByTimeRange("income");
  const expenseData = getDataByTimeRange("expense");
  const donationAmount = getDataByTimeRange("donation");
  const salaryAmount = getDataByTimeRange("salary");
  const netProfitAmount = getDataByTimeRange("netProfit");

  const totalIncome = incomeData.totalAmount || 0;
  const totalExpense = accountSummary?.data?.netTotalExpense?.total || 0;
  const netProfit = netProfitAmount || totalIncome - totalExpense;
  const profitColor = netProfit >= 0 ? "success" : "error";
  const profitIcon = netProfit >= 0 ? <TrendingUp /> : <TrendingDown />;
  const profitLabel = netProfit >= 0 ? "Profit" : "Loss";

  const maxValue = Math.max(totalIncome, totalExpense);
  const incomePercentage = maxValue > 0 ? (totalIncome / maxValue) * 100 : 0;
  const expensePercentage = maxValue > 0 ? (totalExpense / maxValue) * 100 : 0;

  const TimeRangeSelector = () => (
    <Paper
      sx={{
        p: 1,
        mb: 3,
        display: "flex",
        justifyContent: "center",
        background: alpha(theme.palette.primary.main, 0.05),
      }}
    >
      <Tabs
        value={timeRange}
        onChange={(e, newValue) => setTimeRange(newValue)}
        sx={{
          "& .MuiTab-root": {
            minWidth: "auto",
            px: 3,
            py: 1,
            fontSize: "0.875rem",
            fontWeight: "bold",
          },
          "& .Mui-selected": {
            color: theme.palette.primary.main,
          },
        }}
        centered
      >
        <Tab icon={<CalendarMonth />} label="Monthly" value="monthly" />
        <Tab icon={<StackedLineChart />} label="Yearly" value="yearly" />
        <Tab icon={<PieChart />} label="Total" value="total" />
      </Tabs>
    </Paper>
  );

  const StatCard = ({ title, value, icon, color, subtitle, progress }) => (
    <Card
      sx={{
        height: "100%",
        transition: "all 0.3s ease",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette[color].main,
          0.1
        )} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
          border: `1px solid ${alpha(theme.palette[color].main, 0.4)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette[color].main, 0.2),
              width: 40,
              height: 40,
            }}
          >
            {icon}
          </Avatar>
          <Tooltip title={title}>
            <InfoOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
          </Tooltip>
        </Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ color: `${color}.main` }}
        >
          ৳ {value.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {progress && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mt: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette[color].main, 0.2),
              "& .MuiLinearProgress-bar": {
                backgroundColor: theme.palette[color].main,
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box p={isMobile ? 1 : 3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        flexDirection={isMobile ? "column" : "row"}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          gutterBottom={isMobile}
        >
          Financial Overview
        </Typography>
        <Chip
          icon={<CalendarMonth />}
          label={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
            } View`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <TimeRangeSelector />

      <Grid container spacing={3}>
        {/* Financial Performance Highlight */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: alpha(theme.palette.primary.main, 0.03),
              borderRadius: 3,
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                <AccountBalance />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="primary.dark">
                  Financial Performance
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeRange} summary
                </Typography>
              </Box>
            </Box>

            <Card
              sx={{
                flexGrow: 1,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette[profitColor].main,
                  0.1
                )} 0%, ${alpha(theme.palette[profitColor].main, 0.05)} 100%)`,
                boxShadow: "none",
                border: `1px solid ${alpha(
                  theme.palette[profitColor].main,
                  0.2
                )}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 3,
                mb: 2,
                borderRadius: 3,
              }}
            >
              <Box textAlign="center">
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette[profitColor].main, 0.2),
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Box sx={{ color: `${profitColor}.main`, fontSize: 30 }}>
                    {profitIcon}
                  </Box>
                </Avatar>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={`${profitColor}.main`}
                  gutterBottom
                >
                  ৳ {Math.abs(netProfit).toLocaleString()}
                </Typography>
                <Chip
                  label={`Net ${profitLabel}`}
                  color={profitColor}
                  sx={{ mb: 3 }}
                />

                <Box mt={3} px={2}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="body2"
                      color="success.main"
                      fontWeight="medium"
                    >
                      Income
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ৳ {totalIncome.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      variant="body2"
                      color="error.main"
                      fontWeight="medium"
                    >
                      Expense
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ৳ {totalExpense.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StatCard
                  title="Donations"
                  value={donationAmount}
                  icon={<VolunteerActivism color="primary" />}
                  color="primary"
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  title="Salary"
                  value={salaryAmount}
                  icon={<Payments color="warning" />}
                  color="warning"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Income Overview */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              background: alpha(theme.palette.success.light, 0.05),
              mb: 3,
              borderRadius: 3,
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                ৳
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="success.dark">
                  Income Overview
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeRange} income
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StatCard
                  title="Total Income"
                  value={totalIncome}

                  color="success"
                  progress={incomePercentage}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <StatCard
                  title="Invoice Income"
                  value={incomeData.serviceIncomeAmount || 0}
                  icon={<AccountTree color="info" />}
                  color="info"
                />
              </Grid>

              <Grid item xs={12}>
                <StatCard
                  title="Other Income"
                  value={incomeData.totalOtherIncome || 0}
                  icon={<TrendingUp color="secondary" />}
                  color="secondary"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Expense Overview */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              background: alpha(theme.palette.error.light, 0.05),
              borderRadius: 3,
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: "error.main", mr: 2 }}>
                <TrendingDown />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="error.dark">
                  Expense Overview
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeRange} expenses
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StatCard
                  title="Total Expense"
                  value={totalExpense}
                  icon={<TrendingDown color="error" />}
                  color="error"
                  progress={expensePercentage}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard
                  title="Invoice Cost"
                  value={expenseData.invoiceCost || 0}
                  icon={<Receipt color="error" />}
                  color="error"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard
                  title="Other Expense"
                  value={expenseData.totalOtherExpense || 0}
                  icon={<Receipt color="secondary" />}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12}>
                <StatCard
                  title="Salary Expense"
                  value={salaryAmount}
                  icon={<Payments color="warning" />}
                  color="warning"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Summary Footer */}
      <Box mt={3} display="flex" justifyContent="center">
        <Chip
          icon={<ShowChart />}
          label={`Financial summary for ${timeRange} view`}
          variant="outlined"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default DashboardSummary;