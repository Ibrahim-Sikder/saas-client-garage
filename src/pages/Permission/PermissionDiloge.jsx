/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid, Typography, Box, Button } from "@mui/material";
import { Save } from "@mui/icons-material";
import GarageForm from "../../components/form/Form";
import FormAutoCompleted from "../../components/form/FormAutoCompleted";
import { usePermissionFormData } from "../../hooks/usePermissionFormData";
import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useGetSinglePermissionQuery,
} from "../../redux/api/permissionApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/feature/authSlice";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import GarageModal from "../../components/Share/Modal/GarageModal";
import { buttonBox } from "../../utils/customStyle";
import FormCheckBox from "../../components/form/checkbox";

const AddEditPermissionDialog = ({
  open,
  handleClose,
  permissionId,
  permissionType = "add",
  setOpen,
}) => {
  const { userOptions, pageOptions, tenantDomain, roleOptions } =
    usePermissionFormData();
  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const user = useSelector(selectCurrentUser);

  const { data: singlePermissionData, isLoading: permissionLoading } =
    useGetSinglePermissionQuery(
      { tenantDomain, id: permissionId },
      { skip: !permissionId || permissionType !== "edit" },
    );

  const handleSubmit = async (data) => {
    try {
      const pageId = data.pageId?.value || data.pageId;
      const userId = data.userId?.value || data.userId;
      const roleId = data.roleId?.value || data.roleId;
      const permissionData = {
        pageId: [pageId],
        userId: [userId],
        roleId: [roleId],
        create: data.create || false,
        edit: data.edit || false,
        view: data.view || false,
        delete: data.delete || false,
      };
      let result;
      if (permissionType === "edit" && permissionId) {
        result = await updatePermission({
          userId,
          id: permissionId,
          tenantDomain,
          data: permissionData,
        }).unwrap();
      } else {
        result = await createPermission({
          userId,
          tenantDomain,
          data: permissionData,
        }).unwrap();
      }
      if (result.success) {
        toast.success(result.message || "Permission successfully !");
        handleClose();
      }
    } catch (error) {
      console.error(
        `Error ${permissionType === "edit" ? "updating" : "creating"} permission:`,
        error,
      );
    }
  };

  const defaultValues =
    permissionType === "edit" && singlePermissionData?.data?.hasPermission
      ? {
          userId: singlePermissionData.data.hasPermission.userId[0]
            ? {
                value:
                  singlePermissionData.data.hasPermission.userId[0]._id ||
                  singlePermissionData.data.hasPermission.userId[0].id,
                label: singlePermissionData.data.hasPermission.userId[0].name,
              }
            : null,
          roleId: singlePermissionData.data.hasPermission.roleId[0]
            ? {
                value: singlePermissionData.data.hasPermission.roleId[0]._id,
                label: singlePermissionData.data.hasPermission.roleId[0].name,
              }
            : null,
          pageId: singlePermissionData.data.hasPermission.pageId[0]
            ? {
                value: singlePermissionData.data.hasPermission.pageId[0]._id,
                label: singlePermissionData.data.hasPermission.pageId[0].name,
              }
            : null,
          create: singlePermissionData.data.hasPermission.create || false,
          edit: singlePermissionData.data.hasPermission.edit || false,
          view: singlePermissionData.data.hasPermission.view || false,
          delete: singlePermissionData.data.hasPermission.delete || false,
        }
      : {
          userId: null,
          roleId: null,
          pageId: null,
          create: false,
          edit: false,
          view: false,
          delete: false,
        };

  // Loading state
  if (permissionType === "edit" && permissionLoading) {
    return <Loading />;
  }

  const title = "Add New Permission ";

  return (
    <GarageModal open={open} setOpen={setOpen} title={title} maxWidth="md">
      <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormAutoCompleted
              options={userOptions}
              name="userId"
              label="Select User"
              size="normal"
              margin="normal"
              multiple={false}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormAutoCompleted
              options={pageOptions}
              name="pageId"
              label="Select Page"
              margin="normal"
              multiple={false}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormAutoCompleted
              options={roleOptions}
              name="roleId"
              label="Select Role"
              margin="normal"
              multiple={false}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Permissions
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={3}>
                <FormCheckBox
                  name="create"
                  label="Create"
                  description="Ability to create new entries"
                  size="none"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormCheckBox
                  name="edit"
                  label="Edit"
                  description="Ability to modify existing entries"
                  size="none"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormCheckBox
                  name="view"
                  label="View"
                  description="Ability to view entries"
                  size="none"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormCheckBox
                  name="delete"
                  label="Delete"
                  description="Ability to remove entries"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={buttonBox}>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="info"
            type="submit"
            variant="contained"
            startIcon={<Save />}
            sx={{ borderRadius: 2 }}
          >
            {permissionType === "edit"
              ? "Update Permission"
              : "Save Permission"}
          </Button>
        </Box>
      </GarageForm>
    </GarageModal>
  );
};

export default AddEditPermissionDialog;
