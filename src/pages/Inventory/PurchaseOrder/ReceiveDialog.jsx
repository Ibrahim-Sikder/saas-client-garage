/* eslint-disable react/prop-types */
import {
  CalendarToday,
  CheckCircle,
} from "@mui/icons-material";
import {
  Grid,
  InputAdornment,
  Button,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { useUpdatePurchaseOrderMutation } from "../../../redux/api/purchaseOrderApi";
import GarageForm from "../../../components/form/Form";
import FormInput from "../../../components/form/Input";
import FormDatePicker from "../../../components/form/Datepicker";
import TASSelect from "../../../components/form/Select";
import { useAppOptions } from "../../../hooks/useAppOptions";
import { purchaseBtn } from "../../../utils/customStyle";
import Can from "../../../components/Can";
import GarageModal from "../../../components/Share/Modal/GarageModal";
const ReceiveDialog = ({ open, purchaseId, onClose, setOpen }) => {

  const [updatePurchaseOrder, { isLoading }] = useUpdatePurchaseOrderMutation();
  const { performActionWithPermission, tenantDomain } = useAppOptions()

  const handleReceiveOrder = async (data) => {
    performActionWithPermission('dashboard/purchase-order', 'edit',
      async () => {
        try {
          const res = await updatePurchaseOrder({
            tenantDomain,
            id: purchaseId,
            ...data,
          }).unwrap();

          if (res.success) {
            toast.success("Order received successfully!");
            onClose();
          }
        } catch (error) {
          const errorMessage =
            error.data?.errorSources?.[0]?.message ||
            error.data?.err?.issues?.[0]?.message ||
            error.data?.message ||
            "Failed to receive order";

          toast.error(errorMessage);
        }

      }, "You don't have permission to update order"
    )
  };
  const title = ' Receive Order'
  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="sm"
    >

      <GarageForm onSubmit={handleReceiveOrder}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormDatePicker
              fullWidth
              name="receiveDate"
              label="Receive Date"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TASSelect
              size="normal"
              name="status"
              items={["Received", "Pending", "Cancelled", "Shipped",]}
              label="Receive Status"
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInput
              fullWidth
              label="Notes"
              multiline
              rows={3}
              name="note"
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Grid>
        </Grid>
        <Box display='flex' justifyContent='flex-end'>
          <Can action='edit'
            page="/dashboard/purchase-order">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={<CheckCircle />}
              sx={purchaseBtn}
            >
              {isLoading ? "Processing..." : "Confirm Receipt"}
            </Button>
          </Can>
        </Box>
      </GarageForm>
    </GarageModal>
  );
};

export default ReceiveDialog;
