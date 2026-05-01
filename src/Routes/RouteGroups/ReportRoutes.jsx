import ExpiredProductsReportPage from "../../pages/Reports/ExpiredProductReport";
import LowStockReportPage from "../../pages/Reports/LowStockReport";
import ProductStockReportPage from "../../pages/Reports/ProductStockReport";
import DailyStockMovementReportPage from "../../pages/Reports/DailyStockReport";
import ReportsPage from "../../pages/Reports/Report";
import IncomeReport from "../../pages/Report/IncomeReport";
import ExpenseReport from "../../pages/Report/ExpenseReport";
import InvoiceReport from "../../pages/Report/InvoiceReport";
import DonationReport from "../../pages/Report/DonationReport";

export const reportRoutes = [
  {
    path: "expired-product-report",
    element: <ExpiredProductsReportPage />,
  },
  {
    path: "low-stock-report",
    element: <LowStockReportPage />,
  },
  {
    path: "product-stock-report",
    element: <ProductStockReportPage />,
  },
  {
    path: "daily-stock-movement",
    element: <DailyStockMovementReportPage />,
  },
  {
    path: "report",
    element: <ReportsPage />,
  },
  {
    path: "income-report",
    element: <IncomeReport />,
  },
  {
    path: "expense-report",
    element: <ExpenseReport />,
  },
  {
    path: "invoice-report",
    element: <InvoiceReport />,
  },
  {
    path: "donation-report",
    element: <DonationReport />,
  },
];
