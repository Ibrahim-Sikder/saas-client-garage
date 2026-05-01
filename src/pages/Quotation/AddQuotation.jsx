"use client";
/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../public/assets/logo.png";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import { Autocomplete, Box, Chip, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import TrustAutoAddress from "../../components/TrustAutoAddress/TrustAutoAddress";
import { useGetSingleJobCardWithJobNoQuery } from "../../redux/api/jobCard";
import { cmDmOptions, countries } from "../../constant";
import { useCreateQuotationMutation } from "../../redux/api/quotation";
import { unitOptions } from "../../utils/options";
import { useGetAllStocksQuery } from "../../redux/api/stocksApi";
import { suggestionStyles } from "../../utils/customStyle";
import { formateNumber } from "../../utils/formateSemicolon";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import Can from "../../components/Can";
import { usePermissions } from "../../context/PermissionContext";
import QuotationTable from "./QuotationTable";
const AddQuotation = () => {
  const [getDataWithChassisNo, setGetDataWithChassisNo] = useState({});
  const [value, setValue] = useState(getDataWithChassisNo?.vehicle?.carReg_no);
  const parsedDate = new Date();
  const day = parsedDate.getDate().toString().padStart(2, "0");
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = parsedDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const location = useLocation();
  const job_no = new URLSearchParams(location.search).get("order_no");
  const [orderNumber, setOrderNumber] = useState(job_no);
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("");
  const [goOtherButton, setGoOtherButton] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [grandTotal, setGrandTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [vat, setVAT] = useState(0);
  const [tax, setTax] = useState(0);
  const [partsTotal, setPartsTotal] = useState(0);
  const [serviceTotal, setServiceTotal] = useState(0);
  const [currentMileage, setCurrentMileage] = useState("");
  const [mileageChanged, setMileageChanged] = useState(false);
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
      quantity: "",
      unit: "",
      rate: "",
      rateDisplay: "",
      total: "",
    },
  ]);
  console.log("getDataWithChassisNo ", getDataWithChassisNo);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [activeInputType, setActiveInputType] = useState(null);
  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const queryParams = {
    tenantDomain,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  };

  const { data: stockData } = useGetAllStocksQuery(queryParams);
  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  const [createQuotation, { isLoading: createLoading }] =
    useCreateQuotationMutation();

  const {
    data: jobCardData,
    refetch,
    error,
  } = useGetSingleJobCardWithJobNoQuery({
    tenantDomain,
    jobNo: orderNumber,
  });

  useEffect(() => {
    if (jobCardData?.data?.date) {
      setSelectedDate(jobCardData?.data?.date);
    } else {
      setSelectedDate(formattedDate);
    }
  }, [formattedDate, jobCardData?.data?.date]);

  useEffect(() => {
    if (jobCardData?.data?.user_type === "customer") {
      reset({
        job_no: jobCardData?.data?.job_no,
        Id: jobCardData?.data?.Id,
        company_name: jobCardData?.data?.customer?.company_name,
        customer_name: jobCardData?.data?.customer?.customer_name,
        customer_country_code:
          jobCardData?.data?.customer?.customer_country_code,
        customer_contact: jobCardData?.data?.customer?.customer_contact,
        customer_address: jobCardData?.data?.customer?.customer_address,
        chassis_no: getDataWithChassisNo?.chassis_no,
        carReg_no: getDataWithChassisNo?.carReg_no,
        car_registration_no: getDataWithChassisNo?.car_registration_no,
        engine_no: getDataWithChassisNo?.engine_no,
        vehicle_brand: getDataWithChassisNo?.vehicle_brand,
        vehicle_name: getDataWithChassisNo?.vehicle_name,
        mileage: getDataWithChassisNo?.mileage,
      });
    }
    if (jobCardData?.data?.user_type === "company") {
      reset({
        job_no: jobCardData?.data?.job_no,
        Id: jobCardData?.data?.Id,
        company_name: jobCardData?.data?.company?.company_name,
        vehicle_username: jobCardData?.data?.company?.vehicle_username,
        company_address: jobCardData?.data?.company?.company_address,
        company_contact: jobCardData?.data?.company?.company_contact,
        company_country_code: jobCardData?.data?.company?.company_country_code,
        company_email: jobCardData?.data?.company?.company_email,
        customer_address: jobCardData?.data?.company?.customer_address,
        chassis_no: getDataWithChassisNo?.chassis_no,
        carReg_no: getDataWithChassisNo?.carReg_no,
        car_registration_no: getDataWithChassisNo?.car_registration_no,
        engine_no: getDataWithChassisNo?.engine_no,
        vehicle_brand: getDataWithChassisNo?.vehicle_brand,
        vehicle_name: getDataWithChassisNo?.vehicle_name,
        mileage: getDataWithChassisNo?.mileage,
      });
    }
    if (jobCardData?.data?.user_type === "showRoom") {
      reset({
        job_no: jobCardData?.data?.job_no,
        Id: jobCardData?.data?.Id,
        showRoom_name: jobCardData?.data?.showRoom?.showRoom_name,
        vehicle_username: jobCardData?.data?.showRoom?.vehicle_username,
        showRoom_address: jobCardData?.data?.showRoom?.showRoom_address,
        company_name: jobCardData?.data?.showRoom?.company_name,
        company_contact:
          phoneNumber || jobCardData?.data?.showRoom?.company_contact,
        company_country_code: jobCardData?.data?.showRoom?.company_country_code,
        chassis_no: getDataWithChassisNo?.chassis_no,
        carReg_no: getDataWithChassisNo?.carReg_no,
        car_registration_no: getDataWithChassisNo?.car_registration_no,
        engine_no: getDataWithChassisNo?.engine_no,
        vehicle_brand: getDataWithChassisNo?.vehicle_brand,
        vehicle_name: getDataWithChassisNo?.vehicle_name,
        mileage: getDataWithChassisNo?.mileage,
      });
    }
  }, [
    getDataWithChassisNo?.carReg_no,
    getDataWithChassisNo?.car_registration_no,
    getDataWithChassisNo?.chassis_no,
    getDataWithChassisNo?.engine_no,
    getDataWithChassisNo?.mileage,
    getDataWithChassisNo?.vehicle_brand,
    getDataWithChassisNo?.vehicle_name,
    jobCardData?.data?.Id,
    jobCardData?.data?.company?.company_address,
    jobCardData?.data?.company?.company_contact,
    jobCardData?.data?.company?.company_country_code,
    jobCardData?.data?.company?.company_email,
    jobCardData?.data?.company?.company_name,
    jobCardData?.data?.company?.customer_address,
    jobCardData?.data?.company?.vehicle_username,
    jobCardData?.data?.customer?.company_name,
    jobCardData?.data?.customer?.customer_address,
    jobCardData?.data?.customer?.customer_contact,
    jobCardData?.data?.customer?.customer_country_code,
    jobCardData?.data?.customer?.customer_name,
    jobCardData?.data?.job_no,
    jobCardData?.data?.showRoom?.company_contact,
    jobCardData?.data?.showRoom?.company_country_code,
    jobCardData?.data?.showRoom?.company_name,
    jobCardData?.data?.showRoom?.showRoom_address,
    jobCardData?.data?.showRoom?.showRoom_name,
    jobCardData?.data?.showRoom?.vehicle_username,
    jobCardData?.data?.user_type,
    phoneNumber,
    reset,
  ]);

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

  useEffect(() => {
    const totalSum = items.reduce((sum, item) => sum + Number(item.total), 0);
    const serviceTotalSum = serviceItems.reduce(
      (sum, item) => sum + Number(item.total),
      0,
    );
    const roundedTotalSum = Number.parseFloat(
      totalSum + serviceTotalSum,
    ).toFixed(2);
    setPartsTotal(Number(totalSum));
    setServiceTotal(Number(serviceTotalSum));
    setGrandTotal(Number(roundedTotalSum));
  }, [items, serviceItems]);

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

  const handleServiceDescriptionChange = (index, value) => {
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
  };

  const handleDescriptionChange = (index, value) => {
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
  };

  const handleUnitChange = (index, value) => {
    const newItems = [...items];
    newItems[index].unit = value;
    setItems(newItems);
  };

  const handleServiceUnitChange = (index, value) => {
    const newItems = [...serviceItems];
    newItems[index].unit = value;
    setServiceItems(newItems);
  };

  const handleQuantityChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const newItems = [...items];
    const parsedValue = Number.parseFloat(cleanValue) || 0;
    newItems[index].quantity = cleanValue;
    newItems[index].total =
      parsedValue * (Number.parseFloat(newItems[index].rate) || 0);
    newItems[index].total = Number.parseFloat(newItems[index].total.toFixed(2));
    setItems(newItems);
  };

  const handleServiceQuantityChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const newItems = [...serviceItems];
    const parsedValue = Number.parseFloat(cleanValue) || 0;
    newItems[index].quantity = cleanValue;
    newItems[index].total =
      parsedValue * (Number.parseFloat(newItems[index].rate) || 0);
    newItems[index].total = Number.parseFloat(newItems[index].total.toFixed(2));
    setServiceItems(newItems);
  };
  const handleRateChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const newItems = [...items];
    const parsedRate = Number.parseFloat(cleanValue) || 0;
    newItems[index].rate = parsedRate;
    newItems[index].rateDisplay = cleanValue;
    newItems[index].total =
      (Number.parseFloat(newItems[index].quantity) || 0) * parsedRate;
    newItems[index].total = Number.parseFloat(newItems[index].total.toFixed(2));
    setItems(newItems);
  };

  const handleServiceRateChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");

    const parts = numericValue.split(".");
    const cleanValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const newItems = [...serviceItems];
    const parsedRate = Number.parseFloat(cleanValue) || 0;
    newItems[index].rate = parsedRate;
    newItems[index].rateDisplay = cleanValue;
    newItems[index].total =
      (Number.parseFloat(newItems[index].quantity) || 0) * parsedRate;
    newItems[index].total = Number.parseFloat(newItems[index].total.toFixed(2));
    setServiceItems(newItems);
  };

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

  const calculateFinalTotal = () => {
    const discountAsPercentage = discount;
    const totalAfterDiscount = grandTotal - discountAsPercentage;
    const vatAsPercentage = vat / 100;
    const totalAfterVat =
      totalAfterDiscount + totalAfterDiscount * vatAsPercentage;
    const taxAsPercentage = tax / 100;
    let finalTotal = totalAfterVat + totalAfterVat * taxAsPercentage;
    finalTotal = Number.parseFloat(finalTotal).toFixed(2);
    return finalTotal;
  };

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
    if (activeInputType === "service") {
      const newItems = [...serviceItems];
      const matchingUnit = findMatchingUnit(product.product.unit);
      newItems[activeInputIndex].description = product.product.product_name;
      newItems[activeInputIndex].unit = matchingUnit;
      newItems[activeInputIndex].rate = product.product.sellingPrice || 0;
      newItems[activeInputIndex].rateDisplay = (
        product.product.sellingPrice || 0
      ).toString();
      // Use available stock quantity instead of product quantity
      newItems[activeInputIndex].quantity = (product.stock || 0).toString();
      newItems[activeInputIndex].product = product.product._id;
      newItems[activeInputIndex].warehouse = product.warehouse;
      newItems[activeInputIndex].product_name = product.product.product_name;
      newItems[activeInputIndex].sellingPrice =
        product.product.sellingPrice || 0;
      newItems[activeInputIndex].batchNumber = product.batchNumber || "";

      // Calculate total based on quantity and rate
      newItems[activeInputIndex].total =
        (Number.parseFloat(newItems[activeInputIndex].quantity) || 0) *
        (Number.parseFloat(newItems[activeInputIndex].rate) || 0);
      newItems[activeInputIndex].total = Number.parseFloat(
        newItems[activeInputIndex].total.toFixed(2),
      );
      setServiceItems(newItems);
    } else if (activeInputType === "parts") {
      const newItems = [...items];
      const matchingUnit = findMatchingUnit(product.product.unit);
      newItems[activeInputIndex].description = product.product.product_name;
      newItems[activeInputIndex].unit = matchingUnit;
      newItems[activeInputIndex].rate = product.product.sellingPrice || 0;
      newItems[activeInputIndex].rateDisplay = (
        product.product.sellingPrice || 0
      ).toString();
      // Use available stock quantity instead of product quantity
      newItems[activeInputIndex].quantity = (product.stock || 0).toString();
      newItems[activeInputIndex].product = product.product._id;
      newItems[activeInputIndex].warehouse = product.warehouse;
      newItems[activeInputIndex].product_name = product.product.product_name;
      newItems[activeInputIndex].sellingPrice =
        product.product.sellingPrice || 0;
      newItems[activeInputIndex].batchNumber = product.batchNumber || "";

      // Calculate total based on quantity and rate
      newItems[activeInputIndex].total =
        (Number.parseFloat(newItems[activeInputIndex].quantity) || 0) *
        (Number.parseFloat(newItems[activeInputIndex].rate) || 0);
      newItems[activeInputIndex].total = Number.parseFloat(
        newItems[activeInputIndex].total.toFixed(2),
      );
      setItems(newItems);
    }
    setShowSuggestions(false);
  };

  const prepareItemsForSubmission = (itemsArray) => {
    return itemsArray.map((item) => {
      if (item.product && item.warehouse) {
        return item;
      } else {
        return {
          ...item,
        };
      }
    });
  };

  const onSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/create-quotation",
      "create",
      async () => {
        const toastId = toast.loading("Creating Quotation...");
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
        };
        const showRoom = {
          showRoom_name: data.showRoom_name,
          vehicle_username: data.vehicle_username,
          company_name: data.company_name,
          company_contact: data.company_contact,
          company_country_code: data.company_country_code,
          company_address: data.company_address,
        };
        data.mileage = Number(data.mileage);
        const newMileageValue = Number(data.mileage);

        const existingMileageHistory =
          getDataWithChassisNo?.mileageHistory || [];
        const updatedMileageHistory = [...existingMileageHistory];

        // Only add current mileage to history if it has changed
        if (mileageChanged && currentMileage) {
          const newMileageEntry = {
            mileage: Number(currentMileage),
            date: new Date().toISOString(),
          };

          // Check if this mileage value already exists in history
          const mileageExists = updatedMileageHistory.some(
            (entry) => entry.mileage === Number(currentMileage),
          );

          if (!mileageExists) {
            updatedMileageHistory.push(newMileageEntry);
          }
        }

        // Only add a new entry if it's a valid number and not already in the history
        if (!isNaN(newMileageValue) && newMileageValue > 0) {
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
          mileageHistory: updatedMileageHistory,
        };

        // Prepare items for submission
        const preparedItems = prepareItemsForSubmission(items);
        const preparedServiceItems = prepareItemsForSubmission(serviceItems);

        const quotation = {
          user_type: jobCardData?.data?.user_type,
          Id: jobCardData?.data?.Id,
          job_no: orderNumber,
          date: selectedDate,
          parts_total: partsTotal,
          service_total: serviceTotal,
          total_amount: grandTotal,
          discount: discount,
          vat: vat,
          tax: tax, // New: Include tax in the quotation object
          net_total: calculateFinalTotal(),
          input_data: preparedItems,
          service_input_data: preparedServiceItems,
          logo,
          mileage: data.mileage,
        };

        const values = {
          tenantDomain,
          customer,
          company,
          showRoom,
          vehicle,
          quotation,
        };

        try {
          const res = await createQuotation(values).unwrap();
          if (res.success) {
            toast.success(res.message);
            if (goOtherButton === "preview") {
              navigate(`/dashboard/quotation-view?id=${res?.data?._id}`);
              setGoOtherButton("");
            } else if (goOtherButton === "invoice") {
              navigate(
                `/dashboard/create-invoice?order_no=${jobCardData?.data?.job_no}&id=${res?.data?._id}`,
              );
              setGoOtherButton("");
            } else {
              navigate("/dashboard/quotation-list");
              setGoOtherButton("");
            }
            refetch();
          }
        } catch (err) {
          const errorMessage =
            err?.data?.message || err?.message || "Failed to create quotation";
          toast.error(errorMessage);
        } finally {
          toast.dismiss(toastId);
        }
      },
      "You don't permission to create quotation !",
    );
  };

  useEffect(() => {
    setGetDataWithChassisNo(jobCardData?.data?.vehicle);
  }, [jobCardData?.data?.vehicle]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSuggestions]);

  return (
    <div className="md:px-5 md:py-10">
      <div className=" mb-5 pb-5 mx-auto text-center border-b-2 border-[#42A1DA]">
        <div className=" addJobCardHeads">
          <img
            src={CompanyInfoData?.data?.logo || "/placeholder.svg"}
            alt="logo"
            className=" addJobLogoImg"
          />
          <div>
            <div className="flex-1 text-center">
              {CompanyInfoData?.data?.companyNameBN && (
                <h2 className="trustAutoTitle">
                  {CompanyInfoData?.data?.companyNameBN}
                </h2>
              )}
              {CompanyInfoData?.data?.companyName && (
                <h3 className="text-lg md:text-xl english-font mt-1 text-[#4671A1] font-bold ">
                  ({CompanyInfoData?.data?.companyName})
                </h3>
              )}
            </div>
            <span className="text-[12px] lg:text-xl mt-5 block">
              Office: {CompanyInfoData?.data?.address}
            </span>
          </div>
          <TrustAutoAddress />
        </div>
      </div>
      <div className="mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex md:flex-row flex-col justify-between items-center">
            <div className="hidden"></div>
            <div className="vehicleCard">Create Quotation </div>
            <div>
              <input
                type="date"
                className="border px-3 py-1 rounded-md "
                defaultValue={new Date().toISOString().slice(0, 10)}
                {...register("date", {
                  required: "Date is required!",
                })}
              />
            </div>
          </div>
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
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                    focused={job_no}
                    defaultValue={job_no || ""}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Customer Id"
                    {...register("Id")}
                    focused={jobCardData?.data?.Id}
                    required
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Company"
                    focused={
                      jobCardData?.data?.customer?.company_name ||
                      jobCardData?.data?.company?.company_name ||
                      jobCardData?.data?.showRoom?.company_name
                    }
                    {...register("company_name")}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  {!jobCardData?.data && (
                    <TextField
                      fullWidth
                      label="Customer"
                      focused={jobCardData?.data?.customer?.customer_name}
                      {...register("customer_name")}
                    />
                  )}
                  {jobCardData?.data?.user_type === "customer" && (
                    <TextField
                      fullWidth
                      label="Customer"
                      focused={jobCardData?.data?.customer?.customer_name}
                      {...register("customer_name")}
                    />
                  )}
                  {(jobCardData?.data?.user_type === "company" ||
                    jobCardData?.data?.user_type === "showRoom") && (
                    <TextField
                      fullWidth
                      label="Customer"
                      focused={
                        jobCardData?.data?.company?.vehicle_username ||
                        jobCardData?.data?.showRoom?.vehicle_username
                      }
                      {...register("vehicle_username")}
                    />
                  )}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item lg={3} md={4} sm={12} xs={12}>
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
                            {...params}
                            {...register("customer_country_code")}
                            label="Select Country Code"
                            variant="outlined"
                            focused={
                              jobCardData?.data?.customer?.customer_country_code
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item lg={9} md={8} sm={12} xs={12}>
                      {!jobCardData?.data && (
                        <TextField
                          {...register("customer_contact")}
                          variant="outlined"
                          fullWidth
                          type="tel"
                          value={
                            phoneNumber
                              ? phoneNumber
                              : jobCardData?.data?.customer?.customer_contact
                          }
                          onChange={handlePhoneNumberChange}
                          placeholder="Customer Contact No (N)"
                        />
                      )}
                      {jobCardData?.data?.user_type === "customer" && (
                        <TextField
                          {...register("customer_contact")}
                          variant="outlined"
                          fullWidth
                          type="tel"
                          value={
                            phoneNumber
                              ? phoneNumber
                              : jobCardData?.data?.customer?.customer_contact
                          }
                          onChange={handlePhoneNumberChange}
                          placeholder="Customer Contact No (N)"
                          focused={
                            jobCardData?.data?.customer?.customer_contact || ""
                          }
                        />
                      )}
                      {(jobCardData?.data?.user_type === "company" ||
                        jobCardData?.data?.user_type === "showRoom") && (
                        <TextField
                          {...register("company_contact")}
                          variant="outlined"
                          fullWidth
                          type="tel"
                          value={
                            phoneNumber
                              ? phoneNumber
                              : jobCardData?.data?.customer?.customer_contact
                          }
                          onChange={handlePhoneNumberChange}
                          placeholder="Company Contact No (N)"
                          focused={
                            jobCardData?.data?.company?.company_contact ||
                            jobCardData?.data?.showRoom?.company_contact
                          }
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  {!jobCardData?.data && (
                    <TextField
                      fullWidth
                      label="Address"
                      {...register("customer_address")}
                    />
                  )}
                  {jobCardData?.data?.user_type === "customer" && (
                    <TextField
                      fullWidth
                      label="Address"
                      {...register("customer_address")}
                      focused={jobCardData?.data?.customer?.customer_address}
                    />
                  )}
                  {jobCardData?.data?.user_type === "company" && (
                    <TextField
                      fullWidth
                      label="Address"
                      {...register("company_address")}
                      focused={
                        jobCardData?.data?.company?.company_address || ""
                      }
                    />
                  )}
                  {jobCardData?.data?.user_type === "showRoom" && (
                    <TextField
                      fullWidth
                      label="Address"
                      {...register("showRoom_address")}
                      focused={
                        jobCardData?.data?.showRoom?.showRoom_address || ""
                      }
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
            <Box>
              <h3 className="text-xl lg:text-3xl font-bold mb-5 ">
                Vehicle Info
              </h3>
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Chassis No"
                    {...register("chassis_no")}
                    focused={getDataWithChassisNo?.chassis_no || ""}
                    required
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item lg={3} md={4} sm={12} xs={12}>
                      <Autocomplete
                        sx={{ marginRight: "5px" }}
                        freeSolo
                        fullWidth
                        id="free-solo-demo"
                        options={cmDmOptions.map((option) => option.label)}
                        value={jobCardData?.data?.vehicle?.carReg_no || ""}
                        onChange={(event, newValue) => {
                          setValue("carReg_no", newValue);
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
                    </Grid>
                    <Grid item lg={9} md={8} sm={12} xs={12}>
                      <InputMask
                        mask="99-9999"
                        maskChar={null}
                        {...register("car_registration_no")}
                        value={getDataWithChassisNo?.car_registration_no || ""}
                      >
                        {(inputProps) => (
                          <TextField
                            fullWidth
                            {...inputProps}
                            {...register("car_registration_no")}
                            label="Car R (N)"
                            focused={
                              getDataWithChassisNo?.car_registration_no || ""
                            }
                          />
                        )}
                      </InputMask>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Engine & CC"
                    {...register("engine_no")}
                    focused={getDataWithChassisNo?.engine_no || ""}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Vehicle Name"
                    {...register("vehicle_name")}
                    focused={getDataWithChassisNo?.vehicle_name || ""}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Autocomplete
                    freeSolo
                    options={
                      getDataWithChassisNo?.mileageHistory
                        ? [...getDataWithChassisNo.mileageHistory]
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((entry) => ({
                              label: `${entry.mileage} km (${new Date(entry.date).toLocaleDateString()})`,
                              value: String(entry.mileage),
                            }))
                        : []
                    }
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.label
                    }
                    value={
                      currentMileage !== ""
                        ? currentMileage
                        : getDataWithChassisNo?.mileageHistory?.length > 0
                          ? String(
                              getDataWithChassisNo.mileageHistory[
                                getDataWithChassisNo.mileageHistory.length - 1
                              ].mileage,
                            )
                          : String(getDataWithChassisNo?.mileage || "")
                    }
                    onChange={(_, newValue) => {
                      // user clicked a suggestion from dropdown
                      const selected =
                        typeof newValue === "object" && newValue !== null
                          ? newValue.value
                          : newValue;
                      setCurrentMileage(selected || "");
                      const lastMileage =
                        getDataWithChassisNo?.mileageHistory?.slice(-1)[0]
                          ?.mileage;
                      if (lastMileage && Number(selected) !== lastMileage) {
                        setMileageChanged(true);
                      } else if (!lastMileage && selected) {
                        setMileageChanged(true);
                      } else {
                        setMileageChanged(false);
                      }
                    }}
                    onInputChange={(_, newInputValue, reason) => {
                      // user typed manually
                      if (reason === "input") {
                        setCurrentMileage(newInputValue);
                        const lastMileage =
                          getDataWithChassisNo?.mileageHistory?.slice(-1)[0]
                            ?.mileage;
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
                        error={!!errors.mileage}
                        helperText={errors.mileage?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div className="mb-2">
                    <strong>Mileage History:</strong>
                    {getDataWithChassisNo?.mileageHistory?.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getDataWithChassisNo.mileageHistory.map(
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
                                  getDataWithChassisNo.mileageHistory.filter(
                                    (_, i) => i !== index,
                                  );
                                setGetDataWithChassisNo((prevState) => ({
                                  ...prevState,
                                  mileageHistory: updatedHistory,
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
          <Box sx={{ marginTop: "50px" }}>
            <div className="grid grid-cols-12 gap-2 items-center font-bold mb-5 md:mb-1 ">
              <label className="col-span-6 md:col-span-1 text-center hidden md:block ">
                SL No
              </label>
              <label className="col-span-12 md:col-span-6 text-center">
                Services Description
              </label>
              <label className="col-span-6 md:col-span-2 text-center hidden md:block  ">
                Qty
              </label>
              <label className="col-span-6 md:col-span-1 text-center hidden md:block ">
                Rate
              </label>
              <label className="col-span-6 md:col-span-1 text-center hidden md:block  ">
                Amount
              </label>
              <label className="opacity-0 col-span-6 md:col-span-1 hidden md:block ">
                hidden items for responsive
              </label>
            </div>
            {serviceItems.map((item, i) => {
              return (
                <div key={i}>
                  <div className="grid grid-cols-12 gap-2 items-center mt-3 ">
                    <div className="col-span-12 md:col-span-1">
                      <input
                        className="inputField"
                        autoComplete="off"
                        type="text"
                        placeholder="SL No "
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
                          value={item.description}
                          // required
                        />
                        {showSuggestions &&
                          activeInputType === "service" &&
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
                            handleServiceQuantityChange(i, e.target.value)
                          }
                          value={item.quantity}
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
                        placeholder="Rate"
                        onChange={(e) =>
                          handleServiceRateChange(i, e.target.value)
                        }
                        value={formateNumber(item.rateDisplay) || ""}
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
                      {serviceItems.length !== 0 && (
                        <button
                          onClick={() => handleServiceRemove(i)}
                          className="w-full  bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md  py-2 px-2 justify-center "
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 ">
                    {serviceItems.length - 1 === i && (
                      <button
                        onClick={handleServiceAdd}
                        className="w-[135px] bg-[#42A1DA]  hover:bg-[#42A1DA] text-white p-2 rounded-md"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </Box>
          <div className="grid grid-cols-12 gap-2 items-center font-bold mb-5 md:mb-1 mt-5 ">
            <label className="col-span-6 md:col-span-1 text-center hidden md:block ">
              SL No
            </label>
            <label className="col-span-12 md:col-span-6 text-center ">
              Parts Description
            </label>
            <label className="col-span-6 md:col-span-2 text-center hidden md:block  ">
              Qty
            </label>
            <label className="col-span-6 md:col-span-1 text-center hidden md:block ">
              Rate
            </label>
            <label className="col-span-6 md:col-span-1 text-center hidden md:block  ">
              Amount
            </label>
            <label className="opacity-0 col-span-6 md:col-span-1 hidden md:block ">
              hidden items for responsive
            </label>
          </div>
          {items.map((item, i) => {
            return (
              <div key={i}>
                <div className="grid grid-cols-12 gap-2 items-center mt-3 ">
                  <div className="col-span-12 md:col-span-1">
                    <input
                      className="inputField"
                      autoComplete="off"
                      type="text"
                      placeholder="SL No "
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
                          handleDescriptionChange(i, e.target.value)
                        }
                        value={item.description}
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
                                onClick={() => handleSelectSuggestion(product)}
                              >
                                <div
                                  style={suggestionStyles.suggestionItemContent}
                                >
                                  <span
                                    style={suggestionStyles.suggestionItemName}
                                  >
                                    {product.product.product_name}
                                  </span>
                                  <span
                                    style={suggestionStyles.suggestionItemPrice}
                                  >
                                    Stock: {product.stock}
                                  </span>
                                  <span
                                    style={suggestionStyles.suggestionItemPrice}
                                  >
                                    {product.product.unit?.short_name}
                                  </span>
                                  <span
                                    style={suggestionStyles.suggestionItemPrice}
                                  >
                                    {product.product?.sellingPrice}
                                  </span>
                                  <span
                                    style={suggestionStyles.suggestionItemPrice}
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
                        value={item.quantity}
                      />
                      <select
                        className="inputField col-span-9"
                        onChange={(e) => handleUnitChange(i, e.target.value)}
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
                      placeholder="Rate"
                      onChange={(e) => handleRateChange(i, e.target.value)}
                      type="text"
                      value={formateNumber(item.rateDisplay) || ""}
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
                    {items.length !== 0 && (
                      <button
                        onClick={() => handleRemove(i)}
                        className="w-full  bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md  py-2 px-2 justify-center "
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-1 ">
                  {items.length - 1 === i && (
                    <button
                      onClick={handleAddClick}
                      className="w-[135px] bg-[#42A1DA]  hover:bg-[#42A1DA] text-white p-2 rounded-md"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div className="discountFieldWrap mt-5 ">
            <div className="flex items-center ">
              <b className="mr-2 "> Total Amount: </b>
              <span>{formateNumber(grandTotal)}</span>
            </div>
            <div>
              <b className="mr-2  "> Discount: </b>
              <input
                className="py-1 text-center"
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  handleDiscountChange(rawValue);
                }}
                value={formateNumber(discount)}
                autoComplete="off"
                type="text"
                placeholder="Discount"
              />
            </div>
            <div>
              <b className="mr-2 ">Vat: </b>
              <input
                className="text-center"
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  handleVATChange(rawValue);
                }}
                value={formateNumber(vat)}
                autoComplete="off"
                type="text"
                placeholder="Vat"
              />
            </div>
            <div>
              <b className="mr-2 ">Tax: </b>
              <input
                className="text-center"
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  handleTaxChange(rawValue);
                }}
                value={formateNumber(tax)}
                autoComplete="off"
                type="text"
                placeholder="Tax"
              />
            </div>
            <div>
              <div className="flex items-center ml-3 ">
                <b className="mr-2 ">Final Total: </b>
                <span>{formateNumber(calculateFinalTotal())}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-4 md:mt-8  buttonGroup">
            <div className=" flex md:hidden  justify-end md:justify-start submitQutationBtn order-2 md:order-3 ">
              <button type="submit" disabled={createLoading}>
                Add Quotation{" "}
              </button>
            </div>

            <div className="flex">
              <button onClick={() => setGoOtherButton("preview")}>
                Preview
              </button>
              <button>Print </button>
              <button onClick={() => setGoOtherButton("invoice")}>
                Invoice{" "}
              </button>
            </div>

            <div className="hidden  md:flex  justify-end md:justify-start submitQutationBtn order-2 md:order-3 ">
              <Can page="/dashboard/create-quotation" action="create">
                <button type="submit" disabled={createLoading}>
                  Add Quotation{" "}
                </button>
              </Can>
            </div>
          </div>
        </form>
      </div>
      <QuotationTable />
    </div>
  );
};

export default AddQuotation;
