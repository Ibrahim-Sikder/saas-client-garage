/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Switch, FormControlLabel } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const TASSwitch = ({
  name,
  label,
  required,
  disabled,
  fullWidth = true,
  margin = "normal",
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field, fieldState: { error } }) => (
        <FormControlLabel
          control={
            <Switch
              {...field}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled}
            />
          }
          label={label}
          margin={margin}
          fullWidth={fullWidth}
          error={!!error}
        />
      )}
    />
  );
};

export default TASSwitch;
