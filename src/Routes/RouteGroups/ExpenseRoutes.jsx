import ExpenseList from "../../pages/Expense/ExpenseList";
import AddExpense from "../../pages/Expense/AddExpense";
import UpdateExpense from "../../pages/Expense/UpdateExpense";
import ExpenseCategoryList from "../../pages/Expense/ExpenseCategoryList";

export const expenseRoutes = [
  {
    path: "expense-list",
    element: <ExpenseList />,
  },
  {
    path: "add-expense",
    element: <AddExpense />,
    action: "create",
  },
  {
    path: "add-expanse",
    element: <AddExpense />,
    action: "create",
  },
  {
    path: "expanse-list",
    element: <ExpenseList />,
  },
  {
    path: "update-expense",
    element: <UpdateExpense />,
    action: "edit",
  },
  {
    path: "expense-categories",
    element: <ExpenseCategoryList />,
  },
];
