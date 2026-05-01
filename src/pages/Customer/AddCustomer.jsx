/* eslint-disable no-unused-vars */

import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Box, Button, Grid } from "@mui/material";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { ArrowBack } from "@mui/icons-material";
import {
  carBrands,
  cmDmOptions,
  countries,
  fuelType,
  vehicleModels,
  vehicleName,
  vehicleTypes,
} from "../../constant/Vehicle.constant";
import { useCreateCustomerMutation } from "../../redux/api/customerApi";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import CustomerListTable from "./CustomerListTable";

const AddCustomer = () => {
  const [registrationError, setRegistrationError] = useState("");
  const { tenantDomain } = useTenantDomain();

  const [countryCode, setCountryCode] = useState(countries[0]);
  const [driverCountryCode, setDriverCountryCode] = useState(countries[0]);
  const [customerOwnerCountryCode, setCustomerOwnerCountryCode] = useState(
    countries[0]
  );
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");

  const [selectedBrand, setSelectedBrand] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [yearSelectInput, setYearSelectInput] = useState("");

  const [createCustomer, { isLoading, error }] = useCreateCustomerMutation();

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

  const handleCarRegistrationChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    }

    if (value.length > 7) {
      value = value.slice(0, 7);
    }

    setRegistrationError("");
    if (value.length !== 7) {
      setRegistrationError("Car registration number must be 7 characters");
    }

    setValue("car_registration_no", value, {
      shouldValidate: true,
    });
  };


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating Customer...");

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
      customerOwnerPhone: data.customerOwnerPhone,
      customerOwnerName: data.customerOwnerName,
      customerOwnerCountryCode: customerOwnerCountryCode.code,
      whatsappNumber: data.whatsappNumber,

      reference_name: data.reference_name,
    };

    data.vehicle_model = Number(data.vehicle_model);
    data.mileage = Number(data.mileage);

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
      mileageHistory: [
        {
          mileage: Number(data.mileage),
          date: new Date(),
        },
      ],
      fuel_type: data.fuel_type,
    };

    const newData = {
      customer,
      vehicle,
    };


    try {
      const res = await createCustomer({ tenantDomain, customerInfo: newData }).unwrap();
      if (res.success) {
        navigate("/dashboard/customer-list");
        toast.success("Customer cretae to successfully.");
      }
    } catch (err) {
      if (err.data && err.data.errorSources) {
        err.data.errorSources.forEach((error) => {
          toast.error(`${error.path}: ${error.message}`);
        });
      } else {
        toast.error(
          err.data?.message || "An error occurred while creating the customer."
        );
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  const sortedVehicleName = vehicleName.sort((a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  });

  const handleBrandChange = (event, newValue) => {
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
    setYearSelectInput(option.value);
    setFilteredOptions([]);
    setValue("vehicle_model", option.label, {
      shouldValidate: true,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section>
      <div className=" addProductWraps mt-10">
        <div className="productHeadWrap">
          <div className="flex items-center px-3">
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ mr: 2, color: "#fff" }}
            >
              Back
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center">
            <div className="ml-2">
              <h3 className="text-sm font-bold md:text-2xl">
                {" "}
                Add New Customer{" "}
              </h3>
            </div>
          </div>
          <div className="productHome">
            <span>Home / </span>
            <span>Customer / </span>
            <span>New Customer </span>
          </div>
        </div>

        <div className="addProductWrap">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="addCustomerInputFieldWrap">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2  gap-3 my-10">
                  <Box>
                    <h3 className="mb-1 text-xl font-bold">
                      Customer Information{" "}
                    </h3>

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
                            required: "Customer Name is required",
                          })}
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
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label={
                            <>
                              Customer Address (T)
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                }}
                              >
                                *
                              </span>
                            </>
                          }
                          {...register("customer_address", {
                            required: "Customer address is required!",
                          })}
                          error={!!errors.customer_address}
                          helperText={errors.customer_address?.message}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid container spacing={1}>
                          <Grid item lg={3} md={4} sm={12} xs={12}>
                            <Autocomplete
                              sx={{ marginLeft: "5px" }}
                              fullWidth
                              freeSolo
                              options={countries}
                              getOptionLabel={(option) => option.code}
                              value={countryCode}
                              selected
                              onChange={(event, newValue) => {
                                setCountryCode(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  fullWidth
                                  {...params}
                                  label={
                                    <>
                                      Select Country Code
                                      <span
                                        style={{
                                          color: "red",
                                          fontSize: "25px",
                                        }}
                                      >
                                        *
                                      </span>
                                    </>
                                  }
                                  variant="outlined"
                                  error={!!errors.country_code}
                                  helperText={errors.country_code?.message}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item lg={9} md={8} sm={12} xs={12}>
                            <TextField
                              {...register("customer_contact", {
                                required:
                                  "Customer contact number is required ",
                              })}
                              error={!!errors.customer_contact}
                              helperText={errors.customer_contact?.message}
                              label={
                                <>
                                  Customer Contact No (N)
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "25px",
                                    }}
                                  >
                                    *
                                  </span>
                                </>
                              }
                              variant="outlined"
                              fullWidth
                              type="tel"
                              value={phoneNumber}
                              onChange={handlePhoneNumberChange}
                              placeholder="Enter phone number"
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
                          error={!!errors?.whatsappNumber}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          on
                          label="Company Name (T)"
                          {...register("company_name")}
                          error={!!errors?.company_name}
                          helperText={errors.company_name?.message}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Vehicle User Name (T)"
                          {...register("vehicle_username")}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Company Address (T)"
                          {...register("company_address")}
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
                              value={customerOwnerCountryCode}
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
                                />
                              )}
                            />
                          </Grid>
                          <Grid item lg={9} md={8} sm={12} xs={12}>
                            <TextField
                              {...register("customerOwnerPhone")}
                              label="Company Owner Contact No (N)"
                              variant="outlined"
                              fullWidth
                              type="tel"
                              value={ownerPhoneNumber}
                              onChange={handleOwnerPhoneNumberChange}
                              placeholder="Enter phone number"
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Reference Name (T) "
                          {...register("reference_name")}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <h3 className="mb-2 text-xl font-bold">
                      Vehicle Information{" "}
                    </h3>
                    <Grid container spacing={2}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid container spacing={1}>
                          <Grid item lg={3} md={4} sm={12} xs={12}>
                            <Autocomplete
                              freeSolo
                              fullWidth
                              id="reg"
                              Car
                              Registration
                              No
                              options={cmDmOptions.map(
                                (option) => option.label
                              )}
                              renderInput={(params) => (
                                <TextField
                                  fullWidth
                                  {...params}
                                  label={
                                    <>
                                      Car Reg No
                                      <span
                                        style={{
                                          color: "red",
                                          fontSize: "25px",
                                        }}
                                      >
                                        *
                                      </span>
                                    </>
                                  }
                                  {...register("carReg_no", {
                                    required: "Car reg no is required",
                                  })}
                                  error={!!errors.carReg_no}
                                  helperText={errors.carReg_no?.message}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item lg={9} md={8} sm={12} xs={12}>
                            <TextField
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
                                    *
                                  </span>
                                </>
                              }
                              {...register("car_registration_no", {
                                pattern: {
                                  value: /^[\d-]+$/,
                                  message:
                                    "Only numbers and hyphens are allowed",
                                },
                                maxLength: {
                                  value: 7,
                                  message:
                                    "Car registration number must be exactly 7 characters",
                                },
                              })}
                              onChange={handleCarRegistrationChange}
                              error={
                                !!errors.car_registration_no ||
                                !!registrationError
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label={
                            <>
                              Chassis No (T&N)
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                }}
                              >
                                *
                              </span>
                            </>
                          }
                          {...register("chassis_no", {
                            required: "Chassis no number is required!",
                          })}
                          error={!!errors.chassis_no}
                          helperText={errors.chassis_no?.message}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="ENGINE NO & CC (T&N) "
                          {...register("engine_no")}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Autocomplete
                          fullWidth
                          freeSolo
                          onInputChange={(event, newValue) => { }}
                          onChange={handleBrandChange}
                          options={carBrands.map((option) => option.label)}
                          value={selectedBrand}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Vehicle Brand"
                              {...register("vehicle_brand")}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Autocomplete
                          fullWidth
                          freeSolo
                          Vehicle
                          Name
                          options={filteredVehicles.map(
                            (option) => option.value
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Vehicle Name "
                              {...register("vehicle_name")}
                            />
                          )}
                          getOptionLabel={(option) => option || ""}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div className="relative ">
                          <input
                            value={yearSelectInput}
                            onInput={handleYearSelectInput}
                            {...register("vehicle_model")}
                            type="text"
                            className="border productField border-[#11111194] w-[100%] h-14 p-3 rounded-md"
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
                          {errors.vehicle_model && (
                            <span className="text-sm text-red-400">
                              {errors.vehicle_model.message}
                            </span>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Autocomplete
                          freeSolo
                          fullWidth
                          Vehicle
                          Types
                          options={vehicleTypes.map((option) => option.label)}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label=" Vehicle Categories "
                              {...register("vehicle_category")}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          freeSolo
                          fullWidth
                          label="Color & Code (T&N) "
                          {...register("color_code")}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Mileage (N)"
                          {...register(
                            "mileage",

                            {
                              pattern: {
                                value: /^\d+$/,
                                message: "Please enter a valid number.",
                              },
                            }
                          )}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Autocomplete
                          freeSolo
                          fullWidth
                          Fuel
                          Type
                          options={fuelType.map((option) => option.label)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label=" Fuel Type"
                              {...register("fuel_type")}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          label={
                            <>
                              Driver Name (T)
                              {/* <span
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                }}
                              >
                                *
                              </span> */}
                            </>
                          }
                          fullWidth
                          {...register("driver_name", {
                            // required: "Driver Name is required",
                          })}
                          error={!!errors.driver_name}
                          helperText={errors.driver_name?.message}
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
                              value={driverCountryCode}
                              onChange={(event, newValue) => {
                                setDriverCountryCode(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  fullWidth
                                  {...params}
                                  label={
                                    <>
                                      Select Country Code
                                      {/* <span
                                        style={{
                                          color: "red",
                                          fontSize: "25px",
                                        }}
                                      >
                                        *
                                      </span> */}
                                    </>
                                  }
                                  variant="outlined"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item lg={9} md={8} sm={12} xs={12}>
                            <TextField
                              {...register("driver_contact", {
                                // required: "Driver contact number is required",
                              })}
                              error={!!errors.driver_name}
                              helperText={errors.driver_name?.message}
                              label={<>Driver Contact No (N)</>}
                              variant="outlined"
                              fullWidth
                              type="tel"
                              value={driverPhoneNumber}
                              onChange={handleDriverPhoneNumberChange}
                              placeholder="Enter phone number"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              </div>
            </div>

            <div className=" ml-3 flex justify-center ">
              <Button
                type="submit"
                sx={{ color: "white" }}
                disabled={isLoading}
              >
                Add Customer{" "}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <CustomerListTable />
    </section>
  );
};

export default AddCustomer;
