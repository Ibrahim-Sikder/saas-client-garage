/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import { FaPhone } from "react-icons/fa";

const CountryCodeAutocomplete = ({
  name,
  label = "Country Code",
  fullWidth = true,
  options = [],
  sx,
  required,
  size = "small",
  margin = "normal",
  icon: Icon = FaPhone,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={null} 
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          options={options}
          getOptionLabel={(option) => option.label}
          value={field.value}
          onChange={(_, newValue) => field.onChange(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              fullWidth={fullWidth}
              required={required}
              margin={margin}
              error={!!error}
              helperText={error?.message}
              sx={sx}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      )}
    />
  );
};

export default CountryCodeAutocomplete;
