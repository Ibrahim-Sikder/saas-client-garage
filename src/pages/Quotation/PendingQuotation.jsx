import { useAppOptions } from "../../hooks/useAppOptions";
import QuotationTable from "./QuotationTable";
import swal from "sweetalert";
import { FaArchive } from "react-icons/fa";
import { useUpdateQuotationStatusMutation } from "../../redux/api/quotation";

const PendingQuotation = () => {
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [updateQuotationStatus] = useUpdateQuotationStatusMutation();

  const handleMoveToPending = async (id) => {
    performActionWithPermission(
      "/dashboard/quotation-list",
      "delete",
      async () => {
        const willMove = await swal({
          title: "Are you sure?",
          text: "Do you want to mark this quotation as Pending?",
          icon: "warning",
          buttons: ["Cancel", "Yes, Move it"],
          dangerMode: true,
        });

        if (willMove) {
          try {
            await updateQuotationStatus({ 
              id, 
              tenantDomain, 
              status: 'pending' 
            }).unwrap();
            swal("Success!", "Quotation moved to Pending list.", "success");
          } catch (error) {
            swal("Error", error?.data?.message || "Failed to update quotation status.", "error");
          }
        }
      },
      "You don't have permission to move this quotation",
    );
  };

  return (
    <div className="max-w-full">
      <QuotationTable
        isRecycled={false}
        status="pending"
        title="Pending Quotation List"
        handleMoveAction={handleMoveToPending}
      />
    </div>
  );
};

export default PendingQuotation;