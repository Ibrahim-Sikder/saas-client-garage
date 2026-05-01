/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  alpha,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  Chip,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  StepConnector,
  Stepper,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { StyledTab } from ".";
import { DataGrid } from "@mui/x-data-grid";
import TASRightSideModal from "../components/Share/Modal/Modal";
import GarageForm from "../components/form/Form";
import { CalendarMonth } from "@mui/icons-material";

export const tabStyles = {
  width: 115,
  height: "35px",
  margin: 0.5,
  backgroundColor: "#42A1DA",
  color: "white",
  borderRadius: 10,
  padding: "0px",
  fontSize: "11px",
  lineHeight: "20px",
  minHeight: "unset",
  "&.Mui-selected": {
    backgroundColor: "#2dce89",
    color: "#fff",
  },
};

export const GradientBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.main,
    0.12
  )}, ${alpha(theme.palette.background.default, 0.05)})`,
  backdropFilter: "blur(8px)",
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    fontWeight: 600,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transition: "background-color 0.2s ease",
  },
  "&.expired": {
    backgroundColor: alpha(theme.palette.error.light, 0.05),
    "&:hover": {
      backgroundColor: alpha(theme.palette.error.light, 0.1),
    },
  },
  "&.expiring-soon": {
    backgroundColor: alpha(theme.palette.warning.light, 0.05),
    "&:hover": {
      backgroundColor: alpha(theme.palette.warning.light, 0.1),
    },
  },
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${alpha(theme.palette.text.primary, 0.1)}`,
  },
}));

