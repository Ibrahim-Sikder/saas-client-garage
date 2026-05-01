/* eslint-disable react-hooks/exhaustive-deps */
"use client";

/* eslint-disable no-unused-vars */

import "./AddJobCard.css";
import car from "../../../public//assets/car2.jpeg";
import { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Chip, Grid, TextField } from "@mui/material";
// import "react-quill/dist/quill.snow.css";
import InputMask from "react-input-mask";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  carBrands,
  cmDmOptions,
  countries,
  fuelType,
  vehicleModels,
  vehicleName,
  vehicleTypes,
} from "../../constant";
import {
  useGetSingleJobCardQuery,
  useUpdateJobCardMutation,
} from "../../redux/api/jobCard";
import TrustAutoAddress from "../../components/TrustAutoAddress/TrustAutoAddress";
import Loading from "../../components/Loading/Loading";
import { usePermissions } from "../../context/PermissionContext";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import Can from "../../components/Can";

const UpdateJobCard = () => {
  const [inputValue, setInputValue] = useState("");
  const { performActionWithPermission } = usePermissions();
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [driverCountryCode, setDriverCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
  const [customerOwnerCountryCode, setCustomerOwnerCountryCode] = useState(
    countries[0]
  );
  const [companyOwnerCountryCode, setCompanyOwnerCountryCode] = useState(
    countries[0]
  );
  const [value, setValue] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const [filteredOptions, setFilteredOptions] = useState([]);
  const [yearSelectInput, setYearSelectInput] = useState("");
  const [technicianDate, setTechnicianDate] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  const [getDataWithChassisNo, setGetDataWithChassisNo] = useState("");
  const [vehicleInterior, setVehicleInterior] = useState("");
  const [reportedDefect, setReportedDefect] = useState("");
  const [reportedAction, setReportedAction] = useState("");
  const [currentMileage, setCurrentMileage] = useState("");
  const [mileageChanged, setMileageChanged] = useState(false);

  const [clickControl, setClickControl] = useState(null);

  const [dateChange, setDateChange] = useState(false);
  const { tenantDomain } = useTenantDomain();

  const formRef = useRef();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue: setVModelValue,
    formState: { errors },
  } = useForm();

  const [updateJobCard, { isLoading: updateJobCardLoading }] =
    useUpdateJobCardMutation();
  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const userTypeFromProfile = new URLSearchParams(location.search).get(
    "user_type"
  );
  const userFromProfile = new URLSearchParams(location.search).get("user");

  const { data, isLoading, refetch } = useGetSingleJobCardQuery({
    tenantDomain,
    id,
  });

  const singleCard = data?.data;

  useEffect(() => {
    if (singleCard?.user_type === "customer") {
      reset({
        company_name: singleCard?.customer?.company_name,
        vehicle_username: singleCard?.customer?.vehicle_username,
        company_address: singleCard?.customer?.company_address,
        customer_name: singleCard?.customer?.customer_name,
        customer_country_code: singleCard?.customer?.customer_country_code,
        customer_contact: phoneNumber || singleCard?.customer?.customer_contact,
        customer_email: singleCard?.customer?.customer_email,
        customer_address: singleCard?.customer?.customer_address,
        driver_name: singleCard?.customer?.driver_name,
        driver_country_code: singleCard?.customer?.driver_country_code,
        driver_contact:
          driverPhoneNumber || singleCard?.customer?.driver_contact,
        reference_name: singleCard?.customer?.reference_name,

        customerOwnerName: singleCard?.customer?.data?.customerOwnerName,
        customerOwnerCountryCode:
          singleCard?.customer?.data?.customerOwnerCountryCode,
        customerOwnerPhone:
          driverPhoneNumber || singleCard?.customer?.data?.customerOwnerPhone,
        chassis_no: getDataWithChassisNo?.chassis_no,
        carReg_no: getDataWithChassisNo?.carReg_no,
        car_registration_no: getDataWithChassisNo?.car_registration_no,
        engine_no: getDataWithChassisNo?.engine_no,
        vehicle_brand: getDataWithChassisNo?.vehicle_brand,
        vehicle_name: getDataWithChassisNo?.vehicle_name,
        vehicle_model: getDataWithChassisNo?.vehicle_model,
        vehicle_category: getDataWithChassisNo?.vehicle_category,
        color_code: getDataWithChassisNo?.color_code,
        mileage: getDataWithChassisNo?.mileage,
        fuel_type: getDataWithChassisNo?.fuel_type,
        vehicle_interior_parts: singleCard?.vehicle_interior_parts,
        reported_defect: singleCard?.reported_defect,
        reported_action: singleCard?.reported_defect,

        vehicle_body_report: singleCard?.vehicle_body_report,
        note: singleCard?.note,
        technician_date: singleCard?.technician_date,
        technician_name: singleCard?.technician_name,
      });
    }
    if (singleCard && singleCard.user_type === "company") {
      reset({
        company_name: singleCard?.company?.company_name,
        vehicle_username: singleCard?.company?.vehicle_username,
        company_address: singleCard?.company?.company_address,
        company_contact: singleCard?.company?.company_contact,
        company_country_code: singleCard?.company?.company_country_code,
        company_email: singleCard?.company?.company_email,
        customer_address: singleCard?.company?.customer_address,

        driver_name: singleCard?.company?.driver_name,
        driver_country_code: singleCard?.company?.driver_country_code,
        driver_contact:
          driverPhoneNumber || singleCard?.company?.driver_contact,
        reference_name: singleCard?.company?.reference_name,

        companyOwnerName: singleCard?.company?.companyOwnerName,
        companyOwnerCountryCode: singleCard?.company?.companyOwnerCountryCode,
        companyOwnerPhone:
          driverPhoneNumber || singleCard?.company?.companyOwnerPhone,

        chassis_no: getDataWithChassisNo?.chassis_no,
        carReg_no: getDataWithChassisNo?.carReg_no,
        car_registration_no: getDataWithChassisNo?.car_registration_no,
        engine_no: getDataWithChassisNo?.engine_no,
        vehicle_brand: getDataWithChassisNo?.vehicle_brand,
        vehicle_name: getDataWithChassisNo?.vehicle_name,
        vehicle_model: getDataWithChassisNo?.vehicle_model,
        vehicle_category: getDataWithChassisNo?.vehicle_category,
        color_code: getDataWithChassisNo?.color_code,
        mileage: getDataWithChassisNo?.mileage,
        fuel_type: getDataWithChassisNo?.fuel_type,

        vehicle_interior_parts: singleCard?.vehicle_interior_parts,
        reported_defect: singleCard?.reported_defect,
        reported_action: singleCard?.reported_defect,

        vehicle_body_report: singleCard?.vehicle_body_report,
        note: singleCard?.note,
        technician_date: singleCard?.technician_date,
        technician_name: singleCard?.technician_name,
      });
    }
    if (singleCard && singleCard.user_type === "showRoom") {
      reset({
        showRoom_name: singleCard?.showRoom?.showRoom_name,
        vehicle_username: singleCard?.showRoom?.vehicle_username,
        showRoom_address: singleCard?.showRoom?.showRoom_address,
        company_name: singleCard?.showRoom?.company_name,
        company_contact: phoneNumber || singleCard?.showRoom?.company_contact,
        company_country_code: singleCard?.showRoom?.company_country_code,
        company_email: singleCard?.showRoom?.company_email,
        company_address: singleCard?.showRoom?.company_address,
        driver_name: singleCard?.showRoom?.driver_name,
        driver_country_code: singleCard?.showRoom?.driver_country_code,
        driver_contact:
          driverPhoneNumber || singleCard?.showRoom?.driver_contact,
        reference_name: singleCard?.showRoom?.reference_name,

        chassis_no: getDataWithChassisNo?.chassis_no,
        carReg_no: getDataWithChassisNo?.carReg_no,
        car_registration_no: getDataWithChassisNo?.car_registration_no,
        engine_no: getDataWithChassisNo?.engine_no,
        vehicle_brand: getDataWithChassisNo?.vehicle_brand,
        vehicle_name: getDataWithChassisNo?.vehicle_name,
        vehicle_model: getDataWithChassisNo?.vehicle_model,
        vehicle_category: getDataWithChassisNo?.vehicle_category,
        color_code: getDataWithChassisNo?.color_code,
        mileage: getDataWithChassisNo?.mileage,
        fuel_type: getDataWithChassisNo?.fuel_type,
        vehicle_interior_parts: singleCard?.vehicle_interior_parts,
        reported_defect: singleCard?.reported_defect,
        reported_action: singleCard?.reported_defect,

        vehicle_body_report: singleCard?.vehicle_body_report,
        note: singleCard?.note,
        technician_date: singleCard?.technician_date,
        technician_name: singleCard?.technician_name,
      });
    }
  }, [
    driverPhoneNumber,
    getDataWithChassisNo?.carReg_no,
    getDataWithChassisNo?.car_registration_no,
    getDataWithChassisNo?.chassis_no,
    getDataWithChassisNo?.color_code,
    getDataWithChassisNo?.engine_no,
    getDataWithChassisNo?.fuel_type,
    getDataWithChassisNo?.mileage,
    getDataWithChassisNo?.vehicle_brand,
    getDataWithChassisNo?.vehicle_category,
    getDataWithChassisNo?.vehicle_model,
    getDataWithChassisNo?.vehicle_name,
    phoneNumber,
    reset,
    singleCard,
  ]);

  const extractTextFromHTML = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  useEffect(() => {
    if (singleCard && singleCard.vehicle_interior_parts) {
      const extractedText = extractTextFromHTML(
        singleCard.vehicle_interior_parts
      );
      setVehicleInterior(extractedText);
    }
    if (singleCard && singleCard.reported_defect) {
      const extractedText = extractTextFromHTML(singleCard.reported_defect);
      setReportedDefect(extractedText);
    }
    if (singleCard && singleCard.reported_action) {
      const extractedText = extractTextFromHTML(singleCard.reported_action);
      setReportedAction(extractedText);
    }
  }, [singleCard]);

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
  const handleDriverPhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber.length <= 10 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber.length > 1)
    ) {
      setDriverPhoneNumber(newPhoneNumber);
    }
  };
  const handleOwnerPhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber.length <= 10 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber.length > 1)
    ) {
      setOwnerPhoneNumber(newPhoneNumber);
    }
  };

  // Replace the onSubmit function with this improved version that properly handles mileage history
  const onSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/update-jobcard",
      "edit",
      async () => {
        const toastId = toast.loading("Updating Jobcard...");
        const customer = {
          company_name: data.company_name,
          vehicle_username: data.vehicle_username,
          company_address: data.company_address,
          customer_name: data.customer_name,
          customer_contact: data.customer_contact,
          customer_country_code: countryCode.code,
          customer_email: data.customer_email,
          customer_address: data.customer_address,
          driver_name: data.driver_name,
          driver_contact: data.driver_contact,
          driver_country_code: driverCountryCode.code,
          reference_name: data.reference_name,
        };
        const company = {
          company_name: data.company_name,
          vehicle_username: data.vehicle_username,
          company_address: data.company_address,
          company_contact: data.company_contact,
          company_country_code: countryCode.code,
          company_email: data.company_email,
          customer_address: data.customer_address,
          driver_name: data.driver_name,
          driver_contact: data.driver_contact,
          driver_country_code: driverCountryCode.code,
          reference_name: data.reference_name,
        };
        const showroom = {
          showRoom_name: data.showRoom_name,
          vehicle_username: data.vehicle_username,
          showRoom_address: data.showRoom_address,
          company_name: data.company_name,
          company_contact: data.company_contact,
          company_country_code: countryCode.code,
          company_email: data.company_email,
          company_address: data.company_address,
          driver_name: data.driver_name,
          driver_contact: data.driver_contact,
          driver_country_code: driverCountryCode.code,
          reference_name: data.reference_name,
        };
        data.vehicle_model = Number(data.vehicle_model);
        data.mileage = Number(data.mileage);
        // Get existing mileage history
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
        // Extract vehicle information - use the existing mileage history without modification
        const vehicle = {
          carReg_no: data.carReg_no,
          car_registration_no: data.car_registration_no,
          chassis_no: data.chassis_no,
          engine_no: data.engine_no,
          vehicle_brand: data.vehicle_brand,
          vehicle_name: data.vehicle_name,
          vehicle_model: data.vehicle_model,
          vehicle_category: data.vehicle_category,
          color_code: data.color_code,
          fuel_type: data.fuel_type,
          mileageHistory: updatedMileageHistory,
        };
        const jobCard = {
          Id: singleCard.Id,
          job_no: singleCard.job_no,
          user_type: singleCard.user_type,
          date: formattedDate,
          vehicle_interior_parts: data.vehicle_interior_parts,
          reported_defect: data.reported_defect,
          reported_action: data.reported_action,
          note: data.note,
          vehicle_body_report: data.vehicle_body_report,
          technician_name: data.technician_name,
          technician_signature: data.technician_signature,
          technician_date: data.technician_date,
          vehicle_owner: data.vehicle_owner,
          mileage: data.mileage,
        };
        const newCard = {
          tenantDomain: tenantDomain,
          customer,
          company,
          showroom,
          vehicle,
          jobCard,
        };
        const newData = {
          tenantDomain: tenantDomain,
          id,
          data: newCard,
        };

        try {
          const res = await updateJobCard(newData).unwrap();

          if (res.success) {
            toast.success(res.message);
            if (clickControl === "preview") {
              navigate(`/dashboard/preview?id=${res?.data?._id}`);
            }
            if (clickControl === "quotation") {
              navigate(
                `/dashboard/create-quotation?order_no=${res?.data?.job_no}`
              );
            }
            if (clickControl === "invoice") {
              navigate(
                `/dashboard/create-invoice?order_no=${res?.data?.job_no}`
              );
            }
            if (clickControl === null && !userTypeFromProfile) {
              navigate("/dashboard/jobcard-list");
            }
            if (clickControl === null && userTypeFromProfile === "company") {
              navigate(`/dashboard/company-profile?id=${userFromProfile}`);
            }
            if (clickControl === null && userTypeFromProfile === "customer") {
              navigate(`/dashboard/customer-profile?id=${userFromProfile}`);
            }
            if (clickControl === null && userTypeFromProfile === "showRoom") {
              navigate(`/dashboard/show-room-profile?id=${userFromProfile}`);
            }
            refetch();
          }
        } catch (err) {
          toast.error(err || "Something went wrong!");
        } finally {
          toast.dismiss(toastId);
        }
      },
      "You don't have permission to edit job card"
    );
  };

  const sortedVehicleName = vehicleName.sort((a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  });

  const handleBrandChange = (_, newValue) => {
    setSelectedBrand(newValue);
    const filtered = sortedVehicleName.filter(
      (vehicle) => vehicle.label === newValue
    );
    setFilteredVehicles(filtered);
  };

  // Handle input changes
  const handleYearSelectInput = (event) => {
    const value = event.target.value;

    // Check if the input is a number and does not exceed 4 digits
    if (/^\d{0,4}$/.test(value)) {
      setYearSelectInput(value);
      const filtered = vehicleModels.filter((option) =>
        option.label.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };

  const handleOptionClick = (option) => {
    setYearSelectInput(option.label);
    setFilteredOptions([]);
    setVModelValue("vehicle_model", option.label);
  };

  const handleDateChange = (event) => {
    const rawDate = event.target.value;
    const parsedDate = new Date(rawDate);
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setFormattedDate(formattedDate);
  };

  useEffect(() => {
    const parsedDate = new Date();
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    const currentDate = `${day}-${month}-${year}`;
    setFormattedDate(currentDate);
  }, []);

  useEffect(() => {
    setGetDataWithChassisNo(singleCard?.vehicle);
  }, [singleCard?.vehicle]);

  const currentDate = new Date().toISOString().split("T")[0];
  const handleChassisChange = (_, newValue) => {
    const filtered = singleCard?.data?.vehicles?.find(
      (vehicle) => vehicle.chassis_no === newValue
    );
    setGetDataWithChassisNo(filtered);
  };

  // last update mileage show
  useEffect(() => {
    const lastMileage =
      getDataWithChassisNo?.mileageHistory?.length > 0
        ? getDataWithChassisNo.mileageHistory[
            getDataWithChassisNo.mileageHistory.length - 1
          ].mileage
        : singleCard?.mileage || "";

    setCurrentMileage(lastMileage);
  }, [getDataWithChassisNo, singleCard]);

  const getLatestMileage = () => {
    if (getDataWithChassisNo?.mileageHistory?.length > 0) {
      const last =
        getDataWithChassisNo.mileageHistory[
          getDataWithChassisNo.mileageHistory.length - 1
        ];
      return last.mileage;
    }
    return getDataWithChassisNo?.mileage || 0;
  };
  useEffect(() => {
    setCurrentMileage(getLatestMileage());
  }, [getDataWithChassisNo]);

  useEffect(() => {
    if (getDataWithChassisNo?.vehicle_model) {
      setYearSelectInput(getDataWithChassisNo.vehicle_model.toString());
      setVModelValue("vehicle_model", getDataWithChassisNo.vehicle_model);
    } else {
      setYearSelectInput("");
    }
  }, [getDataWithChassisNo?.vehicle_model, setVModelValue]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-xl">
        <Loading />
      </div>
    );
  }

  return (
    <div className="addJobCardWraps my-10  ">
      <div className=" mb-5 pb-5 mx-auto text-center border-b-2 border-[#42A1DA]">
        <div className=" addJobCardHeads">
          <img
            src={CompanyInfoData?.data?.logo || "/placeholder.svg"}
            alt="logo"
            className=" addJobLogoImg"
          />
          <div>
            <div className="flex-1 text-center">
              <h2 className="trustAutoTitle">
                {CompanyInfoData?.data?.companyNameBN}
              </h2>
              <h3 className="text-lg md:text-xl english-font mt-1 text-[#4671A1] font-bold">
                ({CompanyInfoData?.data?.companyName})
              </h3>
            </div>

            <span className="text-[12px] lg:text-xl mt-5 block">
              Office: {CompanyInfoData?.data?.address}
            </span>
          </div>
          <TrustAutoAddress />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <div>
          <div className=" flex lg:flex-row flex-col items-center justify-between my-5 lg:text-left text-center ">
            <div>
              <div>
                <b>
                  Job No: <span className="requiredStart">*</span>
                </b>
                <span> {singleCard?.job_no}</span>
              </div>
              <div className="py-1">
                <b>User type: </b>
                {singleCard?.user_type}
              </div>

              <div>
                <b>User Id: </b>
                {singleCard?.Id}
              </div>
            </div>
            <div>
              <div className="vehicleCard">Vehicle Job Card </div>
            </div>
            <div>
              <div>
                <div className="cursor-pointer">
                  <b>
                    Date <span className="requiredStart">*</span>
                  </b>

                  {dateChange ? (
                    <input
                      className="outline-none curs"
                      onChange={handleDateChange}
                      autoComplete="off"
                      type="date"
                      placeholder="Date"
                      max={currentDate}
                      defaultValue={currentDate}
                    />
                  ) : (
                    <p
                      onClick={() => setDateChange(!dateChange)}
                      className="border border-gray-600 rounded-md px-4 py-2"
                    >
                      {singleCard?.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Box>
              {singleCard?.user_type &&
                (singleCard?.user_type === "customer" ? (
                  <Box>
                    <h3 className="mb-5 text-xl font-bold ">
                      Customer Information
                    </h3>
                    <Grid container spacing={2}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Customer Name (T)"
                          {...register("customer_name")}
                          focused={singleCard?.customer?.customer_name || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Customer Email Address (T)"
                          {...register("customer_email")}
                          type="email"
                          focused={singleCard?.customer?.customer_email || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Customer Address (T) "
                          {...register("customer_address")}
                          focused={singleCard?.customer?.customer_address || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          {...register("company_name")}
                          label="Company Name (T)"
                          focused={singleCard?.customer?.company_name || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Address (T)"
                          {...register("company_address")}
                          focused={singleCard?.customer?.company_address || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Vehicle User Name (T)"
                          {...register("vehicle_username")}
                          focused={singleCard?.customer?.vehicle_username || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid container spacing={1}>
                          <Grid item lg={2} md={6} sm={3} xs={12}>
                            <Autocomplete
                              sx={{ marginRight: "2px" }}
                              fullWidth
                              freeSolo
                              options={countries}
                              getOptionLabel={(option) => option.label}
                              value={
                                countryCode ||
                                singleCard?.customer?.customer_country_code
                              }
                              onChange={(event, newValue) => {
                                setCountryCode(newValue);
                                setPhoneNumber("");
                              }}
                              renderInput={(params) => (
                                <TextField
                                  fullWidth
                                  {...params}
                                  label="Select Country Code"
                                  variant="outlined"
                                  {...register("customer_country_code")}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item lg={10} md={6} sm={9} xs={12}>
                            <TextField
                              {...register("customer_contact")}
                              fullWidth
                              label=""
                              variant="outlined"
                              type="tel"
                              value={
                                phoneNumber
                                  ? phoneNumber
                                  : singleCard?.customer?.customer_contact
                              }
                              onChange={handlePhoneNumberChange}
                              placeholder="Customer Contact No (N)"
                              focused={
                                singleCard?.customer?.customer_contact || ""
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Customer Owner Name (T)"
                          {...register("customerOwnerName")}
                          focused={
                            singleCard?.customer?.customerOwnerName || ""
                          }
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div className="flex items-center">
                          <Autocomplete
                            fullWidth
                            freeSolo
                            options={countries}
                            getOptionLabel={(option) => option.label}
                            value={
                              customerOwnerCountryCode ||
                              singleCard?.customer?.customerOwnerCountryCode
                            }
                            onChange={(event, newValue) => {
                              setCustomerOwnerCountryCode(newValue);
                              setOwnerPhoneNumber("");
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                {...register("customerOwnerCountryCode")}
                                label="Select Country Code"
                                variant="outlined"
                              />
                            )}
                          />
                          <TextField
                            {...register("customerOwnerPhone")}
                            label=""
                            variant="outlined"
                            fullWidth
                            type="tel"
                            value={
                              ownerPhoneNumber
                                ? ownerPhoneNumber
                                : singleCard?.customer?.customerOwnerPhone
                            }
                            onChange={handleOwnerPhoneNumberChange}
                            placeholder="Customer Owner Phone Number "
                            focused={
                              singleCard?.customer?.customerOwnerPhone || ""
                            }
                          />
                        </div>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Reference Name (T) "
                          {...register("reference_name")}
                          focused={singleCard?.customer?.reference_name || ""}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ) : singleCard?.user_type === "company" ? (
                  <Box>
                    <h3 className="mb-5 text-xl font-bold ">
                      Company Information{" "}
                    </h3>
                    <Grid container spacing={2}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          {...register("company_name")}
                          label="Company Name (T)"
                          focused={singleCard?.company?.company_name || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Vehicle User Name (T)"
                          {...register("vehicle_username")}
                          focused={singleCard?.company?.vehicle_username || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Address (T)"
                          {...register("company_address")}
                          focused={singleCard?.company?.company_address || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid container spacing={1}>
                          <Grid item lg={2} md={6} sm={3} xs={12}>
                            <Autocomplete
                              sx={{ marginRight: "2px" }}
                              fullWidth
                              freeSolo
                              options={countries}
                              getOptionLabel={(option) => option.label}
                              value={
                                countryCode ||
                                singleCard?.company?.company_country_code
                              }
                              onChange={(event, newValue) => {
                                setCountryCode(newValue);
                                setPhoneNumber("");
                              }}
                              renderInput={(params) => (
                                <TextField
                                  fullWidth
                                  {...params}
                                  {...register("company_country_code")}
                                  label="Select Country Code"
                                  variant="outlined"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item lg={10} md={6} sm={9} xs={12}>
                            <TextField
                              {...register("company_contact")}
                              fullWidth
                              label=""
                              variant="outlined"
                              type="tel"
                              value={
                                phoneNumber
                                  ? phoneNumber
                                  : singleCard?.company?.company_contact
                              }
                              onChange={handlePhoneNumberChange}
                              placeholder="Company Contact No"
                              focused={
                                singleCard?.company?.company_contact || ""
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Email Address"
                          {...register("company_email")}
                          type="email"
                          focused={singleCard?.company?.company_email || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Owner Name (T)"
                          {...register("companyOwnerName")}
                          focused={singleCard?.customer?.companyOwnerName || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div className="flex items-center">
                          <Autocomplete
                            sx={{ marginRight: "2px" }}
                            fullWidth
                            freeSolo
                            options={countries}
                            getOptionLabel={(option) => option.label}
                            value={
                              companyOwnerCountryCode ||
                              singleCard?.customer?.companyOwnerCountryCode
                            }
                            onChange={(event, newValue) => {
                              setCompanyOwnerCountryCode(newValue);
                              setOwnerPhoneNumber("");
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                {...register("companyOwnerCountryCode")}
                                label="Select Country Code"
                                variant="outlined"
                              />
                            )}
                          />
                          <TextField
                            {...register("companyOwnerPhone")}
                            label=""
                            variant="outlined"
                            fullWidth
                            type="tel"
                            value={
                              ownerPhoneNumber
                                ? ownerPhoneNumber
                                : singleCard?.customer?.companyOwnerPhone
                            }
                            onChange={handleOwnerPhoneNumberChange}
                            placeholder="Company Owner Phone Number "
                            focused={
                              singleCard?.customer?.companyOwnerPhone || ""
                            }
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </Box>
                ) : singleCard?.user_type === "showRoom" ? (
                  <Box>
                    <h3 className="mb-5 text-xl font-bold ">
                      Show Room Information{" "}
                    </h3>
                    <Grid container spacing={2}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          on
                          label="Show Room Name (T)"
                          {...register("showRoom_name")}
                          focused={singleCard?.showRoom?.showRoom_name || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Vehicle User Name (T)  "
                          {...register("vehicle_username")}
                          focused={singleCard?.showRoom?.vehicle_username || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          on
                          label="Show Room Address (T)  "
                          {...register("showRoom_address")}
                          focused={singleCard?.showRoom?.showRoom_address || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          {...register("company_name")}
                          label="Company Name (T)"
                          focused={singleCard?.showRoom?.company_name || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Address (T)"
                          {...register("company_address")}
                          focused={singleCard?.showRoom?.company_address || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid container spacing={1}>
                          <Grid item lg={2} md={6} sm={3} xs={12}>
                            <Autocomplete
                              fullWidth
                              freeSolo
                              options={countries}
                              getOptionLabel={(option) => option.label}
                              value={
                                countryCode ||
                                singleCard?.showRoom?.company_country_code
                              }
                              onChange={(event, newValue) => {
                                setCountryCode(newValue);
                                setPhoneNumber("");
                              }}
                              renderInput={(params) => (
                                <TextField
                                  fullWidth
                                  {...params}
                                  {...register("company_country_code")}
                                  label="Select Country Code"
                                  variant="outlined"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item lg={10} md={6} sm={9} xs={12}>
                            <TextField
                              {...register("company_contact")}
                              fullWidth
                              label="Company Contact No (N) (new field) "
                              variant="outlined"
                              type="tel"
                              value={
                                phoneNumber ||
                                singleCard?.showRoom?.company_contact
                              }
                              onChange={handlePhoneNumberChange}
                              placeholder="Enter phone number"
                              focused={
                                singleCard?.showRoom?.company_contact || ""
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Email Address"
                          {...register("company_email")}
                          type="email"
                          focused={singleCard?.showRoom?.company_email || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Reference Name (T) "
                          {...register("reference_name")}
                          focused={singleCard?.company?.reference_name || ""}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ) : null)}
            </Box>
            <Box>
              <h3 className="mb-5 text-xl font-bold">Vehicle Information </h3>
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div>
                    <TextField
                      onChange={handleChassisChange}
                      fullWidth
                      {...register("chassis_no")}
                      label="Chassis no"
                      focused={getDataWithChassisNo?.chassis_no || ""}
                    />
                  </div>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item lg={2} md={6} sm={3} xs={12}>
                      <Autocomplete
                        sx={{ marginRight: "5px" }}
                        freeSolo
                        fullWidth
                        id="free-solo-demo"
                        value={getDataWithChassisNo?.carReg_no || ""}
                        inputValue={inputValue}
                        onInputChange={(event, newValue) =>
                          setInputValue(newValue)
                        }
                        options={cmDmOptions.map((option) => option?.label)}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label="Vehicle Reg No"
                            {...register("carReg_no")}
                            focused={getDataWithChassisNo?.carReg_no || ""}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item lg={10} md={6} sm={9} xs={12}>
                      <InputMask
                        mask="**-****"
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
                    {...register("engine_no")}
                    label="ENGINE NO & CC (T&N) "
                    focused={getDataWithChassisNo?.engine_no || ""}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Autocomplete
                    fullWidth
                    freeSolo
                    value={getDataWithChassisNo?.vehicle_brand || ""}
                    onInputChange={(event, newValue) => {}}
                    onChange={handleBrandChange}
                    options={carBrands.map((option) => option.label)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Vehicle Brand"
                        {...register("vehicle_brand")}
                        focused={getDataWithChassisNo?.vehicle_brand}
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Autocomplete
                    fullWidth
                    freeSolo
                    Vehicle
                    value={getDataWithChassisNo?.vehicle_name || ""}
                    Name
                    options={filteredVehicles.map((option) => option.value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Vehicle Name "
                        {...register("vehicle_name")}
                        focused={getDataWithChassisNo?.vehicle_name || ""}
                      />
                    )}
                    getOptionLabel={(option) => option || ""}
                  />
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div className="mt-3 relative">
                    <input
                      onInput={handleYearSelectInput}
                      {...register("vehicle_model")}
                      type="text"
                      className="border border-[#11111163] mb-5 w-[100%] h-14 p-3 rounded-md"
                      placeholder="Vehicle Model"
                      value={yearSelectInput}
                    />
                    {yearSelectInput && (
                      <ul className="options-list">
                        {filteredOptions.map((option, index) => (
                          <li
                            key={index}
                            onClick={() => handleOptionClick(option)}
                          >
                            {option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Autocomplete
                    fullWidth
                    id="free-solo-demo"
                    Vehicle
                    Types
                    freeSolo
                    value={getDataWithChassisNo?.vehicle_category || ""}
                    options={vehicleTypes.map((option) => option.label)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        label=" Vehicle Categories "
                        {...register("vehicle_category")}
                        focused={getDataWithChassisNo?.vehicle_category || ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    {...register("color_code")}
                    label="Color & Code (T&N) "
                    focused={getDataWithChassisNo?.color_code || ""}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Current Mileage (KM)"
                    {...register("mileage", {
                      required: "Mileage is required!",
                    })}
                    type="number"
                    value={currentMileage}
                    onChange={(e) => {
                      const newMileage =
                        e.target.value === "" ? "" : Number(e.target.value);
                      setCurrentMileage(newMileage);
                      setValue("mileage", newMileage);

                      const lastMileage =
                        getDataWithChassisNo?.mileageHistory?.slice(-1)[0]
                          ?.mileage;

                      if (lastMileage && newMileage !== lastMileage) {
                        setMileageChanged(true);
                      } else if (!lastMileage && newMileage) {
                        setMileageChanged(true);
                      } else {
                        setMileageChanged(false);
                      }
                    }}
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
                                // Remove the specific entry from mileage history
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
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Autocomplete
                    fullWidth
                    id="free-solo-demo"
                    Fuel
                    Type
                    freeSolo
                    value={getDataWithChassisNo?.fuel_type || ""}
                    options={fuelType.map((option) => option.label)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        label=" Fuel Type"
                        {...register("fuel_type")}
                        focused={getDataWithChassisNo?.fuel_type || ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Driver Name (T)"
                    {...register("driver_name")}
                    focused={singleCard?.customer?.driver_name || ""}
                  />
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item lg={2} md={6} sm={3} xs={12}>
                      <Autocomplete
                        sx={{ marginRight: "2px" }}
                        fullWidth
                        freeSolo
                        options={countries}
                        getOptionLabel={(option) => option.label}
                        value={
                          driverCountryCode ||
                          singleCard?.customer?.driver_country_code
                        }
                        onChange={(event, newValue) => {
                          setDriverCountryCode(newValue);
                          setPhoneNumber("");
                        }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label="Select Country Code"
                            {...register("driver_country_code")}
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item lg={10} md={6} sm={9} xs={12}>
                      <TextField
                        {...register("driver_contact")}
                        fullWidth
                        label=""
                        variant="outlined"
                        type="tel"
                        value={
                          driverPhoneNumber
                            ? driverPhoneNumber
                            : singleCard?.customer?.driver_contact
                        }
                        onChange={handleDriverPhoneNumberChange}
                        placeholder="Driver Contact Number "
                        focused={singleCard?.customer?.driver_contact || ""}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </div>
          <div className="mt-10 vehicleReport">
            <div className="vehicleReportLeftSide">
              <div className=" vehicleTextField">
                <b className="block mb-3">
                  {" "}
                  Vehicle Interior Parts, Papers, Tools, Meter Light & Others{" "}
                </b>

                <textarea
                  {...register("vehicle_interior_parts")}
                  className="textEditor"
                ></textarea>
              </div>
              <div className="mt-5">
                <b className="block mb-1"> Reported Defect </b>

                <textarea
                  {...register("reported_defect")}
                  className="textEditor"
                ></textarea>
              </div>
              <div className="mt-5">
                <b className="block mb-1"> Reported Action </b>
                <textarea
                  {...register("reported_action")}
                  className="textEditor"
                ></textarea>
              </div>
            </div>
            <div className="vehicleReportRightSide">
              <b htmlFor="" className="block mb-3">
                {" "}
                Vehicle Body Report (Mark with X where damage )
              </b>
              <div className="mt-2 imgWrap">
                <img src={car || "/placeholder.svg"} alt="car" />
              </div>
              <div className="mt-3">
                <b className="block mb-1 "> Note </b>
                <textarea autoComplete="off" {...register("note")}></textarea>
              </div>
              <div className="mt-3">
                <b className="block mb-1 "> Vehicle Body Report Comments</b>
                <textarea
                  autoComplete="off"
                  className="p-5"
                  {...register("vehicle_body_report")}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 items-center justify-between mt-5 mb-10">
            <div>
              <TextField
                className="ownerInput"
                {...register("technician_name")}
                label="Technician Name (T) "
                focused={singleCard?.technician_name || ""}
              />
              <br />
            </div>
            <div>
              <TextField
                disabled
                className="ownerInput"
                {...register("technician_signature")}
                label="Technician Signature (T) "
              />
            </div>
            <div className=" cursor-pointer mb-3 md:mb-0 ">
              <input
                {...register("technician_date")}
                className="border h-14 w-[250px] px-3 rounded-sm"
                type="date"
                defaultValue={singleCard?.technician_date}
              />
            </div>
            <div>
              <TextField
                disabled
                className="ownerInput"
                {...register("vehicle_owner")}
                label="Vehicle Owner (T) "
              />
            </div>
          </div>

          <div className="mt-3">
            <b>This is not an invoice, all estimates are valid for 30 days </b>
          </div>

          <div className="mt-12">
            <Can page="/dashboard/update-jobcard" action="edit">
              <button
                disabled={updateJobCardLoading}
                type="submit"
                className="addJobBtn"
              >
                Update Job Card
              </button>
            </Can>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateJobCard;
