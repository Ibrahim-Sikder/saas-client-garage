/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AddCircle, Visibility, Edit, Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import Table from "@/components/Table";
import { useDeleteProductMutation } from "../../../redux/api/productApi";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

import { purchaseBtn } from "../../../utils/customStyle";
import ProductDetailsModal from "./ProductDetailsModal";

const SupplierProduct = ({ productData = [], loading = false }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [deleteProduct] = useDeleteProductMutation();
  const tenantDomain = useTenantDomain();

  const filteredProducts = useMemo(() => {
    return productData?.filter(
      (p) =>
        p?.product_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        p?.product_code?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
  }, [productData, searchTerm]);

  const columns = [
    { key: "product_code", label: "Product Code" },
    { key: "product_name", label: "Product Name" },
    { key: "batchNumber", label: "Batch Number" },
    {
      key: "sellingPrice",
      label: "Price",
      render: (item) => `৳${item.sellingPrice?.toFixed(2)}`,
    },
    {
      key: "product_quantity",
      label: "Stock",
      render: (item) => `${item.product_quantity} pcs`,
    },
    {
      key: "expiryDate",
      label: "Expiry Date",
      render: (item) =>
        item.expiryDate
          ? new Date(item.expiryDate).toLocaleDateString()
          : "N/A",
    },
    { key: "productStatus", label: "Status" },
  ];

  const actions = [
    {
      key: "view",
      label: "View",
      icon: Visibility,
      tooltip: "View Product",
      onClick: (item) => handleProductAction("view", item),
    },
    {
      key: "edit",
      label: "Edit",
      icon: Edit,
      tooltip: "Edit Product",
      onClick: (item) => handleProductAction("edit", item),
    },
    {
      key: "delete",
      label: "Delete",
      icon: Delete,
      tooltip: "Delete Product",
      className: "text-red-500",
      onClick: (item) => handleProductAction("delete", item),
    },
  ];

  const handleProductAction = (action, product) => {
    if (action === "edit") {
      navigate(`/dashboard/update-product/?id=${product._id}`);
      return;
    }

    if (action === "view") {
      setSelectedProduct(product);
      setDialogAction("view");
      setOpenDialog(true);
      return;
    }

    if (action === "delete") {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteProduct({ tenantDomain, id: product._id }).unwrap();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Product deleted successfully.",
              timer: 1500,
              showConfirmButton: false,
            });
          } catch {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Failed to delete product.",
            });
          }
        }
      });
      return;
    }

    if (action === "add") {
      setDialogAction("add");
      setOpenDialog(true);
      return;
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={() => handleProductAction("add")}
          sx={purchaseBtn}
        >
          Add New Product
        </Button>
      </div>
      <Table
        title="Supplier Product Catalog"
        columns={columns}
        data={filteredProducts || []}
        actions={actions}
        loading={loading}
        onSearch={(value) => setSearchTerm(value)}
        searchPlaceholder="Search by name or code..."
        emptyMessage="No products found"
      />

      <ProductDetailsModal
        open={openDialog && dialogAction === "view"}
        onClose={handleCloseDialog}
        product={selectedProduct}
        setOpen={setOpenDialog}
      />
    </>
  );
};

export default SupplierProduct;
