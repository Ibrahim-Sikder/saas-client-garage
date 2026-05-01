/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import {
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";

import {
  Save as SaveIcon,
  BrandingWatermark,
} from "@mui/icons-material";
import GarageForm from "../../components/form/Form";
import TASInput from "../../components/form/Input";
import { useCreateBrandMutation, useGetSingleBrandQuery, useUpdateBrandMutation } from "../../redux/api/brandApi";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import GarageModal from "../../components/Share/Modal/GarageModal";
import { usePermissions } from "../../context/PermissionContext";
import Can from "../../components/Can";
import Loading from "../../components/Loading/Loading";

export const CreateBrandModal = ({ open, setOpen, brandId }) => {
  const [createBrand, { isLoading }] = useCreateBrandMutation();
  const [UpdateBrand, { isLoading: updateLoading }] = useUpdateBrandMutation();
  const { performActionWithPermission } = usePermissions();
  const { tenantDomain } = useTenantDomain();

  const { data, isLoading: singleBrandLoading } = useGetSingleBrandQuery(
    { tenantDomain, id: brandId },
    { skip: !brandId }
  );
  const handleSubmit = async (data) => {
    performActionWithPermission('/dashboard/brand', brandId ? 'edit' : 'create',
      async () => {
        try {
          let res;
          if (brandId) {
            res = await UpdateBrand({
              ...data,
              id: brandId,
              tenantDomain,
            }).unwrap();
          } else {
            res = await createBrand({
              ...data,
              tenantDomain
            }).unwrap();
          }
          if (res.success) {
            toast.success(`Brand ${brandId ? 'update' : 'create'} successfully!`);
            setOpen();
          }
        } catch (error) {
          toast.error(
            (error.message || "Something went wrong")
          );
        }
      }, `You don't have permission to ${brandId ? 'edit' : 'create'} brand ! `
    )
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const title = `${brandId ? 'Update' : 'Create'} Brand`

  const defaultValues = {
    brand: data?.data?.brand || "",
  }

  return (
    <>
      {
        singleBrandLoading ? (
          <Loading />
        ) : (
          <GarageModal
            open={open}
            setOpen={setOpen}
            title={title}
            maxWidth="sm"
          >
            <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>
              <Grid container spacing={3} style={{ padding: 8 }}>
                <Grid item xs={12}>
                  <TASInput
                    name="brand"
                    label="Brand Name "
                    placeholder="Brand Name"
                    required
                    icon={BrandingWatermark}
                    iconPosition="start"
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Can
                    action={brandId ? 'edit' : 'create'}
                    page="/dashboard/brand"
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      sx={{
                        borderRadius: 100,

                        boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                        py: 1.5,
                        textTransform: "none",
                        fontSize: "1rem",
                        color: "white",
                      }}
                    >
                      {brandId ? 'Update' : 'Create'} Brand
                    </Button>
                  </Can>

                </Grid>
              </Grid>
            </GarageForm>


          </GarageModal>
        )
      }

    </>
  );
};
