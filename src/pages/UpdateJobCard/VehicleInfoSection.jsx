/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Grid, TextField, Autocomplete, Chip } from "@mui/material";
import InputMask from "react-input-mask";
import { carBrands, cmDmOptions, vehicleTypes, fuelType, vehicleModels } from "../../../constant";
import useFilteredOptions from "../../../hooks/useFilteredOptions";
import useMileageHistory from "../../../hooks/useMileageHistory";
import JobCardAutocompleteSelect from "../../../components/form/JobcardAutocompleteSelect";
import PhoneInput from "../../../components/form/PhoneInput";
import '../AddJobCard/AddJobCard.css'
const VehicleInfoSection = ({
  singleCard,
  getDataWithChassisNo,
  register,
  errors,
  setGetDataWithChassisNo,
  setValue,
  setVModelValue,
}) => {
  const [yearSelectInput, setYearSelectInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  
  const { sortedVehicleName, handleBrandChange } = useFilteredOptions(
    selectedBrand,
    setSelectedBrand,
    setFilteredVehicles
  );
  
  const { 
    currentMileage, 
    mileageChanged, 
    handleMileageChange,
    handleDeleteMileageEntry 
  } = useMileageHistory(getDataWithChassisNo);

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

  const handleChassisChange = (_, newValue) => {
    const filtered = singleCard?.data?.vehicles?.find(
      (vehicle) => vehicle.chassis_no === newValue
    );
    setGetDataWithChassisNo(filtered);
  };

  useEffect(() => {
    if (getDataWithChassisNo?.vehicle_model) {
      setYearSelectInput(getDataWithChassisNo.vehicle_model.toString());
      setVModelValue("vehicle_model", getDataWithChassisNo.vehicle_model);
    } else {
      setYearSelectInput("");
    }
  }, [getDataWithChassisNo?.vehicle_model, setVModelValue]);

  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">Vehicle Information</h3>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            onChange={handleChassisChange}
            fullWidth
            {...register("chassis_no")}
            label="Chassis no"
            focused={getDataWithChassisNo?.chassis_no || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={2} md={6} sm={3} xs={12}>
              <Autocomplete
                sx={{ marginRight: "5px" }}
                freeSolo
                fullWidth
                value={getDataWithChassisNo?.carReg_no || ""}
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
                    focused={getDataWithChassisNo?.car_registration_no || ""}
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
            label="ENGINE NO & CC (T&N)"
            focused={getDataWithChassisNo?.engine_no || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <JobCardAutocompleteSelect
            label="Vehicle Brand"
            options={carBrands.map((option) => option.label)}
            value={getDataWithChassisNo?.vehicle_brand || ""}
            onChange={handleBrandChange}
            register={register}
            registerName="vehicle_brand"
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <JobCardAutocompleteSelect
            label="Vehicle Name"
            options={filteredVehicles.map((option) => option.value)}
            value={getDataWithChassisNo?.vehicle_name || ""}
            register={register}
            registerName="vehicle_name"
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
                  <li key={index} onClick={() => handleOptionClick(option)}>
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <JobCardAutocompleteSelect
            label="Vehicle Categories"
            options={vehicleTypes.map((option) => option.label)}
            value={getDataWithChassisNo?.vehicle_category || ""}
            register={register}
            registerName="vehicle_category"
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            {...register("color_code")}
            label="Color & Code (T&N)"
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
            onChange={handleMileageChange}
            error={!!errors.mileage}
            helperText={errors.mileage?.message}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className="mb-2">
            <strong>Mileage History:</strong>
            {getDataWithChassisNo?.mileageHistory?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {getDataWithChassisNo.mileageHistory.map((entry, index) => (
                  <Chip
                    key={index}
                    label={`${entry.mileage} km (${new Date(
                      entry.date
                    ).toLocaleDateString()})`}
                    variant="outlined"
                    className="bg-gray-100 border-gray-300 text-gray-800"
                    onDelete={() => handleDeleteMileageEntry(index)}
                    deleteIcon={
                      <span className="text-red-500 hover:text-red-700 cursor-pointer text-lg">
                        ×
                      </span>
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-1">No previous mileage records</p>
            )}
          </div>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <JobCardAutocompleteSelect
            label="Fuel Type"
            options={fuelType.map((option) => option.label)}
            value={getDataWithChassisNo?.fuel_type || ""}
            register={register}
            registerName="fuel_type"
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
          <PhoneInput
            register={register}
            name="driver_contact"
            label="Driver Contact Number"
            countryCode={singleCard?.customer?.driver_country_code}
            phone={singleCard?.customer?.driver_contact}
            setValue={setValue}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default VehicleInfoSection;