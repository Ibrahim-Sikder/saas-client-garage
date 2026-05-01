// hooks/useStockTransfer.js
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useCreateStockTransferMutation } from "../redux/api/stocktransferApi";

export default function useStockTransfer({ stockData, warehouseResponse, tenantDomain }) {
  // Form state
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    referenceNo: `TR-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 1000)
    ).padStart(3, "0")}`,
    fromLocation: "",
    toLocation: "",
    transferredBy: "",
  });

  // Transfer items state
  const [transferItems, setTransferItems] = useState([
    { id: 1, product: null, quantity: 1, note: "" },
  ]);

  // Error state
  const [errors, setErrors] = useState({});

  // Data processing state
  const [warehouseStocks, setWarehouseStocks] = useState({});
  const [availableProducts, setAvailableProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [createStockTransfer] = useCreateStockTransferMutation();

  useEffect(() => {
    if (
      warehouseResponse &&
      warehouseResponse.data &&
      warehouseResponse.data.warehouses
    ) {
      const warehouseList = warehouseResponse.data.warehouses.map(
        (warehouse) => ({
          id: warehouse._id,
          name: warehouse.name,
          code: warehouse.code,
          type: warehouse.type,
          status: warehouse.status,
        })
      );
      setWarehouses(warehouseList);
    }
  }, [warehouseResponse]);

  useEffect(() => {
    if (stockData && stockData.data) {
      // Group stocks by warehouse
      const stocksByWarehouse = {};

      stockData.data.forEach((stockItem) => {
        // Skip if stockItem doesn't have required structure
        if (!stockItem.warehouse || !stockItem.product) {
          return;
        }

        const warehouseId = stockItem.warehouse._id || stockItem.warehouse;
        const productId = stockItem.product._id;

        if (!stocksByWarehouse[warehouseId]) {
          stocksByWarehouse[warehouseId] = {
            warehouseInfo: stockItem.warehouse,
            products: {},
          };
        }

        // Add or update product in this warehouse
        if (!stocksByWarehouse[warehouseId].products[productId]) {
          stocksByWarehouse[warehouseId].products[productId] = {
            productInfo: stockItem.product,
            currentStock: stockItem.quantity || stockItem.inQuantity || 0,
            avgPurchasePrice: stockItem.avgPurchasePrice || 0,
            lastPurchasePrice: stockItem.lastPurchasePrice || 0,
            totalPurchaseValue: stockItem.totalPurchaseValue || 0,
            totalSellingValue: stockItem.totalSellingValue || 0,
          };
        }
      });

      setWarehouseStocks(stocksByWarehouse);
    }
  }, [stockData]);

  useEffect(() => {
    if (formData.fromLocation && warehouseStocks[formData.fromLocation]) {
      const products = [];
      const warehouseProducts = warehouseStocks[formData.fromLocation].products;

      Object.keys(warehouseProducts).forEach((productId) => {
        const product = warehouseProducts[productId];
        if (product.currentStock > 0) {
          products.push({
            _id: productId,
            name: product.productInfo.product_name || "Unknown Product",
            code: product.productInfo.product_code || "N/A",
            currentStock: product.currentStock,
            image: product.productInfo.image,
            category:
              product.productInfo.category?.main_category || "Uncategorized",
            sellingPrice: product.productInfo.sellingPrice || 0,
            purchasePrice:
              product.productInfo.purchasePrice ||
              product.lastPurchasePrice ||
              product.avgPurchasePrice ||
              0,
            batchNumber: product.productInfo.batchNumber || "",
            brand: product.productInfo.brand?.brand || "N/A",
            unit: product.productInfo.unit?.unit || "Unit",
          });
        }
      });

      setAvailableProducts(products);

      // Reset transfer items when location changes
      setTransferItems([{ id: 1, product: null, quantity: 1, note: "" }]);
    } else {
      setAvailableProducts([]);
    }
  }, [formData.fromLocation, warehouseStocks]);

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset toLocation if fromLocation changes
    if (name === "fromLocation") {
      setFormData((prev) => ({
        ...prev,
        toLocation: "",
      }));
    }
  };

  // Transfer item handlers
  const handleAddItem = () => {
    const newItem = {
      id: Math.max(...transferItems.map((item) => item.id), 0) + 1,
      product: null,
      quantity: 1,
      note: "",
    };
    setTransferItems([...transferItems, newItem]);
  };

  const handleRemoveItem = (id) => {
    setTransferItems(transferItems.filter((item) => item.id !== id));
    // Remove any errors for this item
    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const handleProductChange = (id, newProduct) => {
    setTransferItems(
      transferItems.map((item) =>
        item.id === id ? { ...item, product: newProduct, quantity: 1 } : item
      )
    );
    // Clear error for this item
    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const handleQuantityChange = (id, quantity) => {
    const item = transferItems.find((item) => item.id === id);

    if (item && item.product) {
      // Validate quantity against current stock
      if (quantity > item.product.currentStock) {
        setErrors({ ...errors, [id]: "Quantity exceeds available stock" });
      } else {
        // Clear error if it exists
        const newErrors = { ...errors };
        delete newErrors[id];
        setErrors(newErrors);
      }
    }

    setTransferItems(
      transferItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const handleNoteChange = (id, note) => {
    setTransferItems(
      transferItems.map((item) =>
        item.id === id ? { ...item, note: note } : item
      )
    );
  };

  // Helper function to get warehouse name by ID
  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    if (warehouse) {
      return warehouse.name;
    }
    if (warehouseStocks[warehouseId]) {
      return warehouseStocks[warehouseId].warehouseInfo.name;
    }

    return warehouseId;
  };

  // Reset form function
  const resetForm = useCallback(() => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      referenceNo: `TR-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 1000)
      ).padStart(3, "0")}`,
      fromLocation: "",
      toLocation: "",
      transferredBy: "",
    });
    setTransferItems([{ id: 1, product: null, quantity: 1, note: "" }]);
    setErrors({});
  }, []);

  // Form submission handler
  const handleSubmit = async (onSuccess) => {
    if (formSubmitting) {
      return;
    }

    // Validate form
    let hasErrors = false;
    const newErrors = {};

    if (!formData.fromLocation) {
      newErrors.fromLocation = "Source warehouse is required";
      hasErrors = true;
    }

    if (!formData.toLocation) {
      newErrors.toLocation = "Destination warehouse is required";
      hasErrors = true;
    }

    if (!formData.transferredBy) {
      newErrors.transferredBy = "Transfer person is required";
      hasErrors = true;
    }

    if (!transferItems || transferItems.length === 0) {
      newErrors.items = "At least one product must be added";
      hasErrors = true;
    } else {
      transferItems.forEach((item, index) => {
        if (!item.product) {
          newErrors[`item_${index}`] = "Product is required";
          hasErrors = true;
        } else if (item.quantity <= 0) {
          newErrors[`item_${index}`] = "Quantity must be greater than 0";
          hasErrors = true;
        } else if (item.quantity > item.product.currentStock) {
          newErrors[`item_${index}`] = "Quantity exceeds available stock";
          hasErrors = true;
        }
      });
    }

    setErrors(newErrors);

    if (!hasErrors) {
      setFormSubmitting(true);

      try {
        // Prepare transfer data
        const items = Array.isArray(transferItems)
          ? transferItems
              .filter((item) => item && item.product)
              .map((item) => ({
                product: item.product._id,
                quantity: Number(item.quantity),
                note: item.note || "",
                batchNumber: `TR-${Date.now()}-${item.id}`,
              }))
          : [];

        const transferData = {
          referenceNo: formData.referenceNo,
          date: formData.date,
          fromWarehouse: formData.fromLocation,
          toWarehouse: formData.toLocation,
          transferredBy: formData.transferredBy,
          items,
        };

        const result = await createStockTransfer({
          transferData,
          tenantDomain,
        }).unwrap();

        if (result.success) {

          toast.success("Stock transfer completed successfully!");

          // Call success callback with the result
          if (onSuccess && typeof onSuccess === "function") {
            onSuccess(result);
          }
          resetForm();
        } else {
          setErrors({
            submit: result.message || "Transfer failed. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error transferring stock:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "An unexpected error occurred";
        toast.error(errorMessage);
        setErrors({
          submit: errorMessage,
        });
      } finally {
        setFormSubmitting(false);
      }
    }
  };

  return {
    formData,
    transferItems,
    errors,
    warehouses,
    availableProducts,
    formSubmitting,
    handleInputChange,
    handleSelectChange,
    handleAddItem,
    handleRemoveItem,
    handleProductChange,
    handleQuantityChange,
    handleNoteChange,
    handleSubmit,
    getWarehouseName,
    resetForm,
  };
}