export const GradientButton = styled(Button)(
  ({ theme, color = "primary" }) => ({
    background: `linear-gradient(45deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
    boxShadow: `0 4px 10px ${alpha(theme.palette[color].main, 0.3)}`,
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: `0 6px 15px ${alpha(theme.palette[color].main, 0.4)}`,
      transform: "translateY(-2px)",
    },
  })
);

export const AnimatedChip = styled(Chip)(({ theme }) => ({
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

export const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: "blur(10px)",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 8px 32px ${alpha(theme.palette.text.primary, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: `0 12px 48px ${alpha(theme.palette.primary.main, 0.12)}`,
    transform: "translateY(-5px)",
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
}));
export const tabsStyles = {
  "& .MuiTabs-indicator": {
    display: "none", // Hides the underline indicator
  },
  "& .MuiTabs-flexContainer": {
    flexWrap: "nowrap",
    borderBottom: "none",
  },
  "& .MuiTabs-scroller": {
    overflowX: "auto",
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      height: "5px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555",
    },
  },
  "@media (max-width: 600px)": {
    "& .MuiTabs-scroller": {
      overflowX: "auto",
      "-webkit-overflow-scrolling": "touch",
    },
  },
};

export const backBtnStyle = {
  mr: 2,
  color: "#fff",

  height: {
    xs: "30px",
    md: "auto",
  },
  borderRadius: 5,
};

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: alpha(theme.palette.primary.main, 0.05),
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.primary.main, 0.2),
    borderRadius: "10px",
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.3),
    },
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "0.875rem",
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
}));

export const StatusChip = styled(Chip)(({ theme, status }) => {
  let color;
  switch (status?.toLowerCase()) {
    case "active":
      color = theme.palette.success.main;
      break;
    case "inactive":
      color = theme.palette.error.main;
      break;
    case "pending":
      color = theme.palette.warning.main;
      break;
    default:
      color = theme.palette.info.main;
  }

  return {
    backgroundColor: alpha(color, 0.1),
    color: color,
    fontWeight: "bold",
    border: `1px solid ${alpha(color, 0.3)}`,
    "& .MuiChip-icon": {
      color: "inherit",
    },
  };
});

export const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: "transform 0.2s ease, background-color 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

export const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    transition: "all 0.3s ease",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: "1px",
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

export const SupplierAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: "bold",
  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
}));

export const mockSuppliers = [
  {
    _id: "1",
    supplierId: "SUP-001",
    full_name: "John Smith",
    shop_name: "Global Auto Parts Ltd.",
    phone_number: "+1 (555) 123-4567",
    email: "john@globalautoparts.com",
    supplier_status: "active",
    supplier_rating: 4.8,
    vendor: "Parts Supplier",
    country: "United States",
    street_address: "123 Main Street",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    year_established: 2005,
    annual_revenue: 1500000,
    products_count: 245,
    orders_count: 128,
    last_order_date: "2025-03-15",
    payment_terms: "Net 30",
    credit_limit: 50000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
  {
    _id: "2",
    supplierId: "SUP-002",
    full_name: "Sarah Johnson",
    shop_name: "Premium Electronics Inc.",
    phone_number: "+1 (555) 987-6543",
    email: "sarah@premiumelectronics.com",
    supplier_status: "active",
    supplier_rating: 4.5,
    vendor: "Electronics Supplier",
    country: "Canada",
    street_address: "456 Maple Avenue",
    city: "Toronto",
    state: "ON",
    postal_code: "M5V 2H1",
    year_established: 2010,
    annual_revenue: 2000000,
    products_count: 178,
    orders_count: 95,
    last_order_date: "2025-03-10",
    payment_terms: "Net 45",
    credit_limit: 75000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
  {
    _id: "3",
    supplierId: "SUP-003",
    full_name: "Michael Chen",
    shop_name: "Chen Manufacturing Co.",
    phone_number: "+1 (555) 456-7890",
    email: "michael@chenmanufacturing.com",
    supplier_status: "inactive",
    supplier_rating: 3.2,
    vendor: "Manufacturing",
    country: "China",
    street_address: "789 Industrial Blvd",
    city: "Shanghai",
    state: "SH",
    postal_code: "200000",
    year_established: 2000,
    annual_revenue: 5000000,
    products_count: 312,
    orders_count: 210,
    last_order_date: "2025-02-28",
    payment_terms: "Net 60",
    credit_limit: 100000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
  {
    _id: "4",
    supplierId: "SUP-004",
    full_name: "Emily Davis",
    shop_name: "EcoPack Solutions",
    phone_number: "+1 (555) 789-0123",
    email: "emily@ecopacksolutions.com",
    supplier_status: "pending",
    supplier_rating: 4.0,
    vendor: "Packaging Supplier",
    country: "United Kingdom",
    street_address: "10 Green Street",
    city: "London",
    state: "LDN",
    postal_code: "EC1A 1BB",
    year_established: 2015,
    annual_revenue: 800000,
    products_count: 87,
    orders_count: 42,
    last_order_date: "2025-03-05",
    payment_terms: "Net 15",
    credit_limit: 25000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
  {
    _id: "5",
    supplierId: "SUP-005",
    full_name: "Robert Wilson",
    shop_name: "Wilson Logistics",
    phone_number: "+1 (555) 234-5678",
    email: "robert@wilsonlogistics.com",
    supplier_status: "active",
    supplier_rating: 4.7,
    vendor: "Logistics Provider",
    country: "Australia",
    street_address: "25 Harbor Road",
    city: "Sydney",
    state: "NSW",
    postal_code: "2000",
    year_established: 2008,
    annual_revenue: 3000000,
    products_count: 0,
    orders_count: 156,
    last_order_date: "2025-03-12",
    payment_terms: "Net 30",
    credit_limit: 80000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
  {
    _id: "6",
    supplierId: "SUP-006",
    full_name: "Jennifer Lopez",
    shop_name: "JL Tech Solutions",
    phone_number: "+1 (555) 345-6789",
    email: "jennifer@jltech.com",
    supplier_status: "active",
    supplier_rating: 4.9,
    vendor: "Technology Supplier",
    country: "United States",
    street_address: "500 Tech Parkway",
    city: "San Francisco",
    state: "CA",
    postal_code: "94107",
    year_established: 2012,
    annual_revenue: 4500000,
    products_count: 203,
    orders_count: 187,
    last_order_date: "2025-03-18",
    payment_terms: "Net 15",
    credit_limit: 90000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
  {
    _id: "7",
    supplierId: "SUP-007",
    full_name: "David Kim",
    shop_name: "Kim's Auto Parts",
    phone_number: "+1 (555) 456-7890",
    email: "david@kimsautoparts.com",
    supplier_status: "inactive",
    supplier_rating: 3.5,
    vendor: "Parts Supplier",
    country: "South Korea",
    street_address: "123 Seoul Street",
    city: "Seoul",
    state: "SL",
    postal_code: "04524",
    year_established: 2007,
    annual_revenue: 1200000,
    products_count: 175,
    orders_count: 89,
    last_order_date: "2025-02-20",
    payment_terms: "Net 30",
    credit_limit: 40000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
  {
    _id: "8",
    supplierId: "SUP-008",
    full_name: "Maria Garcia",
    shop_name: "Garcia Manufacturing",
    phone_number: "+1 (555) 567-8901",
    email: "maria@garciamanufacturing.com",
    supplier_status: "active",
    supplier_rating: 4.6,
    vendor: "Manufacturing",
    country: "Mexico",
    street_address: "789 Industrial Avenue",
    city: "Mexico City",
    state: "CDMX",
    postal_code: "06000",
    year_established: 2003,
    annual_revenue: 2800000,
    products_count: 230,
    orders_count: 145,
    last_order_date: "2025-03-08",
    payment_terms: "Net 45",
    credit_limit: 70000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
  {
    _id: "9",
    supplierId: "SUP-009",
    full_name: "James Brown",
    shop_name: "Brown Electrical Supplies",
    phone_number: "+1 (555) 678-9012",
    email: "james@brownelectrical.com",
    supplier_status: "pending",
    supplier_rating: 3.8,
    vendor: "Electrical Supplier",
    country: "United States",
    street_address: "456 Power Lane",
    city: "Chicago",
    state: "IL",
    postal_code: "60601",
    year_established: 2011,
    annual_revenue: 950000,
    products_count: 112,
    orders_count: 67,
    last_order_date: "2025-03-01",
    payment_terms: "Net 30",
    credit_limit: 35000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
  {
    _id: "10",
    supplierId: "SUP-010",
    full_name: "Linda Martinez",
    shop_name: "Martinez Tools & Equipment",
    phone_number: "+1 (555) 789-0123",
    email: "linda@martineztools.com",
    supplier_status: "active",
    supplier_rating: 4.3,
    vendor: "Tools Supplier",
    country: "Spain",
    street_address: "25 Valencia Street",
    city: "Barcelona",
    state: "BCN",
    postal_code: "08001",
    year_established: 2009,
    annual_revenue: 1800000,
    products_count: 198,
    orders_count: 110,
    last_order_date: "2025-03-14",
    payment_terms: "Net 30",
    credit_limit: 55000,
    profile_image: "/placeholder.svg?height=40&width=40",
  },
];

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: "2rem",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
  background: "linear-gradient(to right, #ffffff, #f8f9fa)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "6px",
    height: "100%",
    background: "linear-gradient(to bottom, #42A1DA, #2980b9)",
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #2980b9 0%, #1e6091 100%)",
    boxShadow: "0 4px 12px rgba(66, 161, 218, 0.3)",
  },
}));

export const SectionTitle = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.1rem",
  color: "#2980b9",
  marginBottom: "1rem",
  display: "flex",
  alignItems: "center",
  "&::after": {
    content: '""',
    flex: 1,
    height: "1px",
    background:
      "linear-gradient(to right, rgba(66, 161, 218, 0.5), transparent)",
    marginLeft: "10px",
  },
});

export const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-alternativeLabel`]: {
    top: 22,
  },
  [`&.MuiStepConnector-active`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage:
        "linear-gradient( 95deg, #42A1DA 0%, #2980b9 50%, #1e6091 100%)",
    },
  },
  [`&.MuiStepConnector-completed`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage:
        "linear-gradient( 95deg, #42A1DA 0%, #2980b9 50%, #1e6091 100%)",
    },
  },
  [`& .MuiStepConnector-line`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

export const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, #42A1DA 0%, #2980b9 50%, #1e6091 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, #42A1DA 0%, #2980b9 50%, #1e6091 100%)",
  }),
}));

