import swal from "sweetalert";
import {
  usePermanantlyDeleteMoneyReceiptMutation,
  useRestoreFromRecycledMoneyReceiptMutation,
} from "../../redux/api/money-receipt";
import { useAppOptions } from "../../hooks/useAppOptions";
import MoneyReceiptTable from "../MoneyReceived/MoneyReceiptTable";

const RecycledMoneyReceipt = () => {
  const { tenantDomain } = useAppOptions();

  const [permanantlyDeleteMoneyReceipt] =
    usePermanantlyDeleteMoneyReceiptMutation();
  const [restoreFromRecycledMoneyReceipt] =
    useRestoreFromRecycledMoneyReceiptMutation();

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Money Receipt.",
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
        await restoreFromRecycledMoneyReceipt({ tenantDomain, id }).unwrap();
        swal({
          title: "Restored!",
          text: "Money Receipt has been restored successfully.",
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
        await permanantlyDeleteMoneyReceipt({ tenantDomain, id }).unwrap();
        swal({
          title: "Deleted!",
          text: "Money Receipt has been permanently deleted.",
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

  const isRecycled = true;

  return (
    <>
      <MoneyReceiptTable
        isRecycled={isRecycled}
        title=" Recycle Money Receipt List"
        handleDeleteAction={handleDeleteOrRestore}
      />
    </>
  );
};

export default RecycledMoneyReceipt;
