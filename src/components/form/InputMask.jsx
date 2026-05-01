/* eslint-disable react/prop-types */
// components/form/MaskedInput.tsx
"use client";

import { Controller, useFormContext } from "react-hook-form";
import InputMask from "react-input-mask";
import {
  TextField,
  InputAdornment,
} from "@mui/material";

const MaskedInput = ({
  name,
  label,
  mask,
  maskChar = "_",
  icon,
  iconPosition = "start",
  margin = "normal",
  rules,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <InputMask
          {...field}
          mask={mask}
          maskChar={maskChar}
          value={field.value || ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              label={label}
              fullWidth
              margin={margin}
              error={!!error}
              helperText={error ? error.message : ""}
              InputProps={{
                startAdornment:
                  icon && iconPosition === "start" ? (
                    <InputAdornment position="start">{icon}</InputAdornment>
                  ) : undefined,
                endAdornment:
                  icon && iconPosition === "end" ? (
                    <InputAdornment position="end">{icon}</InputAdornment>
                  ) : undefined,
              }}
            />
          )}
        </InputMask>
      )}
    />
  );
};

export default MaskedInput;
