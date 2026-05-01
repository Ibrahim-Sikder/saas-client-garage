import { useAppOptions } from "../../hooks/useAppOptions";
import { useMoveUserToRecycleBinMutation } from "../../redux/api/userApi";
import AllUserListTable from "./AllUserListTable";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
export const AllUserList = () => {
  const [moveUserToRecycleBin, { isLoading: deleteLoading }] =
    useMoveUserToRecycleBinMutation();
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const handleMoveToRecycleBin = async (userId) => {
    performActionWithPermission(
      "/dashboard/all-user-list",
      "delete",
      async () => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "This action cannot be undone!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
          try {
            await moveUserToRecycleBin({ tenantDomain, id: userId }).unwrap();
            toast.success("User deleted successfully");
          } catch {
            toast.error("Failed to delete user");
          }
        }
      },
      "You don't have permission to delete user."
    );
  };
  const isRecycled = false;
  return (
    <AllUserListTable
      isRecycled={isRecycled}
      handleMoveToRecycleBin={handleMoveToRecycleBin}
      deleteLoading={deleteLoading}
    />
  );
};
