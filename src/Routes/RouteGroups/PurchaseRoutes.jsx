import PurchaseList from "../../pages/Parchase/PurchaseList";
import AddPurchase from "../../pages/Parchase/AddPurchase";
import UpdatePurchase from "../../pages/Parchase/UpdatePurchase";
import PurchaseReturn from "../../pages/Inventory/PurchaseReturn/PurchaseReturn";
import PurchaseReturnUpdate from "../../pages/Inventory/PurchaseReturn/PurchaseReturnUpdate";

export const purchaseRoutes = [
  {
    path: "purchase-list",
    element: <PurchaseList />,
  },
  {
    path: "add-purchase",
    element: <AddPurchase />,
    action: "create",
  },
  {
    path: "update-purchase",
    element: <UpdatePurchase />,
    action: "edit",
  },
  {
    path: "update-purchase-return",
    element: <PurchaseReturnUpdate />,
    action: "edit",
  },
  {
    path: "purchase-return-add",
    element: <PurchaseReturn />,
    action: "create",
  },
];
