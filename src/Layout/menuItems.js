import { getIcon } from "../utils/iconHelper";

export const getMenuItems = (user, handleLogout) => [
  {
    id: "dashboard",
    type: "single",
    icon: getIcon("HiOutlineHome", "hi", 35),
    text: "Dashboard",
    link: "/dashboard",
  },
  {
    id: "panel12",
    type: "accordion",
    title: "Client",
    icon: getIcon("HiOutlineUserGroup", "hi", 22),
    items: [
      {
        icon: getIcon("HiOutlineUserAdd", "hi"),
        text: "Customer Add",
        link: "/dashboard/add-customer",
      },
      {
        icon: getIcon("FaUserFriends", "fa"),
        text: "Customer List",
        link: "/dashboard/customer-list",
      },
      {
        icon: getIcon("Business", "mui"),
        text: "Company Add",
        link: "/dashboard/add-company",
      },
      {
        icon: getIcon("HiOutlineOfficeBuilding", "hi"),
        text: "Company List",
        link: "/dashboard/company-list",
      },
      {
        icon: getIcon("Store", "mui"),
        text: "Show Room Add",
        link: "/dashboard/add-show-room",
      },
      {
        icon: getIcon("Storefront", "mui"),
        text: "Show Room List",
        link: "/dashboard/show-room-list",
      },
    ],
  },
  {
    id: "panel1",
    type: "accordion",
    title: "Vehicle Job Card",
    icon: getIcon("DirectionsCar", "mui"),
    items: [
      {
        icon: getIcon("Assignment", "mui"),
        text: "Job Card Add",
        link: "/dashboard/create-job-card",
      },
      {
        icon: getIcon("FaClipboardList", "fa"),
        text: "Job Card List",
        link: "/dashboard/jobcard-list",
      },
    ],
  },
  {
    id: "Vehicles ",
    type: "single",
    icon: getIcon("DirectionsCar", "mui"),
    text: "Vehicles",
    link: "/dashboard/vehicles",
  },
  {
    id: "panel2",
    type: "accordion",
    title: "Quotation",
    icon: getIcon("RequestQuote", "mui"),
    items: [
      {
        icon: getIcon("HiOutlineDocumentText", "hi", 24),
        text: "Quotation Add",
        link: "/dashboard/create-quotation",
      },
      {
        icon: getIcon("HiOutlineDocumentDuplicate", "hi", 24),
        text: "Quotation List",
        link: "/dashboard/quotation-list",
      },
    ],
  },
  {
    id: "panel3",
    type: "accordion",
    title: "Invoice Card",
    icon: getIcon("Receipt", "mui"),
    items: [
      {
        icon: getIcon("FaFileInvoice", "fa"),
        text: "Invoice Add",
        link: "/dashboard/create-invoice",
      },
      {
        icon: getIcon("FaFileInvoiceDollar", "fa"),
        text: "Invoice List",
        link: "/dashboard/invoice-list",
      },
    ],
  },
  {
    id: "panel4",
    type: "accordion",
    title: "Money receipt",
    icon: getIcon("CurrencyExchange", "mui"),
    items: [
      {
        icon: getIcon("FaMoneyBillWave", "fa"),
        text: "Money Receipt Add",
        link: "/dashboard/money-receive-create",
      },
      {
        icon: getIcon("FaMoneyBill", "fa"),
        text: "Money Receipt List",
        link: "/dashboard/money-receipt-list",
      },
    ],
  },
  {
    id: "panel5",
    type: "accordion",
    title: "Projects",
    icon: getIcon("FaProjectDiagram", "fa", 22),
    items: [
      {
        icon: getIcon("FaRunning", "fa", 22),
        text: "Running Project",
        link: "/dashboard/running-project",
      },
      {
        icon: getIcon("FaCheckCircle", "fa", 22),
        text: "Complete Project",
        link: "/dashboard/complete-project",
      },
    ],
  },
  {
    id: "panel17",
    type: "accordion",
    title: "Suppliers",
    icon: getIcon("LocalShipping", "mui"),
    items: [
      {
        icon: getIcon("PersonAdd", "mui"),
        text: "Add Supplier",
        link: "/dashboard/add-supplier",
      },
      {
        icon: getIcon("FaTruck", "fa"),
        text: "Supplier List",
        link: "/dashboard/supplier-list",
      },
    ],
  },
  {
    id: "panel-product",
    type: "accordion",
    title: "Product",
    icon: getIcon("Inventory", "mui"),
    items: [
      {
        icon: getIcon("Add", "mui"),
        text: "Product Add",
        link: "/dashboard/add-product",
      },
      {
        icon: getIcon("List", "mui"),
        text: "Product List",
        link: "/dashboard/product-list",
      },
      {
        icon: getIcon("Category", "mui"),
        text: "Product Type",
        link: "/dashboard/product-type",
      },
      {
        icon: getIcon("HiOutlineExclamation", "hi"),
        text: "Expired Product",
        link: "/dashboard/expired-products",
      },
      {
        icon: getIcon("FaTags", "fa"),
        text: "Category",
        link: "/dashboard/category",
      },
      {
        icon: getIcon("LocalOffer", "mui"),
        text: "Brand",
        link: "/dashboard/brand",
      },
      {
        icon: getIcon("Widgets", "mui"),
        text: "Unit",
        link: "/dashboard/unit",
      },
      {
        icon: getIcon("Difference", "mui"),
        text: "Variant Attributes",
        link: "/dashboard/variants",
      },
      {
        icon: getIcon("FaBarcode", "fa"),
        text: "Generate Barcode",
        link: "/dashboard/barcode",
      },
    ],
  },
  {
    id: "panel18",
    type: "accordion",
    title: "Purchase",
    icon: getIcon("ShoppingCart", "mui"),
    items: [
      {
        icon: getIcon("PointOfSale", "mui"),
        text: "Purchase Order",
        link: "/dashboard/purchase-order",
      },
      {
        icon: getIcon("AddShoppingCart", "mui"),
        text: "Purchase Add",
        link: "/dashboard/add-purchase",
      },
      {
        icon: getIcon("FaTruck", "fa"),
        text: "Purchase List",
        link: "/dashboard/purchase-list",
      },
      {
        icon: getIcon("HiOutlineReceiptRefund", "hi"),
        text: "Purchase Return",
        link: "/dashboard/purchase-return",
      },
    ],
  },
  {
    id: "panel6",
    type: "accordion",
    title: "Inventory",
    icon: getIcon("ShoppingBag", "mui"),
    items: [
      {
        icon: getIcon("Inventory2", "mui"),
        text: "Mange Stock",
        link: "/dashboard/stock",
      },
      {
        icon: getIcon("MdOutlineWarehouse", "md", 24),
        text: "Warehouse Stock",
        link: "/dashboard/warehouse-stock",
      },
      {
        icon: getIcon("MdOutlineInventory", "md", 24),
        text: "Manage Warehouse",
        link: "/dashboard/warehouse",
      },
      {
        icon: getIcon("HiOutlineSwitchHorizontal", "hi", 24),
        text: "Stock Transfer",
        link: "/dashboard/stock-transfer",
      },
      {
        icon: getIcon("TbAdjustmentsCheck", "tb", 24),
        text: "Quantity Adjustment",
        link: "/dashboard/quantity-adjustment",
      },
      {
        icon: getIcon("HiOutlineShieldCheck", "hi", 24),
        text: "Warranties",
        link: "/dashboard/warranties",
      },
      {
        icon: getIcon("FaExclamationTriangle", "fa", 24),
        text: "Low Stock Alert",
        link: "/dashboard/low-stocks",
      },
      {
        icon: getIcon("TbTransformFilled", "tb"),
        text: "Stock Transaction",
        link: "/dashboard/stock-transaction",
      },
    ],
  },
  {
    id: "panel10",
    type: "accordion",
    title: "Finance",
    icon: getIcon("AccountBalance", "mui", 22),
    items: [
      {
        icon: getIcon("Payments", "mui"),
        text: "Add Income",
        link: "/dashboard/add-income",
      },
      {
        icon: getIcon("MonetizationOn", "mui"),
        text: "Income List",
        link: "/dashboard/income-list",
      },
      {
        icon: getIcon("MoneyOff", "mui"),
        text: "Expense Add",
        link: "/dashboard/add-expense",
      },
      {
        icon: getIcon("FaMoneyBillAlt", "fa"),
        text: "Expense List",
        link: "/dashboard/expense-list",
      },
      {
        icon: getIcon("Category", "mui"),
        text: "Expense Categories",
        link: "/dashboard/expense-categories",
      },
      {
        icon: getIcon("Savings", "mui"),
        text: "Donation Add",
        link: "/dashboard/create-donation",
      },
      {
        icon: getIcon("ReceiptLong", "mui"),
        text: "Donation List",
        link: "/dashboard/donation-list",
      },
    ],
  },
  {
    id: "panel13",
    type: "accordion",
    title: "HRM",
    icon: getIcon("FaUsers", "fa", 22),
    items: [
      {
        icon: getIcon("FaUserPlus", "fa"),
        text: "Employee Add",
        link: "/dashboard/add-employee",
      },
      {
        icon: getIcon("Group", "mui"),
        text: "Employee List",
        link: "/dashboard/employee-list",
      },
      {
        icon: getIcon("CalendarToday", "mui"),
        text: "Attendance Add",
        link: "/dashboard/add-attendance",
      },
      {
        icon: getIcon("FaCalendarAlt", "fa"),
        text: "Attendance List",
        link: "/dashboard/attendance-list",
      },
      {
        icon: getIcon("EventNote", "mui"),
        text: "Leave",
        link: "/dashboard/employee-leave",
      },
      {
        icon: getIcon("Payments", "mui"),
        text: "Add Salary",
        link: "/dashboard/add-salary",
      },
      {
        icon: getIcon("Payments", "mui"),
        text: "Salary List",
        link: "/dashboard/salary-list",
      },
    ],
  },
  {
    id: "panel30",
    type: "accordion",
    title: "Tenant & UI Management",
    icon: getIcon("AdminPanelSettings", "mui", 22),
    items: [
      {
        icon: getIcon("Business", "mui"),
        text: "All Tenant List",
        link: "/dashboard/all-tenant-list",
      },
      {
        icon: getIcon("ContactMail", "mui"),
        text: "Contact Customer List",
        link: "/dashboard/contact-customer",
      },
      {
        icon: getIcon("BrandingWatermark", "mui"),
        text: "Company Brand",
        link: "/dashboard/company-brand",
      },
      {
        icon: getIcon("Star", "mui"),
        text: "Client Review",
        link: "/dashboard/review",
      },
    ],
    condition: user.role === "admin",
  },
  {
    id: "all-user-list",
    type: "single",
    icon: getIcon("Group", "mui", 22),
    text: "All User List",
    link: "/dashboard/all-user-list",
  },
  {
    id: "panel27",
    type: "accordion",
    title: "Report",
    icon: getIcon("Report", "mui"),
    items: [
      {
        icon: getIcon("RequestQuote", "mui"),
        text: "Income Report",
        link: "/dashboard/income-report",
      },
      {
        icon: getIcon("CurrencyExchange", "mui"),
        text: "Expense Report",
        link: "/dashboard/expense-report",
      },
      {
        icon: getIcon("VolunteerActivism", "mui"),
        text: "Donation Report",
        link: "/dashboard/donation-report",
      },
      {
        icon: getIcon("Receipt", "mui"),
        text: "Invoice Report",
        link: "/dashboard/invoice-report",
      },
    ],
  },
  {
    id: "panel27-permission",
    type: "accordion",
    title: "Permission",
    icon: getIcon("Security", "mui"),
    items: [
      {
        icon: getIcon("FaUserCog", "fa"),
        text: "User Permission",
        link: "/dashboard/user-permission",
      },
      {
        icon: getIcon("FaShieldAlt", "fa"),
        text: "Role Management",
        link: "/dashboard/role-management",
      },
      {
        icon: getIcon("Settings", "mui"),
        text: "Page Management",
        link: "/dashboard/page-management",
      },
    ],
  },
  {
    id: "panel16",
    type: "accordion",
    title: "Recycle Bin",
    icon: getIcon("Recycling", "mui"),
    items: [
      {
        icon: getIcon("DeleteForever", "mui"),
        text: "Jobcard List",
        link: "/dashboard/recycle-bin-jobcard-list",
      },
      {
        icon: getIcon("FaTrash", "fa"),
        text: "Quotation List",
        link: "/dashboard/recycle-bin-quotation-list",
      },
      {
        icon: getIcon("HiOutlineTrash", "hi"),
        text: "Invoice List",
        link: "/dashboard/recycle-bin-invoice-list",
      },
      {
        icon: getIcon("FaTrashRestore", "fa"),
        text: "Money Receipt List",
        link: "/dashboard/recycle-bin-moneyreceipt-list",
      },
      {
        icon: getIcon("HiOutlineUserGroup", "hi"),
        text: "Customer List",
        link: "/dashboard/recycle-bin-customer-list",
      },
      {
        icon: getIcon("HiOutlineOfficeBuilding", "hi"),
        text: "Company List",
        link: "/dashboard/recycle-bin-company-list",
      },
      {
        icon: getIcon("Storefront", "mui"),
        text: "Show Room List",
        link: "/dashboard/recycle-bin-showroom-list",
      },
      {
        icon: getIcon("FaUsers", "fa"),
        text: "Employee List",
        link: "/dashboard/recycle-bin-employee-list",
      },
      {
        icon: getIcon("FaHospitalUser", "fa"),
        text: "Supplier List",
        link: "/dashboard/recycle-bin-supplier-list",
      },
      {
        icon: getIcon("FaHospitalUser", "fa"),
        text: "User List",
        link: "/dashboard/recycle-bin-user-list",
      },
    ],
  },
  {
    id: "panel15",
    type: "accordion",
    title: "Database Backup",
    icon: getIcon("FaDatabase", "fa", 22),
    items: [
      {
        icon: getIcon("Backup", "mui"),
        text: "Backup Database",
        link: "/dashboard/backup",
      },
      {
        icon: getIcon("Restore", "mui"),
        text: "Restore Database",
        link: "/dashboard/restore",
      },
    ],
  },
  {
    id: "logout",
    type: "single",
    icon: getIcon("Logout", "mui", 22),
    text: "Log Out",
    action: handleLogout,
  },
];
