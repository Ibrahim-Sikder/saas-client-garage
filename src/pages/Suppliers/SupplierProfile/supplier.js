/* eslint-disable no-unused-vars */
import { Box, Chip, Paper, Rating, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
// Styled components for unique design elements
export const GradientBox = styled(Box)(({ theme, gradientColors }) => ({
  background: `linear-gradient(135deg, ${
    gradientColors || "#4a00e0 0%, #8e2de2 100%"
  })`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  color: "white",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  },
}));

export const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: "#FFD700",
  },
  "& .MuiRating-iconHover": {
    color: "#FFEB3B",
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 60,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  borderRadius: "8px 8px 0 0",
  marginRight: 2,
  transition: "all 0.3s ease",
  "&.Mui-selected": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: 4,
    borderRadius: 2,
  },
  backgroundColor: "rgba(0, 0, 0, 0.03)",
  borderRadius: 8,
  padding: "4px",
}));

export const GlassCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  padding: theme.spacing(3),
}));

export const StatusChip = styled(Chip)(({ theme, statuscolor }) => ({
  fontWeight: 600,
  backgroundColor:
    statuscolor === "green"
      ? "rgba(46, 125, 50, 0.1)"
      : statuscolor === "orange"
      ? "rgba(237, 108, 2, 0.1)"
      : statuscolor === "red"
      ? "rgba(211, 47, 47, 0.1)"
      : "rgba(25, 118, 210, 0.1)",
  color:
    statuscolor === "green"
      ? "#2e7d32"
      : statuscolor === "orange"
      ? "#ed6c02"
      : statuscolor === "red"
      ? "#d32f2f"
      : "#1976d2",
  "& .MuiChip-icon": {
    color: "inherit",
  },
}));

// Mock data for supplier profile
export const supplierData = {
  id: "SUP-010023",
  name: "Global Auto Parts Ltd.",
  contactPerson: "Michael Chen",
  email: "michael@globalautoparts.com",
  phone: "+8801765432187",
  alternatePhone: "+8801765432188",
  joinDate: "12/05/2021",
  address: "75 Industrial Avenue, Sector 5",
  city: "Singapore",
  country: "Singapore",
  postalCode: "238859",
  website: "www.globalautoparts.com",
  taxId: "TAX-87654321",
  businessLicense: "BL-2021-45678",
  rating: 4.8,
  status: "Active",
  verificationStatus: "Verified",
  creditLimit: 50000,
  currentCredit: 32500,
  availableCredit: 17500,
  paymentTerms: "Net 30",
  discountTerms: "2% 10 Net 30",
  categories: [
    "Engine Parts",
    "Brake Systems",
    "Electrical Components",
    "Suspension",
    "Transmission",
  ],
  specialties: ["OEM Parts", "Performance Parts", "Genuine Toyota Parts"],
  bankName: "HSBC Bank",
  accountNumber: "********7654",
  accountHolder: "Global Auto Parts Ltd.",
  bankBranch: "Singapore Central",
  swiftCode: "HSBCSGSG",
  routingNumber: "123456789",
  emergencyContact: {
    name: "Sarah Wong",
    relationship: "Operations Manager",
    phone: "+8801765432188",
    email: "sarah@globalautoparts.com",
  },
  operatingHours: "Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM",
  leadTime: "3-5 business days",
  minimumOrderValue: 500,
  returnPolicy: "30 days return for defective items",
  warrantyPolicy: "1 year manufacturer warranty",
  notes:
    "Preferred supplier for Toyota genuine parts. Offers bulk discounts for orders above $5000.",
  documents: [
    {
      id: "DOC-001",
      name: "Business Registration",
      type: "PDF",
      uploadDate: "12/05/2021",
      status: "Verified",
    },
    {
      id: "DOC-002",
      name: "Tax Certificate",
      type: "PDF",
      uploadDate: "12/05/2021",
      status: "Verified",
    },
    {
      id: "DOC-003",
      name: "Product Catalog",
      type: "PDF",
      uploadDate: "01/15/2022",
      status: "Active",
    },
    {
      id: "DOC-004",
      name: "Quality Certification",
      type: "PDF",
      uploadDate: "03/10/2022",
      status: "Verified",
    },
  ],
  contacts: [
    {
      id: "CON-001",
      name: "Michael Chen",
      position: "CEO",
      phone: "+8801765432187",
      email: "michael@globalautoparts.com",
      primary: true,
    },
    {
      id: "CON-002",
      name: "Sarah Wong",
      position: "Operations Manager",
      phone: "+8801765432188",
      email: "sarah@globalautoparts.com",
      primary: false,
    },
    {
      id: "CON-003",
      name: "David Lim",
      position: "Sales Manager",
      phone: "+8801765432189",
      email: "david@globalautoparts.com",
      primary: false,
    },
  ],
  locations: [
    {
      id: "LOC-001",
      name: "Headquarters",
      address: "75 Industrial Avenue, Sector 5, Singapore",
      primary: true,
    },
    {
      id: "LOC-002",
      name: "Warehouse",
      address: "120 Logistics Park, Singapore",
      primary: false,
    },
  ],
  performance: {
    qualityScore: 92,
    deliveryScore: 95,
    priceScore: 88,
    communicationScore: 90,
    overallScore: 91,
    onTimeDelivery: 95,
    qualityRating: 4.8,
    returnRate: 2,
    priceCompetitiveness: 92,
    responseTime: "2 hours",
    fulfillmentRate: 98,
    defectRate: 0.5,
  },
  financials: {
    totalPurchases: 256000,
    ytdPurchases: 86000,
    lastMonthPurchases: 12500,
    averageOrderValue: 3200,
    outstandingPayments: 15000,
    paymentHistory: {
      onTime: 95,
      late: 5,
      average: 28,
    },
  },
};

