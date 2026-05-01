/* eslint-disable no-unused-vars */
import { useState } from "react";
import { toast } from "react-toastify";
import { unitOptions } from "../utils/options";

export const useQuotationHandlers = (
  isEditMode,
  specificQuotation,
  setSpecificQuotation,
  items,
  setItems,
  serviceItems,
  setServiceItems,
  stockData,
  setProductSuggestions,
  setShowSuggestions,
  setActiveSuggestionIndex,
  setActiveInputType,
  setActiveInputIndex,
  removeQuotation,
  refetchQuotation,
  id,
  tenantDomain,
  setReload,
  setPhoneNumber,
  reload,
  activeInputIndex,
  setAddButton,
  setServiceAddButton,
  serviceAddButton,
  addButton,
  activeInputType
) => {
  const [discount, setDiscount] = useState(0);
  const [vat, setVAT] = useState(0);
  const [tax, setTax] = useState(0);
  const [removeButton, setRemoveButton] = useState("");

  const filterProductSuggestions = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2 || !stockData?.data) {
      setProductSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filteredProducts = stockData.data.filter((stock) =>
      stock.product.product_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setProductSuggestions(filteredProducts);
    setShowSuggestions(filteredProducts.length > 0);
    setActiveSuggestionIndex(0);
  };

  const handleAddClick = () => {
    setItems([
      ...items,
      {
        description: "",
        unit: "",
        quantity: "",
        rate: "",
        rateDisplay: "",
        total: "",
      },
    ]);
  };

  const handleServiceAdd = () => {
    setServiceItems([
      ...serviceItems,
      {
        description: "",
        unit: "",
        quantity: "",
        rate: "",
        rateDisplay: "",
        total: "",
      },
    ]);
  };

  const handleRemove = (index) => {
    if (typeof index === "number" && index >= 0 && index < items.length) {
      const list = [...items];
      list.splice(index, 1);
      setItems(list);
    } else {
      console.error("Invalid index");
    }
  };

  const handleServiceRemove = (index) => {
    if (!index) {
      const list = [...serviceItems];
      setServiceItems(list);
    } else {
      const list = [...serviceItems];
      list.splice(index, 1);
      setServiceItems(list);
    }
  };

  // Description change handlers
  const handleServiceDescriptionChange = (index, value) => {
    if (
      isEditMode &&
      specificQuotation?.service_input_data &&
      Array.isArray(specificQuotation.service_input_data)
    ) {
      const newItems = [...specificQuotation.service_input_data];
      newItems[index] = {
        ...newItems[index],
        description: value,
      };

      setSpecificQuotation((prevState) => ({
        ...prevState,
        service_input_data: newItems,
      }));

      setActiveInputType("service");
      setActiveInputIndex(index);
      filterProductSuggestions(value);
    } else {
      const newItems = [...serviceItems];
      newItems[index].description = value;
      if (newItems[index].product) {
        delete newItems[index].product;
        delete newItems[index].warehouse;
        delete newItems[index].product_name;
        delete newItems[index].sellingPrice;
        delete newItems[index].batchNumber;
      }
      setServiceItems(newItems);
      setActiveInputType("service");
      setActiveInputIndex(index);
      filterProductSuggestions(value);
    }
  };

  const handleDescriptionChange = (index, value) => {
    if (
      isEditMode &&
      specificQuotation?.input_data &&
      Array.isArray(specificQuotation.input_data)
    ) {
      const newItems = [...specificQuotation.input_data];
      newItems[index] = {
        ...newItems[index],
        description: value,
      };

      setSpecificQuotation((prevState) => ({
        ...prevState,
        input_data: newItems,
      }));

      setActiveInputType("parts");
      setActiveInputIndex(index);
      filterProductSuggestions(value);
    } else {
      const newItems = [...items];
      newItems[index].description = value;
      if (newItems[index].product) {
        delete newItems[index].product;
        delete newItems[index].warehouse;
        delete newItems[index].product_name;
        delete newItems[index].sellingPrice;
        delete newItems[index].batchNumber;
      }
      setItems(newItems);
      setActiveInputType("parts");
      setActiveInputIndex(index);
      filterProductSuggestions(value);
    }
  };

  // Unit change handlers
  const handleUnitChange = (index, value) => {
    if (
      isEditMode &&
      specificQuotation?.input_data &&
      Array.isArray(specificQuotation.input_data)
    ) {
      const newItems = [...specificQuotation.input_data];
      newItems[index] = {
        ...newItems[index],
        unit: value,
      };

      setSpecificQuotation((prevState) => ({
        ...prevState,
        input_data: newItems,
      }));
    } else {
      const newItems = [...items];
      newItems[index].unit = value;
      setItems(newItems);
    }
  };

  const handleServiceUnitChange = (index, value) => {
    if (
      isEditMode &&
      specificQuotation?.service_input_data &&
      Array.isArray(specificQuotation.service_input_data)
    ) {
      const newItems = [...specificQuotation.service_input_data];
      newItems[index] = {
        ...newItems[index],
        unit: value,
      };

      setSpecificQuotation((prevState) => ({
        ...prevState,
        service_input_data: newItems,
      }));
    } else {
      const newItems = [...serviceItems];
      newItems[index].unit = value;
      setServiceItems(newItems);
    }
  };

  // Quantity change handlers
  const handleQuantityChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    if (
      isEditMode &&
      specificQuotation?.input_data &&
      Array.isArray(specificQuotation.input_data)
    ) {
      const newItems = [...specificQuotation.input_data];
      const parsedQuantity = Number.parseFloat(cleanValue) || 0;
      const rate = Number.parseFloat(newItems[index].rate) || 0;
      const total = parsedQuantity * rate;

      newItems[index] = {
        ...newItems[index],
        quantity: cleanValue,
        total: Number.parseFloat(total.toFixed(2)),
      };

      setSpecificQuotation((prevState) => ({
        ...prevState,
        input_data: newItems,
      }));
    } else {
      const newItems = [...items];
      const parsedValue = Number.parseFloat(cleanValue) || 0;
      newItems[index].quantity = cleanValue;
      newItems[index].total =
        parsedValue * (Number.parseFloat(newItems[index].rate) || 0);
      newItems[index].total = Number.parseFloat(
        newItems[index].total.toFixed(2)
      );
      setItems(newItems);
    }
  };

  const handleServiceQuantityChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    if (
      isEditMode &&
      specificQuotation?.service_input_data &&
      Array.isArray(specificQuotation.service_input_data)
    ) {
      const newItems = [...specificQuotation.service_input_data];
      const parsedQuantity = Number.parseFloat(cleanValue) || 0;
      const rate = Number.parseFloat(newItems[index].rate) || 0;
      const total = parsedQuantity * rate;

      newItems[index] = {
        ...newItems[index],
        quantity: cleanValue,
        total: Number.parseFloat(total.toFixed(2)),
      };

      setSpecificQuotation((prevState) => ({
        ...prevState,
        service_input_data: newItems,
      }));
    } else {
      const newItems = [...serviceItems];
      const parsedValue = Number.parseFloat(cleanValue) || 0;
      newItems[index].quantity = cleanValue;
      newItems[index].total =
        parsedValue * (Number.parseFloat(newItems[index].rate) || 0);
      newItems[index].total = Number.parseFloat(
        newItems[index].total.toFixed(2)
      );
      setServiceItems(newItems);
    }
  };

  // Rate change handlers
  const handleRateChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    if (
      isEditMode &&
      specificQuotation?.input_data &&
      Array.isArray(specificQuotation.input_data)
    ) {
      const newItems = [...specificQuotation.input_data];
      const parsedRate = Number.parseFloat(cleanValue) || 0;
      const quantity = Number.parseFloat(newItems[index].quantity) || 0;
      const total = quantity * parsedRate;

      newItems[index] = {
        ...newItems[index],
        rate: parsedRate,
        rateDisplay: cleanValue,
        total: Number.parseFloat(total.toFixed(2)),
      };

      setSpecificQuotation((prevState) => ({
        ...prevState,
        input_data: newItems,
      }));
    } else {
      const newItems = [...items];
      const parsedRate = Number.parseFloat(cleanValue) || 0;
      newItems[index].rate = parsedRate;
      newItems[index].rateDisplay = cleanValue;
      newItems[index].total =
        (Number.parseFloat(newItems[index].quantity) || 0) * parsedRate;
      newItems[index].total = Number.parseFloat(
        newItems[index].total.toFixed(2)
      );
      setItems(newItems);
    }
  };

  const handleServiceRateChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    if (
      isEditMode &&
      specificQuotation?.service_input_data &&
      Array.isArray(specificQuotation.service_input_data)
    ) {
      const newItems = [...specificQuotation.service_input_data];
      const parsedRate = Number.parseFloat(cleanValue) || 0;
      const quantity = Number.parseFloat(newItems[index].quantity) || 0;
      const total = quantity * parsedRate;

      newItems[index] = {
        ...newItems[index],
        rate: parsedRate,
        rateDisplay: cleanValue,
        total: Number.parseFloat(total.toFixed(2)),
      };

      setSpecificQuotation((prevState) => ({
        ...prevState,
        service_input_data: newItems,
      }));
    } else {
      const newItems = [...serviceItems];
      const parsedRate = Number.parseFloat(cleanValue) || 0;
      newItems[index].rate = parsedRate;
      newItems[index].rateDisplay = cleanValue;
      newItems[index].total =
        (Number.parseFloat(newItems[index].quantity) || 0) * parsedRate;
      newItems[index].total = Number.parseFloat(
        newItems[index].total.toFixed(2)
      );
      setServiceItems(newItems);
    }
  };

  // Discount, VAT, Tax handlers
  const handleDiscountChange = (value) => {
    const parsedValue = value === "" ? 0 : Number.parseFloat(value);
    if (!isNaN(parsedValue)) {
      setDiscount(parsedValue);
    }
  };

  const handleVATChange = (value) => {
    const parsedValue = value === "" ? 0 : Number.parseFloat(value);
    if (!isNaN(parsedValue)) {
      setVAT(parsedValue);
    }
  };

  const handleTaxChange = (value) => {
    const parsedValue = value === "" ? 0 : Number.parseFloat(value);
    if (!isNaN(parsedValue)) {
      setTax(parsedValue);
    }
  };

  // Phone number handler
  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber.length <= 10 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber.length > 1)
    ) {
      setPhoneNumber(newPhoneNumber);
    }
  };

  // Remove handlers for edit mode
  const handleRemoveButton = async (i, name) => {
    try {
      setRemoveButton("remove");
      const values = {
        tenantDomain,
        quotationInfo: {
          id: id,
          data: { index: i, quotation_name: name },
        },
      };

      const response = await removeQuotation(values);

      if (response?.data) {
        if (response.data.success) {
          setReload(!reload);
          toast.success(response.data.message || "Item removed successfully");
          refetchQuotation();
        } else {
          toast.error(response.data.message || "Failed to remove item");
        }
      } else if (response?.error) {
        const errorMessage =
          response.error?.data?.message ||
          response.error?.message ||
          "Failed to remove item";
        toast.error(errorMessage);
        console.error("Remove quotation error:", response.error);
      } else {
        toast.error("Unexpected response format");
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error in handleRemoveButton:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An error occurred while removing the item";
      toast.error(errorMessage);
    } finally {
      setRemoveButton("");
    }
  };

  const handlePartsAddButton = () => {
    setAddButton(!addButton);
  };

  const handleServiceAddButton = () => {
    setServiceAddButton(!serviceAddButton);
  };

  const handleServiceDescriptionAdd = () => {
    setServiceItems([
      ...serviceItems,
      {
        description: "",
        unit: "",
        quantity: "",
        rate: "",
        rateDisplay: "",
        total: "",
      },
    ]);
  };

  const handleServiceDescriptionRemove = (index) => {
    if (index === 0 && serviceItems.length === 1) {
      setServiceItems([
        {
          description: "",
          unit: "",
          quantity: "",
          rate: "",
          rateDisplay: "",
          total: "",
        },
      ]);
    } else {
      const list = [...serviceItems];
      list.splice(index, 1);
      setServiceItems(list);
    }
  };

  const findMatchingUnit = (productUnit) => {
    if (!productUnit) return "Pcs";
    const unitValue =
      typeof productUnit === "object" ? productUnit.unit : productUnit;
    const shortName =
      typeof productUnit === "object" ? productUnit.short_name : null;
    const exactMatch = unitOptions.find(
      (option) =>
        option.value === unitValue ||
        option.label === unitValue ||
        (shortName &&
          (option.value === shortName || option.label === shortName))
    );
    if (exactMatch) {
      return exactMatch.value;
    }
    const caseInsensitiveMatch = unitOptions.find(
      (option) =>
        option.value.toLowerCase() === unitValue?.toLowerCase() ||
        option.label.toLowerCase() === unitValue?.toLowerCase() ||
        (shortName &&
          (option.value.toLowerCase() === shortName.toLowerCase() ||
            option.label.toLowerCase() === shortName.toLowerCase()))
    );
    if (caseInsensitiveMatch) {
      return caseInsensitiveMatch.value;
    }
    return "Pcs";
  };

  // Handle select suggestion
  const handleSelectSuggestion = (product) => {
    if (!product) return;

    const productName = product.product?.product_name || "";
    const productPrice = Number(product.product?.sellingPrice) || 0;
    const productQuantity = product.stock || 1;
    let productUnit = "Set";

    if (product.product?.unit && typeof product.product.unit === "object") {
      productUnit = product.product.unit.unit || "Set";
    }

    const matchingUnit = findMatchingUnit(product.product.unit);
    const total = productQuantity * productPrice;

    if (activeInputType === "service") {
      if (
        isEditMode &&
        activeInputIndex < (specificQuotation?.service_input_data?.length || 0)
      ) {
        const newItems = [...(specificQuotation.service_input_data || [])];
        newItems[activeInputIndex] = {
          ...newItems[activeInputIndex],
          description: productName,
          unit: matchingUnit,
          rate: productPrice,
          rateDisplay: productPrice.toString(),
          quantity: productQuantity,
          total: total,
        };

        setSpecificQuotation((prevState) => ({
          ...prevState,
          service_input_data: newItems,
        }));
      } else {
        const actualIndex = isEditMode
          ? activeInputIndex -
            (specificQuotation?.service_input_data?.length || 0)
          : activeInputIndex;

        const newItems = [...serviceItems];
        newItems[actualIndex] = {
          ...newItems[actualIndex],
          description: productName,
          unit: matchingUnit,
          rate: productPrice,
          rateDisplay: productPrice.toString(),
          quantity: productQuantity,
          total: total,
        };
        setServiceItems(newItems);
      }
    } else if (activeInputType === "parts") {
      if (
        isEditMode &&
        activeInputIndex < (specificQuotation?.input_data?.length || 0)
      ) {
        const newItems = [...(specificQuotation.input_data || [])];
        newItems[activeInputIndex] = {
          ...newItems[activeInputIndex],
          description: productName,
          unit: matchingUnit,
          rate: productPrice,
          rateDisplay: productPrice.toString(),
          quantity: productQuantity,
          total: total,
        };

        setSpecificQuotation((prevState) => ({
          ...prevState,
          input_data: newItems,
        }));
      } else {
        const actualIndex = isEditMode
          ? activeInputIndex - (specificQuotation?.input_data?.length || 0)
          : activeInputIndex;

        const newItems = [...items];
        newItems[actualIndex] = {
          ...newItems[actualIndex],
          description: productName,
          unit: matchingUnit,
          rate: productPrice,
          rateDisplay: productPrice.toString(),
          quantity: productQuantity,
          total: total,
        };
        setItems(newItems);
      }
    }

    setShowSuggestions(false);
  };

  return {
    discount,
    vat,
    tax,
    removeButton,
    filterProductSuggestions,
    handleAddClick,
    handleServiceAdd,
    handleRemove,
    handleServiceRemove,
    handleServiceDescriptionChange,
    handleDescriptionChange,
    handleUnitChange,
    handleServiceUnitChange,
    handleQuantityChange,
    handleServiceQuantityChange,
    handleRateChange,
    handleServiceRateChange,
    handleDiscountChange,
    handleVATChange,
    handleTaxChange,
    handlePhoneNumberChange,
    handleRemoveButton,
    handlePartsAddButton,
    handleServiceAddButton,
    handleServiceDescriptionAdd,
    handleServiceDescriptionRemove,
    handleSelectSuggestion,
  };
};
