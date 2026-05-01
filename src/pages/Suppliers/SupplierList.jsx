import { Box } from "@mui/material";
import swal from "sweetalert";
import { useTenantDomain } from "@/hooks/useTenantDomain";
import { useMoveRecycledSupplierMutation } from "../../redux/api/supplier";
import SupplierListTable from "./SupplierListTable";
import { wrapBoxStyle } from "../../utils/customStyle";
import { usePermissions } from "../../context/PermissionContext";

const SupplierList = () => {
  const { performActionWithPermission } = usePermissions();
  const [moveRecycledSupplier] = useMoveRecycledSupplierMutation();
  const { tenantDomain } = useTenantDomain();
  const isRecycled = false;

  const handleDeleteSupplier = async (id) => {
    performActionWithPermission(
      "/dashboard",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Move Supplier to Recycle Bin?",
          text: "This supplier will be moved to the recycle bin. Continue?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await moveRecycledSupplier({ tenantDomain, id }).unwrap();
            swal("Moved!", "Supplier moved to recycle bin.", "success");
          } catch (error) {
            console.error("❌ Move error:", error);
            swal("Error", "Failed to move supplier.", "error");
          }
        }
      },
      "You don't have permission to delete suppliers!"
    );
  };

  return (
    <Box sx={wrapBoxStyle}>
      <SupplierListTable
        title="Supplier List"
        handleDeleteSupplier={handleDeleteSupplier}
        isRecycled={isRecycled}
      />
    </Box>
  );
};

export default SupplierList;
