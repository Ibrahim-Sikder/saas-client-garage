"use client"

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form"
import { Autocomplete, Chip, TextField } from "@mui/material"
import styled from "styled-components"

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
}))

const ExpenseAutoComplete = ({
  name,
  label = "Autocomplete",
  fullWidth = true,
  sx,
  required,
  options = [],
  size = "small",
  multiple = false, // Fixed: Default to false for single selection
  margin = "normal",
  freeSolo = false,
  defaultValue = null, // Fixed: Default to null for single selection
  placeholder = "Select option",
}) => {
  const { control, setValue, watch } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Fixed: Handle both single and multiple selection properly
        const value = multiple
          ? options.filter((opt) => field.value?.includes(opt._id))
          : options.find((opt) => opt._id === field.value) || null

        return (
          <Autocomplete
            multiple={multiple}
            disableCloseOnSelect={multiple} // Only disable close on select for multiple
            options={options}
            getOptionLabel={(option) => (typeof option === "string" ? option : option?.label || "")}
            isOptionEqualToValue={(option, value) => option._id === (typeof value === "string" ? value : value?._id)}
            value={value}
            onChange={(_, newValue) => {
              // Fixed: Handle single vs multiple selection
              const selected = multiple ? newValue?.map((item) => item?._id) || [] : newValue?._id || null
              field.onChange(selected)
            }}
            renderTags={
              multiple
                ? (value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip key={option?._id} label={option?.label} {...getTagProps({ index })} />
                    ))
                : undefined
            }
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
                size={size}
                sx={sx}
              />
            )}
          />
        )
      }}
    />
  )
}

export default ExpenseAutoComplete
