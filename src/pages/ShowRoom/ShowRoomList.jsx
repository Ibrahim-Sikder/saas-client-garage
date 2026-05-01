/* eslint-disable react-hooks/exhaustive-deps */

import { useAppOptions } from "../../hooks/useAppOptions";
import { useMoveRecycledShowRoomMutation } from "../../redux/api/showRoomApi";
import ShowRoomListTable from "./ShowRoomListTable";
import swal from "sweetalert";
const ShowRoomList = () => {
  const isRecycled = false;
  const [moveRecycledShowRoom] = useMoveRecycledShowRoomMutation();
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const handleMoveToRecycled = async (id) => {
    performActionWithPermission(
      "/dashboard/show-room-list",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this Show Room to the Recycle Bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await moveRecycledShowRoom({ tenantDomain, id }).unwrap();
            swal("Moved to Recycle bin!", "Successful.", "success");
          } catch (error) {
            swal(
              "Error",
              "An error occurred while deleting the card.",
              "error"
            );
          }
        }
      },
      "You don't have permission to move to recycle bin the show room!"
    );
  };

  return (
    <ShowRoomListTable
      title="Show Room List"
      handleDeleteAction={handleMoveToRecycled}
      isRecycled={isRecycled}
    />
  );
};

export default ShowRoomList;
