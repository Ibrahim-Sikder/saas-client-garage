/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import {
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Category as CategoryIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useCreateCategoryMutation, useGetSingleCategoryQuery, useUpdateCategoryMutation } from "../../redux/api/categoryApi";
import GarageForm from "../../components/form/Form";
import ImageUpload from "../../components/form/ImageUpload";
import TASInput from "../../components/form/Input";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import GarageModal from "../../components/Share/Modal/GarageModal";
import Can from "../../components/Can";
import { usePermissions } from "../../context/PermissionContext";

export const CreateCategoryModal = ({ open, setOpen, categoryId }) => {
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const { performActionWithPermission } = usePermissions();
  const { tenantDomain } = useTenantDomain();

  const { data, isLoading: isLoadingCategory } = useGetSingleCategoryQuery(
    { tenantDomain, id: categoryId },
    { skip: !categoryId }
  );

  const isLoading = isCreating || isUpdating || isLoadingCategory;

  const handleSubmit = async (formData) => {
    performActionWithPermission(
      '/dashboard/category',
      categoryId ? 'edit' : 'create',
      async () => {
        try {
          const imageUrl = formData.image && formData.image.length > 0
            ? formData.image[0]
            : data?.data?.image;

          let res;
          if (categoryId) {
            res = await updateCategory({
              ...formData,
              image: imageUrl,
              id: categoryId,
              tenantDomain,
            }).unwrap();
          } else {
            res = await createCategory({
              ...formData,
              image: imageUrl,
              tenantDomain
            }).unwrap();
          }

          if (res.success) {
            toast.success(`Category ${categoryId ? 'updated' : 'created'} successfully!`);
            setOpen(false);
          }
        } catch (error) {
          toast.error(error?.data?.message || error?.message || "Something went wrong");
        }
      },
      `You don't have permission to ${categoryId ? 'edit' : 'create'} category`
    );
  };

  // Proper default values for the form
  const defaultValues = categoryId ? {
    main_category: data?.data?.main_category || "",
    sub_category: data?.data?.sub_category || "",
    image: data?.data?.image ? [data.data.image] : [],
  } : {
    main_category: "",
    sub_category: "",
    image: [],
  };

  const title = categoryId ? "Edit Category" : "Create Category";
  const buttonText = categoryId ? "Update Category" : "Create Category";

  if (isLoadingCategory && categoryId) {
    return (
      <GarageModal open={open} setOpen={setOpen} title={title} maxWidth="sm">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <CircularProgress />
        </div>
      </GarageModal>
    );
  }

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="sm"
    >
      <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>
        <Grid container spacing={3} style={{ padding: 8 }}>
          <Grid item xs={12}>
            <ImageUpload
              fullWidth
              name="image"
              label="Upload Category Image"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight="semi-bold" mb={1}>
              Main Category
            </Typography>
            <TASInput
              name="main_category"
              label="Main Category"
              placeholder="Main Category"
              required
              icon={CategoryIcon}
              iconPosition="start"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight="semi-bold" mb={1}>
              Sub Category
            </Typography>
            <TASInput
              name="sub_category"
              label="Sub Category"
              placeholder="Sub Category"
              required
              icon={CategoryIcon}
              iconPosition="start"
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Can
              action={categoryId ? 'edit' : 'create'}
              page="/dashboard/category"
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  borderRadius: 100,
                  background: "#42A1DA",
                  boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  color: "white",
                  '&:disabled': {
                    background: '#cccccc',
                  }
                }}
              >
                {isLoading ? "Processing..." : buttonText}
              </Button>
            </Can>
          </Grid>
        </Grid>
      </GarageForm>
    </GarageModal>
  );
};