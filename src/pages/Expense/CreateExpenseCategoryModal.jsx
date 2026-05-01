/* eslint-disable react/prop-types */
import { Box, Grid } from "@mui/material";
import TASInput from "../../components/form/Input";
import { toast } from "react-toastify";
import {
  useCreateExpenseCategoryMutation,
  useGetSingleExpenseCategoryQuery,
  useUpdateExpenseCategoryMutation,
} from "../../redux/api/expense";
import { Close as CloseIcon, Save as SaveIcon } from "@mui/icons-material";
import { StyledButton } from "../../utils";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import GarageForm from "../../components/form/Form";
import { StyledModal } from "../../utils/customStyle";

const CreateExpenseCategoryModal = ({ open, setOpen, categoryId }) => {
  const tenantDomain = useTenantDomain();
  const { data: singleCategory, isLoading } = useGetSingleExpenseCategoryQuery({
    tenantDomain,
    id: categoryId,
  });

  const [createExpenseCategory, { isLoading: isCreating }] =
    useCreateExpenseCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateExpenseCategoryMutation();

  // Default form values
  const defaultValues = {
    name: singleCategory?.data?.name || "",
    code: singleCategory?.data?.code || "",
  };

  const handleSubmit = async (formData, reset) => {
    const toastId = toast.loading(
      categoryId
        ? "Updating expense category..."
        : "Creating expense category..."
    );
    try {
      if (categoryId) {
        const res = await updateCategory({
          tenantDomain,
          id: categoryId,
          ...formData,
        }).unwrap();
        toast.success(res.message || "Expense category updated successfully!");
      } else {
        const res = await createExpenseCategory({
          tenantDomain,
          expenseInfo: formData,
        }).unwrap();
        toast.success(res.message || "Expense category created successfully!");
      }
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        "Error: " +
        (error.data?.message || error.message || "Something went wrong!")
      );
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <>
      {isLoading ? (
        <h3>Loading...........</h3>
      ) : (
        <StyledModal
          open={open}
          setOpen={setOpen}
          width={{ xs: 300, md: 500 }}
          sx={{ padding: { xs: 1.5, md: 4 } }}
          title={
            categoryId ? "Update Expense Category" : "Create Expense Category"
          }
        >
          <Box padding={0}>

            <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>
              <Grid container spacing={3} padding={{ xs: 1.5, md: 4 }}>
                <Grid item xs={12}>
                  <TASInput
                    size="medium"
                    fullWidth
                    name="name"
                    label="Category Name"
                    placeholder="Enter category name"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TASInput
                    size="medium"
                    fullWidth
                    name="code"
                    label="Category Code"
                    placeholder="Enter unique category code"
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <StyledButton
                      variant="outlined"
                      color="secondary"
                      onClick={() => setOpen(false)}
                      startIcon={<CloseIcon />}
                      disabled={isCreating || isUpdating}
                    >
                      Cancel
                    </StyledButton>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={isCreating || isUpdating}
                    >
                      {categoryId ? "Update Category" : "Create Category"}
                    </StyledButton>
                  </Box>
                </Grid>
              </Grid>
            </GarageForm>
          </Box>
        </StyledModal>
      )}
    </>
  );
};

export default CreateExpenseCategoryModal;
