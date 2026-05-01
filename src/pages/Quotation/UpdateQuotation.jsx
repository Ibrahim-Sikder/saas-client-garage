/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { cmDmOptions, countries } from "../../constant";
import TrustAutoAddress from "../../components/TrustAutoAddress/TrustAutoAddress";
import {
  useGetSingleQuotationQuery,
  useRemoveQuotationMutation,
  useUpdateQuotationMutation,
} from "../../redux/api/quotation";
import { formatDate } from "../../utils/formateDate";
import { unitOptions } from "../../utils/options";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useGetAllStocksQuery } from "../../redux/api/stocksApi";
import { suggestionStyles } from "../../utils/customStyle";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { usePermissions } from "../../context/PermissionContext";
import Can from "../../components/Can";
import { formateNumber } from "../../utils/formateSemicolon";
import { useCompanyProfileData } from "../../hooks/useCompanyProfileData";

const UpdateQuotation = () => {
  const [specificQuotation, setSpecificQuotation] = useState({});
  const [value, setValue] = useState("");
  const [partsTotal, setPartsTotal] = useState(0);
  const [serviceTotal, setServiceTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [discount, setDiscount] = useState("");
  const [vat, setVAT] = useState("");
  const [tax, setTax] = useState("");
  const [error, setError] = useState("");
  const [removeButton, setRemoveButton] = useState("");
  const [reload, setReload] = useState(false);
  const [addButton, setAddButton] = useState(false);
  const [serviceAddButton, setServiceAddButton] = useState(false);
  const partsDiscountRef = useRef(null);
  const netTotalAmountRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { tenantDomain } = useTenantDomain();

  const { companyProfileData } = useCompanyProfileData();

  const userTypeFromProfile = new URLSearchParams(location.search).get(
    "user_type",
  );
  const userFromProfile = new URLSearchParams(location.search).get("user");
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [items, setItems] = useState([
    {
      description: "",
      unit: "",
      quantity: "",
      rate: "",
      rateDisplay: "",
      total: "",
    },
  ]);

  const [serviceItems, setServiceItems] = useState([
    {
      description: "",
      unit: "",
      quantity: "",
      rate: "",
      rateDisplay: "",
      total: "",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [activeInputType, setActiveInputType] = useState(null);
  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const [currentMileage, setCurrentMileage] = useState("");
  const [mileageChanged, setMileageChanged] = useState(false);
  const { performActionWithPermission } = usePermissions();
  const {
    register,
    handleSubmit,
    reset,
    setValue: setFormValue,
    formState: { errors },
  } = useForm();

  const queryParams = {
    tenantDomain,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  };

  const { data: stockData } = useGetAllStocksQuery(queryParams);

  const [updateQuotation, { isLoading: updateLoading, error: updateError }] =
    useUpdateQuotationMutation();
  const [removeQuotation, { isLoading: removeLoading, error: removeError }] =
    useRemoveQuotationMutation();

  const {
    data,
    isLoading: quotationLoading,
    error: quotationError,
    refetch: refetchQuotation,
  } = useGetSingleQuotationQuery(
    {
      tenantDomain,
      id,
    },
    {
      skip: !id || !tenantDomain,
    },
  );
  useEffect(() => {
    if (data && typeof data === "object") {
      const quotationData = data.data || data;
      if (quotationData && typeof quotationData === "object") {
        setSpecificQuotation(quotationData);
        setDiscount(quotationData.discount || "");
        setVAT(quotationData.vat || "");
        setTax(quotationData.tax || "");

        if (quotationData.mileage) {
          setCurrentMileage(quotationData.mileage.toString());
        }

        if (quotationData.date) {
          setSelectedDate(quotationData.date);
        }
      }
    }
  }, [data]);

  // Reset form when specificQuotation changes
  useEffect(() => {
    if (!specificQuotation || Object.keys(specificQuotation).length === 0) {
      return;
    }

    const resetData = {
      Id: specificQuotation?.Id,
      job_no: specificQuotation?.job_no,
      mileage:
        specificQuotation?.mileage || specificQuotation?.vehicle?.mileage,
    };

    if (specificQuotation?.user_type === "customer") {
      Object.assign(resetData, {
        company_name: specificQuotation?.customer?.company_name,
        customer_name: specificQuotation?.customer?.customer_name,
        customer_country_code:
          specificQuotation?.customer?.customer_country_code,
        customer_contact: specificQuotation?.customer?.customer_contact,
        customer_address: specificQuotation?.customer?.customer_address,
      });
    } else if (specificQuotation?.user_type === "company") {
      Object.assign(resetData, {
        company_name: specificQuotation?.company?.company_name,
        vehicle_username: specificQuotation?.company?.vehicle_username,
        company_address: specificQuotation?.company?.company_address,
        company_contact: specificQuotation?.company?.company_contact,
        company_country_code: specificQuotation?.company?.company_country_code,
        company_email: specificQuotation?.company?.company_email,
      });
    } else if (specificQuotation?.user_type === "showRoom") {
      Object.assign(resetData, {
        showRoom_name: specificQuotation?.showRoom?.showRoom_name,
        vehicle_username: specificQuotation?.showRoom?.vehicle_username,
        showRoom_address: specificQuotation?.showRoom?.showRoom_address,
        company_name: specificQuotation?.showRoom?.company_name,
        company_contact: specificQuotation?.showRoom?.company_contact,
        company_country_code: specificQuotation?.showRoom?.company_country_code,
      });
    }

    // Vehicle data
    Object.assign(resetData, {
      carReg_no: specificQuotation?.vehicle?.carReg_no,
      car_registration_no: specificQuotation?.vehicle?.car_registration_no,
      engine_no: specificQuotation?.vehicle?.engine_no,
      vehicle_brand: specificQuotation?.vehicle?.vehicle_brand,
      vehicle_name: specificQuotation?.vehicle?.vehicle_name,
      chassis_no: specificQuotation?.vehicle?.chassis_no,
    });

    reset(resetData);
  }, [specificQuotation, reset]);

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber.length <= 11 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber.length > 1)
    ) {
      setPhoneNumber(newPhoneNumber);
    }
  };

  // Calculate totals whenever items change
  useEffect(() => {
    const calculateTotals = () => {
      // Calculate parts total
      const existingPartsTotal =
        specificQuotation?.input_data?.reduce(
          (sum, item) => sum + (Number.parseFloat(item.total) || 0),
          0,
        ) || 0;

      const newPartsTotal = items.reduce(
        (sum, item) => sum + (Number.parseFloat(item.total) || 0),
        0,
      );

      // Calculate service total
      const existingServiceTotal =
        specificQuotation?.service_input_data?.reduce(
          (sum, item) => sum + (Number.parseFloat(item.total) || 0),
          0,
        ) || 0;

      const newServiceTotal = serviceItems.reduce(
        (sum, item) => sum + (Number.parseFloat(item.total) || 0),
        0,
      );

      const totalPartsAmount = existingPartsTotal + newPartsTotal;
      const totalServiceAmount = existingServiceTotal + newServiceTotal;
      const grandTotalAmount = totalPartsAmount + totalServiceAmount;

      setPartsTotal(totalPartsAmount);
      setServiceTotal(totalServiceAmount);
      setGrandTotal(grandTotalAmount);
    };

    calculateTotals();
  }, [
    items,
    serviceItems,
    specificQuotation?.input_data,
    specificQuotation?.service_input_data,
  ]);

  // Fixed: Service description change handlers
  const handleServiceDescriptionChange = (index, value) => {
    if (
      !specificQuotation?.service_input_data ||
      !Array.isArray(specificQuotation.service_input_data)
    ) {
      return;
    }

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
  };

  const handleServiceDescriptionChange2 = (index, value) => {
    const newItems = [...serviceItems];
    newItems[index] = {
      ...newItems[index],
      description: value,
    };
    setServiceItems(newItems);

    setActiveInputType("service");
    setActiveInputIndex(
      index + (specificQuotation?.service_input_data?.length || 0),
    );
    filterProductSuggestions(value);
  };

  // Fixed: Parts description change handlers
  const handleDescriptionChange = (index, value) => {
    if (
      !specificQuotation?.input_data ||
      !Array.isArray(specificQuotation.input_data)
    ) {
      return;
    }

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
  };

  const handleDescriptionChange2 = (index, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      description: value,
    };
    setItems(newItems);

    setActiveInputType("parts");
    setActiveInputIndex(index + (specificQuotation?.input_data?.length || 0));
    filterProductSuggestions(value);
  };

  // Fixed: Service quantity change handlers
  const handleServiceQuantityChange = (index, value) => {
    if (
      !specificQuotation?.service_input_data ||
      !Array.isArray(specificQuotation.service_input_data)
    ) {
      return;
    }

    // Allow decimal numbers
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

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
  };

  const handleServiceQuantityChange2 = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const newItems = [...serviceItems];
    const parsedQuantity = Number.parseFloat(cleanValue) || 0;
    const rate = Number.parseFloat(newItems[index].rate) || 0;
    const total = parsedQuantity * rate;

    newItems[index] = {
      ...newItems[index],
      quantity: cleanValue,
      total: Number.parseFloat(total.toFixed(2)),
    };

    setServiceItems(newItems);
  };

  // Fixed: Parts quantity change handlers
  const handleQuantityChange = (index, value) => {
    if (
      !specificQuotation?.input_data ||
      !Array.isArray(specificQuotation.input_data)
    ) {
      return;
    }

    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

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
  };

  const handleQuantityChange2 = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const newItems = [...items];
    const parsedQuantity = Number.parseFloat(cleanValue) || 0;
    const rate = Number.parseFloat(newItems[index].rate) || 0;
    const total = parsedQuantity * rate;

    newItems[index] = {
      ...newItems[index],
      quantity: cleanValue,
      total: Number.parseFloat(total.toFixed(2)),
    };

    setItems(newItems);
  };

  // Fixed: Service rate change handlers
  const handleServiceRateChange = (index, value) => {
    if (
      !specificQuotation?.service_input_data ||
      !Array.isArray(specificQuotation.service_input_data)
    ) {
      return;
    }

    // Remove commas and allow only numbers and decimal points
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

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
  };

  const handleServiceRateChange2 = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const newItems = [...serviceItems];
    const parsedRate = Number.parseFloat(cleanValue) || 0;
    const quantity = Number.parseFloat(newItems[index].quantity) || 0;
    const total = quantity * parsedRate;

    newItems[index] = {
      ...newItems[index],
      rate: parsedRate,
      rateDisplay: cleanValue,
      total: Number.parseFloat(total.toFixed(2)),
    };

    setServiceItems(newItems);
  };

  // Fixed: Parts rate change handlers
  const handleRateChange = (index, value) => {
    if (
      !specificQuotation?.input_data ||
      !Array.isArray(specificQuotation.input_data)
    ) {
      return;
    }

    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

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
  };

  const handleRateChange2 = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const newItems = [...items];
    const parsedRate = Number.parseFloat(cleanValue) || 0;
    const quantity = Number.parseFloat(newItems[index].quantity) || 0;
    const total = quantity * parsedRate;

    newItems[index] = {
      ...newItems[index],
      rate: parsedRate,
      rateDisplay: cleanValue,
      total: Number.parseFloat(total.toFixed(2)),
    };

    setItems(newItems);
  };

  // Unit change handlers
  const handleUnitChange = (index, value) => {
    if (
      !specificQuotation?.input_data ||
      !Array.isArray(specificQuotation.input_data)
    ) {
      return;
    }

    const newItems = [...specificQuotation.input_data];
    newItems[index] = {
      ...newItems[index],
      unit: value,
    };

    setSpecificQuotation((prevState) => ({
      ...prevState,
      input_data: newItems,
    }));
  };

  const handleUnitChange2 = (index, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      unit: value,
    };
    setItems(newItems);
  };

  const handleServiceUnitChange = (index, value) => {
    if (
      !specificQuotation?.service_input_data ||
      !Array.isArray(specificQuotation.service_input_data)
    ) {
      return;
    }

    const newItems = [...specificQuotation.service_input_data];
    newItems[index] = {
      ...newItems[index],
      unit: value,
    };

    setSpecificQuotation((prevState) => ({
      ...prevState,
      service_input_data: newItems,
    }));
  };

  const handleServiceUnitChange2 = (index, value) => {
    const newItems = [...serviceItems];
    newItems[index] = {
      ...newItems[index],
      unit: value,
    };
    setServiceItems(newItems);
  };

  // Product suggestions
  const filterProductSuggestions = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2 || !stockData?.data) {
      setProductSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filteredProducts = stockData.data.filter((stock) =>
      stock.product.product_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

    setProductSuggestions(filteredProducts);
    setShowSuggestions(filteredProducts.length > 0);
    setActiveSuggestionIndex(0);
  };

  // Find matching unit function (same as AddQuotation)
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
          (option.value === shortName || option.label === shortName)),
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
            option.label.toLowerCase() === shortName.toLowerCase())),
    );
    if (caseInsensitiveMatch) {
      return caseInsensitiveMatch.value;
    }
    return "Pcs";
  };

  const handleSelectSuggestion = (product) => {
    if (!product) return;

    const productName = product.product?.product_name || "";
    const productPrice = Number(product.product?.sellingPrice) || 0;
    const productQuantity = product.stock || 0;
    const productUnit = findMatchingUnit(product.product?.unit);
    const total = productQuantity * productPrice;

    if (activeInputType === "service") {
      if (
        activeInputIndex < (specificQuotation?.service_input_data?.length || 0)
      ) {
        const newItems = [...(specificQuotation.service_input_data || [])];
        newItems[activeInputIndex] = {
          ...newItems[activeInputIndex],
          description: productName,
          unit: productUnit,
          rate: productPrice,
          rateDisplay: productPrice.toString(),
          quantity: productQuantity.toString(),
          total: total,
          product: product.product._id,
          warehouse: product.warehouse,
          product_name: product.product.product_name,
          sellingPrice: product.product.sellingPrice || 0,
          batchNumber: product.batchNumber || "",
        };

        setSpecificQuotation((prevState) => ({
          ...prevState,
          service_input_data: newItems,
        }));
      } else {
        const actualIndex =
          activeInputIndex -
          (specificQuotation?.service_input_data?.length || 0);
        const newItems = [...serviceItems];
        newItems[actualIndex] = {
          ...newItems[actualIndex],
          description: productName,
          unit: productUnit,
          rate: productPrice,
          rateDisplay: productPrice.toString(),
          quantity: productQuantity.toString(),
          total: total,
          product: product.product._id,
          warehouse: product.warehouse,
          product_name: product.product.product_name,
          sellingPrice: product.product.sellingPrice || 0,
          batchNumber: product.batchNumber || "",
        };
        setServiceItems(newItems);
      }
    } else if (activeInputType === "parts") {
      if (activeInputIndex < (specificQuotation?.input_data?.length || 0)) {
        const newItems = [...(specificQuotation.input_data || [])];
        newItems[activeInputIndex] = {
          ...newItems[activeInputIndex],
          description: productName,
          unit: productUnit,
          rate: productPrice,
          rateDisplay: productPrice.toString(),
          quantity: productQuantity.toString(),
          total: total,
          product: product.product._id,
          warehouse: product.warehouse,
          product_name: product.product.product_name,
          sellingPrice: product.product.sellingPrice || 0,
          batchNumber: product.batchNumber || "",
        };

        setSpecificQuotation((prevState) => ({
          ...prevState,
          input_data: newItems,
        }));
      } else {
        const actualIndex =
          activeInputIndex - (specificQuotation?.input_data?.length || 0);
        const newItems = [...items];
        newItems[actualIndex] = {
          ...newItems[actualIndex],
          description: productName,
          unit: productUnit,
          rate: productPrice,
          rateDisplay: productPrice.toString(),
          quantity: productQuantity.toString(),
          total: total,
          product: product.product._id,
          warehouse: product.warehouse,
          product_name: product.product.product_name,
          sellingPrice: product.product.sellingPrice || 0,
          batchNumber: product.batchNumber || "",
        };
        setItems(newItems);
      }
    }

    setShowSuggestions(false);
  };

  const handleSuggestionClick = (product) => {
    handleSelectSuggestion(product);
  };

  // Remove handlers
  const handleRemove = (index) => {
    if (index === 0 && items.length === 1) {
      setItems([
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
      const list = [...items];
      list.splice(index, 1);
      setItems(list);
    }
  };

  const handleServiceDescriptionRemove = (index) => {
    if (index === 0 && serviceItems.length === 1) {
      // Reset the first item instead of removing it
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

  // Add handlers
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

  const handlePartsAddButton = () => {
    setAddButton(!addButton);
  };

  const handleServiceAddButton = () => {
    setServiceAddButton(!serviceAddButton);
  };

  // Discount, VAT, Tax handlers
  const handleDiscountChange = (value) => {
    const parsedValue = Number(value);
    if (!isNaN(parsedValue)) {
      setDiscount(parsedValue);
    }
  };

  const handleVATChange = (value) => {
    const parsedValue = Number(value);
    if (!isNaN(parsedValue)) {
      setVAT(parsedValue);
    }
  };

  const calculateFinalTotal = () => {
    let currentPartsTotal = partsTotal;
    let currentServiceTotal = serviceTotal;

    if (currentPartsTotal === 0 && specificQuotation?.parts_total) {
      currentPartsTotal = Number(specificQuotation.parts_total);
    }
    if (currentServiceTotal === 0 && specificQuotation?.service_total) {
      currentServiceTotal = Number(specificQuotation.service_total);
    }

    const currentGrandTotal = currentPartsTotal + currentServiceTotal;

    let effectiveDiscount = 0;
    if (discount === 0 || discount > 0) {
      effectiveDiscount = discount;
    } else if (discount === "") {
      effectiveDiscount = Number(specificQuotation?.discount) || 0;
    }

    let totalAfterDiscount = currentGrandTotal - effectiveDiscount;
    totalAfterDiscount = totalAfterDiscount < 0 ? 0 : totalAfterDiscount;

    let effectiveVat = 0;
    if (vat === 0 || vat > 0) {
      effectiveVat = vat;
    } else if (vat === "") {
      effectiveVat = Number(specificQuotation?.vat) || 0;
    }

    const vatAmount = totalAfterDiscount * (effectiveVat / 100);
    const totalAfterVat = totalAfterDiscount + vatAmount;

    let effectiveTax = 0;
    if (tax === 0 || tax > 0) {
      effectiveTax = tax;
    } else if (tax === "") {
      effectiveTax = Number(specificQuotation?.tax) || 0;
    }

    const taxAmount = totalAfterVat * (effectiveTax / 100);
    const finalTotal = totalAfterVat + taxAmount;

    return Number.parseFloat(finalTotal).toFixed(2);
  };

  // Form submission
  const input_data = [
    ...(specificQuotation?.input_data || []),
    ...items
      .filter((item) => item.total !== undefined && item.total !== "")
      .map((item) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        unit: item.unit,
        total: item.total,
        product: item.product,
        warehouse: item.warehouse,
        product_name: item.product_name,
        sellingPrice: item.sellingPrice,
        batchNumber: item.batchNumber,
      })),
  ];

  const service_input_data = [
    ...(specificQuotation?.service_input_data || []),
    ...serviceItems
      .filter((item) => item.total !== undefined && item.total !== "")
      .map((item) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        unit: item.unit,
        total: item.total,
        product: item.product,
        warehouse: item.warehouse,
        product_name: item.product_name,
        sellingPrice: item.sellingPrice,
        batchNumber: item.batchNumber,
      })),
  ];

  const onSubmit = async (data) => {
    console.log("raw data check this ", data);
    performActionWithPermission(
      "/dashboard/update-quotation",
      "edit",
      async () => {
        setRemoveButton("");
        try {
          const customer = {
            company_name: data.company_name,
            customer_name: data.customer_name,
            customer_contact: data.customer_contact,
            customer_country_code: data.company_country_code,
            customer_address: data.customer_address,
          };

          const company = {
            company_name: data.company_name,
            vehicle_username: data.vehicle_username,
            company_address: data.company_address,
            company_contact: data.company_contact,
            company_country_code: data.company_country_code,
            company_email: data.company_email,
            customer_address: data.company_address,
          };

          const showRoom = {
            showRoom_name: data.showRoom_name,
            vehicle_username: data.vehicle_username,
            company_name: data.company_name,
            company_contact: data.company_contact,
            company_country_code: data.company_country_code,
            company_address: data.company_address,
          };

          data.vehicle_model = Number(data.vehicle_model);

          const newMileageValue =
            Number(currentMileage) ||
            Number(data.mileage) ||
            Number(specificQuotation?.mileage) ||
            0;
          data.mileage = newMileageValue;
          const existingMileageHistory =
            specificQuotation?.vehicle?.mileageHistory || [];
          const updatedMileageHistory = [...existingMileageHistory];

          if (
            mileageChanged &&
            !isNaN(newMileageValue) &&
            newMileageValue > 0
          ) {
            const mileageExists = updatedMileageHistory.some(
              (entry) => entry.mileage === newMileageValue,
            );
            if (!mileageExists) {
              updatedMileageHistory.push({
                mileage: newMileageValue,
                date: new Date().toISOString(),
              });
            }
          }

          const vehicle = {
            carReg_no: data.carReg_no,
            car_registration_no: data.car_registration_no,
            chassis_no: data.chassis_no,
            engine_no: data.engine_no,
            vehicle_brand: data.vehicle_brand,
            vehicle_name: data.vehicle_name,
            // mileage: newMileageValue,
            // mileageHistory: updatedMileageHistory,
          };

          const quotation = {
            user_type: specificQuotation?.user_type,
            Id: specificQuotation?.Id,
            job_no: specificQuotation?.job_no,
            date: selectedDate || specificQuotation?.date,
            parts_total: partsTotal || specificQuotation.parts_total,
            service_total: serviceTotal || specificQuotation.serviceTotal,
            total_amount: grandTotal || specificQuotation?.total_amount,
            discount:
              discount === 0 || discount > 0
                ? discount
                : specificQuotation?.discount,
            vat: vat === 0 || vat > 0 ? vat : specificQuotation?.vat,
            tax: tax === 0 || tax > 0 ? tax : specificQuotation?.tax,
            net_total: calculateFinalTotal() || specificQuotation.net_total,
            input_data: input_data,
            service_input_data: service_input_data,
            mileage: newMileageValue, // ← THIS was missing
          };

          const values = {
            tenantDomain,
            customer,
            company,
            showRoom,
            vehicle,
            quotation,
            mileage: data.mileage,
          };

          console.log("values console this ", values);

          const newValue = {
            id: id,
            data: {
              ...values,
            },
          };
          console.log("new value check ", newValue);

          if (removeButton === "") {
            const res = await updateQuotation(newValue).unwrap();
            if (res.success) {
              setReload(!reload);
              toast.success("Quotation updated successfully");
              console.log("response this ", res);
              // Only navigate if update was successful
              // if (!userTypeFromProfile) {
              //   navigate("/dashboard/quotation-list");
              // } else if (userTypeFromProfile === "company") {
              //   navigate(`/dashboard/company-profile?id=${userFromProfile}`);
              // } else if (userTypeFromProfile === "customer") {
              //   navigate(`/dashboard/customer-profile?id=${userFromProfile}`);
              // } else if (userTypeFromProfile === "showRoom") {
              //   navigate(`/dashboard/show-room-profile?id=${userFromProfile}`);
              // }
            }
          }
        } catch (error) {
          console.error("Update error:", error);

          // Handle the error and show appropriate toast message
          let errorMessage = "An error occurred while updating the quotation";

          if (error?.data?.message) {
            errorMessage = error.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          } else if (error?.error?.data?.message) {
            errorMessage = error.error.data.message;
          }

          // Show the error in a toast
          toast.error(errorMessage);

          // Set the error state for display
          setError(errorMessage);

          // Don't navigate - stay on the page so user can fix the issue
          // Re-throw to prevent navigation in the performActionWithPermission callback
          throw error;
        }
      },
      "You don't have permission update quotation",
    );
  };

  // Navigation handlers
  const handleGoInvoice = async () => {
    try {
      await handleSubmit(onSubmit)();
      // Only navigate if submission was successful
      navigate(
        `/dashboard/create-invoice?order_no=${specificQuotation?.job_no}&id=${id}`,
      );
    } catch (error) {
      // Navigation prevented due to error
      console.error("Submission failed:", error);
    }
  };
  const handleGoPreview = async () => {
    try {
      await handleSubmit(onSubmit)();
      // Only navigate if submission was successful
      navigate(`/dashboard/quotation-view?id=${id}`);
    } catch (error) {
      // Navigation prevented due to error
      console.error("Submission failed:", error);
    }
  };

  const handleOnSubmit = async () => {
    try {
      await handleSubmit(onSubmit)();
      // Navigation is now handled inside onSubmit after successful update
    } catch (error) {
      // Submission failed, stay on page
      console.error("Submission failed:", error);
    }
  };

  // Click outside handler for suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSuggestions &&
        !event.target.closest(".inputField") &&
        !event.target.closest(".suggestion-item")
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  // Mileage change handler
  useEffect(() => {
    if (specificQuotation?.mileage) {
      setFormValue("mileage", specificQuotation.mileage);
      setCurrentMileage(specificQuotation.mileage.toString());
    }
  }, [specificQuotation?.mileage, setFormValue]);

  // Loading and error states
  if (quotationLoading) {
    return (
      <div className="px-5 py-10">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Loading quotation data...</div>
        </div>
      </div>
    );
  }

  if (quotationError) {
    return (
      <div className="px-5 py-10">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl text-red-500">
            Error loading quotation:{" "}
            {quotationError?.data?.message ||
              quotationError?.message ||
              "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  if (!specificQuotation || Object.keys(specificQuotation).length === 0) {
    return (
      <div className="px-5 py-10">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">No quotation data found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-10">
      <div className="mb-5 pb-5 mx-auto text-center border-b-2 border-[#42A1DA]">
        <div className="addJobCardHeads">
          <img
            src={companyProfileData?.logo || "/placeholder.svg"}
            alt="logo"
            className="addJobLogoImg"
          />
          <div>
            <div className="flex-1 text-center">
              {companyProfileData?.companyNameBN && (
                <h2 className="trustAutoTitle">
                  {companyProfileData.companyNameBN}
                </h2>
              )}
              {companyProfileData?.companyName && (
                <h3 className="text-lg md:text-xl english-font mt-1 text-[#4671A1] font-bold ">
                  ({companyProfileData?.companyName})
                </h3>
              )}
            </div>
            <span className="text-[12px] lg:text-xl mt-5 block">
              Office: {companyProfileData?.address}
            </span>
          </div>
          <TrustAutoAddress />
        </div>
      </div>

      <div className="mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex md:flex-row flex-col justify-between items-center">
            <div className="hidden"></div>
            <div className="vehicleCard">Update Quotation</div>
            <div className="flex items-center gap-x-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "170px" }}
                  label="Quotation Date"
                  value={selectedDate ? dayjs(selectedDate) : dayjs()}
                  onChange={(newValue) => {
                    if (newValue) {
                      const formattedDate = newValue.format("YYYY-MM-DD");
                      setSelectedDate(formattedDate);
                    }
                  }}
                  slotProps={{
                    textField: { fullWidth: true, variant: "outlined" },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          {/* Customer Info Section */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 my-10">
            <Box>
              <h3 className="text-xl lg:text-3xl font-bold mb-5">
                Customer Info
              </h3>
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Job Card No"
                    {...register("job_no")}
                    focused={!!specificQuotation?.job_no}
                    required
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Customer Id"
                    {...register("Id")}
                    focused={!!specificQuotation?.Id}
                    required
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Company"
                    focused={
                      !!(
                        specificQuotation?.customer?.company_name ||
                        specificQuotation?.company?.company_name ||
                        specificQuotation?.showRoom?.company_name
                      )
                    }
                    {...register("company_name")}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  {specificQuotation?.user_type === "customer" && (
                    <TextField
                      fullWidth
                      label="Customer"
                      focused={!!specificQuotation?.customer?.customer_name}
                      {...register("customer_name")}
                    />
                  )}
                  {(specificQuotation?.user_type === "company" ||
                    specificQuotation?.user_type === "showRoom") && (
                    <TextField
                      fullWidth
                      label="Customer"
                      focused={
                        !!(
                          specificQuotation?.company?.vehicle_username ||
                          specificQuotation?.showRoom?.vehicle_username
                        )
                      }
                      {...register("vehicle_username")}
                    />
                  )}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div className="flex md:flex-row flex-col gap-0.5 items-center mt-3">
                    <Autocomplete
                      fullWidth
                      freeSolo
                      options={countries}
                      getOptionLabel={(option) => option.label}
                      value={countryCode}
                      onChange={(event, newValue) => {
                        setCountryCode(newValue);
                        setPhoneNumber("");
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          {...register("customer_country_code")}
                          label="Select Country Code"
                          variant="outlined"
                          focused={
                            !!(
                              specificQuotation?.customer
                                ?.customer_country_code ||
                              specificQuotation?.company
                                ?.company_country_code ||
                              specificQuotation?.showRoom?.company_country_code
                            )
                          }
                        />
                      )}
                    />
                    <TextField
                      {...register(
                        specificQuotation?.user_type === "customer"
                          ? "customer_contact"
                          : "company_contact",
                      )}
                      variant="outlined"
                      fullWidth
                      type="tel"
                      value={
                        phoneNumber ||
                        specificQuotation?.customer?.customer_contact ||
                        specificQuotation?.company?.company_contact ||
                        specificQuotation?.showRoom?.company_contact ||
                        ""
                      }
                      onChange={handlePhoneNumberChange}
                      placeholder="Contact No"
                      focused={
                        !!(
                          specificQuotation?.customer?.customer_contact ||
                          specificQuotation?.company?.company_contact ||
                          specificQuotation?.showRoom?.company_contact
                        )
                      }
                    />
                  </div>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  {specificQuotation?.user_type === "customer" && (
                    <TextField
                      fullWidth
                      label="Address"
                      {...register("customer_address")}
                      focused={!!specificQuotation?.customer?.customer_address}
                    />
                  )}
                  {specificQuotation?.user_type === "company" && (
                    <TextField
                      fullWidth
                      label="Address"
                      {...register("company_address")}
                      focused={!!specificQuotation?.company?.company_address}
                    />
                  )}
                  {specificQuotation?.user_type === "showRoom" && (
                    <TextField
                      fullWidth
                      label="Address"
                      {...register("showRoom_address")}
                      focused={!!specificQuotation?.showRoom?.showRoom_address}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>

            {/* Vehicle Info Section */}
            <Box>
              <h3 className="text-xl lg:text-3xl font-bold mb-5">
                Vehicle Info
              </h3>
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Chassis No"
                    {...register("chassis_no")}
                    focused={!!specificQuotation?.vehicle?.chassis_no}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div className="flex mt-3 md:gap-0 gap-4 items-center">
                    <Autocomplete
                      sx={{ marginRight: "5px" }}
                      freeSolo
                      fullWidth
                      id="free-solo-demo"
                      options={cmDmOptions.map((option) => option.label)}
                      value={specificQuotation?.vehicle?.carReg_no || ""}
                      onChange={(event, newValue) => {
                        setFormValue("carReg_no", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          label="Vehicle Reg No (New field)"
                          {...register("carReg_no")}
                        />
                      )}
                    />
                    <InputMask
                      mask="99-9999"
                      maskChar={null}
                      {...register("car_registration_no")}
                    >
                      {(inputProps) => (
                        <TextField
                          fullWidth
                          {...inputProps}
                          {...register("car_registration_no")}
                          label="Car R (N)"
                          focused={
                            !!specificQuotation?.vehicle?.car_registration_no
                          }
                        />
                      )}
                    </InputMask>
                  </div>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Engine & CC"
                    {...register("engine_no")}
                    focused={!!specificQuotation?.vehicle?.engine_no}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Vehicle Name"
                    {...register("vehicle_name")}
                    focused={!!specificQuotation?.vehicle?.vehicle_name}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Autocomplete
                    freeSolo
                    options={
                      specificQuotation?.vehicle?.mileageHistory
                        ? [...specificQuotation.vehicle.mileageHistory]
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((entry) => ({
                              label: `${entry?.mileage} km (${new Date(entry.date).toLocaleDateString()})`,
                              value: String(entry?.mileage),
                            }))
                        : []
                    }
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.label
                    }
                    value={
                      currentMileage !== ""
                        ? currentMileage
                        : specificQuotation?.mileage
                          ? String(specificQuotation?.mileage)
                          : ""
                    }
                    onChange={(_, newValue) => {
                      // user clicked a suggestion from dropdown
                      const selected =
                        typeof newValue === "object" && newValue !== null
                          ? newValue.value
                          : newValue;
                      const val = selected || "";
                      setCurrentMileage(val);
                      setFormValue("mileage", val);
                      const lastMileage =
                        specificQuotation?.vehicle?.mileageHistory?.slice(-1)[0]
                          ?.mileage;
                      if (lastMileage && Number(val) !== lastMileage) {
                        setMileageChanged(true);
                      } else if (!lastMileage && val) {
                        setMileageChanged(true);
                      } else {
                        setMileageChanged(false);
                      }
                    }}
                    onInputChange={(_, newInputValue, reason) => {
                      // user typed manually
                      if (reason === "input") {
                        setCurrentMileage(newInputValue);
                        setFormValue("mileage", newInputValue);
                        const lastMileage =
                          specificQuotation?.vehicle?.mileageHistory?.slice(
                            -1,
                          )[0]?.mileage;
                        if (
                          lastMileage &&
                          Number(newInputValue) !== lastMileage
                        ) {
                          setMileageChanged(true);
                        } else if (!lastMileage && newInputValue) {
                          setMileageChanged(true);
                        } else {
                          setMileageChanged(false);
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...register("mileage", {
                          required: "Mileage is required!",
                        })}
                        fullWidth
                        label="Current Mileage (KM)"
                        type="number"
                        focused={!!specificQuotation?.mileage}
                        error={!!errors.mileage}
                        helperText={errors.mileage?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div className="mb-2">
                    <strong>Mileage History:</strong>
                    {specificQuotation?.vehicle?.mileageHistory?.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {specificQuotation.vehicle?.mileageHistory.map(
                          (entry, index) => (
                            <Chip
                              key={index}
                              label={`${entry.mileage} km (${new Date(
                                entry.date,
                              ).toLocaleDateString()})`}
                              variant="outlined"
                              className="bg-gray-100 border-gray-300 text-gray-800"
                              onDelete={() => {
                                const updatedHistory =
                                  specificQuotation?.vehicle?.mileageHistory.filter(
                                    (_, i) => i !== index,
                                  );
                                setSpecificQuotation((prevState) => ({
                                  ...prevState,
                                  vehicle: {
                                    ...prevState.vehicle,
                                    mileageHistory: updatedHistory,
                                  },
                                }));
                              }}
                              deleteIcon={
                                <span className="text-red-500 hover:text-red-700 cursor-pointer text-lg">
                                  ×
                                </span>
                              }
                            />
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-1">
                        No previous mileage records
                      </p>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>

          {/* Services Section */}
          <div className="grid grid-cols-12 gap-2 items-center font-bold mb-5 md:mb-1 mt-5">
            <label className="col-span-6 md:col-span-1 text-center hidden md:block">
              SL No
            </label>
            <label className="col-span-12 md:col-span-6 text-center">
              Services Description
            </label>
            <label className="col-span-6 md:col-span-2 text-center hidden md:block">
              Qty
            </label>
            <label className="col-span-6 md:col-span-1 text-center hidden md:block">
              Rate
            </label>
            <label className="col-span-6 md:col-span-1 text-center hidden md:block">
              Amount
            </label>
            <label className="opacity-0 col-span-6 md:col-span-1 hidden md:block">
              hidden items for responsive
            </label>
          </div>

          {/* Existing Service Items */}
          <div>
            {specificQuotation?.service_input_data?.length > 0 && (
              <>
                {specificQuotation.service_input_data.map((item, i) => (
                  <div key={i}>
                    <div className="grid grid-cols-12 gap-2 items-center mt-3">
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="SL No"
                          defaultValue={`${i + 1 < 10 ? `0${i + 1}` : i + 1}`}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div style={suggestionStyles.suggestionContainer}>
                          <input
                            className="inputField"
                            autoComplete="off"
                            type="text"
                            placeholder="Description"
                            onChange={(e) =>
                              handleServiceDescriptionChange(i, e.target.value)
                            }
                            value={item.description || ""}
                          />
                          {showSuggestions &&
                            activeInputType === "service" &&
                            activeInputIndex === i && (
                              <div
                                style={suggestionStyles.suggestionsList}
                                className="suggestionsList"
                              >
                                {productSuggestions.map((product, index) => (
                                  <div
                                    key={product._id}
                                    className="suggestion-item"
                                    style={{
                                      ...suggestionStyles.suggestionItem,
                                      ...(index === activeSuggestionIndex
                                        ? suggestionStyles.suggestionItemActive
                                        : {}),
                                    }}
                                    onClick={() =>
                                      handleSuggestionClick(product)
                                    }
                                  >
                                    <div
                                      style={
                                        suggestionStyles.suggestionItemContent
                                      }
                                    >
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemName
                                        }
                                      >
                                        {product.product.product_name}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        Stock: {product.stock}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        {product.product.unit?.short_name}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        {product.product?.sellingPrice}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        WH: {product.warehouse?.name}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-2 flex gap-2">
                        <div className="grid grid-cols-12 quotationSelect">
                          <input
                            className="inputField col-span-3"
                            autoComplete="off"
                            type="text"
                            placeholder="Qty"
                            onChange={(e) =>
                              handleServiceQuantityChange(i, e.target.value)
                            }
                            value={item.quantity || ""}
                          />
                          <select
                            className="inputField col-span-9"
                            onChange={(e) =>
                              handleServiceUnitChange(i, e.target.value)
                            }
                            value={item.unit || ""}
                          >
                            <option value="" disabled>
                              Select Unit
                            </option>
                            {unitOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="Rate"
                          onChange={(e) =>
                            handleServiceRateChange(i, e.target.value)
                          }
                          value={item.rateDisplay || item.rate || ""}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="Amount"
                          value={formateNumber(item.total)}
                          readOnly
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <button
                          type="button"
                          disabled={removeLoading}
                          onClick={() => handleRemoveButton(i, "service")}
                          className="w-full bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md py-2 px-2 justify-center"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Add New Service Items */}
          <div>
            <div className="flex justify-end mt-2">
              {!serviceAddButton && (
                <button
                  type="button"
                  onClick={handleServiceAddButton}
                  className="w-[135px] bg-[#42A1DA] hover:bg-[#42A1DA] text-white p-2 rounded-md"
                >
                  Add new
                </button>
              )}
              {serviceAddButton && (
                <button
                  type="button"
                  onClick={handleServiceAddButton}
                  className="border w-[135px] border-[#42A1DA] hover:border-[#42A1DA] text-black rounded-md px-2 py-2 mb-2"
                >
                  Cancel
                </button>
              )}
            </div>
            {serviceAddButton && (
              <>
                {serviceItems.map((item, i) => (
                  <div key={i}>
                    <div className="grid grid-cols-12 gap-2 items-center mt-3">
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="SL No"
                          defaultValue={`${i + 1 < 10 ? `0${i + 1}` : i + 1}`}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div style={suggestionStyles.suggestionContainer}>
                          <input
                            className="inputField"
                            autoComplete="off"
                            type="text"
                            placeholder="Description"
                            onChange={(e) =>
                              handleServiceDescriptionChange2(i, e.target.value)
                            }
                            value={item.description}
                          />
                          {showSuggestions &&
                            activeInputType === "service" &&
                            activeInputIndex ===
                              i +
                                (specificQuotation?.service_input_data
                                  ?.length || 0) && (
                              <div
                                style={suggestionStyles.suggestionsList}
                                className="suggestionsList"
                              >
                                {productSuggestions.map((product, index) => (
                                  <div
                                    key={product._id}
                                    className="suggestion-item"
                                    style={{
                                      ...suggestionStyles.suggestionItem,
                                      ...(index === activeSuggestionIndex
                                        ? suggestionStyles.suggestionItemActive
                                        : {}),
                                    }}
                                    onClick={() =>
                                      handleSuggestionClick(product)
                                    }
                                  >
                                    <div
                                      style={
                                        suggestionStyles.suggestionItemContent
                                      }
                                    >
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemName
                                        }
                                      >
                                        {product.product.product_name}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        Stock: {product.stock}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        {product.product.unit?.short_name}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        {product.product?.sellingPrice}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        WH: {product.warehouse?.name}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-2 flex gap-2">
                        <div className="grid grid-cols-12 quotationSelect">
                          <input
                            className="inputField col-span-3"
                            autoComplete="off"
                            type="text"
                            placeholder="Qty"
                            onChange={(e) =>
                              handleServiceQuantityChange2(i, e.target.value)
                            }
                            value={item.quantity}
                          />
                          <select
                            className="inputField col-span-9"
                            onChange={(e) =>
                              handleServiceUnitChange2(i, e.target.value)
                            }
                            value={item.unit || ""}
                          >
                            <option value="" disabled>
                              Select Unit
                            </option>
                            {unitOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="Rate"
                          onChange={(e) =>
                            handleServiceRateChange2(i, e.target.value)
                          }
                          value={item.rateDisplay || item.rate || ""}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="Amount"
                          value={formateNumber(item.total)}
                          readOnly
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <button
                          type="button"
                          onClick={() => handleServiceDescriptionRemove(i)}
                          className="w-full bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md py-2 px-2 justify-center"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={handleServiceDescriptionAdd}
                    className="w-[135px] bg-[#42A1DA] hover:bg-[#42A1DA] text-white p-2 rounded-md"
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Parts Section */}
          <div className="grid grid-cols-12 gap-2 items-center font-bold mb md:mb-1 mt-5">
            <label className="col-span-6 md:col-span-1 text-center hidden md:block">
              SL No
            </label>
            <label className="col-span-12 md:col-span-6 text-center">
              Parts Description
            </label>
            <label className="col-span-6 md:col-span-2 text-center hidden md:block">
              Qty
            </label>
            <label className="col-span-6 md:col-span-1 text-center hidden md:block">
              Rate
            </label>
            <label className="col-span-6 md:col-span-1 text-center hidden md:block">
              Amount
            </label>
            <label className="opacity-0 col-span-6 md:col-span-1 hidden md:block">
              hidden items for responsive
            </label>
          </div>

          {/* Existing Parts Items */}
          <div>
            {specificQuotation?.input_data?.length > 0 && (
              <>
                {specificQuotation.input_data.map((item, i) => (
                  <div key={i}>
                    <div className="grid grid-cols-12 gap-2 items-center mt-3">
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="SL No"
                          defaultValue={`${i + 1 < 10 ? `0${i + 1}` : i + 1}`}
                          required
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div style={suggestionStyles.suggestionContainer}>
                          <input
                            className="inputField"
                            autoComplete="off"
                            type="text"
                            placeholder="Description"
                            onChange={(e) =>
                              handleDescriptionChange(i, e.target.value)
                            }
                            value={item.description || ""}
                            required
                          />
                          {showSuggestions &&
                            activeInputType === "parts" &&
                            activeInputIndex === i && (
                              <div style={suggestionStyles.suggestionsList}>
                                {productSuggestions.map((product, index) => (
                                  <div
                                    key={product._id}
                                    style={{
                                      ...suggestionStyles.suggestionItem,
                                      ...(index === activeSuggestionIndex
                                        ? suggestionStyles.suggestionItemActive
                                        : {}),
                                    }}
                                    onClick={() =>
                                      handleSelectSuggestion(product)
                                    }
                                  >
                                    <div
                                      style={
                                        suggestionStyles.suggestionItemContent
                                      }
                                    >
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemName
                                        }
                                      >
                                        {product.product.product_name}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        Stock: {product.stock}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        {product.product.unit?.short_name}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        {product.product?.sellingPrice}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        WH: {product.warehouse?.name}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-2 flex gap-2">
                        <div className="grid grid-cols-12 quotationSelect">
                          <input
                            className="inputField col-span-3"
                            autoComplete="off"
                            type="text"
                            placeholder="Qty"
                            onChange={(e) =>
                              handleQuantityChange(i, e.target.value)
                            }
                            required
                            value={item.quantity || ""}
                          />
                          <select
                            className="inputField col-span-9"
                            onChange={(e) =>
                              handleUnitChange(i, e.target.value)
                            }
                            value={item.unit || ""}
                            required
                          >
                            <option value="" disabled>
                              Select Unit
                            </option>
                            {unitOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="Rate"
                          onChange={(e) => handleRateChange(i, e.target.value)}
                          required
                          value={item.rateDisplay || item.rate || ""}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="Amount"
                          value={formateNumber(item.total)}
                          readOnly
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <button
                          type="button"
                          disabled={removeLoading}
                          onClick={() => handleRemoveButton(i, "parts")}
                          className="w-full bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md py-2 px-2 justify-center"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Add New Parts Items */}
          <div>
            <div className="flex items-center justify-end mt-2">
              {!addButton && (
                <button
                  type="button"
                  onClick={handlePartsAddButton}
                  className="w-[135px] bg-[#42A1DA] hover:bg-[#42A1DA] text-white p-2 rounded-md"
                >
                  Add new
                </button>
              )}
              {addButton && (
                <button
                  type="button"
                  onClick={handlePartsAddButton}
                  className="border w-[135px] border-[#42A1DA] hover:border-[#42A1DA] text-black rounded-md px-2 py-2 mb-2"
                >
                  Cancel
                </button>
              )}
            </div>
            {addButton && (
              <>
                {items.map((item, i) => (
                  <div key={i}>
                    <div className="grid grid-cols-12 gap-2 items-center mt-3">
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="SL No"
                          defaultValue={`${i + 1 < 10 ? `0${i + 1}` : i + 1}`}
                          required
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div style={suggestionStyles.suggestionContainer}>
                          <input
                            className="inputField"
                            autoComplete="off"
                            type="text"
                            placeholder="Description"
                            onChange={(e) =>
                              handleDescriptionChange2(i, e.target.value)
                            }
                            value={item.description}
                            required
                          />
                          {showSuggestions &&
                            activeInputType === "parts" &&
                            activeInputIndex ===
                              i +
                                (specificQuotation?.input_data?.length ||
                                  0) && (
                              <div
                                style={suggestionStyles.suggestionsList}
                                className="suggestionsList"
                              >
                                {productSuggestions.map((product, index) => (
                                  <div
                                    key={product._id}
                                    className="suggestion-item"
                                    style={{
                                      ...suggestionStyles.suggestionItem,
                                      ...(index === activeSuggestionIndex
                                        ? suggestionStyles.suggestionItemActive
                                        : {}),
                                    }}
                                    onClick={() =>
                                      handleSuggestionClick(product)
                                    }
                                  >
                                    <div
                                      style={
                                        suggestionStyles.suggestionItemContent
                                      }
                                    >
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemName
                                        }
                                      >
                                        {product.product.product_name}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        Stock: {product.stock}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        {product.product.unit?.short_name}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        {product.product?.sellingPrice}
                                      </span>
                                      <span
                                        style={
                                          suggestionStyles.suggestionItemPrice
                                        }
                                      >
                                        WH: {product.warehouse?.name}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-2 flex gap-2">
                        <div className="grid grid-cols-12 quotationSelect">
                          <input
                            className="inputField col-span-3"
                            autoComplete="off"
                            type="text"
                            placeholder="Qty"
                            onChange={(e) =>
                              handleQuantityChange2(i, e.target.value)
                            }
                            value={item.quantity}
                            required
                          />
                          <select
                            className="inputField col-span-9"
                            onChange={(e) =>
                              handleUnitChange2(i, e.target.value)
                            }
                            value={item.unit || ""}
                            required
                          >
                            <option value="" disabled>
                              Select Unit
                            </option>
                            {unitOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="Rate"
                          onChange={(e) => handleRateChange2(i, e.target.value)}
                          value={item.rateDisplay || item.rate || ""}
                          required
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <input
                          className="inputField"
                          autoComplete="off"
                          type="text"
                          placeholder="Amount"
                          value={formateNumber(item.total)}
                          readOnly
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1">
                        <button
                          type="button"
                          onClick={() => handleRemove(i)}
                          className="w-full bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md py-2 px-2 justify-center"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      {items.length - 1 === i && (
                        <div
                          onClick={handleAddClick}
                          className="flex justify-end mt-2"
                        >
                          <button
                            type="button"
                            className="w-[135px] bg-[#42A1DA] hover:bg-[#42A1DA] text-white p-2 rounded-md"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </form>

        {/* Discount and Total Section */}
        <div className="discountFieldWrap mt-5">
          <div className="flex items-center">
            <b>Total Amount: </b>
            <span>
              {formateNumber(
                grandTotal ? grandTotal : specificQuotation?.total_amount,
              )}
            </span>
          </div>
          <div>
            <b>Discount: </b>
            <input
              className="py-1 text-center"
              onChange={(e) => handleDiscountChange(e.target.value)}
              autoComplete="off"
              type="text"
              placeholder="Discount"
              defaultValue={formateNumber(specificQuotation?.discount)}
              ref={partsDiscountRef}
            />
          </div>
          <div>
            <b>Vat: </b>
            <input
              className="text-center"
              onChange={(e) => handleVATChange(e.target.value)}
              autoComplete="off"
              type="text"
              placeholder="Vat"
              defaultValue={formateNumber(specificQuotation?.vat)}
            />
          </div>
          <div>
            <div className="ml-3">
              <strong>
                Final Total:{" "}
                <span ref={netTotalAmountRef}>
                  {formateNumber(
                    calculateFinalTotal()
                      ? calculateFinalTotal()
                      : specificQuotation?.net_total,
                  )}
                </span>
              </strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 buttonGroup buttonMargin">
          <div className="flex md:flex-row flex-wrap justify-end">
            <Button onClick={handleGoPreview}>Preview</Button>
            <a
              className="bg-[#42A0D9] text-white px-3 py-2 rounded-full"
              href={`${import.meta.env.VITE_API_URL}/quotations/quotation/${
                specificQuotation?._id
              }`}
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
            <Button>Print</Button>
            <Button onClick={handleGoInvoice}>Invoice</Button>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-center align-items-center">
            <Can page="/dashboard/update-quotation" action="edit">
              <Button
                sx={{ background: "#42A1DA", color: "#fff" }}
                onClick={handleOnSubmit}
                className="addJobBtn"
                disabled={updateLoading}
              >
                Update Quotation
              </Button>
            </Can>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuotation;
