/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const FormAutoCompleted = ({
  name,
  label = "Autocomplete",
  fullWidth = true,
  sx,
  required,
  options,
  size = "small",
  multiple = true,
  margin = "normal",
  freeSolo = false, // Changed to false to only allow selection from options
  defaultValue = [],
  placeholder = "Select options",
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          multiple={multiple}
          freeSolo={freeSolo}
          options={options}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            return option?.label || "";
          }}
          isOptionEqualToValue={(option, value) => {
            if (typeof option === "object" && typeof value === "object") {
              return option.value === value.value;
            }
            return option === value;
          }}
          value={field.value || defaultValue}
          onChange={(_, newValue) => {
            // Store the entire option object (with both label and value)
            field.onChange(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              fullWidth={fullWidth}
              required={required}
              margin={margin}
              error={!!error}
              helperText={error?.message}
              variant="outlined"
              sx={sx}
            />
          )}
        />
      )}
    />
  );
};

export default FormAutoCompleted;