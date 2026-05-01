import swal from "sweetalert";
import {
  usePermenantlyDeleteSupplierMutation,
  useRestoreFromRecycledSupplierMutation,
} from "../../redux/api/supplier";
import { useAppOptions } from "../../hooks/useAppOptions";
import SupplierListTable from "../Suppliers/SupplierListTable";

const RecyclebinSupplierList = () => {
  const { tenantDomain } = useAppOptions();
  const isRecycled = true;

  const [permenantlyDeleteSupplier] = usePermenantlyDeleteSupplierMutation();
  const [restoreFromRecycledSupplier] =
    useRestoreFromRecycledSupplierMutation();

  const handleDeleteSupplier = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this supplier.",
      icon: "warning",
      buttons: {
        restore: { text: "Restore", value: "restore" },
        delete: { text: "Delete Permanently", value: "delete" },
      },
    });

    try {
      if (result === "restore") {
        await restoreFromRecycledSupplier({ tenantDomain, id }).unwrap();
        swal("Restored!", "Supplier has been restored.", "success");
      } else if (result === "delete") {
        await permenantlyDeleteSupplier(id).unwrap();
        swal("Deleted!", "Supplier permanently deleted.", "error");
      }
    } catch (error) {
      console.error("❌ Action failed:", error);
      swal("Error", "An error occurred while processing supplier.", "error");
    }
  };

  return (
    <div className="w-full mt-5 mb-24">
      <SupplierListTable
        handleDeleteSupplier={handleDeleteSupplier}
        isRecycled={isRecycled}
        title="Recycle Bin Suppliers"
      />
    </div>
  );
};

export default RecyclebinSupplierList;
