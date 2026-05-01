import ProductList from "../../pages/Products/ProductList";
import AddProduct from "../../pages/Products/AddProduct";
import UpdateProduct from "../../pages/Products/UpdateProduct";
import CategoryList from "../../pages/Category/CategoryList";
import Brand from "../../pages/Brand/Brand";
import Unit from "../../pages/Unit/Unit";
import Barcode from "../../pages/Barcode/Barcode";
import ProductType from "../../pages/ProductType/ProductType";

export const productRoutes = [
  {
    path: "product-list",
    element: <ProductList />,
  },
  {
    path: "add-product",
    element: <AddProduct />,
    action: "create",
  },
  {
    path: "update-product",
    element: <UpdateProduct />,
    action: "edit",
  },
  {
    path: "category",
    element: <CategoryList />,
  },
  {
    path: "brand",
    element: <Brand />,
  },
  {
    path: "unit",
    element: <Unit />,
  },
  {
    path: "barcode",
    element: <Barcode />,
  },
  {
    path: "product-type",
    element: <ProductType />,
  },
];
