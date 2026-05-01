/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { DialogActions, Button, Grid } from "@mui/material";
import {
  useCreateWarrantyMutation,
  useUpdateWarrantyMutation,
} from "../../../redux/api/warrantyApi";
import { toast } from "react-toastify";
import GarageForm from "../../../components/form/Form";
import FormInput from "../../../components/form/Input";
import TASSelect from "../../../components/form/Select";
import GarageModal from "../../../components/Share/Modal/GarageModal";
import { useAppOptions } from "../../../hooks/useAppOptions";
import Can from "../../../components/Can";

const WarrantyModal = ({ open, onClose, editingWarranty }) => {
  const [createWarranty] = useCreateWarrantyMutation();
  const [updateWarranty] = useUpdateWarrantyMutation();
  const { performActionWithPermission, tenantDomain } = useAppOptions();

  const handleSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/warranties",
      editingWarranty ? "edit" : "create",
      async () => {
        try {
          let res;
          if (editingWarranty) {
            res = await updateWarranty({
              id: editingWarranty._id,
              tenantDomain,
              ...data,
            }).unwrap();
          } else {
            res = await createWarranty({
              ...data,
              tenantDomain,
            }).unwrap();
          }

          if (res.success) {
            toast.success(
              `Warranty ${
                editingWarranty ? "updated" : "created"
              } successfully!`
            );
            onClose();
          }
        } catch (error) {
          toast.error(error.message || "Something went wrong");
        }
      },
      `You don't have permission to ${
        editingWarranty ? "update" : "create"
      } warranty !`
    );
  };

  const formatDurationTypeForSelect = (type) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const defaultValues = {
    name: editingWarranty?.name || "",
    terms: editingWarranty?.terms || "",
    duration: editingWarranty?.duration || "",
    durationType:
      formatDurationTypeForSelect(editingWarranty?.durationType) || "",
    description: editingWarranty?.description || "",
  };
  const formatDurationTypeForDatabase = (type) => {
    return type.toLowerCase();
  };

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      durationType: formatDurationTypeForDatabase(data.durationType),
    };
    handleSubmit(formattedData);
  };
  const title = `${editingWarranty ? "Update" : "Create"} warranty`;

  return (
    <>
      <GarageModal open={open} setOpen={onClose} title={title} maxWidth="sm">
        <GarageForm onSubmit={handleFormSubmit} defaultValues={defaultValues}>
          <Grid container spacing={3} style={{ mt: 1, padding: 8 }}>
            <Grid item xs={12}>
              <FormInput
                name="name"
                label={
                  <>
                    Warranty Name
                    <span style={{ color: "red", fontSize: "25px" }}> *</span>
                  </>
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="duration"
                label={
                  <>
                    Duration
                    <span style={{ color: "red", fontSize: "25px" }}> *</span>
                  </>
                }
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TASSelect
                label={
                  <>
                    Duration Type
                    <span style={{ color: "red", fontSize: "25px" }}> *</span>
                  </>
                }
                name="durationType"
                fullWidth
                size="medium"
                items={["Days", "Months", "Years"]}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name="terms"
                label="Terms & Conditions"
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Can
              action={editingWarranty ? "edit" : "create"}
              page="/dashboard/warranties"
            >
              <Button type="submit" variant="contained">
                {editingWarranty ? "Update" : "Create "}
              </Button>
            </Can>
          </DialogActions>
        </GarageForm>
      </GarageModal>
    </>
  );
};

export default WarrantyModal;
