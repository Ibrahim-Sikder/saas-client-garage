import { useAppOptions } from "../../hooks/useAppOptions";
import { useMoveRecycledQuotationMutation } from "../../redux/api/quotation";
import QuotationTable from "./QuotationTable";
import swal from "sweetalert";
const QuotationList = () => {
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const [moveRecycledQuotation] = useMoveRecycledQuotationMutation();

  const handleMoveToRecycled = async (id) => {
    performActionWithPermission(
      "/dashboard/quotation-list",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this quotation to Recycle Bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await moveRecycledQuotation({ tenantDomain, id }).unwrap();
            swal("Moved!", "Quotation moved to Recycle Bin.", "success");
          } catch (error) {
            swal("Error", "Failed to move quotation.", "error");
          }
        }
      },
      "You don't have permission to delete this quotation"
    );
  };

  return (
    <div className="max-w-full">
      <QuotationTable
        isRecycled={false}
        title="Quotation List"
        handleMoveAction={handleMoveToRecycled}
      />
    </div>
  );
};

export default QuotationList;
