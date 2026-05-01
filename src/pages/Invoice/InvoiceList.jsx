import { useAppOptions } from "../../hooks/useAppOptions";
import { useMoveRecycledInvoiceMutation } from "../../redux/api/invoice";
import swal from "sweetalert";
import InvoiceTable from "./InvoiceTable";

const InvoiceList = () => {
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [moveRecycledInvoice] = useMoveRecycledInvoiceMutation();
  const isRecycled = false;

  const handleMoveToRecycledBin = async (data) => {
    performActionWithPermission(
      "/dashboard/invoice-list",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this invoice to the Recycle Bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await moveRecycledInvoice({ tenantDomain, id: data._id }).unwrap();
            swal(
              "Moved!",
              "Invoice moved to Recycle Bin successfully.",
              "success"
            );
          } catch (error) {
            swal(
              "Error",
              "An error occurred while deleting the invoice.",
              "error"
            );
          }
        }
      },
      "You don't have permission to delete invoice!"
    );
  };

  return (
    <InvoiceTable
      title="Invoice List"
      isRecycled={isRecycled}
      handleDeleteAction={handleMoveToRecycledBin}
    />
  );
};

export default InvoiceList;
