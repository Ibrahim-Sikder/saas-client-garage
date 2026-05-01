/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import SupplierForm from "./SupplierForm";
import GarageModal from "../../components/Share/Modal/GarageModal";
export const AddSupplierModal = ({ open, setOpen }) => {
  const title = `Create Supplier`

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="md"
    >
      <SupplierForm />
    </GarageModal>
  );
};
