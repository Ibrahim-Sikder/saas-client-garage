import Income from "../../pages/Income/Income";
import IncomeList from "../../pages/Income/IncomeList";
import UpdateIncome from "../../pages/Income/UpdateIncome";

export const incomeRoutes = [
  {
    path: "add-income",
    element: <Income />,
    action: "create",
  },
  {
    path: "income-list",
    element: <IncomeList />,
  },
  {
    path: "update-income",
    element: <UpdateIncome />,
    action: "edit",
  },
];
