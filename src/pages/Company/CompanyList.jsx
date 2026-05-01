/* eslint-disable no-unused-vars */
import CompanyListTable from "./CompanyListTable";
import { useMoveRecycledCompanyMutation } from "../../redux/api/companyApi";
import { useAppOptions } from "../../hooks/useAppOptions";
import swal from "sweetalert";
const CompanyList = () => {
  const isRecycled = false;
  const [moveRecycledCompany] = useMoveRecycledCompanyMutation();
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const handleMoveToRecycled = async (id) => {
    performActionWithPermission(
      "/dashboard/company-list",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this Company to Recycle Bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await moveRecycledCompany({ tenantDomain, id }).unwrap();
            swal(
              "Moved to Recycle Bin!",
              "Company successfully moved to the recycle bin.",
              "success"
            );
          } catch (error) {
            console.error("Recycling error:", error);
            swal(
              "Error",
              "An error occurred while moving the company.",
              "error"
            );
          }
        }
      }
    );
  };

  return (
    <CompanyListTable
      title="Company List"
      isRecycled={isRecycled}
      handleDeleteAction={handleMoveToRecycled}
    />
  );

};


export default CompanyList;
