/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import swal from "sweetalert";
import {
  usePermanentlyDeleteCustomerMutation,
  useRestoreFromRecycledCustomerMutation,
} from "../../redux/api/customerApi";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import CustomerListTable from "../Customer/CustomerListTable";

const RecycledBinCustomerList = () => {
  const isRecycled = true;
  const { tenantDomain } = useTenantDomain();
  const [permanentlyDeleteCustomer] = usePermanentlyDeleteCustomerMutation();
  const [restoreFromRecycledCustomer] =
    useRestoreFromRecycledCustomerMutation();

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Customer.",
      icon: "warning",
      buttons: {
        restore: {
          text: "Restore",
          value: "restore",
          visible: true,
          className: "btn-restore",
        },
        delete: {
          text: "Permanently Delete",
          value: "delete",
          visible: true,
          className: "btn-delete",
        },
      },
      className: "custom-swal",
    });

    try {
      if (result === "restore") {
        await restoreFromRecycledCustomer({ tenantDomain, id }).unwrap();
        swal("Restored!", "Customer restored successfully.", "success");
      } else if (result === "delete") {
        await permanentlyDeleteCustomer({ tenantDomain, id }).unwrap();
        swal("Deleted!", "Customer permanently deleted.", "success");
      }
    } catch (error) {
      swal("Error", "An error occurred while processing the request.", "error");
    }
  };

  return (
    <CustomerListTable
      title="Recycle Bin Customer List"
      handleDeleteAction={handleDeleteOrRestore}
      isRecycled={isRecycled}
    />
  );
};

export default RecycledBinCustomerList;
