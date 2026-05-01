import Invoice from "../../pages/Invoice/Invoice";
import UpdateInvoice from "../../pages/Invoice/UpdateInvoice";
import InvoiceView from "../../pages/Invoice/InvoiceView";
import InvoiceList from "../../pages/Invoice/InvoiceList";
import RecycledbinInvoiceList from "../../pages/Recyclebin/RecycledbinInvoiceList";

export const invoiceRoutes = [
  {
    path: "create-invoice",
    element: <Invoice />,
  },
  {
    path: "update-invoice",
    element: <UpdateInvoice />,
    action: "edit",
  },
  {
    path: "invoice-view",
    element: <InvoiceView />,
  },
  {
    path: "invoice-list",
    element: <InvoiceList />,
  },
  {
    path: "recycle-bin-invoice-list",
    element: <RecycledbinInvoiceList />,
  },
];
