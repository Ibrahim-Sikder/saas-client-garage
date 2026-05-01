/* eslint-disable no-unsafe-optional-chaining */
"use client";

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Grid, Chip, TextField } from "@mui/material";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SettingsIcon from "@mui/icons-material/Settings";
import BuildIcon from "@mui/icons-material/Build";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";

import {
  carBrandOptions,
  carRegOptions,
  countries,
  countryValues,
  fuelTypeOption,
  vehicleModels,
  vehicleNameOptions,
  vehicleTypesOptions,
} from "../../../constant/Vehicle.constant";
import {
  useCreateVehicleMutation,
  useGetSingleVehicleQuery,
  useUpdateVehicleMutation,
} from "../../../redux/api/vehicle";
import GarageForm from "../../../components/form/Form";
import Loading from "../../../components/Loading/Loading";
import FormAutocomplete from "../../../components/form/FormAutocomplete";
import MaskedInput from "../../../components/form/InputMask";
import FormInput from "../../../components/form/Input";
import AutocompleteSelect from "../../../components/form/AutocompleteSelect";
import Can from "../../../components/Can";
import { useAppOptions } from "../../../hooks/useAppOptions";

const JobCardForm = ({
  onClose,
  id,
  user_type,
  vehicleData: vehicleIdData,
  isEditing,
}) => {
  const [createVehicle, { isLoading: createLoading }] =
    useCreateVehicleMutation();
  const [updateVehicle, { isLoading: updateLoading }] =
    useUpdateVehicleMutation();
  const { performActionWithPermission, tenantDomain } = useAppOptions();

  const vehicleId = vehicleIdData?._id;

  const { data: singleVehicle, isLoading: vehicleLoading } =
    useGetSingleVehicleQuery({
      tenantDomain,
      id: vehicleId,
    });

  const vehicleData = singleVehicle?.data;

  const isLoading = createLoading || updateLoading || vehicleLoading;

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const [mileageHistory, setMileageHistory] = useState([]);
  const [currentMileage, setCurrentMileage] = useState("");
  const [mileageChanged, setMileageChanged] = useState(false);

  useEffect(() => {
    if (vehicleData?.mileageHistory) {
      setMileageHistory(vehicleData.mileageHistory);
      if (vehicleData.mileageHistory.length > 0) {
        const lastMileage =
          vehicleData.mileageHistory[vehicleData.mileageHistory.length - 1]
            .mileage;
        setCurrentMileage(lastMileage);
        setValue("mileage", lastMileage);
      }
    }
  }, [vehicleData, setValue]);

  const handleSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/add-customer",
      vehicleId ? "edit" : "create",
      async () => {
        const toastId = toast.loading(
          isEditing ? "Updating Vehicle..." : "Creating Vehicle..."
        );

        // --- Handle mileage update ---
        let updatedMileageHistory = [...mileageHistory];
        if (mileageChanged && currentMileage) {
          const newMileageEntry = {
            mileage: Number(currentMileage),
            date: new Date().toISOString(),
          };
          updatedMileageHistory.push(newMileageEntry);
          setMileageHistory(updatedMileageHistory);
        }

        // --- Normalize vehicle_model ---
        let vehicleModelValue;
        if (Array.isArray(data.vehicle_model)) {
          // if array (autocomplete/select), pick first and convert
          vehicleModelValue = Number(data.vehicle_model[0]);
        } else {
          // else directly convert to number
          vehicleModelValue = Number(data.vehicle_model);
        }

        // avoid NaN
        if (isNaN(vehicleModelValue)) {
          vehicleModelValue = undefined;
        }

        const submitData = {
          Id: id,
          user_type: user_type,

          // pick first if array
          carReg_no: Array.isArray(data.carReg_no)
            ? data.carReg_no[0]
            : data.carReg_no,
          vehicle_brand: Array.isArray(data.vehicle_brand)
            ? data.vehicle_brand[0]
            : data.vehicle_brand,
          vehicle_name: Array.isArray(data.vehicle_name)
            ? data.vehicle_name[0]
            : data.vehicle_name,
          vehicle_category: Array.isArray(data.vehicle_category)
            ? data.vehicle_category[0]
            : data.vehicle_category,
          fuel_type: Array.isArray(data.fuel_type)
            ? data.fuel_type[0]
            : data.fuel_type,

          // normal string fields
          car_registration_no: data.car_registration_no,
          chassis_no: data.chassis_no,
          engine_no: data.engine_no,
          color_code: data.color_code,

          // fixed: always number or undefined
          vehicle_model: vehicleModelValue,

          // mileage tracking
          mileage: currentMileage ? Number(currentMileage) : undefined,
          mileageHistory: updatedMileageHistory,

          // driver info
          driver_name: data.driver_name,
          driver_contact: data.driver_contact,
          driver_country_code:
            data.driver_country_code?.value || data.driver_country_code,
        };

        try {
          let res;
          if (vehicleId) {
            res = await updateVehicle({
              tenantDomain,
              id: vehicleData._id,
              vehicleInfo: submitData,
            }).unwrap();
          } else {
            res = await createVehicle({
              tenantDomain,
              vehicleInfo: submitData,
            }).unwrap();
          }

          if (res.success) {
            toast.update(toastId, {
              render: res.message,
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
            onClose();
          } else {
            toast.update(toastId, {
              render: `Failed to ${isEditing ? "update" : "create"} vehicle!`,
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
        } catch (err) {
          let errorMessage = `Failed to ${
            isEditing ? "update" : "create"
          } vehicle!`;

          if (err?.data?.message) {
            errorMessage = err.data.message;
          }
          if (err?.data?.errorSources?.length > 0) {
            errorMessage = err.data.errorSources[0]?.message || errorMessage;
          }
          if (err?.data?.err?.code === 11000) {
            const key = Object.keys(err.data.err.keyValue)[0];
            const value = err.data.err.keyValue[key];
            errorMessage = `${value} already exists`;
          }

          toast.update(toastId, {
            render: errorMessage,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      },
      `You don't have permission to ${vehicleId ? "edit" : "create"} vehicle !`
    );
  };

  const defaultvalues = {
    carReg_no: vehicleData?.carReg_no
      ? Array.isArray(vehicleData?.carReg_no)
        ? vehicleData?.carReg_no
        : [vehicleData?.carReg_no]
      : [],
    car_registration_no: vehicleData?.car_registration_no || "",
    chassis_no: vehicleData?.chassis_no || "",
    engine_no: vehicleData?.engine_no || "",
    vehicle_brand: vehicleData?.vehicle_brand
      ? Array.isArray(vehicleData?.vehicle_brand)
        ? vehicleData?.vehicle_brand
        : [vehicleData?.vehicle_brand]
      : [],
    vehicle_name: vehicleData?.vehicle_name
      ? Array.isArray(vehicleData?.vehicle_name)
        ? vehicleData?.vehicle_name
        : [vehicleData?.vehicle_name]
      : [],
    vehicle_model: vehicleData?.vehicle_model
      ? Array.isArray(vehicleData?.vehicle_model)
        ? vehicleData.vehicle_model.map((v) => ({ label: v, value: v }))
        : [
            {
              label: vehicleData.vehicle_model,
              value: vehicleData.vehicle_model,
            },
          ]
      : [],
    vehicle_category: vehicleData?.vehicle_category
      ? Array.isArray(vehicleData?.vehicle_category)
        ? vehicleData?.vehicle_category
        : [vehicleData?.vehicle_category]
      : [],
    color_code: vehicleData?.color_code || "",
    fuel_type: vehicleData?.fuel_type
      ? Array.isArray(vehicleData?.fuel_type)
        ? vehicleData?.fuel_type
        : [vehicleData?.fuel_type]
      : [],
    driver_name: vehicleData?.driver_name || "",
    driver_contact: vehicleData?.driver_contact || "",
    driver_country_code: vehicleData?.driver_country_code || "",

    mileage: vehicleData?.mileage || "",
  };

  return (
    <>
      {vehicleLoading ? (
        <Loading />
      ) : (
        <GarageForm onSubmit={handleSubmit} defaultValues={defaultvalues}>
          <Box>
            <Grid container spacing={2} style={{ padding: 8 }}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormAutocomplete
                  name="carReg_no"
                  label={
                    <>
                      Vehicle Reg No
                      <span style={{ color: "red", fontSize: "25px" }}> *</span>
                    </>
                  }
                  placeholder="Vehicle Reg No"
                  options={carRegOptions}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <MaskedInput
                  name="car_registration_no"
                  label={
                    <>
                      Car R (N)
                      <span style={{ color: "red", fontSize: "25px" }}> *</span>
                    </>
                  }
                  mask="99-9999"
                  maskChar={null}
                  icon={<DirectionsCarIcon />}
                  iconPosition="start"
                  margin="none"
                  rules={{
                    required: "Car registration number is required",
                    validate: (value) => {
                      if (value && value.includes("_")) {
                        return "Please complete the car registration number";
                      }
                      return true;
                    },
                  }}
                />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormInput
                  fullWidth
                  size="medium"
                  label={
                    <>
                      Chassis No (T&N)
                      <span style={{ color: "red", fontSize: "25px" }}> *</span>
                    </>
                  }
                  name="chassis_no"
                  icon={SettingsIcon}
                  iconPosition="start"
                  margin="none"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormInput
                  name="engine_no"
                  size="medium"
                  label="ENGINE NO & CC (T&N) "
                  icon={BuildIcon}
                  iconPosition="start"
                  margin="none"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormAutocomplete
                  name="vehicle_brand"
                  label="Vehicle Brand"
                  placeholder="Vehicle Brand"
                  options={carBrandOptions}
                  margin="none"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormAutocomplete
                  name="vehicle_name"
                  label="Vehicle Name "
                  placeholder="Vehicle Name"
                  options={vehicleNameOptions}
                  margin="none"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormAutocomplete
                  name="vehicle_model"
                  label="Vehicle Model"
                  placeholder="Vehicle Model"
                  options={vehicleModels}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormAutocomplete
                  name="vehicle_category"
                  label=" Vehicle Categories "
                  placeholder="Vehicle Categories"
                  options={vehicleTypesOptions}
                  margin="none"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormInput
                  fullWidth
                  size="medium"
                  label="Color & Code (T&N) "
                  name="color_code"
                  icon={ColorLensIcon}
                  iconPosition="start"
                  margin="none"
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

                    const lastMileage = mileageHistory?.slice(-1)[0]?.mileage;

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
                  {mileageHistory?.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mileageHistory.map((entry, index) => (
                        <Chip
                          key={index}
                          label={`${entry.mileage} km (${new Date(
                            entry.date
                          ).toLocaleDateString()})`}
                          variant="outlined"
                          className="bg-gray-100 border-gray-300 text-gray-800"
                          onDelete={() => {
                            // Remove the specific entry from mileage history
                            const updatedHistory = mileageHistory.filter(
                              (_, i) => i !== index
                            );
                            setMileageHistory(updatedHistory);
                          }}
                          deleteIcon={
                            <span className="text-red-500 hover:text-red-700 cursor-pointer text-lg">
                              ×
                            </span>
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-1">
                      No previous mileage records
                    </p>
                  )}
                </div>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormAutocomplete
                  name="fuel_type"
                  label=" Fuel Type"
                  placeholder="Fuel Type"
                  options={fuelTypeOption}
                  margin="none"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <FormInput
                  fullWidth
                  size="medium"
                  label="Driver Name (T)"
                  name="driver_name"
                  icon={PersonIcon}
                  iconPosition="start"
                  margin="none"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={1}>
                  <Grid item lg={3} md={4} sm={12} xs={12}>
                    <AutocompleteSelect
                      name="driver_country_code"
                      label="Select Country Code"
                      placeholder="Country Code"
                      options={countryValues}
                      size="medium"
                      margin="none"
                    />
                  </Grid>
                  <Grid item lg={9} md={8} sm={12} xs={12}>
                    <FormInput
                      fullWidth
                      size="medium"
                      label="Driver Contact No (N)"
                      name="driver_contact"
                      icon={PhoneIcon}
                      iconPosition="start"
                      margin="none"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Can
            page="/dashboard/add-customer"
            action={vehicleId ? "edit" : "create"}
          >
            <button
              disabled={isLoading}
              className="block mt-3 w-full bg-[#42A1DA] text-white font-bold p-4 rounded-lg"
            >
              {isLoading ? (
                "Processing..."
              ) : vehicleId ? (
                <>
                  <EditIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Update Vehicle
                </>
              ) : (
                <>
                  <AddCircleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Add Vehicle
                </>
              )}
            </button>
          </Can>
        </GarageForm>
      )}
    </>
  );
};

export default JobCardForm;
