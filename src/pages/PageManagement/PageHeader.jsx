/* eslint-disable react/prop-types */
import { useTheme } from "@mui/material/styles";
import {
  Dashboard as DashboardIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
} from "@mui/icons-material";
import { Typography, Box } from "@mui/material";
import SummaryCards from "../../components/SummaryCard";

const PageHeader = ({ pageData }) => {
  const theme = useTheme();
  const totalPages = pageData?.data?.length || 0;
  const activePages =
    pageData?.data?.filter((page) => page.status === "active")?.length || 0;
  const inactivePages =
    pageData?.data?.filter((page) => page.status === "inactive")?.length || 0;

  const cards = [
    {
      title: "Total Pages",
      value: totalPages,
      icon: <DashboardIcon />,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.main,
    },
    {
      title: "Active Pages",
      value: activePages,
      icon: <ActiveIcon />,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.main,
    },
    {
      title: "Inactive Pages",
      value: inactivePages,
      icon: <InactiveIcon />,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.main,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Page Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Manage and configure pages for your garage management system
      </Typography>

      <SummaryCards cards={cards} singleRow />
    </Box>
  );
};

export default PageHeader;
