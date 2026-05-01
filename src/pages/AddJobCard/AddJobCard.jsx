/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */

import "./AddJobCard.css";
import car from "../../../public/assets/car2.jpeg";
import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
// import "react-quill/dist/quill.snow.css";
import InputMask from "react-input-mask";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { HiOutlineChevronDown, HiOutlinePlus } from "react-icons/hi";
import {
  carBrands,
  cmDmOptions,
  countries,
  fuelType,
  vehicleModels,
  vehicleName,
  vehicleTypes,
} from "../../constant";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { usePermissions } from "../../context/PermissionContext";
import TrustAutoAddress from "../../components/TrustAutoAddress/TrustAutoAddress";

import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import Loading from "../../components/Loading/Loading";
import Can from "../../components/Can";
import {
  useCreateJobCardMutation,
  useGetAllJobCardsQuery,
  useGetUserDetailsForJobCardQuery,
} from "../../redux/api/jobCard";
import { useGetAllShowRoomsQuery } from "../../redux/api/showRoomApi";
import { useGetAllCompaniesQuery } from "../../redux/api/companyApi";
import { useGetAllCustomersQuery } from "../../redux/api/customerApi";
import JobCardTable from "./JobCardTable";

const AddJobCard = () => {
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();

  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const user = new URLSearchParams(location.search).get("user_type");

  const [currentPage, setCurrentPage] = useState(1);

  const [idType, setIdType] = useState(null);
  const [showId, setShowId] = useState([]);
  const [userId, setUserId] = useState(id);
  const [newId, setNewId] = useState(user ? user : "customer");

  const [inputValue, setInputValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");

  const [countryCode, setCountryCode] = useState(countries[0]);
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
  const [driverCountryCode, setDriverCountryCode] = useState(countries[0]);
  const [customerOwnerCountryCode, setCustomerOwnerCountryCode] = useState(
    countries[0]
  );
  const [companyOwnerCountryCode, setCompanyOwnerCountryCode] = useState(
    countries[0]
  );
  const [clickControl, setClickControl] = useState(null);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const [filteredOptions, setFilteredOptions] = useState([]);
  const [yearSelectInput, setYearSelectInput] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentMileage, setCurrentMileage] = useState("");
  const [mileageChanged, setMileageChanged] = useState(false);

  const [getDataWithChassisNo, setGetDataWithChassisNo] = useState("");

  const formRef = useRef();
  const navigate = useNavigate();
  const limit = 10;
  const jobCardLimit = 500000;
  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue: setVModelValue,
    formState: { errors },
  } = useForm();

  const [
    createJobCard,
    { isLoading: createJobCardLoading, error: jobCardCreateError },
  ] = useCreateJobCardMutation();

  const { data: customerData, isLoading: customerLoading } =
    useGetAllCustomersQuery({
      tenantDomain: tenantDomain,
      limit: jobCardLimit,
      page: currentPage,
    });

  const { data: companyData, isLoading: companyLoading } =
    useGetAllCompaniesQuery({
      tenantDomain: tenantDomain,
      limit: jobCardLimit,
      page: currentPage,
    });
  const { data: showroomData, isLoading: showroomLoading } =
    useGetAllShowRoomsQuery({
      tenantDomain: tenantDomain,
      limit: jobCardLimit,
      page: currentPage,
    });

  const { data: userDetails, isLoading: userDetailsLoading } =
    useGetUserDetailsForJobCardQuery({
      tenantDomain: tenantDomain,
      id: userId,
      userType: newId,
    });

  const { data: allJobCards, isLoading: jobCardLoading } =
    useGetAllJobCardsQuery({
      tenantDomain: tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
    });

  const lastJobCard = allJobCards?.data?.jobCards
    ? [...allJobCards.data.jobCards].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
    : null;

  const jobNumber =
    (Number(lastJobCard?.job_no) && !isNaN(Number(lastJobCard.job_no))
      ? Number(lastJobCard.job_no)
      : 0) + 1;

  const paddedJobNumber = jobNumber?.toString().padStart(4, "0");

  useEffect(() => {
    if (userDetails?.data && newId === "customer") {
      reset({
        company_name: userDetails?.data?.company_name,
        vehicle_username: userDetails?.data?.vehicle_username,
        company_address: userDetails?.data?.company_address,
        customer_name: userDetails?.data?.customer_name,
        customer_country_code: userDetails?.data?.customer_country_code,
        customer_contact: phoneNumber || userDetails?.data?.customer_contact,
        customer_email: userDetails?.data?.customer_email,
        customer_address: userDetails?.data?.customer_address,
        driver_name: userDetails?.data?.driver_name,
        driver_country_code: userDetails?.data?.driver_country_code,
        driver_contact: driverPhoneNumber || userDetails?.data?.driver_contact,
        reference_name: userDetails?.data?.reference_name,
        customerOwnerName: userDetails?.data?.customerOwnerName,
        customerOwnerCountryCode: userDetails?.data?.customerOwnerCountryCode,
        customerOwnerPhone:
          driverPhoneNumber || userDetails?.data?.customerOwnerPhone,
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
      });
    }
    if (userDetails?.data && newId === "company") {
      reset({
        company_name: userDetails?.data?.company_name,
        vehicle_username: userDetails?.data?.vehicle_username,
        company_address: userDetails?.data?.company_address,
        company_contact: userDetails?.data?.company_contact,
        company_country_code: userDetails?.data?.company_country_code,
        company_email: userDetails?.data?.company_email,
        customer_address: userDetails?.data?.customer_address,

        driver_name: userDetails?.data?.driver_name,
        driver_country_code: userDetails?.data?.driver_country_code,
        driver_contact: driverPhoneNumber || userDetails?.data?.driver_contact,

        companyOwnerName: userDetails?.data?.companyOwnerName,
        companyOwnerCountryCode: userDetails?.data?.companyOwnerCountryCode,
        companyOwnerPhone:
          driverPhoneNumber || userDetails?.data?.companyOwnerPhone,
        reference_name: userDetails?.data?.reference_name,
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
      });
    }
    if (userDetails?.data && newId === "showRoom") {
      reset({
        showRoom_name: userDetails?.data?.showRoom_name,
        vehicle_username: userDetails?.data?.vehicle_username,
        showRoom_address: userDetails?.data?.showRoom_address,
        company_name: userDetails?.data?.company_name,
        company_contact: phoneNumber || userDetails?.data?.company_contact,
        company_country_code: userDetails?.data?.company_country_code,
        company_email: userDetails?.data?.company_email,
        company_address: userDetails?.data?.company_address,
        driver_name: userDetails?.data?.driver_name,
        driver_country_code: userDetails?.data?.driver_country_code,
        driver_contact: driverPhoneNumber || userDetails?.data?.driver_contact,
        reference_name: userDetails?.data?.reference_name,

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
      });
    }
  }, [
    customerData,
    reset,
    phoneNumber,
    driverPhoneNumber,
    getDataWithChassisNo?.carReg_no,
    getDataWithChassisNo?.car_registration_no,
    getDataWithChassisNo?.engine_no,
    getDataWithChassisNo?.vehicle_brand,
    getDataWithChassisNo?.vehicle_name,
    getDataWithChassisNo?.vehicle_model,
    getDataWithChassisNo?.vehicle_category,
    getDataWithChassisNo?.color_code,
    getDataWithChassisNo?.mileage,
    getDataWithChassisNo?.fuel_type,
    userDetails?.data,
    newId,
    userId,
  ]);

  useEffect(() => {
    if (!userDetails || !userDetails.data) {
      formRef.current?.reset();
    }
  }, [userDetails]);

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber?.length <= 10 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber?.length > 1)
    ) {
      setPhoneNumber(newPhoneNumber);
    }
  };
  const handleDriverPhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber?.length <= 10 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber?.length > 1)
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

  const onSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/create-job-card",
      "create",
      async () => {
        const toastId = toast.loading("Creating Jobcard...");
        if (!newId) {
          return toast.error("Please add your Id.");
        }

        const customer = {
          company_name: data.company_name,
          vehicle_username: data.vehicle_username,
          company_address: data.company_address,
          customer_name: data.customer_name,
          customer_contact: data.customer_contact,
          customer_country_code: countryCode?.code,
          customer_email: data.customer_email,
          customer_address: data.customer_address,
          driver_name: data.driver_name,
          driver_contact: data.driver_contact,
          driver_country_code: driverCountryCode?.code,
          reference_name: data.reference_name,
          customerOwnerPhone: data.customerOwnerPhone,
          customerOwnerName: data.customerOwnerName,
          customerOwnerCountryCode: customerOwnerCountryCode?.code,
        };

        const company = {
          company_name: data.company_name,
          vehicle_username: data.vehicle_username,
          company_address: data.company_address,
          company_contact: data.company_contact,
          company_country_code: countryCode?.code,
          company_email: data.company_email,
          customer_address: data.customer_address,
          driver_name: data.driver_name,
          driver_contact: data.driver_contact,
          driver_country_code: driverCountryCode?.code,
          reference_name: data.reference_name,
          companyOwnerPhone: data.companyOwnerPhone,
          companyOwnerName: data.companyOwnerName,
          companyOwnerCountryCode: companyOwnerCountryCode?.code,
        };

        const showroom = {
          showRoom_name: data.showRoom_name,
          vehicle_username: data.vehicle_username,
          showRoom_address: data.showRoom_address,
          company_name: data.company_name,
          company_contact: data.company_contact,
          company_country_code: countryCode?.code,
          company_email: data.company_email,
          company_address: data.company_address,
          driver_name: data.driver_name,
          driver_contact: data.driver_contact,
          driver_country_code: driverCountryCode?.code,
          reference_name: data.reference_name,
        };

        data.vehicle_model = Number(data.vehicle_model);
        data.mileage = Number(data.mileage);

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
          mileageHistory: updatedMileageHistory,
          fuel_type: data.fuel_type,
        };

        const jobCard = {
          Id: userId,
          job_no: lastJobCard?.job_no,
          user_type: newId,
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

        try {
          const res = await createJobCard(newCard).unwrap();
          if (res.success) {
            toast.success(res?.message);
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
            if (clickControl === null) {
              navigate("/dashboard/jobcard-list");
            }
          }
        } catch (err) {
          toast.error(err | "Something went wrong!");
        } finally {
          toast.dismiss(toastId);
        }
      },
      "You don't have permission to create job card"
    );
  };

  const sortedVehicleName = vehicleName.sort((a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  });

  const handleBrandChange = (event, newValue) => {
    setSelectedBrand(newValue);

    // Filter and sort the vehicles
    const filtered = sortedVehicleName
      ?.filter((vehicle) =>
        vehicle.label?.toLowerCase().includes(newValue?.toLowerCase())
      )
      .sort((a, b) => a.label.localeCompare(b.label));

    setFilteredVehicles(filtered);
  };
  // Handle input changes
  const handleYearSelectInput = (event) => {
    const value = event.target.value;

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

  // get id
  const getIdWithIdType = (userType) => {
    setIdType(userType);
    setNewId(userType);

    switch (userType) {
      case "customer":
        setShowId(
          customerData?.data?.customers?.map((option) => option.customerId)
        );

        break;
      case "company":
        setShowId(
          companyData?.data?.companies?.map((option) => option.companyId)
        );

        break;
      case "showRoom":
        setShowId(
          showroomData?.data?.showrooms?.map((option) => option.showRoomId)
        );
        break;
      default:
        toast.error("Invalid id type");
    }
  };

  useEffect(() => {
    const parsedDate = new Date();
    const day = parsedDate.getDate()?.toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1)?.toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    const currentDate = `${day}-${month}-${year}`;
    setFormattedDate(currentDate);
  }, []);

  const handleIdChange = (_, newValue) => {
    setUserId(newValue);
  };

  const handleChassisChange = (_, newValue) => {
    if (userDetails?.data?.vehicles) {
      const filtered = userDetails?.data?.vehicles?.find(
        (vehicle) => vehicle.chassis_no === newValue
      );
      setGetDataWithChassisNo(filtered);
    }
  };

  useEffect(() => {
    setCurrentMileage("");
    setMileageChanged(false);
  }, [getDataWithChassisNo?.chassis_no]);

  useEffect(() => {
    const defaultMileage =
      getDataWithChassisNo?.mileageHistory?.length > 0
        ? getDataWithChassisNo.mileageHistory[
            getDataWithChassisNo.mileageHistory.length - 1
          ].mileage
        : getDataWithChassisNo?.mileage || "";

    setCurrentMileage(defaultMileage);
  }, [getDataWithChassisNo]);

  const [localMileageEntries, setLocalMileageEntries] = useState([]);

  useEffect(() => {
    setLocalMileageEntries([]);
  }, [getDataWithChassisNo]);

  // vehicle model
  useEffect(() => {
    if (getDataWithChassisNo?.vehicle_model) {
      setYearSelectInput(getDataWithChassisNo.vehicle_model.toString());
      setVModelValue("vehicle_model", getDataWithChassisNo.vehicle_model);
    } else {
      setYearSelectInput("");
    }
  }, [getDataWithChassisNo?.vehicle_model, setVModelValue]);

  if (customerLoading || companyLoading || showroomLoading || jobCardLoading) {
    return (
      <div className="flex items-center justify-center text-xl">
        <Loading />
      </div>
    );
  }

  return (
    <div className="addJobCardWraps">
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
                <span> {paddedJobNumber}</span>
              </div>
              <div>
                <span>
                  {idType === "company" && <b>Company Id :</b>}
                  {idType === "customer" && <b>Customer Id :</b>}
                  {idType === "showRoom" && <b>Show room Id :</b>}
                  {idType === null && <b>Select Id :</b>}

                  {userId ? userId : "....."}
                </span>
              </div>
              <div className="md:flex items-center mt-2">
                <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
                  <InputLabel id="demo-select-small-label">
                    Select Customer
                  </InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    className="py-1"
                    label="Select Customer"
                    onChange={(e) => getIdWithIdType(e.target.value)}
                  >
                    <MenuItem value="company">Company ID </MenuItem>
                    <MenuItem value="customer">Customer ID</MenuItem>
                    <MenuItem value="showRoom">Show Room ID </MenuItem>
                  </Select>
                </FormControl>

                <Autocomplete
                  sx={{ m: 1, minWidth: 170 }}
                  className="w-40 "
                  id="free-solo-demo"
                  options={showId.map((option) => option)}
                  onChange={handleIdChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Id" className="w-40" />
                  )}
                />
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
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    {...register("date", {
                      required: "Date is required!",
                    })}
                  />

                  {errors.technician_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors?.date?.message}
                    </p>
                  )}
                </div>

                <div className="addCustomerRelative">
                  <div className="flex justify-center">
                    <div className="flex items-center w-40 h-10 mt-2 p-2 rounded-sm bg-[#42A1DA] text-white">
                      <p>Add Customer </p>
                      <HiOutlineChevronDown className="ml-1" size={20} />
                    </div>
                  </div>
                  <div className="space-y-2 addCustomerDropDown ">
                    <Link to="/dashboard/add-customer">
                      {" "}
                      <span className="flex items-center">
                        <HiOutlinePlus size={20} /> Add Customer{" "}
                      </span>
                    </Link>
                    <Link to="/dashboard/add-company">
                      {" "}
                      <span className="flex items-center">
                        <HiOutlinePlus size={20} /> Add Company{" "}
                      </span>
                    </Link>

                    <Link to="/dashboard/add-show-room">
                      {" "}
                      <span className="flex items-center">
                        <HiOutlinePlus size={20} /> Add Show Room
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Box>
              {newId &&
                (newId === "customer" ? (
                  <div>
                    <h3 className="mb-5 text-xl font-bold ">
                      Customer Information
                    </h3>

                    <Box>
                      <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            label={
                              <>
                                Customer Name (T)
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "25px",
                                  }}
                                >
                                  {" "}
                                  *
                                </span>
                              </>
                            }
                            {...register("customer_name", {
                              required: "Customer name is requried!",
                            })}
                            focused={userDetails?.data?.customer_name || ""}
                            error={!!errors.customer_name}
                            helperText={errors.customer_name?.message}
                          />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            label="Customer Email Address (T)"
                            {...register("customer_email")}
                            type="email"
                            focused={userDetails?.data?.customer_email || ""}
                          />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            label="Customer Address (T) "
                            {...register("customer_address")}
                            focused={userDetails?.data?.customer_address || ""}
                          />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            {...register("company_name")}
                            label="Company Name (T)"
                            focused={userDetails?.data?.company_name || ""}
                          />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            label="Company Address (T)"
                            {...register("company_address")}
                            focused={userDetails?.data?.company_address || ""}
                          />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            label="Vehicle User Name (T)"
                            {...register("vehicle_username")}
                            focused={userDetails?.data?.vehicle_username || ""}
                          />
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <Grid container spacing={1}>
                            <Grid item lg={2} md={12} sm={12} xs={12}>
                              <Autocomplete
                                sx={{ marginRight: "2px" }}
                                fullWidth
                                freeSolo
                                options={countries}
                                getOptionLabel={(option) => option.label}
                                value={
                                  countryCode ||
                                  userDetails?.data?.customer_country_code
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
                            <Grid item lg={10} md={12} sm={12} xs={12}>
                              <TextField
                                {...register("customer_contact", {
                                  required:
                                    "Customer contact number is required!",
                                })}
                                label={
                                  <>
                                    Customer Contact Number (T)
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "25px",
                                      }}
                                    >
                                      {" "}
                                      *
                                    </span>
                                  </>
                                }
                                variant="outlined"
                                fullWidth
                                type="tel"
                                value={
                                  phoneNumber
                                    ? phoneNumber
                                    : userDetails?.data?.customer_contact
                                }
                                onChange={handlePhoneNumberChange}
                                placeholder="Customer Contact No (N)"
                                focused={
                                  userDetails?.data?.customer_contact || ""
                                }
                                error={!!errors.customer_contact}
                                helperText={errors.customer_contact?.message}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            label="Customer Owner Name (T)"
                            {...register("customerOwnerName")}
                            focused={userDetails?.data?.customerOwnerName || ""}
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
                                driverCountryCode ||
                                userDetails?.data?.customerOwnerCountryCode
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
                                  : userDetails?.data?.customerOwnerPhone
                              }
                              onChange={handleOwnerPhoneNumberChange}
                              placeholder="Customer Owner Phone Number "
                              focused={
                                userDetails?.data?.customerOwnerPhone || ""
                              }
                            />
                          </div>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            label="Reference Name (T) "
                            {...register("reference_name")}
                            focused={userDetails?.data?.reference_name || ""}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </div>
                ) : newId === "company" ? (
                  <Box>
                    <h3 className="mb-5 text-xl font-bold ">
                      Company Information
                    </h3>
                    <Grid container spacing={2}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          {...register("company_name", {
                            required: "Company name is required!",
                          })}
                          label="Company Name (T)"
                          focused={userDetails?.data?.company_name || ""}
                          error={!!errors.company_name}
                          helperText={errors.company_name?.message}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Vehicle User Name (T)"
                          {...register("vehicle_username")}
                          focused={userDetails?.data?.vehicle_username || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Address (T)"
                          {...register("company_address")}
                          focused={userDetails?.data?.company_address || ""}
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
                              countryCode ||
                              userDetails?.data?.company_country_code
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
                          <TextField
                            {...register("company_contact", {
                              required: "Company contact number is requried!",
                            })}
                            label=""
                            variant="outlined"
                            fullWidth
                            type="tel"
                            value={
                              phoneNumber
                                ? phoneNumber
                                : userDetails?.data?.company_contact
                            }
                            onChange={handlePhoneNumberChange}
                            placeholder="Company Contact No"
                            focused={userDetails?.data?.company_contact || ""}
                            error={!!errors.company_contact}
                            helperText={errors.company_contact?.message}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Email Address"
                          {...register("company_email")}
                          type="email"
                          focused={userDetails?.data?.company_email || ""}
                        />
                      </Grid>

                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Owner Name (T)"
                          {...register("companyOwnerName")}
                          focused={userDetails?.data?.companyOwnerName || ""}
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
                              userDetails?.data?.companyOwnerCountryCode
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
                                : userDetails?.data?.companyOwnerPhone
                            }
                            onChange={handleOwnerPhoneNumberChange}
                            placeholder="Company Owner Phone Number "
                            focused={userDetails?.data?.companyOwnerPhone || ""}
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </Box>
                ) : newId === "showRoom" ? (
                  <Box>
                    <h3 className="mb-5 text-xl font-bold ">
                      Show Room Information
                    </h3>
                    <Grid container spacing={2}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Show Room Name (T)"
                          {...register("showRoom_name", {
                            required: "Show room name is required!",
                          })}
                          focused={userDetails?.data?.showRoom_name || ""}
                          error={!!errors.showRoom_name}
                          helperText={errors.showRoom_name?.message}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Vehicle User Name (T)  "
                          {...register("vehicle_username")}
                          focused={userDetails?.data?.vehicle_username || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          on
                          label="Show Room Address (T)  "
                          {...register("showRoom_address")}
                          focused={userDetails?.data?.showRoom_address || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          {...register("company_name")}
                          label="Company Name (T)"
                          focused={userDetails?.data?.company_name || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Address (T)"
                          {...register("company_address")}
                          focused={userDetails?.data?.company_address || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div className="flex items-center my-1">
                          <Autocomplete
                            fullWidth
                            freeSolo
                            options={countries}
                            getOptionLabel={(option) => option.label}
                            value={
                              countryCode ||
                              userDetails?.data?.company_country_code
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
                          <TextField
                            {...register("company_contact")}
                            label="Company Contact No (N) (new field) "
                            variant="outlined"
                            fullWidth
                            type="tel"
                            value={
                              phoneNumber || userDetails?.data?.company_contact
                            }
                            onChange={handlePhoneNumberChange}
                            placeholder="Enter phone number"
                            focused={userDetails?.data?.company_contact || ""}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Email Address"
                          {...register("company_email")}
                          type="email"
                          focused={userDetails?.data?.company_email || ""}
                        />
                      </Grid>

                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Reference Name (T) "
                          {...register("reference_name")}
                          focused={userDetails?.data?.reference_name || ""}
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
                  {userDetails?.data?.vehicles ? (
                    <Autocomplete
                      fullWidth
                      disableClearable
                      freeSolo
                      onChange={handleChassisChange}
                      options={
                        userDetails?.data?.vehicles
                          ? userDetails?.data?.vehicles?.map(
                              (option) => option?.chassis_no
                            )
                          : ""
                      }
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          label={
                            <>
                              Select Chassis no (N)
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                }}
                              >
                                {" "}
                                *
                              </span>
                            </>
                          }
                          {...register("chassis_no", {
                            required: "Chassis no is required!",
                          })}
                          error={!!errors.chassis_no}
                          helperText={errors.chassis_no?.message}
                          inputProps={{
                            ...params.inputProps,
                            maxLength:
                              getDataWithChassisNo?.chassis_no?.length || 30,
                          }}
                        />
                      )}
                    />
                  ) : (
                    <div>
                      <TextField
                        fullWidth
                        {...register("chassis_no", {
                          required: "Chassis number is required!",
                        })}
                        label="Chassis no"
                        focused={getDataWithChassisNo?.chassis_no || ""}
                        error={!!errors.chassis_no}
                        helperText={errors.chassis_no?.message}
                      />
                    </div>
                  )}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item lg={2} md={12} sm={12} xs={12}>
                      <Autocomplete
                        sx={{ marginRight: "5px" }}
                        freeSolo
                        fullWidth
                        value={getDataWithChassisNo?.carReg_no || ""}
                        id="free-solo-demo"
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
                    <Grid item lg={10} md={12} sm={12} xs={12}>
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
                            label={
                              <>
                                Car R (N)
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "25px",
                                  }}
                                >
                                  {" "}
                                  *
                                </span>
                              </>
                            }
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
                    onInputChange={(event, newValue) => {}}
                    onChange={handleBrandChange}
                    value={getDataWithChassisNo?.vehicle_brand || ""}
                    options={carBrands.map((option) => option.label)}
                    // value={selectedBrand}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Vehicle Brand"
                        // focused={getDataWithChassisNo?.vehicle_brand}
                        {...register("vehicle_brand")}
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Autocomplete
                    fullWidth
                    freeSolo
                    onInputChange={(event, newValue) => {}}
                    value={getDataWithChassisNo?.vehicle_name || ""}
                    options={filteredVehicles.map((option) => option.value)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        label="Vehicle Name"
                        {...register("vehicle_name")}
                        // focused={getDataWithChassisNo?.vehicle_name}
                        error={!!errors.vehicle_name}
                        helperText={errors.vehicle_name?.message}
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
                    {...register("mileage", {
                      required: "Mileage is required!",
                    })}
                    label="Current Mileage (KM)"
                    type="number"
                    value={currentMileage}
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
                    label={<>Driver Name (T)</>}
                    {...register("driver_name")}
                    focused={userDetails?.data?.driver_name || ""}
                  />
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid container spacing={1}>
                    <Grid item lg={2} md={12} sm={12} xs={12}>
                      <Autocomplete
                        sx={{ marginRight: "2px" }}
                        fullWidth
                        freeSolo
                        options={countries}
                        getOptionLabel={(option) => option.label}
                        value={
                          driverCountryCode ||
                          userDetails?.data?.driver_country_code
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
                    <Grid item lg={10} md={12} sm={12} xs={12}>
                      <TextField
                        {...register("driver_contact")}
                        label={
                          <>
                            Driver Contact Number (N)
                            {/* <span
                              style={{
                                color: "red",
                                fontSize: "25px",
                              }}
                            >
                              {" "}
                              *
                            </span> */}
                          </>
                        }
                        variant="outlined"
                        fullWidth
                        type="tel"
                        value={
                          driverPhoneNumber
                            ? driverPhoneNumber
                            : userDetails?.data?.driver_contact
                        }
                        onChange={handleDriverPhoneNumberChange}
                        placeholder="Driver Contact Number "
                        focused={userDetails?.data?.driver_contact || ""}
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
                <textarea {...register("note")} autoComplete="off"></textarea>
              </div>
              <div className="mt-3">
                <b className="block mb-1 "> Vehicle Body Report Comments</b>
                <textarea
                  {...register("vehicle_body_report")}
                  label="Technician Name (T) "
                  autoComplete="off"
                  className="p-5"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between mt-5 mb-10">
            <div>
              <TextField
                className="ownerInput"
                {...register("technician_name")}
                label="Technician Name (T) "
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
            <div>
              <input
                className={`border h-14 w-60 px-3 rounded-sm ${
                  errors.technician_date ? "border-red-500" : ""
                }`}
                type="date"
                {...register("technician_date", {
                  required: "Technician date is required!",
                })}
                defaultValue={new Date().toISOString().slice(0, 10)}
                min={new Date().toISOString().split("T")[0]}
              />

              {errors.technician_date && (
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.technician_date?.message}
                </p>
              )}
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

          <div className="mt-5 flex justify-center ">
            <Can page="/dashboard/create-job-card" action="create">
              <Button
                sx={{ color: "#fff", borderRadius: "20px" }}
                disabled={createJobCardLoading}
                type="submit"
              >
                Add To Job Card
              </Button>
            </Can>
          </div>
        </div>
      </form>
      <JobCardTable />
    </div>
  );
};

export default AddJobCard;
