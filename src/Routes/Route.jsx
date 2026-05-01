import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import Main from "../Layout/Main";
import { customerRoutes } from "./RouteGroups/CustomerRoutes";
import { employeeRoutes } from "./RouteGroups/EmployeeRoutes";
import { jobCardRoutes } from "./RouteGroups/JobCardRoutes";
import { otherRoutes } from "./RouteGroups/OtherRoutes";
import { showroomRoutes } from "./RouteGroups/ShowRoomRoutes";
import { companyRoutes } from "./RouteGroups/CompanyRoute";
import { invoiceRoutes } from "./RouteGroups/InvoiceRoutes";
import { quotationRoutes } from "./RouteGroups/QuotationRoutes";
import { moneyReceiptRoutes } from "./RouteGroups/MoneyReceiptRoutes";
import { expenseRoutes } from "./RouteGroups/ExpenseRoutes";
import { holidayRoutes } from "./RouteGroups/HolidayRoutes";
import { incomeRoutes } from "./RouteGroups/IncomeRoutes";
import { donationRoutes } from "./RouteGroups/DonationRoutes";
import { inventoryRoutes } from "./RouteGroups/InventoryRoutes";
import { productRoutes } from "./RouteGroups/ProductRoutes";
import { warehouseRoutes } from "./RouteGroups/WarehouseRoute";
import { purchaseRoutes } from "./RouteGroups/PurchaseRoutes";
import { supplierRoutes } from "./RouteGroups/SupplierRoutes";
import { roleRoutes } from "./RouteGroups/RoleRoutes";
import { billPayRoutes } from "./RouteGroups/BillRoutes";
import { projectRoutes } from "./RouteGroups/ProjectRoutes";
import { reportRoutes } from "./RouteGroups/ReportRoutes";
import { userManagementRoutes } from "./RouteGroups/UserManagementRoutes";
import { attendanceRoutes } from "./RouteGroups/AttendanceRoutes";
import { authRoutes } from "./RouteGroups/AuthRoutes";
import { createRoutes } from "./RouteGroups/RouteBuilder";
import { vehicleRoutes } from "./RouteGroups/VehicleRoutes";

const protectedRoutes = [
  ...createRoutes(otherRoutes),
  ...createRoutes(vehicleRoutes),
  ...createRoutes(jobCardRoutes),
  ...createRoutes(employeeRoutes),
  ...createRoutes(customerRoutes),
  ...createRoutes(companyRoutes),
  ...createRoutes(showroomRoutes),
  ...createRoutes(invoiceRoutes),
  ...createRoutes(quotationRoutes),
  ...createRoutes(moneyReceiptRoutes),
  ...createRoutes(expenseRoutes),
  ...createRoutes(attendanceRoutes),
  ...createRoutes(holidayRoutes),
  ...createRoutes(incomeRoutes),
  ...createRoutes(donationRoutes),
  ...createRoutes(productRoutes),
  ...createRoutes(inventoryRoutes),
  ...createRoutes(warehouseRoutes),
  ...createRoutes(purchaseRoutes),
  ...createRoutes(supplierRoutes),
  ...createRoutes(roleRoutes),
  ...createRoutes(billPayRoutes),
  ...createRoutes(projectRoutes),
  ...createRoutes(reportRoutes),
  ...createRoutes(userManagementRoutes),
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: authRoutes,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: protectedRoutes,
  },
]);
