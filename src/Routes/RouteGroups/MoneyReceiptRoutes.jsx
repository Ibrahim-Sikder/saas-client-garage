import MoneyReceiptList from "../../pages/MoneyReceived/MoneyReceiptList";
import CreateMoneyReceived from "../../pages/MoneyReceived/CreateMoneyReceived";
import MoneyReceiptView from "../../pages/MoneyReceived/MoneyReceiptView";
import UpdateMoneyReceipt from "../../pages/MoneyReceived/UpdateMoneyReceipt";
import DueMoneyReceiptList from "../../pages/MoneyReceived/DueMoneyReceiptList";
import RecycledMoneyReceipt from "../../pages/Recyclebin/RecycledMoneyReceipt";

export const moneyReceiptRoutes = [
  {
    path: "money-receive-create",
    element: <CreateMoneyReceived />,
    action: "create",
  },
  {
    path: "money-receipt-list",
    element: <MoneyReceiptList />,
  },
  {
    path: "money-receipt-view",
    element: <MoneyReceiptView />,
  },
  {
    path: "money-receipt-update",
    element: <UpdateMoneyReceipt />,
    action: "edit",
  },
  {
    path: "money-receipt-due",
    element: <DueMoneyReceiptList />,
  },
  {
    path: "recycle-bin-moneyreceipt-list",
    element: <RecycledMoneyReceipt />,
  },
];
