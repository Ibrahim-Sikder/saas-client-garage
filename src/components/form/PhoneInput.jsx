/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { countries } from "../../constant";

const PhoneInput = ({
  register,
  name,
  label,
  required = false,
  countryCode,
  phone,
  error,
  helperText,
  setValue,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (countryCode) {
      const country = countries.find((c) => c.code === countryCode);
      if (country) setSelectedCountry(country);
    }
    if (phone) setPhoneNumber(phone);
  }, [countryCode, phone]);

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
      setValue(name, newPhoneNumber);
    }
  };

  return (
    <div className="flex items-center">
      <Autocomplete
        sx={{ marginRight: "2px" }}
        fullWidth
        freeSolo
        options={countries}
        getOptionLabel={(option) => option.label}
        value={selectedCountry}
        onChange={(event, newValue) => {
          setSelectedCountry(newValue);
          setPhoneNumber("");
          setValue(name, "");
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
      <TextField
        {...register(name, {
          required: required ? "Contact number is required!" : false,
        })}
        label={label}
        variant="outlined"
        fullWidth
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        error={!!error}
        helperText={helperText}
      />
    </div>
  );
};

export default PhoneInput;