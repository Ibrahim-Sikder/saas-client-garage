import { useAppOptions } from "../../hooks/useAppOptions";
import {
  usePermanantlyDeleteInvoiceMutation,
  useRestoreFromRecycledInvoiceMutation,
} from "../../redux/api/invoice";
import swal from "sweetalert";
import InvoiceTable from "../Invoice/InvoiceTable";

const RecycledInvoiceList = () => {
  const { tenantDomain } = useAppOptions();
  const [restoreFromRecycledInvoice] = useRestoreFromRecycledInvoiceMutation();
  const [permanantlyDeleteInvoice] = usePermanantlyDeleteInvoiceMutation();
  const isRecycled = true;

  const handleDeleteOrRestore = async (data) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Invoice.",
      icon: "warning",
      buttons: {
        restore: { text: "Restore", value: "restore" },
        delete: { text: "Permanently Delete", value: "delete" },
      },
    });

    if (result === "restore") {
      try {
        await restoreFromRecycledInvoice({
          tenantDomain,
          id: data._id,
        }).unwrap();
        swal("Restored!", "Invoice has been restored successfully.", "success");
      } catch (error) {
        swal(
          "Error",
          "An error occurred while restoring the invoice.",
          "error"
        );
      }
    } else if (result === "delete") {
      try {
        await permanantlyDeleteInvoice({ tenantDomain, id: data._id }).unwrap();
        swal("Deleted!", "Invoice has been permanently deleted.", "error");
      } catch (error) {
        swal("Error", "An error occurred while deleting the invoice.", "error");
      }
    }
  };

  return (
    <InvoiceTable
      title="Recycle Invoice List"
      isRecycled={isRecycled}
      handleDeleteAction={handleDeleteOrRestore}
    />
  );
};

export default RecycledInvoiceList;
