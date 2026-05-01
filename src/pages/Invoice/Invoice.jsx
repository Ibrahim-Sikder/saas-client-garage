/* eslint-disable react-hooks/exhaustive-deps */
"use client";
/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Invoice.css";
import { toast } from "react-toastify";
import { Autocomplete, Box, Chip, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { formatDate } from "../../utils/formateDate";
import TADatePickers from "../../components/form/TADatePickers";
import { cmDmOptions, countries } from "../../constant";
import TrustAutoAddress from "../../components/TrustAutoAddress/TrustAutoAddress";
import { useCreateInvoiceMutation } from "../../redux/api/invoice";
import { useGetSingleJobCardWithJobNoQuery } from "../../redux/api/jobCard";
import { unitOptions } from "../../utils/options";
import { useGetSingleQuotationQuery } from "../../redux/api/quotation";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import Can from "../../components/Can";
import { usePermissions } from "../../context/PermissionContext";
import InvoiceTable from "./InvoiceTable";
import { formateNumber } from "../../utils/formateSemicolon";

const Invoice = () => {
  const { tenantDomain } = useTenantDomain();
  const [getDataWithChassisNo, setGetDataWithChassisNo] = useState({});
  const [specificQuotation, setSpecificQuotation] = useState({});
  const [value, setValue] = useState(getDataWithChassisNo?.vehicle?.carReg_no);
  const parsedDate = new Date();
  const day = parsedDate.getDate().toString().padStart(2, "0");
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = parsedDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const location = useLocation();
  const job_no = new URLSearchParams(location.search).get("order_no");
  const id = new URLSearchParams(location.search).get("id");
  const [orderNumber, setOrderNumber] = useState(job_no);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [vat, setVAT] = useState(0);
  const [tax, setTax] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [currentMileage, setCurrentMileage] = useState("");
  const [mileageChanged, setMileageChanged] = useState(false);
  const [partsTotal, setPartsTotal] = useState(0);
  const [serviceTotal, setServiceTotal] = useState(0);
  const [goOtherButton, setGoOtherButton] = useState("");
  const { performActionWithPermission } = usePermissions();

  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });
  const [reload, setReload] = useState(false);
  const [items, setItems] = useState([
    { description: "", unit: "", quantity: "", rate: "", total: "" },
  ]);
  const [serviceItems, setServiceItems] = useState([
    { description: "", unit: "", quantity: "", rate: "", total: "" },
  ]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [
    createInvoice,
    { isLoading: createLoading, error: createInvoiceError },
  ] = useCreateInvoiceMutation();
  const { data: jobCardData, refetch } = useGetSingleJobCardWithJobNoQuery({
    tenantDomain,
    jobNo: orderNumber,
  });
  const {
    data: quotationResponse,
    isLoading,
    error,
    refetch: singleRefetch,
  } = useGetSingleQuotationQuery({
    tenantDomain,
    id,
  });

  useEffect(() => {
    if (jobCardData?.data?.date) {
      setSelectedDate(jobCardData?.data?.date);
    } else {
      setSelectedDate(formattedDate);
    }
  }, [formattedDate, jobCardData?.data?.date]);

  useEffect(() => {
    if (specificQuotation?.discount !== undefined) {
      setDiscount(Number(specificQuotation.discount));
    }
    if (specificQuotation?.vat !== undefined) {
      setVAT(Number(specificQuotation.vat));
    }
    if (specificQuotation?.tax !== undefined) {
      setTax(Number(specificQuotation.tax));
    }
  }, [specificQuotation]);

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

  useEffect(() => {
    if (quotationResponse?.data) {
      setSpecificQuotation(quotationResponse.data);
    }
  }, [quotationResponse]);

  useEffect(() => {
    if (reload) {
      singleRefetch();
    }
  }, [reload, singleRefetch]);

  useEffect(() => {
    if (job_no && id) {
      setReload(!reload);
    }
  }, [job_no, id]);

  useEffect(() => {
    const totalSum = specificQuotation?.input_data?.reduce(
      (sum, item) => sum + Number(item.total),
      0
    );
    const totalSum2 = items.reduce((sum, item) => sum + Number(item.total), 0);
    const serviceTotalSum = specificQuotation?.service_input_data?.reduce(
      (sum, item) => sum + Number(item.total),
      0
    );
    const serviceTotalSum2 = serviceItems.reduce(
      (sum, item) => sum + Number(item.total),
      0
    );
    const newTotalSum = isNaN(totalSum) ? 0 : totalSum;
    const newTotalSum2 = isNaN(totalSum2) ? 0 : totalSum2; // Fixed: should be totalSum2
    const newServiceTotalSum = isNaN(serviceTotalSum) ? 0 : serviceTotalSum;
    const newServiceTotalSum2 = isNaN(serviceTotalSum2) ? 0 : serviceTotalSum2;
    const newGrandTotal = newTotalSum + newTotalSum2;
    const newServiceGrandTotal = newServiceTotalSum + newServiceTotalSum2;
    const totalGrand = Number.parseFloat(
      (newGrandTotal + newServiceGrandTotal).toFixed(2)
    ); // Ensure toFixed is called on the sum before parseFloat
    setPartsTotal(newGrandTotal);
    setServiceTotal(newServiceGrandTotal);
    setGrandTotal(totalGrand);
  }, [
    items,
    serviceItems,
    specificQuotation?.input_data,
    specificQuotation?.service_input_data,
  ]);

  const handleDateChange = (newDate) => {
    setSelectedDate(formatDate(newDate));
  };

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

  const handleRemove = (index) => {
    if (!index) {
      const list = [...items];
      setItems(list);
    } else {
      const list = [...items];
      list.splice(index, 1);
      setItems(list);
    }
  };

  const handleServiceDescriptionRemove = (index) => {
    if (!index) {
      const list = [...serviceItems];
      setServiceItems(list);
    } else {
      const list = [...serviceItems];
      list.splice(index, 1);
      setServiceItems(list);
    }
  };

  const handleAddClick = () => {
    setItems([
      ...items,
      { description: "", unit: "", quantity: "", rate: "", total: "" },
    ]);
  };

  const handleServiceDescriptionAdd = () => {
    setServiceItems([
      ...serviceItems,
      { description: "", unit: "", quantity: "", rate: "", total: "" },
    ]);
  };

  const handleDescriptionChange = (index, value) => {
    const newItems = [...items];
    newItems[index].description = value;
    setItems(newItems);
  };

  const handleDescriptionChange2 = (index, value) => {
    const newItems = [...specificQuotation.input_data];
    newItems[index] = {
      ...newItems[index],
      description: value,
    };
    setSpecificQuotation((prevState) => ({
      ...prevState,
      input_data: newItems,
    }));
  };

  const handleServiceDescriptionChange = (index, value) => {
    const newItems = [...serviceItems];
    newItems[index].description = value;
    setServiceItems(newItems);
  };

  const handleServiceDescriptionChange2 = (index, value) => {
    const newItems = [...specificQuotation.service_input_data];
    newItems[index] = {
      ...newItems[index],
      description: value,
    };
    setSpecificQuotation((prevState) => ({
      ...prevState,
      service_input_data: newItems,
    }));
  };

  const handleUnitChange = (index, value) => {
    const newItems = [...serviceItems];
    newItems[index].unit = value;
    setServiceItems(newItems);
  };

  const handleUnitChange2 = (index, value) => {
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

  const handleInputUnitChange = (index, value) => {
    const newItems = [...items];
    newItems[index].unit = value;
    setItems(newItems);
  };

  const handleInputUnitChange2 = (index, value) => {
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

  const handleQuantityChange = (index, value) => {
    const newItems = [...items];
    const roundedValue = Math.round(value) || 0;
    newItems[index].quantity = roundedValue;
    newItems[index].total = roundedValue * newItems[index].rate;
    newItems[index].total = Number.parseFloat(newItems[index].total.toFixed(2));
    setItems(newItems);
  };

  const handleQuantityChange2 = (index, value) => {
    if (!isNaN(value)) {
      const newItems = [...specificQuotation.input_data];
      const roundedValue = Math.round(value) || 0;
      newItems[index].quantity = Number(roundedValue);
      newItems[index].total = Number(roundedValue) * newItems[index].rate;
      newItems[index].total = Number(newItems[index].total.toFixed(2));
      setSpecificQuotation((prevState) => ({
        ...prevState,
        input_data: newItems,
      }));
    }
  };

  const handleServiceQuantityChange = (index, value) => {
    const newItems = [...serviceItems];
    const roundedValue = Math.round(value) || 0;
    newItems[index].quantity = roundedValue;
    newItems[index].total = roundedValue * newItems[index].rate;
    newItems[index].total = Number.parseFloat(newItems[index].total.toFixed(2));
    setServiceItems(newItems);
  };

  const handleServiceQuantityChange2 = (index, value) => {
    if (!isNaN(value)) {
      const newItems = [...specificQuotation.service_input_data];
      const roundedValue = Math.round(value) || 0;
      newItems[index].quantity = Number(roundedValue);
      newItems[index].total = Number(roundedValue) * newItems[index].rate;
      newItems[index].total = Number(newItems[index].total.toFixed(2));
      setSpecificQuotation((prevState) => ({
        ...prevState,
        service_input_data: newItems,
      }));
    }
  };

  const handleRateChange = (index, value) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    const newItems = [...items];
    // Store the actual numeric value for calculations
    newItems[index].rate = Number.parseFloat(numericValue) || 0;
    // Calculate total with the updated rate
    newItems[index].total = newItems[index].quantity * newItems[index].rate;
    // Round total to two decimal places
    newItems[index].total = Number.parseFloat(newItems[index].total.toFixed(2));
    setItems(newItems);
  };

  const handleRateChange2 = (index, value) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    const newItems = [...specificQuotation.input_data];
    newItems[index].rate = Number(numericValue) || 0;
    newItems[index].total = Number(
      newItems[index].quantity * newItems[index].rate
    );
    newItems[index].total = Number(newItems[index].total.toFixed(2));
    setSpecificQuotation((prevState) => ({
      ...prevState,
      input_data: newItems,
    }));
  };

  const handleServiceRateChange = (index, value) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    const newItems = [...serviceItems];
    // Store the actual numeric value for calculations
    newItems[index].rate = Number.parseFloat(numericValue) || 0;
    // Calculate total with the updated rate
    newItems[index].total = newItems[index].quantity * newItems[index].rate;
    // Round total to two decimal places
    newItems[index].total = Number.parseFloat(newItems[index].total.toFixed(2));
    setServiceItems(newItems);
  };

  const handleServiceRateChange2 = (index, value) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    const newItems = [...specificQuotation.service_input_data];
    newItems[index].rate = Number(numericValue) || 0;
    newItems[index].total = Number(
      newItems[index].quantity * newItems[index].rate
    );
    newItems[index].total = Number(newItems[index].total.toFixed(2));
    setSpecificQuotation((prevState) => ({
      ...prevState,
      service_input_data: newItems,
    }));
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
    // New handler for Tax
    const parsedValue = value === "" ? 0 : Number.parseFloat(value);
    if (!isNaN(parsedValue)) {
      setTax(parsedValue);
    }
  };

  const handleAdvance = (value) => {
    const parsedValue = value === "" ? 0 : Number.parseFloat(value);
    if (!isNaN(parsedValue)) {
      setAdvance(parsedValue);
    }
  };

  const calculateFinalTotal = () => {
    const totalAfterDiscount = grandTotal - discount;
    const totalAfterVat = totalAfterDiscount + totalAfterDiscount * (vat / 100);
    const finalTotalWithTax = totalAfterVat + totalAfterVat * (tax / 100); // Apply tax after VAT
    return Number.parseFloat(finalTotalWithTax.toFixed(2));
  };

  const calculateDue = () => {
    const due = calculateFinalTotal() - advance;
    return Number.parseFloat(due).toFixed(2);
  };

  const inputData = [
    ...(specificQuotation?.input_data || []),
    ...items
      .filter((item) => item.total !== undefined && item.total !== "")
      .map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        total: item.total,
      })),
  ];

  const serviceInputData = [
    ...(specificQuotation?.service_input_data || []),
    ...serviceItems
      .filter((item) => item.total !== undefined && item.total !== "")
      .map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        total: item.total,
      })),
  ];

  const onSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/create-quotation",
      "create",
      async () => {
        const toastId = toast.loading("Creating Company...");
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
            (entry) => entry.mileage === Number(currentMileage)
          );

          if (!mileageExists) {
            updatedMileageHistory.push(newMileageEntry);
          }
        }
        // Only add a new entry if it's a valid number and not already in the history
        if (!isNaN(newMileageValue) && newMileageValue > 0) {
          const mileageExists = updatedMileageHistory.some(
            (entry) => entry.mileage === newMileageValue
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
        const invoice = {
          user_type: jobCardData?.data?.user_type,
          Id: jobCardData?.data?.Id,
          job_no: orderNumber,
          date: selectedDate,
          parts_total: partsTotal,
          service_total: serviceTotal,
          total_amount: grandTotal,
          discount: discount,
          vat: vat,
          tax: tax,
          net_total: calculateFinalTotal(),
          input_data: inputData,
          service_input_data: serviceInputData,
          advance: advance,
          due: calculateDue(),
          mileage: data.mileage,
        };
        const values = {
          tenantDomain,
          customer,
          company,
          showRoom,
          vehicle,
          invoice,
        };
        try {
          const res = await createInvoice(values).unwrap();
          if (res.success) {
            toast.success(res.message);
            setReload(!reload);
            refetch();
            if (goOtherButton === "preview") {
              navigate(`/dashboard/invoice-view?id=${res?.data?._id}`);
              setGoOtherButton("");
            } else if (goOtherButton === "money-receipt") {
              navigate(
                `/dashboard/money-receive-create?order_no=${jobCardData?.data?.job_no}&id=${res?.data?._id}&net_total=${res?.net_total}`
              );
              setGoOtherButton("");
            } else {
              navigate("/dashboard/invoice-list");
              setGoOtherButton("");
            }
          }
        } catch (err) {
          const errorMessage =
            err?.data?.message || err?.error || "Failed to create invoice!";
          toast.error(errorMessage);
        } finally {
          toast.dismiss(toastId);
        }
      },
      "You don't have permission to create invoice"
    );
  };

  useEffect(() => {
    setGetDataWithChassisNo(jobCardData?.data?.vehicle);
  }, [jobCardData?.data?.vehicle]);
  useEffect(() => {
    if (jobCardData?.data?.mileage) {
      reset({
        mileage: jobCardData.data.mileage,
      });
      setCurrentMileage(jobCardData.data.mileage);
    }
  }, [jobCardData, reset]);
  return (
    <div className="md:px-5 py-5 lg:py-10">
      <div className=" mb-5 pb-5 mx-auto text-center border-b-2 border-[#42A1DA]">
        <div className="flex lg:flex-row columns-1 space-y-3 w-full mt-3 md:mt-5 mb-2 invoiceHeader  ">
          <img
            src={CompanyInfoData?.data?.logo || "/placeholder.svg"}
            alt="logo"
            className="w-[110px] md:w-[210px]"
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

            <span className="block mt-5">
              Office: {CompanyInfoData?.data?.address}
            </span>
          </div>
          <TrustAutoAddress />
        </div>
      </div>
      <div className="mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="hidden"></div>
            <div className="vehicleCard">Create Invoice </div>
            <div>
              <TADatePickers
                handleDateChange={handleDateChange}
                selectedDate={selectedDate}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-10 ">
            <Box>
              <h3 className="text-xl lg:text-3xl font-bold mb-3">
                Customer Info
              </h3>
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Job Card No"
                    onChange={(e) => setOrderNumber(e.target.value)}
                    focused={job_no}
                    defaultValue={job_no || ""}
                    required
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Customer Id"
                    {...register("Id")}
                    focused={jobCardData?.data?.Id}
                    required
                    inputProps={{ readOnly: true }}
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
                    <Grid item lg={3} md={5} sm={12} xs={12}>
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
                              jobCardData?.data?.customer?.customer_country_code
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item lg={9} md={7} sm={12} xs={12}>
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
              <h3 className="text-xl lg:text-3xl font-bold mb-3 ">
                Vehicle Info
              </h3>
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Chassis No"
                    {...register("chassis_no")}
                    focused={getDataWithChassisNo?.chassis_no?.length || ""}
                    required
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item lg={3} md={5} sm={12} xs={12}>
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
                            // focused={getDataWithChassisNo?.carReg_no}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item lg={9} md={7} sm={12} xs={12}>
                      <InputMask
                        mask="99-9999"
                        maskChar={null}
                        {...register("car_registration_no")}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            {...register("car_registration_no")}
                            fullWidth
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
                  <TextField
                    fullWidth
                    {...register("mileage", {
                      required: "Mileage is required!",
                    })}
                    label="Current Mileage (KM)"
                    type="number"
                    focused={jobCardData?.data?.mileage || ""}
                    defaultValue={jobCardData?.data?.mileage || ""}
                    onChange={(e) => {
                      const newMileage = e.target.value;
                      setCurrentMileage(newMileage);
                      const lastMileage =
                        getDataWithChassisNo?.mileageHistory?.slice(-1)[0]
                          ?.mileage;
                      if (lastMileage && Number(newMileage) !== lastMileage) {
                        setMileageChanged(true);
                      } else if (!lastMileage && newMileage) {
                        setMileageChanged(true);
                      } else {
                        setMileageChanged(false);
                      }
                    }}
                    error={!!errors.mileage}
                    helperText={errors.mileage?.message}
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
                                entry.date
                              ).toLocaleDateString()})`}
                              variant="outlined"
                              className="bg-gray-100 border-gray-300 text-gray-800"
                              onDelete={() => {
                                const updatedHistory =
                                  getDataWithChassisNo.mileageHistory.filter(
                                    (_, i) => i !== index
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
                          )
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
          <Box>
            <div className="grid grid-cols-12 gap-2 items-center font-bold mb-5 md:mb-1 ">
              <label className="col-span-6 md:col-span-1 text-center hidden md:block ">
                SL No
              </label>
              <label className="col-span-12 md:col-span-7 text-center">
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
            </div>
            <div>
              {specificQuotation?.service_input_data?.length > 0 && (
                <>
                  {specificQuotation?.service_input_data?.map((item, i) => {
                    return (
                      <div key={i}>
                        <div className="grid grid-cols-12 gap-2 items-center mt-3 ">
                          <div className="col-span-12 md:col-span-1">
                            <input
                              className="inputField"
                              autoComplete="off"
                              type="text"
                              placeholder="SL No "
                              defaultValue={`${
                                i + 1 < 10 ? `0${i + 1}` : i + 1
                              }`}
                              required
                            />
                          </div>
                          <div className="col-span-12 md:col-span-6">
                            <input
                              className="inputField"
                              autoComplete="off"
                              type="text"
                              placeholder="Description"
                              onChange={(e) =>
                                handleServiceDescriptionChange2(
                                  i,
                                  e.target.value
                                )
                              }
                              value={item.description}
                              required
                            />
                          </div>
                          <div className="col-span-12 md:col-span-2 flex gap-2">
                            <div className="grid grid-cols-12 quotationSelect">
                              <input
                                className="inputField col-span-3"
                                autoComplete="off"
                                type="text"
                                placeholder="Qty"
                                onChange={(e) =>
                                  handleServiceQuantityChange2(
                                    i,
                                    e.target.value
                                  )
                                }
                                required
                                value={item.quantity}
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
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
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
                              required
                              value={formateNumber(item.rate)}
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
                              <button className="w-full  bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md  py-2 px-2 justify-center ">
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            {!specificQuotation && (
              <>
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
                            required
                          />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                          <input
                            className="inputField"
                            autoComplete="off"
                            type="text"
                            placeholder="Description"
                            onChange={(e) =>
                              handleServiceDescriptionChange(i, e.target.value)
                            }
                            value={item.description}
                            required
                          />
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
                              required
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
                            placeholder="Rate"
                            onChange={(e) =>
                              handleServiceRateChange(i, e.target.value)
                            }
                            value={formateNumber(item.rate)}
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
                          {serviceItems.length !== 0 && (
                            <button
                              onClick={() => handleServiceDescriptionRemove(i)}
                              className="w-full  bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md  py-2 px-2 justify-center "
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end mt-1 ">
                        {serviceItems.length - 1 === i && (
                          <button
                            onClick={handleServiceDescriptionAdd}
                            className="w-[135px] bg-[#42A1DA]  hover:bg-[#42A1DA] text-white p-2 rounded-md"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </Box>
          <div className="grid grid-cols-12 gap-2 items-center font-bold mb-5 md:mb-1 mt-5  ">
            <label className="col-span-6 md:col-span-1 text-center hidden md:block ">
              SL No
            </label>
            <label className="col-span-12 md:col-span-6 text-center">
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
          <div>
            {specificQuotation?.input_data?.length > 0 && (
              <>
                {specificQuotation?.input_data?.map((item, i) => {
                  return (
                    <div key={i}>
                      <div className="grid grid-cols-12 gap-2 items-center mt-3 ">
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
                              required
                              value={item.quantity}
                            />
                            <select
                              className="inputField col-span-9"
                              onChange={(e) =>
                                handleInputUnitChange2(i, e.target.value)
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
                            onChange={(e) =>
                              handleRateChange2(i, e.target.value)
                            }
                            required
                            value={formateNumber(item.rate)}
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
                            <button className="w-full  bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md  py-2 px-2 justify-center ">
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {/* Other case */}
            {!specificQuotation && (
              <>
                {items.map((item, i) => {
                  return (
                    <div key={i}>
                      <div className="grid grid-cols-12 gap-2 items-center mt-3 ">
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
                          <input
                            className="inputField"
                            autoComplete="off"
                            type="text"
                            placeholder="Description"
                            onChange={(e) =>
                              handleDescriptionChange(i, e.target.value)
                            }
                            value={item.description}
                            required
                          />
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
                              required
                            />
                            <select
                              className="inputField col-span-9"
                              onChange={(e) =>
                                handleInputUnitChange(i, e.target.value)
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
                            placeholder="Rate"
                            onChange={(e) =>
                              handleRateChange(i, e.target.value)
                            }
                            value={formateNumber(item.rate)}
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
                          <div
                            onClick={handleAddClick}
                            className="flex justify-end mt-2 addQuotationBtns"
                          >
                            <button className="w-[135px] bg-[#42A1DA]  hover:bg-[#42A1DA] text-white p-2 rounded-md">
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <div className="discountFieldWrap mt-5 ">
            <div className="flex items-center">
              <b className="mr-2"> Total Amount: </b>
              <span>{formateNumber(grandTotal)}</span>
            </div>
            <div>
              <b className="mr-2"> Discount: </b>
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
              <b className="mr-2">Vat: </b>
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
              <b className="mr-2">Tax: </b> {/* New Tax Input Field */}
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
                <b className="mr-2">Final Total:</b>
                <span>{formateNumber(calculateFinalTotal())}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center ml-3 ">
                <b className="mr-2">Due:</b>
                <span>{formateNumber(calculateDue())}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row mt-8 buttonGroup ">
            <div className="hidden md:block order-3 md:order-2 ">
              <button type="submit" onClick={() => setGoOtherButton("preview")}>
                Preview
              </button>
              <button onClick={() => setGoOtherButton("money-receipt")}>
                Money Receipt{" "}
              </button>
            </div>
            <div className="flex justify-end submitQutationBtn order-2 md:order-3 ">
              <Can page="/dashboard/create-invoice" action="create">
                <button type="submit" disabled={createLoading}>
                  Add To Invoice
                </button>
              </Can>
            </div>
            <div className=" md:hidden order-3 md:order-2 mt-4">
              <button type="submit" onClick={() => setGoOtherButton("preview")}>
                Preview
              </button>
              <button onClick={() => setGoOtherButton("money-receipt")}>
                Money Receipt{" "}
              </button>
            </div>
          </div>
        </form>
      </div>
      <InvoiceTable />
    </div>
  );
};
export default Invoice;
