import MoneyReceiptTable from "./MoneyReceiptTable";
import { useMoveRecycledMoneyReceiptMutation } from "../../redux/api/money-receipt";
import swal from "sweetalert";
import { useAppOptions } from "../../hooks/useAppOptions";

const MoneyReceiptList = () => {
  const [moveRecycledMoneyReceipt] = useMoveRecycledMoneyReceiptMutation();
  const isRecycled = false;
  const { performActionWithPermission, tenantDomain } = useAppOptions();
  const handleMoveRecycledBin = async (id) => {
    performActionWithPermission(
      "/dashboard/money-receipt-list",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: " You want to move  this Money Receipt Recycle Bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await moveRecycledMoneyReceipt({ tenantDomain, id }).unwrap();
            swal(
              "Move to Recycle bin!",
              "Move to Recycle bin successful.",
              "success"
            );
          } catch (error) {
            swal(
              "Error",
              "An error occurred while deleting the card.",
              "error"
            );
          }
        }
      },
      "You don't have permission to delete money receive !"
    );
  };
  return (
    <>
      <MoneyReceiptTable
        isRecycled={isRecycled}
        title=" Money Receipt List"
        handleDeleteAction={handleMoveRecycledBin}
      />
    </>
  );
};

export default MoneyReceiptList;
