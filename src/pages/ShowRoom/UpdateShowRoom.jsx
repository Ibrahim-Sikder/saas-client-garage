/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */

import TextField from "@mui/material/TextField";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Autocomplete, Box, Button, Chip, Grid } from "@mui/material";
import {
  carBrands,
  cmDmOptions,
  countries,
  vehicleModels,
  vehicleName,
  vehicleTypes,
} from "../../constant";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { ArrowBack } from "@mui/icons-material";
import { usePermissions } from "../../context/PermissionContext";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetSingleShowRoomQuery, useUpdateShowRoomMutation } from "../../redux/api/showRoomApi";
import Loading from "../../components/Loading/Loading";
import Can from "../../components/Can";

const UpdateShowRoom = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const navigate = useNavigate();

  // country code
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [driverCountryCode, setDriverCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");
  const { performActionWithPermission } = usePermissions();

  const [filteredOptions, setFilteredOptions] = useState([]);
  const [yearSelectInput, setYearSelectInput] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [getDataWithChassisNo, setGetDataWithChassisNo] = useState({});
  const { tenantDomain } = useTenantDomain();

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

  const handleDriverPhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber.length <= 11 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber.length > 1)
    ) {
      setDriverPhoneNumber(newPhoneNumber);
    }
  };

  const {
    data: singleCard,
    isLoading,
    refetch,
  } = useGetSingleShowRoomQuery({ tenantDomain, id });
  const [updateShowroom, { isLoading: updateLoading }] =
    useUpdateShowRoomMutation()

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (singleCard?.data) {
      reset({
        showRoom_name: singleCard?.data?.showRoom_name,
        vehicle_username: singleCard?.data?.vehicle_username,
        showRoom_address: singleCard?.data?.showRoom_address,
        company_name: singleCard?.data?.company_name,
        company_contact: phoneNumber || singleCard?.data?.company_contact,
        company_country_code: singleCard?.data?.company_country_code,
        company_email: singleCard?.data?.company_email,
        company_address: singleCard?.data?.company_address,
        driver_name: singleCard?.data?.driver_name,
        driver_country_code: singleCard?.data?.driver_country_code,
        driver_contact: driverPhoneNumber || singleCard?.data?.driver_contact,
        reference_name: singleCard?.data?.reference_name,
        whatsappNumber: singleCard?.data?.whatsappNumber,

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
    performActionWithPermission('/dashboard/update-show-room', 'edit',
      async () => {
        const toastId = toast.loading("Updating showroom...");

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
          whatsappNumber: data.whatsappNumber,
          driver_contact: data.driver_contact,
          driver_country_code: driverCountryCode.code,
          reference_name: data.reference_name,
        };
        data.vehicle_model = Number(data.vehicle_model);
        data.mileage = Number(data.mileage);
        const newMileageValue = Number(data.mileage);

        const updatedMileageHistory = [
          ...(getDataWithChassisNo.mileageHistory || []),
        ];

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
          showroom,
          vehicle,
        };

        const updateData = {
          tenantDomain,
          ...newData,
        };

        try {
          const res = await updateShowroom({ id: id, data: updateData }).unwrap();
          if (res.success) {
            toast.success(res.message);
            navigate("/dashboard/show-room-list");
            refetch();
            reset();
          }
        } catch (err) {
          toast.error("Failed to update customer");
        } finally {
          toast.dismiss(toastId);
        }

      }, "You do't have permission to edit show room"
    )
  };

  const handleBrandChange = (event, newValue) => {
    const filtered = vehicleName.filter(
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

  const handleChassisChange = (_, newValue) => {
    const filtered = singleCard?.data?.vehicles?.find(
      (vehicle) => vehicle.chassis_no === newValue
    );
    setGetDataWithChassisNo(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-xl">
        <Loading />
      </div>
    );
  }
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <section>
      <div className=" addProductWraps my-10 ">
        <div className="productHeadWrap">
          <div className="flex items-center justify-center ">
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack ArrowBack />}
              sx={{ mr: 2, color: "#fff" }}
            >
              Back
            </Button>
          </div>
          <h3 className="text-xl font-bold md:text-2xl"> Update Show Room </h3>
          <div className="productHome">
            <span>Home / </span>
            <span>Show Room / </span>
            <span>New Show Room </span>
          </div>
        </div>

        <div className="addProductWrap">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
              <Box>
                <h3 className="my-3  ml-2 text-xl font-bold md:ml-0">
                  Show Room Information{" "}
                </h3>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      on
                      label="Show Room Name (T)"
                      {...register("showRoom_name")}
                      focused={singleCard?.data?.showRoom_name || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      onC
                      label="Show Room Owner Name (T)"
                      {...register("vehicle_username")}
                      focused={singleCard?.data?.vehicle_username || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      on
                      label="Show Room Address (T)"
                      {...register("showRoom_address")}
                      focused={singleCard?.data?.showRoom_address || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      onC
                      label="Company Name (T)"
                      {...register("company_name")}
                      focused={singleCard?.data?.company_name || ""}
                    />
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={1}>
                      <Grid item lg={3} md={4} sm={12} xs={12}>
                        <Autocomplete
                          sx={{ marginRight: "2px" }}
                          fullWidth
                          freeSolo
                          options={countries}
                          getOptionLabel={(option) => option.label}
                          value={
                            countryCode ||
                            singleCard?.data?.customer_country_code
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
                              {...register("company_country_code")}
                              variant="outlined"
                              focused={
                                singleCard?.data?.company_country_code || ""
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={9} md={8} sm={12} xs={12}>
                        <TextField
                          {...register("company_contact")}
                          fullWidth
                          label="Company Contact No (N)"
                          variant="outlined"
                          type="tel"
                          value={
                            phoneNumber
                              ? phoneNumber
                              : singleCard?.data?.company_contact
                          }
                          onChange={handlePhoneNumberChange}
                          placeholder="Enter phone number"
                          focused={singleCard?.data?.company_contact || ""}
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
                      label="Show Room Email Address (N)"
                      {...register("company_email")}
                      type="email"
                      focused={singleCard?.data?.company_email || ""}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Company Address (T) "
                      {...register("company_address")}
                      focused={singleCard?.data?.company_address || ""}
                    />
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
                <h3 className="my-3 text-xl font-bold">Vehicle Information </h3>
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
                      onChange={handleBrandChange}
                      value={getDataWithChassisNo?.vehicle_brand || ""}
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
                      Vehicle
                      Name
                      value={getDataWithChassisNo?.vehicle_name || ""}
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
                    <div className="relative ">
                      <input
                        onInput={handleYearSelectInput}
                        {...register("vehicle_model")}
                        type="text"
                        className="border  border-[#11111194] w-[100%] h-14 p-3 rounded-md"
                        placeholder="Vehicle Model"
                        defaultValue={getDataWithChassisNo?.vehicle_model}
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
                      renderInput={(params) => (
                        <TextField
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
                              if (event.key === "Enter") {
                                event.stopPropagation();
                              }
                            }}
                            onChange={(event, newValue) => {
                              const updatedMileageHistory = newValue?.map(
                                (item) => {
                                  const original =
                                    getDataWithChassisNo.mileageHistory.find(
                                      (mh) =>
                                        `${mh.mileage} km (${new Date(
                                          mh.date
                                        ).toLocaleDateString()})` === item
                                    );

                                  if (original) return original;

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
                                      e.preventDefault();
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
                          focused={getDataWithChassisNo?.fuel_type || ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      o
                      label="Show Room Person Name (T)"
                      {...register("driver_name")}
                      focused={singleCard?.data?.driver_name || ""}
                    />
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={1}>
                      <Grid item lg={3} md={4} sm={12} xs={12}>
                        <Autocomplete
                          sx={{ marginRight: "2px" }}
                          fullWidth
                          freeSolo
                          options={countries}
                          getOptionLabel={(option) => option.label}
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
                              fullWidth
                              {...params}
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

            <div className="mt-8 flex justify-center ">
              <Can page="/dashboard/update-show-room" action="edit">
                <Button
                  type="submit"
                  sx={{ color: "white" }}
                  disabled={isLoading}
                >
                  Update Show Room{" "}
                </Button>
              </Can>

            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateShowRoom;
