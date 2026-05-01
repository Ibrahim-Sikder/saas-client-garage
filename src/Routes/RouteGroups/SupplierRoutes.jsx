import AddSuppliers from "../../pages/Suppliers/AddSuppliers";
import SupplierList from "../../pages/Suppliers/SupplierList";
import UpdateSupplier from "../../pages/Suppliers/UpdateSupplier";
import SupplierProfile from "../../pages/Suppliers/SupplierProfile";
import RecyclebinSupplierList from "../../pages/Recyclebin/RecyclebinSupplierList";

export const supplierRoutes = [
  {
    path: "add-supplier",
    element: <AddSuppliers />,
    action: "create",
  },
  {
    path: "supplier-list",
    element: <SupplierList />,
  },
  {
    path: "supplier-profile",
    element: <SupplierProfile />,
  },
  {
    path: "update-supplier",
    element: <UpdateSupplier />,
    action: "edit",
  },
  {
    path: "recycle-bin-supplier-list",
    element: <RecyclebinSupplierList />,
  },
];
