/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, Chip, TextField } from "@mui/material";
import styled from "styled-components";

const StyledTextField = styled(TextField)(({ margin }) => ({
  margin: margin === "dense" ? "4px 0" : margin === "none" ? "0" : "16px 0",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#42A1DA",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#42A1DA",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#42A1DA",
  },
}));

const FormAutocomplete = ({
  name,
  label = "Autocomplete",
  fullWidth = true,
  sx,
  required,
  options,
  size = "small",
  multiple = true,
  margin = "normal",
  freeSolo = true,
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
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option?.label || ""
          }
          value={field?.value || defaultValue}
          renderTags={(value, getTagProps) =>
            value
              .filter((option) => option !== null && option !== undefined)
              .map((option, index) => {
                const tagProps = getTagProps({ index });
                const { key, ...restTagProps } = tagProps;
                return (
                  <Chip
                    key={
                      typeof option === "string" ? option : option?.label || ""
                    }
                    variant="outlined"
                    label={
                      typeof option === "string" ? option : option?.label || ""
                    }
                    {...restTagProps}
                  />
                );
              })
          }
          onChange={(_, newValue) => {
            const updatedValue = Array.isArray(newValue)
              ? newValue
                  .filter((v) => v !== null && v !== undefined)
                  .map((v) => (typeof v === "string" ? v : v.label))
              : [];
            field.onChange(updatedValue);
          }}
          renderInput={(params) => (
            <StyledTextField
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

export default FormAutocomplete;
