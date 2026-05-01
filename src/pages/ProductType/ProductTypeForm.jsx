/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import TASForm from "../../components/form/Form";
import { Button, Grid, Typography } from "@mui/material";
import TASInput from "../../components/form/Input";
import { toast } from "react-toastify";
import { useCreateProductTypeMutation, useUpdateProductTypeMutation } from "../../redux/api/productTypeApi";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import Can from "../../components/Can";
import { usePermissions } from "../../context/PermissionContext";

const ProductTypeForm = ({ editingProductType, onSuccess }) => {
  const [createProductType, { isLoading: isCreating }] = useCreateProductTypeMutation();
  const [updateProductType, { isLoading: isUpdating }] = useUpdateProductTypeMutation();
  const [formKey, setFormKey] = useState(0);

  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();
  useEffect(() => {
    if (editingProductType) {
      setFormKey(prev => prev + 1);
    }
  }, [editingProductType]);

  const handleSubmit = async (data) => {
    performActionWithPermission('/dashboard/product-type', 'create',
      async () => {
        try {
          const res = await createProductType({ tenantDomain, data: data }).unwrap();
          if (res.success) {
            toast.success("Product Type created successfully!");
            if (onSuccess) onSuccess();
          }
        } catch (error) {
          toast.error(error.message || "Something went wrong!");
        }
      }
    )
  };

  const handleUpdate = async (data) => {

    performActionWithPermission('/dashboard/product-type', 'edit',
      async () => {
        try {
          const res = await updateProductType({
            id: editingProductType?._id,
            tenantDomain,
            data: data
          }).unwrap();
          if (res.success) {
            toast.success("Product Type updated successfully!");
            if (onSuccess) onSuccess();
          }
        } catch (error) {
          toast.error(error.message || "Something went wrong!");
        }
      }
    )
  };

  const defaultValues = {
    product_type: editingProductType?.product_type || ''
  };
  return (
    <TASForm
      key={formKey}
      onSubmit={editingProductType ? handleUpdate : handleSubmit}
      defaultValues={defaultValues}
    >
      <Grid container spacing={2} style={{ padding: 5 }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Typography fontWeight="semi-bold" mb={1}>
            Product Type
          </Typography>
          <TASInput
            size="medium"
            fullWidth
            name="product_type"
            label="Product Type"
            placeholder="Enter product type name"
          />
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Can
            page='/dashboard/product-type'
            action={editingProductType ? 'edit' : 'create'}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || isUpdating}
              sx={{
                color: "white",
                bgcolor: "#499CCC",

              }}
            >
              {isCreating || isUpdating ? (
                "Processing..."
              ) : (
                editingProductType ? "Update Product Type" : "Create Product Type"
              )}
            </Button>
          </Can>
        </Grid>

        {/* Debug info - you can remove this later */}
        {editingProductType && (
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="body2" color="text.secondary">
              Debug: Editing ID: {editingProductType._id}, Name: {editingProductType.product_type}
            </Typography>
          </Grid>
        )}
      </Grid>
    </TASForm>
  );
};

export default ProductTypeForm;