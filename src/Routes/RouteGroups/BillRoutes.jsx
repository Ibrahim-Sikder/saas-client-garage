import BillPayList from "../../pages/BillPay/BillPayList";
import AddPaybill from "../../pages/BillPay/AddPaybill";
import UpdateBillPay from "../../pages/BillPay/UpdateBillPay";
import BillPayInvoice from "../../pages/BillPay/BillPayInvoice";
import BillPayHistory from "../../pages/BillPay/BillPayHistory";

export const billPayRoutes = [
  {
    path: "paybill",
    element: <BillPayList />,
  },
  {
    path: "add-paybill",
    element: <AddPaybill />,
    action: "create",
  },
  {
    path: "update-paybill",
    element: <UpdateBillPay />,
    action: "edit",
  },
  {
    path: "paybill-view",
    element: <BillPayInvoice />,
  },
  {
    path: "bill-pay-history",
    element: <BillPayHistory />,
  },
];
