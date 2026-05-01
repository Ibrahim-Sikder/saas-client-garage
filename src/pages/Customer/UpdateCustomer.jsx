/* eslint-disable no-unused-vars */
"use client";

import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { Autocomplete, Box, Button, Chip, Grid } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import {
  carBrands,
  cmDmOptions,
  countries,
  vehicleModels,
  vehicleName,
  vehicleTypes,
} from "../../constant";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetSingleCustomerQuery, useUpdateCustomerMutation } from "../../redux/api/customerApi";
import Loading from "../../components/Loading/Loading";

const UpdateCustomer = () => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [yearSelectInput, setYearSelectInput] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [getDataWithChassisNo, setGetDataWithChassisNo] = useState({});

  const [customerOwnerCountryCode, setCustomerOwnerCountryCode] = useState(
    countries[0]
  );
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");

  const handleBrandChange = (_, newValue) => {
    const filtered = vehicleName.filter(
      (vehicle) => vehicle.label === newValue
    );
    setFilteredVehicles(filtered);
    if (newValue) {
      setGetDataWithChassisNo((prev) => ({
        ...prev,
        vehicle_brand: newValue,
      }));
    }
  };

  // Handle input changes
  const handleYearSelectInput = (event) => {
    const value = event.target.value;
    // Check if the input is a number and does not exceed 4 digits
    if (/^\d{0,4}$/.test(value)) {
      setYearSelectInput(value);
      const filtered = vehicleModels?.filter((option) =>
        option.label.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      event.target.value = value.slice(0, 4);
    }
  };
  const handleOptionClick = (option) => {
    setYearSelectInput(option.label);
    setFilteredOptions([]);
  };
  const { tenantDomain } = useTenantDomain();

  const {
    data: singleCard,
    isLoading,
    refetch,
  } = useGetSingleCustomerQuery({ tenantDomain, id });

  const [updateCustomer, { isLoading: updateLoading, error }] =
    useUpdateCustomerMutation();

  const { register, handleSubmit, reset } = useForm();

  // country code set
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [driverCountryCode, setDriverCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");

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

  useEffect(() => {
    if (singleCard?.data) {
      reset({
        company_name: singleCard?.data?.company_name,
        vehicle_username: singleCard?.data?.vehicle_username,
        company_address: singleCard?.data?.company_address,
        customer_name: singleCard?.data?.customer_name,
        customer_country_code: singleCard?.data?.customer_country_code,
        customer_contact: phoneNumber || singleCard?.data?.customer_contact,
        customer_email: singleCard?.data?.customer_email,
        customer_address: singleCard?.data?.customer_address,
        driver_name: singleCard?.data?.driver_name,
        driver_country_code: singleCard?.data?.driver_country_code,
        driver_contact: driverPhoneNumber || singleCard?.data?.driver_contact,
        reference_name: singleCard?.data?.reference_name,
        whatsappNumber: singleCard?.data?.whatsappNumber,

        customerOwnerPhone:
          ownerPhoneNumber || singleCard?.data?.customerOwnerPhone,
        customerOwnerName: singleCard?.data?.customerOwnerName,
        customerOwnerCountryCode: singleCard?.data?.customerOwnerCountryCode,

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
    singleCard,
    reset,
    phoneNumber,
    driverPhoneNumber,
    ownerPhoneNumber,
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
  ]);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Updating Customer...");

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
      customerOwnerPhone: data.customerOwnerPhone,
      customerOwnerName: data.customerOwnerName,
      customerOwnerCountryCode: customerOwnerCountryCode.code,
      whatsappNumber: data.whatsappNumber,
    };

    data.vehicle_model = Number(data.vehicle_model);
    data.mileage = Number(data.mileage);

    // Get the current mileage value
    const newMileageValue = Number(data.mileage);

    // Check if we need to add a new mileage entry
    const updatedMileageHistory = [
      ...(getDataWithChassisNo.mileageHistory || []),
    ];

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
      vehicle_model: data.vehicle_model,
      vehicle_category: data.vehicle_category,
      color_code: data.color_code,
      mileageHistory: updatedMileageHistory,
      fuel_type: data.fuel_type,
    };

    const newData = {
      customer,
      vehicle,
    };

    const updateData = {
      tenantDomain,
      ...newData,
    };
    try {
      const res = await updateCustomer({
        id: id,
        data: updateData,
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        navigate("/dashboard/customer-list");
        refetch();
        reset();
      }
    } catch (err) {
      toast.error("Failed to update customer");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleChassisChange = (_, newValue) => {
    const filtered = singleCard?.data?.vehicles?.find(
      (vehicle) => vehicle.chassis_no === newValue
    );
    if (filtered) {
      setGetDataWithChassisNo(filtered);
      // If a vehicle brand is selected, update the filtered vehicles
      if (filtered.vehicle_brand) {
        const vehicleOptions = vehicleName.filter(
          (vehicle) => vehicle.label === filtered.vehicle_brand
        );
        setFilteredVehicles(vehicleOptions);
      }
    } else {
      setGetDataWithChassisNo({});
    }
  };

  const handleVehicleCategoryChange = (_, newValue) => {
    if (newValue) {
      setGetDataWithChassisNo((prev) => ({
        ...prev,
        vehicle_category: newValue,
      }));
    }
  };

  if (isLoading) {
    return <p>Loading.....</p>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-xl">
        <Loading />
      </div>
    );
  }
  return (
    <section>
      <div className=" addProductWraps my-10 ">
        <div className="productHeadWrap">
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ mr: 2, color: "#fff" }}
          >
            Back
          </Button>
          <div className="flex flex-wrap items-center justify-center">
            <h3 className="text-sm font-bold md:text-2xl">Update Customer </h3>
          </div>
          <div className="productHome">
            <span>Dashboard / </span>
            <span>Update Customer </span>
          </div>
        </div>

        <div className="addProductWrap">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-10 ">
              <Box>
                <h3 className="my-3  text-xl font-bold">
                  Customer Information{" "}
                </h3>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Customer Name (T)"
                      {...register("customer_name")}
                      focused={singleCard?.data?.customer_name || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Customer Email Address (T)"
                      {...register("customer_email")}
                      focused={singleCard?.data?.customer_email || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Customer Address (T) "
                      {...register("customer_address")}
                      focused={singleCard?.data?.customer_address || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={1}>
                      <Grid item lg={3} md={4} sm={12} xs={12}>
                        <Autocomplete
                          sx={{ marginRight: "2px", marginLeft: "5px" }}
                          fullWidth
                          freeSolo
                          options={countries}
                          getOptionLabel={(option) => option.code}
                          value={
                            countryCode ||
                            singleCard?.data?.customer_country_code
                          }
                          onChange={(_, newValue) => {
                            setCountryCode(newValue);
                            setPhoneNumber("");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Country Code"
                              {...register("customer_country_code")}
                              variant="outlined"
                              focused={
                                singleCard?.data?.customer_country_code || ""
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={9} md={8} sm={12} xs={12}>
                        <TextField
                          {...register("customer_contact")}
                          fullWidth
                          label="Customer Contact No (N)"
                          variant="outlined"
                          type="tel"
                          value={
                            phoneNumber
                              ? phoneNumber
                              : singleCard?.data?.customer_contact
                          }
                          onChange={handlePhoneNumberChange}
                          placeholder="Enter phone number"
                          focused={singleCard?.data?.customer_contact || ""}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      on
                      label="Whatsapp Number (N)"
                      {...register("whatsappNumber")}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name (T)"
                      {...register("company_name")}
                      focused={singleCard?.data?.company_name || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Vehicle User Name (T)"
                      {...register("vehicle_username")}
                      focused={singleCard?.data?.vehicle_username || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Company Address (T)"
                      {...register("company_address")}
                      focused={singleCard?.data?.company_address || ""}
                    />
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Company Owner Name (T)"
                      {...register("customerOwnerName")}
                    />
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={1}>
                      <Grid item lg={3} md={4} sm={12} xs={12}>
                        <Autocomplete
                          fullWidth
                          freeSolo
                          options={countries}
                          getOptionLabel={(option) => option.code}
                          value={
                            customerOwnerCountryCode ||
                            singleCard?.data?.customerOwnerCountryCode
                          }
                          onChange={(event, newValue) => {
                            setCustomerOwnerCountryCode(newValue);
                            setOwnerPhoneNumber("");
                          }}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label="Select Country Code"
                              variant="outlined"
                              focused={
                                singleCard?.data?.customerOwnerCountryCode || ""
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={9} md={8} sm={12} xs={12}>
                        <TextField
                          {...register("customerOwnerPhone")}
                          label="Customer Owner Contact No (N)"
                          variant="outlined"
                          fullWidth
                          type="tel"
                          value={
                            ownerPhoneNumber
                              ? ownerPhoneNumber
                              : singleCard?.data?.customerOwnerPhone
                          }
                          onChange={handleOwnerPhoneNumberChange}
                          placeholder="Enter phone number"
                          focused={singleCard?.data?.customerOwnerPhone || ""}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Reference Name (T) "
                      {...register("reference_name")}
                      focused={singleCard?.data?.reference_name || ""}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <h3 className="my-3  text-xl font-bold">
                  Vehicle Information{" "}
                </h3>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Autocomplete
                      disableClearable
                      freeSolo
                      fullWidth
                      onChange={handleChassisChange}
                      options={singleCard?.data?.vehicles.map(
                        (option) => option.chassis_no
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Chassis no"
                          {...register("chassis_no")}
                          inputProps={{
                            ...params.inputProps,
                            maxLength:
                              getDataWithChassisNo?.chassis_no?.length || 30,
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={1}>
                      <Grid item lg={3} md={4} sm={12} xs={12}>
                        <Autocomplete
                          freeSolo
                          fullWidth
                          value={getDataWithChassisNo?.carReg_no || ""}
                          options={cmDmOptions.map((option) => option.label)}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label="CarReg no"
                              {...register("carReg_no")}
                              focused={getDataWithChassisNo?.carReg_no || ""}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={9} md={8} sm={12} xs={12}>
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
                      label="ENGINE NO & CC (T&N) "
                      {...register("engine_no")}
                      focused={getDataWithChassisNo?.engine_no || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Autocomplete
                      freeSolo
                      fullWidth
                      value={getDataWithChassisNo?.vehicle_brand || ""} // Changed to value
                      onChange={handleBrandChange}
                      options={carBrands.map((option) => option.label)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vehicle Brand"
                          {...register("vehicle_brand")}
                          focused={getDataWithChassisNo?.vehicle_brand || ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Autocomplete
                      fullWidth
                      freeSolo
                      value={getDataWithChassisNo?.vehicle_name || ""} // Changed to value
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
                    <div className="relative">
                      <input
                        onInput={handleYearSelectInput}
                        {...register("vehicle_model")}
                        type="text"
                        className="border productField border-[#11111194]  w-[100%] h-14 p-3 rounded-md"
                        placeholder="Vehicle Model"
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
                      freeSolo
                      fullWidth
                      value={getDataWithChassisNo?.vehicle_category || ""}
                      options={vehicleTypes.map((option) => option.label)}
                      onChange={handleVehicleCategoryChange}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          label="Vehicle Category"
                          {...register("vehicle_category")}
                          focused={getDataWithChassisNo?.vehicle_category || ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Color & Code (T&N) "
                      {...register("color_code")}
                      focused={getDataWithChassisNo?.color_code || ""}
                    />
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ mb: 2 }}>
                      {getDataWithChassisNo?.mileageHistory &&
                        getDataWithChassisNo.mileageHistory.length > 0 && (
                          <Autocomplete
                            multiple
                            id="tags-filled"
                            options={getDataWithChassisNo.mileageHistory.map(
                              (option) =>
                                `${option.mileage} km (${new Date(
                                  option.date
                                ).toLocaleDateString()})`
                            )}
                            value={getDataWithChassisNo.mileageHistory.map(
                              (option) =>
                                `${option.mileage} km (${new Date(
                                  option.date
                                ).toLocaleDateString()})`
                            )}
                            freeSolo
                            onKeyDown={(event) => {
                              // Prevent Enter key from submitting the form
                              if (event.key === "Enter") {
                                event.stopPropagation();
                              }
                            }}
                            onChange={(event, newValue) => {
                              // Map string values back to objects for the database
                              const updatedMileageHistory = newValue?.map(
                                (item) => {
                                  // Try to find the original object
                                  const original =
                                    getDataWithChassisNo.mileageHistory.find(
                                      (mh) =>
                                        `${mh.mileage} km (${new Date(
                                          mh.date
                                        ).toLocaleDateString()})` === item
                                    );

                                  if (original) return original;

                                  // If it's a new entry, create a new object
                                  const mileageMatch = item.match(/^(\d+)/);
                                  const mileage = mileageMatch
                                    ? Number.parseInt(mileageMatch[1])
                                    : 0;
                                  return {
                                    mileage,
                                    date: new Date().toISOString(),
                                  };
                                }
                              );

                              // Update ONLY the mileageHistory property while preserving all other properties
                              setGetDataWithChassisNo((prevState) => ({
                                ...prevState,
                                mileageHistory: updatedMileageHistory,
                              }));
                            }}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => {
                                const { key, ...tagProps } = getTagProps({
                                  index,
                                });
                                return (
                                  <Chip
                                    variant="outlined"
                                    label={option}
                                    key={key}
                                    {...tagProps}
                                    onDelete={(e) => {
                                      e.preventDefault(); // Prevent form submission
                                      const { onDelete } = getTagProps({
                                        index,
                                      });
                                      if (onDelete) onDelete(e);
                                    }}
                                    className="bg-gray-100 border-gray-300 text-gray-800"
                                  />
                                );
                              })
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                label="Mileage History"
                                placeholder="Mileage records"
                                size="medium"
                              />
                            )}
                          />
                        )}

                      {(!getDataWithChassisNo?.mileageHistory ||
                        getDataWithChassisNo.mileageHistory.length === 0) && (
                          <TextField
                            type="number"
                            fullWidth
                            label="Mileage (N)"
                            {...register("mileage", {
                              pattern: {
                                value: /^\d+$/,
                                message: "Please enter a valid number.",
                              },
                            })}
                            focused={getDataWithChassisNo?.mileage || ""}
                          />
                        )}
                    </Box>
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Autocomplete
                      freeSolo
                      fullWidth
                      value={getDataWithChassisNo?.fuel_type || ""}
                      options={carBrands.map((option) => option.label)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Fuel Type "
                          {...register("fuel_type")}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Driver Name (T)"
                      {...register("driver_name")}
                      focused={singleCard?.data?.driver_name || ""}
                    />
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={1}>
                      <Grid item lg={3} md={4} sm={12} xs={12}>
                        <Autocomplete
                          sx={{ marginRight: "2px", marginLeft: "5px" }}
                          fullWidth
                          freeSolo
                          options={countries}
                          getOptionLabel={(option) => option.code}
                          value={
                            driverCountryCode ||
                            singleCard?.data?.driver_country_code
                          }
                          onChange={(event, newValue) => {
                            setDriverCountryCode(newValue);
                            setPhoneNumber("");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...register("driver_country_code")}
                              label="Select Country Code"
                              variant="outlined"
                              focused={
                                singleCard?.data?.driver_country_code || ""
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={9} md={8} sm={12} xs={12}>
                        <TextField
                          {...register("driver_contact")}
                          fullWidth
                          label="Driver Contact No (N)"
                          variant="outlined"
                          type="tel"
                          value={
                            driverPhoneNumber
                              ? driverPhoneNumber
                              : singleCard?.data?.driver_contact
                          }
                          onChange={handleDriverPhoneNumberChange}
                          placeholder="Enter phone number"
                          focused={singleCard?.data?.driver_contact || ""}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </div>
            <div className="flex justify-center mt-5">
              <Button
                type="submit"
                sx={{ color: "white" }}
                disabled={updateLoading}
              >
                Update Customer{" "}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateCustomer;
