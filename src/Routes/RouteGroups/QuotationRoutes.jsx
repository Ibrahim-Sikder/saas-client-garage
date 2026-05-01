import AddQuotation from "../../pages/Quotation/AddQuotation";
import QuotationView from "../../pages/Quotation/QuotationView";
import QuotationList from "../../pages/Quotation/QuotationList";
import UpdateQuotation from "../../pages/Quotation/UpdateQuotation";
import RecycledQuotationList from "../../pages/Recyclebin/RecycledQuotationList";
import PendingQuotation from "../../pages/Quotation/PendingQuotation";

export const quotationRoutes = [
  {
    path: "create-quotation",
    element: <AddQuotation />,
    action: "create",
  },
  {
    path: "update-quotation",
    element: <UpdateQuotation />,
    action: "edit",
  },
  {
    path: "quotation-view",
    element: <QuotationView />,
  },
  {
    path: "quotation-list",
    element: <QuotationList />,
  },
  {
    path: "pending-quotation",
    element: <PendingQuotation />,
  },
  {
    path: "recycle-bin-quotation-list",
    element: <RecycledQuotationList />,
  },
];
