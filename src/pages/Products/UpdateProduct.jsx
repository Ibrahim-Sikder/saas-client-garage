import ProductForm from "./ProductForm";

const UpdateProduct = () => {
  const id = new URLSearchParams(location.search).get("id");

  return <ProductForm id={id} />;
};

export default UpdateProduct;
