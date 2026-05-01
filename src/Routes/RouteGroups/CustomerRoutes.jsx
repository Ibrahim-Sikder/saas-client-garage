import CustomerList from "../../pages/Customer/CustomerList";
import UpdateCustomer from "../../pages/Customer/UpdateCustomer";
import AddCustomer from "../../pages/Customer/AddCustomer";
import CustomerProfile from "../../pages/Customer/CustomerProfile";
import AllCustomerList from "../../pages/Customer/AllCustomerList";
import RecycledbinCustomerList from "../../pages/Recyclebin/RecycledbinCustomerList";

export const customerRoutes = [
  {
    path: "customer-list",
    element: <CustomerList />,
  },
  {
    path: "update-customer",
    element: <UpdateCustomer />,
    action: "edit",
  },
  {
    path: "add-customer",
    element: <AddCustomer />,
    action: "create",
  },
  {
    path: "customer-profile",
    element: <CustomerProfile />,
  },
  {
    path: "all-customer",
    element: <AllCustomerList />,
  },
  {
    path: "recycle-bin-customer-list",
    element: <RecycledbinCustomerList />,
  },
];
