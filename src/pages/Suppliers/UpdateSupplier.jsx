import SupplierForm from "./SupplierForm";

const UpdateSupplier = () => {
  const id = new URLSearchParams(location.search).get("id");

  return <SupplierForm id={id}/>;
};

export default UpdateSupplier;
