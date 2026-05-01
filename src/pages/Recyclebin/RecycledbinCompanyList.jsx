/* eslint-disable no-unused-vars */
import swal from "sweetalert";
import { useAppOptions } from "../../hooks/useAppOptions";
import {
  usePermanentlyDeleteCompanyMutation,
  useRestoreFromRecycledCompanyMutation,
} from "../../redux/api/companyApi";
import CompanyListTable from "../Company/CompanyListTable";

const RecycledBinCompanyList = () => {
  const isRecycled = true;
  const { tenantDomain } = useAppOptions();
  const [permanentlyDeleteCompany] = usePermanentlyDeleteCompanyMutation();
  const [restoreFromRecycledCompany] = useRestoreFromRecycledCompanyMutation();

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Company.",
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
        await restoreFromRecycledCompany({ tenantDomain, id }).unwrap();
        swal({
          title: "Restored!",
          text: "Company has been restored successfully.",
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
        await permanentlyDeleteCompany({ tenantDomain, id }).unwrap();
        swal({
          title: "Deleted!",
          text: "Company has been permanently deleted.",
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

  return (
    <CompanyListTable
      title="Recycle Bin Company List"
      isRecycled={isRecycled}
      handleDeleteAction={handleDeleteOrRestore}
    />
  );
};

export default RecycledBinCompanyList;