export const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  border: "1px solid rgba(66, 161, 218, 0.2)",
  backgroundColor: "rgba(66, 161, 218, 0.05)",
}));

export const steps = [
  "Supplier Information",
  "Bill Details",
  "Payment Information",
  "Review & Submit",
];

export const mileageStyle = {
  margin: "2px",
  backgroundColor: "primary.main",
  color: "white",
  fontWeight: "bold",
};

export const outlinedInputSx = {
  borderRadius: "12px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e2e8f0",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cbd5e1",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#8b5cf6",
    borderWidth: "2px",
  },
};

export const outlinedInputWrapperSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#8b5cf6",
      borderWidth: "2px",
    },
  },
};

export const productStyle = {
  borderRadius: "20px",
  border: "1px solid rgba(226, 232, 240, 0.8)",
  mt: 4,
  overflow: "hidden",
  background:
    "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
};

export const productBox = {
  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  py: 2,
  px: 3,
  display: "flex",
  alignItems: "center",
};

export const inputFieldSx = {
  borderRadius: "12px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e2e8f0",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cbd5e1",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#8b5cf6",
    borderWidth: "2px",
  },
};
export const avatarStyle = {
  width: 32,
  height: 32,
  mr: 1.5,
  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  color: "white",
  boxShadow: "0 3px 6px rgba(139, 92, 246, 0.3)",
};
export const avatarStyle2 = {
  width: 28,
  height: 28,
  mr: 1.5,
  bgcolor: alpha("#0ea5e9", 0.1),
  color: "#0ea5e9",
};
export const textInuptStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#8b5cf6",
      borderWidth: "2px",
    },
  },
};

