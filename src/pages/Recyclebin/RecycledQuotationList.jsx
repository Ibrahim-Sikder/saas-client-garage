import swal from "sweetalert";
import {
  usePermanantlyDeleteQuotationMutation,
  useRestoreFromRecycledQuotationMutation,
} from "../../redux/api/quotation";
import { useAppOptions } from "../../hooks/useAppOptions";
import QuotationTable from "../Quotation/QuotationTable";

const RecycledQuotationList = () => {
  const { tenantDomain } = useAppOptions();
  const [restoreFromRecycledQuotation] =
    useRestoreFromRecycledQuotationMutation();
  const [permanantlyDeleteQuotation] = usePermanantlyDeleteQuotationMutation();

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Quotation.",
      icon: "warning",
      buttons: {
        restore: { text: "Restore", value: "restore" },
        delete: { text: "Permanently Delete", value: "delete" },
      },
    });

    if (result === "restore") {
      try {
        await restoreFromRecycledQuotation({ tenantDomain, id }).unwrap();
        swal("Restored!", "Quotation restored successfully.", "success");
      } catch (error) {
        swal("Error", "Failed to restore quotation.", "error");
      }
    } else if (result === "delete") {
      try {
        await permanantlyDeleteQuotation({ tenantDomain, id }).unwrap();
        swal("Deleted!", "Quotation permanently deleted.", "error");
      } catch (error) {
        swal("Error", "Failed to delete quotation.", "error");
      }
    }
  };

  return (
    <div className="max-w-full">
      <QuotationTable
        isRecycled={true}
        title="Recycled Quotation List"
        handleMoveAction={handleDeleteOrRestore}
      />
    </div>
  );
};

export default RecycledQuotationList;
