/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const FormTextArea = ({
  name,
  label,
  placeholder,
  minRows = 2,
  maxRows,
  sx,
  required,
  variant = "outlined",
  margin = "normal",
  disabled,
  value,
  onChange,
  fullWidth = true,
}) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={label}
            placeholder={placeholder}
            minRows={minRows}
            maxRows={maxRows}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            variant={variant}
            margin={margin}
            disabled={disabled}
            fullWidth={fullWidth}
            onChange={(e) => {
              field.onChange(e.target.value);
              if (onChange) onChange(e);
            }}
            value={field.value || value || ""}
            error={!!error}
            helperText={error ? error.message : ""}
            sx={{
              width: "100%",
              maxHeight: "300px",
              ...sx,
            }}
          />
        )}
      />
    </>
  );
};

export default FormTextArea;