// Mock data for recent orders
export const recentOrders = [
  {
    id: "PO-2023",
    date: "Mar 15, 2025",
    items: 12,
    amount: 8500,
    status: "Delivered",
    deliveryDate: "Mar 18, 2025",
    paymentStatus: "Paid",
  },
  {
    id: "PO-1987",
    date: "Mar 02, 2025",
    items: 8,
    amount: 4200,
    status: "Delivered",
    deliveryDate: "Mar 05, 2025",
    paymentStatus: "Paid",
  },
  {
    id: "PO-1954",
    date: "Feb 22, 2025",
    items: 15,
    amount: 12800,
    status: "Pending",
    deliveryDate: "Mar 25, 2025",
    paymentStatus: "Pending",
  },
  {
    id: "PO-1932",
    date: "Feb 15, 2025",
    items: 5,
    amount: 3200,
    status: "Delivered",
    deliveryDate: "Feb 18, 2025",
    paymentStatus: "Paid",
  },
  {
    id: "PO-1921",
    date: "Feb 10, 2025",
    items: 10,
    amount: 6500,
    status: "Delivered",
    deliveryDate: "Feb 13, 2025",
    paymentStatus: "Paid",
  },
];

// Mock data for inventory items
export const inventoryItems = [
  {
    id: "INV-1001",
    name: "Brake Pads (Toyota)",
    stock: 45,
    price: 85,
    lastOrder: "Mar 15, 2025",
    category: "Brake Systems",
    minStock: 20,
    status: "In Stock",
  },
  {
    id: "INV-1002",
    name: "Oil Filters Premium",
    stock: 78,
    price: 35,
    lastOrder: "Mar 02, 2025",
    category: "Engine Parts",
    minStock: 30,
    status: "In Stock",
  },
  {
    id: "INV-1003",
    name: "Spark Plugs Set",
    stock: 120,
    price: 25,
    lastOrder: "Feb 22, 2025",
    category: "Engine Parts",
    minStock: 50,
    status: "In Stock",
  },
  {
    id: "INV-1004",
    name: "Alternator (Honda)",
    stock: 12,
    price: 250,
    lastOrder: "Feb 15, 2025",
    category: "Electrical Components",
    minStock: 10,
    status: "In Stock",
  },
  {
    id: "INV-1005",
    name: "Shock Absorbers",
    stock: 8,
    price: 120,
    lastOrder: "Feb 10, 2025",
    category: "Suspension",
    minStock: 10,
    status: "Low Stock",
  },
];
