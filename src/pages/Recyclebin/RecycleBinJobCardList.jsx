import {
  usePermanentlyDeleteJobCardMutation,
  useRestoreFromRecycleBinJobCardMutation,
} from "../../redux/api/jobCard";

import swal from "sweetalert";
import { useAppOptions } from "../../hooks/useAppOptions";
import JobCardTable from "../AddJobCard/JobCardTable";

const RecycleBinJobCardList = () => {
  const isRecycled = true;
  const { tenantDomain } = useAppOptions();

  const [permanentlyDeleteJobCard] = usePermanentlyDeleteJobCardMutation();
  const [restoreFromRecycleBinJobCard] =
    useRestoreFromRecycleBinJobCardMutation();

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this jobcard.",
      icon: "warning",
      buttons: {
        restore: { text: "Restore", value: "restore" },
        delete: { text: "Permanently Delete", value: "delete" },
      },
    });

    if (result === "restore") {
      try {
        await restoreFromRecycleBinJobCard({ tenantDomain, id }).unwrap();
        swal(
          "Restored!",
          "Job card has been restored successfully.",
          "success"
        );
      } catch {
        swal("Error", "An error occurred while restoring the card.", "error");
      }
    } else if (result === "delete") {
      try {
        await permanentlyDeleteJobCard({ tenantDomain, id }).unwrap();
        swal("Deleted!", "Job card has been permanently deleted.", "error");
      } catch {
        swal("Error", "An error occurred while deleting the card.", "error");
      }
    }
  };

  return (
    <JobCardTable
      title="Recycle Bin Job Cards"
      handleMoveToRecycled={handleDeleteOrRestore}
      isRecycled={isRecycled}
    />
  );
};

export default RecycleBinJobCardList;
