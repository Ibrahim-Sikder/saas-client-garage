import swal from "sweetalert";
import { useAppOptions } from "../../hooks/useAppOptions";
import {
  usePermanentlyDeleteShowRoomMutation,
  useRestoreFromRecycledShowRoomMutation,
} from "../../redux/api/showRoomApi";
import ShowRoomListTable from "../ShowRoom/ShowRoomListTable";
const RecycledBinShowRoomList = () => {
  const { tenantDomain } = useAppOptions();
  const isRecycled = true;
  const [permanentlyDeleteShowRoom] = usePermanentlyDeleteShowRoomMutation();
  const [restoreFromRecycledShowRoom] =
    useRestoreFromRecycledShowRoomMutation();

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Show Room.",
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

    if (result === "restore") {
      try {
        await restoreFromRecycledShowRoom({
          tenantDomain,
          id,
        }).unwrap();
        swal({
          title: "Restored!",
          text: "Show Room has been restored successfully.",
          icon: "success",
          button: "OK",
        });
      } catch (error) {
        swal({
          title: "Error",
          text: "An error occurred while restoring the card.",
          icon: "error",
          button: "OK",
        });
      }
    } else if (result === "delete") {
      try {
        await permanentlyDeleteShowRoom({ tenantDomain, id }).unwrap();
        swal({
          title: "Deleted!",
          text: "Show Room has been permanently deleted.",
          icon: "error",
          button: "OK",
        });
      } catch (error) {
        swal({
          title: "Error",
          text: "An error occurred while deleting the card.",
          icon: "error",
          button: "OK",
        });
      }
    }
  };

  return (
    <ShowRoomListTable
      title="Show Room List"
      handleDeleteAction={handleDeleteOrRestore}
      isRecycled={isRecycled}
    />
  );
};

export default RecycledBinShowRoomList;
