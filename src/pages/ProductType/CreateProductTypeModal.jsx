/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import ProductTypeForm from "./ProductTypeForm";
import GarageModal from "../../components/Share/Modal/GarageModal";

export const CreateProductTypeModal = ({
  open,
  setOpen,
  editingProductType,
}) => {
  const title = editingProductType
    ? "Edit Product Type"
    : "Create Product Type";

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <GarageModal open={open} setOpen={setOpen} title={title} maxWidth="sm">
      <ProductTypeForm
        editingProductType={editingProductType}
        onSuccess={handleClose}
      />
    </GarageModal>
  );
};