export const GradientCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.95
  )}, ${alpha(theme.palette.background.paper, 0.85)})`,
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  overflow: "visible",
  position: "relative",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: `0 12px 48px ${alpha(theme.palette.primary.main, 0.2)}`,
    transform: "translateY(-5px)",
  },
}));

export const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  width: { xs: 0, md: 140 },
  height: { xs: 0, md: 140 },
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

export const EnhancedProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
  },
}));

export const GlassBox = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  padding: theme.spacing(3),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
}));

export const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  "& .MuiCardHeader-title": {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  "& .MuiCardHeader-subheader": {
    color: alpha(theme.palette.text.primary, 0.6),
  },
  "& .MuiCardHeader-avatar": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
}));

export const GradientBox = styled(Box)(
  ({ theme, gradientColors = ["primary", "secondary"] }) => ({
    background: `linear-gradient(135deg, ${theme.palette[gradientColors[0]].main
      }, ${theme.palette[gradientColors[1]].main})`,
    color: theme.palette.common.white,
    borderRadius: 16,
    padding: theme.spacing(3),
    boxShadow: `0 8px 32px ${alpha(
      theme.palette[gradientColors[0]].main,
      0.3
    )}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: `0 12px 48px ${alpha(
        theme.palette[gradientColors[0]].main,
        0.4
      )}`,
    },
  })
);

export const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const addButtonStyle = {
  height: "54px",
  width: "50px",
  marginTop: "8px",
  minWidth: 0,
  padding: 0,
  color: "#fff",
  borderRadius: "12px",
};

export const AnimatedTab = styled(StyledTab)(({ theme }) => ({
  transition: "all 0.3s ease",
  borderRadius: "8px 8px 0 0",
  margin: "0 4px",
  minHeight: 60,
  fontWeight: 600,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: "translateY(-3px)",
  },
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.main,
    transform: "translateY(-3px)",
  },
}));

export const EnhancedStepper = styled(Stepper)(({ theme }) => ({
  "& .MuiStepLabel-root": {
    padding: theme.spacing(1, 0),
  },
  "& .MuiStepLabel-iconContainer": {
    "& .MuiStepIcon-root": {
      color: alpha(theme.palette.primary.main, 0.4),
      "&.Mui-active": {
        color: theme.palette.primary.main,
        boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: "50%",
      },
      "&.Mui-completed": {
        color: theme.palette.success.main,
      },
    },
  },
  "& .MuiStepConnector-line": {
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

export const ProgressIndicator = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  "& .MuiLinearProgress-bar": {
    borderRadius: 3,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

export const EnhancedDivider = styled(Divider)(({ theme }) => ({
  "&::before, &::after": {
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
  margin: theme.spacing(4, 0),
}));

export const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginBottom: theme.spacing(3),
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
  },
}));

export const EnhancedSectionTitle = styled(SectionTitle)(({ theme }) => ({
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 60,
    height: 3,
    borderRadius: 1.5,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
}));

export const suggestionStyles = {
  suggestionContainer: {
    position: "relative",
    width: "100%",
  },
  suggestionsList: {
    position: "absolute",
    top: "100%",
    left: 0,
    zIndex: 1000,
    width: "100%",
    maxHeight: "200px",
    overflowY: "auto",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    marginTop: "2px",
  },
  suggestionItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
  suggestionItemActive: {
    backgroundColor: "#f0f0f0",
  },
  suggestionItemContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  suggestionItemName: {
    fontWeight: "bold",
  },
  suggestionItemPrice: {
    color: "#42A1DA",
  },
};
export const ResponsiveCalendarContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiCalendarPicker-root, & .MuiPickersCalendarHeader-root, & .MuiDayPicker-header, & .MuiDayPicker-monthContainer":
  {
    width: "100%",
    maxWidth: "100%",
  },
  "& .MuiPickersDay-root": {
    margin: "1px",
    [theme.breakpoints.down("sm")]: {
      margin: "0px",
      fontSize: "0.75rem",
      padding: "0px",
      height: "32px",
      width: "32px",
    },
  },
  "& .MuiPickersCalendarHeader-label": {
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },
  "& .MuiPickersCalendarHeader-switchViewButton, & .MuiPickersArrowSwitcher-button":
  {
    [theme.breakpoints.down("sm")]: {
      padding: "4px",
    },
  },
  "& .MuiDayPicker-weekDayLabel": {
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.75rem",
      width: "32px",
      height: "24px",
    },
  },
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  overflow: "hidden",
  position: "relative",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
  },
}));

