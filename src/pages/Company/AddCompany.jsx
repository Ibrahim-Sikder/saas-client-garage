/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */

import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Box, Button, Grid } from "@mui/material";

import { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { ArrowBack } from "@mui/icons-material";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { usePermissions } from "../../context/PermissionContext";
import { useCreateCompanyMutation } from "../../redux/api/companyApi";
import {
  carBrands,
  cmDmOptions,
  countries,
  fuelType,
  vehicleModels,
  vehicleName,
  vehicleTypes,
} from "../../constant";
import Can from "../../components/Can";
import CompanyListTable from "./CompanyListTable";

const AddCompany = () => {
  const [registrationError, setRegistrationError] = useState("");

  const [selectedBrand, setSelectedBrand] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [yearSelectInput, setYearSelectInput] = useState("");
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [driverCountryCode, setDriverCountryCode] = useState(countries[0]);
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");
  const [companyOwnerCountryCode, setCompanyOwnerCountryCode] = useState(
    countries[0]
  );
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [createCompany, { isLoading, error }] = useCreateCompanyMutation();

  const handleBrandChange = (event, newValue) => {
    setSelectedBrand(newValue);
    const filtered = vehicleName.filter(
      (vehicle) => vehicle.label === newValue
    );
    setFilteredVehicles(filtered);
  };
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
    setYearSelectInput(option.value);
    setFilteredOptions([]);
    setValue("vehicle_model", option.label, {
      shouldValidate: true,
    });
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

  const onSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/add-company",
      "create",
      async () => {
        const toastId = toast.loading("Creating Company...");
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
          companyOwnerPhone: data.companyOwnerPhone,
          companyOwnerName: data.companyOwnerName,
          companyOwnerCountryCode: companyOwnerCountryCode.code,
          reference_name: data.reference_name,
          whatsappNumber: data.whatsappNumber,
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
          tenantDomain,
          company,
          vehicle,
        };

        try {
          const res = await createCompany(newData).unwrap();

          if (res.success) {
            toast.success("Successfully add to company post");
            navigate("/dashboard/company-list");
          }
        } catch (err) {
          if (err.data && err.data.errorSources) {
            err.data.errorSources.forEach((error) => {
              toast.error(`${error.path}: ${error.message}`);
            });
          } else {
            toast.error(err.data?.message || "Failed to creating the company.");
          }
        } finally {
          toast.dismiss(toastId);
        }
      },
      "You don't have permission to create companies."
    );
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <section>
      <div className=" addProductWraps mt-8 ">
        <div className="productHeadWrap">
          <div className="flex flex-wrap items-center justify-center">
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ mr: 2, color: "#fff" }}
            >
              Back
            </Button>
          </div>
          <h3 className="text-sm font-bold md:text-2xl"> New Company </h3>
          <div className="productHome">
            <span>Home / </span>
            <span>New Company </span>
          </div>
        </div>

        <div className="addProductWrap">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-10">
              <Box>
                <h3 className="mb-1 ml-2 text-xl font-bold md:ml-0">
                  Company Information{" "}
                </h3>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      on
                      label={
                        <>
                          Company Name (T)
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
                      {...register("company_name", {
                        required: "Compnay name is required",
                      })}
                      error={!!errors.company_name}
                      helperText={errors.company_name?.message}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      onC
                      label="Vehicle User Name (T)"
                      {...register("vehicle_username")}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      on
                      label="Company Address (T)"
                      {...register("company_address")}
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
                          value={countryCode}
                          onChange={(event, newValue) => {
                            setCountryCode(newValue);
                            // setPhoneNumber("");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Country Code"
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={9} md={8} sm={12} xs={12}>
                        <TextField
                          {...register("company_contact", {
                            required: "Company contact number is required! ",
                          })}
                          fullWidth
                          label={
                            <>
                              Company Contact No (N)
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
                          type="tel"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          error={!!errors.company_contact}
                          helperText={errors.company_contact?.message}
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
                      label="Company Email Address (N)"
                      {...register("company_email")}
                      type="email"
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Company Owner Name (T)"
                      {...register("companyOwnerName")}
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
                          value={companyOwnerCountryCode}
                          onChange={(event, newValue) => {
                            setCompanyOwnerCountryCode(newValue);
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
                          {...register("companyOwnerPhone")}
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
                    <div className="flex items-center my-1"></div>
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
                <h3 className="mb-1 ml-2 text-xl font-bold md:ml-0">
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
                          options={cmDmOptions.map((option) => option.label)}
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
                              message: "Only numbers and hyphens are allowed",
                            },
                            maxLength: {
                              value: 7,
                              message:
                                "Car registration number must be exactly 7 characters",
                            },
                          })}
                          onChange={handleCarRegistrationChange}
                          error={
                            !!errors.car_registration_no || !!registrationError
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
                      options={filteredVehicles.map((option) => option.value)}
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
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={9} md={8} sm={12} xs={12}>
                        <TextField
                          {...register("driver_contact", {
                            required: "Driver contact number is required",
                          })}
                          error={!!errors.driver_name}
                          helperText={errors.driver_name?.message}
                          label={
                            <>
                              Driver Contact No (N)
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

            <div className="mt-5 justify-center flex ">
              <Can page="/dashboard/add-company" action="create">
                <Button
                  type="submit"
                  sx={{ color: "white" }}
                  disabled={isLoading}
                >
                  Add Company{" "}
                </Button>
              </Can>
            </div>
          </form>
        </div>
      </div>
      <CompanyListTable />
    </section>
  );
};

export default AddCompany;