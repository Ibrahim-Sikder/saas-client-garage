/* eslint-disable react/prop-types */
import { MenuItem, TextField, InputAdornment } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const FormSelect = ({
  items,
  name,
  label,
  size = "small",
  margin = "normal",
  required,
  fullWidth = true,
  sx,
  onChange,
  icon: Icon,
  iconPosition = "start",
}) => {
  const { control, formState } = useFormContext();
  const isError = formState.errors[name] !== undefined;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={items[0] || ""}
      render={({ field }) => (
        <TextField
          {...field}
          sx={{ ...sx }}
          size={size}
          select
          label={label}
          required={required}
          fullWidth={fullWidth}
          error={isError}
          margin={margin}
          onChange={(e) => {
            field.onChange(e.target.value);
            if (onChange) {
              onChange(e.target.value);
            }
          }}
          helperText={isError ? formState.errors[name]?.message : ""}
          InputProps={
            Icon
              ? {
                [`${iconPosition}Adornment`]: (
                  <InputAdornment position={iconPosition}>
                    <Icon />
                  </InputAdornment>
                ),
              }
              : {}
          }
        >
          {items.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default FormSelect;
