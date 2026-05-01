/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import CustomerListTable from "./CustomerListTable";
import { useMoveRecycledCustomerMutation } from "../../redux/api/customerApi";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { usePermissions } from "../../context/PermissionContext";

const CustomerList = () => {
  const isRecycled = false;
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();
  const [moveRecycledCustomer] = useMoveRecycledCustomerMutation();

  const handleMoveToRecycledBin = async (id) => {
    performActionWithPermission(
      "/dashboard/customer-list",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this Customer to the Recycle Bin?",
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancel", "Yes, Move"],
        });

        if (willDelete) {
          try {
            await moveRecycledCustomer({ tenantDomain, id }).unwrap();
            swal(
              "Moved!",
              "Customer moved to Recycle Bin successfully.",
              "success"
            );
          } catch (error) {
            swal("Error", "Failed to move Customer to Recycle Bin.", "error");
          }
        }
      },
      "You don't have permission to delete customers."
    );
  };

  return (
    <CustomerListTable
      title="Customer List"
      handleDeleteAction={handleMoveToRecycledBin}
      isRecycled={isRecycled}
    />
  );
};

export default CustomerList;
