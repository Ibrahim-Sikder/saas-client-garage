/* eslint-disable react/prop-types */

import {
  Box,
  Button,
  Grid,
} from "@mui/material";
import GarageForm from "../../components/form/Form";
import FormInput from "../../components/form/Input";
import FormSelect from "../../components/form/Select";
import {
  useCreatePageMutation,
  useUpdatePageMutation,
} from "../../redux/api/pageApi";
import { toast } from "react-toastify";
import GarageModal from "../../components/Share/Modal/GarageModal";
import { buttonBox } from "../../utils/customStyle";

const PageForm = ({ open, onClose, pageData, mode, tenantDomain, setOpen }) => {
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();
  const isEditMode = mode === "edit" && pageData;
  const defaultValues = {
    name: pageData?.name || "",
    path: pageData?.path || "",
    category: pageData?.category || '',
    route: pageData?.route || "",
    status: pageData?.status || "",
  };

  const handleSubmit = async (formData) => {
    try {
      let res;

      if (isEditMode) {
        res = await updatePage({
          id: pageData._id,
          tenantDomain,
          ...formData,
        }).unwrap();

        if (res.success) {
          toast.success(res.message || "Form updated successfully");
          onClose();
        }
      } else {
        res = await createPage({
          tenantDomain,
          data: formData,
        }).unwrap();

        if (res.success) {
          toast.success(res.message || "Form created successfully");
          onClose();
        }
      }
    } catch (error) {
      toast.error(
        error.data?.message || error.message || "Something went wrong!"
      );
    }
  };
  const title = `${isEditMode ? 'Edit' : 'Create'} page`

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="md"
    >
      <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>


        <Grid container spacing={2} padding={2}>

          <Grid item xs={12}>
            <FormInput
              fullWidth
              label="Page Category"
              name="category"
              defaultValue={isEditMode ? pageData.category : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInput
              fullWidth
              label="Page Name"
              name="name"
              defaultValue={isEditMode ? pageData.name : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInput
              fullWidth
              label="Path"
              name="path"
              placeholder="/example-path"
              required
              defaultValue={isEditMode ? pageData.path : "/"}
            />

          </Grid>
          <Grid item xs={12}>
            <FormInput
              fullWidth
              label="Route"
              name="route"
              placeholder="example-route"
              required
              defaultValue={isEditMode ? pageData.route : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <FormSelect
              size="normal"
              label="Status"
              items={["Active", "Inactive"]}
              name="status"
              defaultValue={isEditMode ? pageData.status : "Active"}
            />
          </Grid>
        </Grid>
        <Box sx={buttonBox} >
          <Button color="error" onClick={onClose}>Cancel</Button>
          <Button
            color='info'
            type="submit"
            variant="contained"
            disabled={!tenantDomain}
          >
            {isEditMode ? "Update Page" : "Create Page"}
          </Button>
        </Box>

      </GarageForm>
    </GarageModal>
  );
};

export default PageForm;