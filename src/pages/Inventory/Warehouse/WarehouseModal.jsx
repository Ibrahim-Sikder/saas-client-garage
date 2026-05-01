/* eslint-disable react/prop-types */

"use client";
import {
  Typography,
  Button,
  DialogTitle,
  Grid,
  Divider,

} from "@mui/material";
import {
  Warehouse as WarehouseIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Storage as CapacityIcon,
} from "@mui/icons-material";
import GarageForm from "../../../components/form/Form";
import TASInput from "../../../components/form/Input";
import TASSelect from "../../../components/form/Select";
import { cityOptions, warehouseTypes } from "../../../utils/options";
import TASAutocomplete from "../../../components/form/Autocomplete";
import FormTextArea from "../../../components/form/FormTextArea";
import {
  useCreateWarehouseMutation,
  useGetSingleWarehouseQuery,
  useUpdateWarehouseMutation,
} from "../../../redux/api/warehouseApi";
import { toast } from "react-toastify";
import { labelStyle } from "../../../utils/customStyle";
import GarageModal from "../../../components/Share/Modal/GarageModal";
import { useAppOptions } from "../../../hooks/useAppOptions";
import Can from "../../../components/Can";

const WarehouseModal = ({ open, onClose, warehouseId }) => {
  const [createWarehouse] = useCreateWarehouseMutation();
  const [updateWarehouse] = useUpdateWarehouseMutation();
  const { tenantDomain, performActionWithPermission } = useAppOptions()
  const { data: singleWarehouse, isLoading } = useGetSingleWarehouseQuery(
    { tenantDomain, id: warehouseId },
    { skip: !warehouseId }
  );

  const handleClose = () => {
    onClose(false);
  };

  const handleSubmit = async (data) => {
    performActionWithPermission(
      'dashboard/warehouse',
      warehouseId ? 'edit' : 'create',
      async () => {
        const modifiedData = {
          ...data,
          city: data.city?.[0] || "",
        };

        try {
          let res;
          if (warehouseId) {
            res = await updateWarehouse({
              id: warehouseId,
              data: { ...modifiedData, tenantDomain },
            }).unwrap();
          } else {
            res = await createWarehouse({
              tenantDomain,
              ...modifiedData,
            }).unwrap();
          }

          if (res.success) {
            toast.success(`Warehouse ${warehouseId ? 'updated' : 'created'} successfully!`);
            handleClose();
          }
        } catch (error) {
          const apiError = error?.data || error;
          if (apiError?.errorSources?.length > 0) {
            apiError.errorSources.forEach((source) => {
              toast.error(`${source.path}: ${source.message}`);
            });
          } else if (apiError?.message) {
            toast.error(apiError.message);
          } else {
            toast.error("Failed to save warehouse");
          }
        }
      },
      `You don't have permission to ${warehouseId ? 'update' : 'create'} warehouse!`
    );
  };


  const defaultValue = {
    name: singleWarehouse?.data?.name || "",
    address: singleWarehouse?.data?.address || "",
    city: [singleWarehouse?.data?.city] || [],
    manager: singleWarehouse?.data?.manager || "",
    phone: singleWarehouse?.data?.phone || "",
    type: singleWarehouse?.data?.type || "",
    capacity: singleWarehouse?.data?.capacity || "",
    openingDate: singleWarehouse?.data?.openingDate || "",
    status: singleWarehouse?.data?.status || "active",
    note: singleWarehouse?.data?.note || "",
  };

  const title = "Create warehouse "

  return (
    <>
      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <GarageModal
          open={open}
          setOpen={onClose}
          title={title}
          maxWidth="md"
        >
          <GarageForm onSubmit={handleSubmit} defaultValues={defaultValue}>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="" sx={{ fontWeight: "bold", display: "flex" }}>
                {warehouseId ? "Update" : "Add New"} Warehouse
              </Typography>
            </DialogTitle>
            <Divider />

            <Grid container spacing={3} sx={{ mt: 0, padding: 2 }}>
              {/* Warehouse Name (Required) */}
              <Grid item xs={12}>
                <TASInput
                  name="name"
                  label={
                    <>
                      Warehouse Name
                      <span style={labelStyle}> *</span>
                    </>
                  }
                  icon={WarehouseIcon}
                  fullWidth

                  placeholder="Main Warehouse"
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TASInput
                  name="address"
                  label="Address"
                  icon={LocationOnIcon}
                  fullWidth
                  placeholder="123 Industrial Area"
                />
              </Grid>

              {/* City */}
              <Grid item xs={12} md={6}>
                <TASAutocomplete
                  name="city"
                  label="City"
                  options={cityOptions}
                  icon={LocationOnIcon}
                />
              </Grid>

              {/* Store Manager */}
              <Grid item xs={12} md={6}>
                <TASInput
                  name="manager"
                  label="Store Manager"
                  icon={PersonIcon}
                  fullWidth
                  placeholder="John Doe"
                />
              </Grid>

              {/* Store Manager Phone */}
              <Grid item xs={12} md={6}>
                <TASInput
                  name="phone"
                  label="Store Manager Phone"
                  icon={PhoneIcon}
                  fullWidth
                  placeholder="+1 234 567 890"
                />
              </Grid>

              {/* Warehouse Type */}
              <Grid item xs={12} md={6}>
                <TASSelect
                  name="type"
                  label="Warehouse Type"
                  items={warehouseTypes}
                  icon={BusinessIcon}
                />
              </Grid>

              {/* Capacity */}
              <Grid item xs={12} md={6}>
                <TASInput
                  name="capacity"
                  label="Capacity"
                  icon={CapacityIcon}
                  fullWidth
                  placeholder="5000 Units"
                />
              </Grid>

              {/* Opening Date */}
              <Grid item xs={12} md={6}>
                <TASInput
                  name="openingDate"
                  label="Opening Date"
                  type="date"
                  icon={EventIcon}
                  fullWidth
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={6}>
                <TASSelect
                  name="status"
                  label="Status"
                  items={["active", "inactive"]}
                  icon={BusinessIcon}
                />
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <FormTextArea
                  name="note"
                  label="Notes"
                  icon={DescriptionIcon}
                  fullWidth
                  placeholder="Special storage requirements or other notes..."
                  rows={4}
                />
              </Grid>
            </Grid>

            <div className="flex flex-col md:flex-row justify-between items-center mt-3 space-y-3">
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 3,
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 },
                }}
              >
                Cancel
              </Button>
              <Can action={warehouseId ? 'edit' : 'create'}
                page="/dashboard/warehouse">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 3,
                    color: "white",
                    mb: 2

                  }}
                >
                  {warehouseId ? "Update Warehouse" : "Create Warehouse"}
                </Button>
              </Can>
            </div>
          </GarageForm>
        </GarageModal>
      )}
    </>
  );
};

export default WarehouseModal;