export const GlowingBorder = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 4,
  background: "linear-gradient(90deg, #42A1DA, #F77F00, #42A1DA)",
  backgroundSize: "200% 100%",
  animation: "glow 3s linear infinite",
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#42A1DA",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    padding: "16px",
  },
  "& .MuiDataGrid-cell": {
    padding: "16px",
    fontSize: "14px",
  },
  "& .MuiDataGrid-row:nth-of-type(even)": {
    backgroundColor: "#f9f9f9",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(66, 161, 218, 0.08)",
  },
  "& .MuiDataGrid-footerContainer": {
    display: "none",
  },
}));

export const ActionButton = styled(Button)(({ theme, color }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: "600",
  boxShadow: "none",
  padding: "6px 12px",
}));

export const StyledModal = styled(TASRightSideModal)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "8px 0 0 8px",
  },
}));

export const StyledForm = styled(GarageForm)(({ theme }) => ({
  "& .MuiGrid-item": {
    marginBottom: theme.spacing(2),
  },
}));

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const GlowingBadge = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: "linear-gradient(45deg, #ff00ea, #00fffb)",
    zIndex: -1,
    filter: "blur(5px)",
    borderRadius: "50%",
    animation: "glowing 1.5s linear infinite",
  },
  "@keyframes glowing": {
    "0%": { opacity: 0.5 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0.5 },
  },
}));

export const StatusCard = styled(Card)(({ theme, status }) => ({
  borderRadius: "16px",
  marginBottom: theme.spacing(2),
  background:
    status === "active"
      ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
      : status === "expired"
        ? "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
        : "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
  color: "white",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
}));

export const PaymentStatusCard = styled(Card)(({ theme, ispaid }) => ({
  background:
    ispaid === "true"
      ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
      : "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
  color: "white",
  borderRadius: "16px",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  animation: ispaid === "false" ? "pulse 2s infinite" : "none",
  "@keyframes pulse": {
    "0%": {
      boxShadow: "0 8px 32px rgba(244, 67, 54, 0.2)",
    },
    "50%": {
      boxShadow: "0 8px 32px rgba(244, 67, 54, 0.4)",
    },
    "100%": {
      boxShadow: "0 8px 32px rgba(244, 67, 54, 0.2)",
    },
  },
}));

export const GradientBorder = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 4,
  background: "linear-gradient(90deg, #42A1DA, #F77F00, #42A1DA)",
  backgroundSize: "200% 100%",
  animation: "gradientMove 5s ease infinite",
}));

export const StyledCalendar = styled(CalendarMonth)(({ theme }) => ({
  "& .rbc-today": {
    backgroundColor: theme.palette.primary.light,
  },
  "& .rbc-event": {
    backgroundColor: theme.palette.secondary.main,
  },
  "& .rbc-header": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 4,
  fontWeight: "bold",
  "&.in-stock": {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.dark,
  },
  "&.low-stock": {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.dark,
  },
  "&.out-of-stock": {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.dark,
  },
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

export const btnStyle = {
  background: "rgba(255, 255, 255, 0.9)",
  color: "#0B1F3A",
  fontWeight: 600,
  fontSize: {
    xs: "13px",
    sm: "15px",
  },
  width: "70%",
  padding: "0px",
  margin: "0 auto",
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.1)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#42A1DA",
    borderColor: "#42A1DA",
    transform: "scale(1.02)",
  },
};
export const btnStyle2 = {
  background: "#fff",
  width: "125px",
  padding: "0px",
  height: "35px",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#42A1DA",
    border: "1px solid #42A1DA",
  },
};
export const labelStyle = {
  color: "red",
  fontSize: "25px",
};

export const wareHouseInput = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    },
  },
};

