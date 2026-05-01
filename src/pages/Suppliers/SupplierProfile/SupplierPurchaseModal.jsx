/* eslint-disable react/prop-types */

import GarageModal from "../../../components/Share/Modal/GarageModal";
import PurChaseForm from "../../Parchase/PurChaseForm";

export default function SupplierPurchaseModal({ open, setOpen }) {
  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title="Create New Product"
      maxWidth="xl"
      fullWidth
    >
      <PurChaseForm />
    </GarageModal>
  );
}
