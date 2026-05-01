import { useAppOptions } from "../../hooks/useAppOptions";
import {
  usePermanentlyDeleteUserMutation,
  useRestoreUserMutation,
} from "../../redux/api/userApi";

import swal from "sweetalert";
import AllUserListTable from "../Tenant/AllUserListTable";

export const RecycleBinAllUser = () => {
  const [restoreUser, { isLoading: restoreLoading }] = useRestoreUserMutation();
  const [permanentlyDeleteUser, { isLoading: deleteLoading }] =
    usePermanentlyDeleteUserMutation();
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this user.",
      icon: "warning",
      buttons: {
        restore: { text: "Restore", value: "restore" },
        delete: { text: "Permanently Delete", value: "delete" },
      },
    });

    if (result === "restore") {
      performActionWithPermission(
        "/dashboard/all-user-list",
        "update",
        async () => {
          try {
            await restoreUser({ tenantDomain, id }).unwrap();
            swal(
              "Restored!",
              "User has been restored successfully.",
              "success"
            );
          } catch {
            swal(
              "Error",
              "An error occurred while restoring the user.",
              "error"
            );
          }
        },
        "You don't have permission to restore users."
      );
    } else if (result === "delete") {
      performActionWithPermission(
        "/dashboard/all-user-list",
        "delete", // Permanent delete requires delete permission
        async () => {
          try {
            await permanentlyDeleteUser({ tenantDomain, id }).unwrap();
            swal("Deleted!", "User has been permanently deleted.", "success");
          } catch {
            swal(
              "Error",
              "An error occurred while deleting the user.",
              "error"
            );
          }
        },
        "You don't have permission to permanently delete users."
      );
    }
  };

  const isRecycled = true;

  return (
    <AllUserListTable
      isRecycled={isRecycled}
      handleMoveToRecycleBin={handleDeleteOrRestore}
      deleteLoading={deleteLoading}
      restoreLoading={restoreLoading}
    />
  );
};

export default RecycleBinAllUser;