export const wareHouseButton = {
  borderRadius: 2,
  py: 1,
  px: 3,
  color: "#fff",
  boxShadow: `0 4px 14px ${alpha("#006a4e", 0.4)}`,
  background: `linear-gradient(45deg, #006a4e 30%, #00a651 90%)`,
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px ${alpha("#006a4e", 0.6)}`,
  },
};
export const wareHouseCard = {
  height: "100%",
  background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
  },
  borderRadius: 3,
};

export const NoteHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  gap: "8px",
}));

export const NoteDate = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  marginTop: "4px",
}));

export const PriorityTag = styled("span")(({ priority, theme }) => ({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "0.7rem",
  fontWeight: "600",
  marginLeft: "auto",
  backgroundColor:
    priority === "high"
      ? theme.palette.error.light
      : priority === "medium"
        ? theme.palette.warning.light
        : theme.palette.success.light,
  color:
    priority === "high"
      ? theme.palette.error.contrastText
      : priority === "medium"
        ? theme.palette.warning.contrastText
        : theme.palette.success.contrastText,
}));

export const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    background: alpha("#ffffff", 0.05),
    "& fieldset": {
      borderColor: alpha("#06b6d4", 0.3),
    },
    "&:hover fieldset": {
      borderColor: alpha("#06b6d4", 0.5),
    },
    "&.Mui-focused fieldset": {
      borderColor: "#06b6d4",
    },
  },
  "& .MuiInputLabel-root": {
    color: alpha("#ffffff", 0.7),
  },
  "& .MuiOutlinedInput-input": {
    color: "#ffffff",
  },
};
export const searchInput = {
  minWidth: { xs: "100%", sm: "300px" },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  },
}
export const wrapBoxStyle = { p: 1, borderRadius: 2, mt: 2 }
export const buttonStyle = {
  background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
  py: 3,
  fontSize: "1.1rem",
  fontWeight: 700,
  borderRadius: 3,
  boxShadow: `0 15px 40px ${alpha("#06b6d4", 0.4)}`,
  "&:hover": {
    background: "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
    boxShadow: `0 20px 50px ${alpha("#06b6d4", 0.5)}`,
  },
};
export const expenseInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3b82f6",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3b82f6",
      borderWidth: 2,
    },
  },
};

export const SupplierScoreCard = styled(Box)(({ theme, score }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor:
    score >= 80
      ? "rgba(46, 125, 50, 0.1)"
      : score >= 60
        ? "rgba(237, 108, 2, 0.1)"
        : "rgba(211, 47, 47, 0.1)",
  color: score >= 80 ? "#2e7d32" : score >= 60 ? "#ed6c02" : "#d32f2f",
  border: `1px solid ${score >= 80
    ? "rgba(46, 125, 50, 0.3)"
    : score >= 60
      ? "rgba(237, 108, 2, 0.3)"
      : "rgba(211, 47, 47, 0.3)"
    }`,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

export const GlassCard2 = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  padding: theme.spacing(3),
}));

export const modalStyle = {
  border: "none",
  "& .MuiDataGrid-cell": {
    borderColor: alpha("#6a1b9a", 0.1),
    whiteSpace: "nowrap",
  },
  "& .MuiDataGrid-columnHeaders": {
    bgcolor: alpha("#6a1b9a", 0.05),
  },
  "& .MuiDataGrid-toolbarContainer": {
    bgcolor: alpha("#6a1b9a", 0.02),
    borderRadius: 1,
    p: 1,
    mb: 1,
  },
  "& .MuiDataGrid-row:hover": {
    bgcolor: alpha("#6a1b9a", 0.05),
  },
  "& .MuiCheckbox-root.Mui-checked": {
    color: "#6a1b9a",
  },
  "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
    color: alpha("#6a1b9a", 0.7),
  },
}

export const modalBox = {
  width: "100%",
  overflow: "auto",
  "& .MuiDataGrid-root": {
    minWidth: "800px",
  },
  "& .MuiDataGrid-columnHeaders": {
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "white",
  },
  "& .MuiDataGrid-virtualScroller": {
    overflow: "visible",
  },
}
export const pBtnStyle = {
  borderRadius: 100,
  background:
    "linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)",
  boxShadow:
    "0 4px 10px rgba(106, 27, 154, 0.3)",
  px: 3,
  color: "white",
}


export const cardStyle = {
  borderRadius: 2,
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}

export const purchaseBtn = {
  color: '#fff',
  borderRadius: 2,

  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
}

export const buttonBox = { mt: '15px', display: 'flex', gap: '5px', justifyContent: 'end', padding: 1 }
