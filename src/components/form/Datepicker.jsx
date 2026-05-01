/* eslint-disable react/prop-types */
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const FormDatePicker = ({
  name,
  size = "medium",
  label,
  required,
  fullWidth = true,
  margin = "normal",
  sx,
  // disableFuture = true,
  // disablePast = false,
  defaultValue = null,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value, ref } }) => {
        // Show today's date as placeholder but don't submit it
        const dateValue = value ? dayjs(value) : null;

        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              inputRef={ref}
              label={label}
              value={dateValue}
              onChange={(date) => {
                // Only update the form value when user explicitly selects a date
                if (date && dayjs(date).isValid()) {
                  const formatted = dayjs(date).format("YYYY-MM-DD");
                  onChange(formatted);
                } else {
                  onChange(null);
                }
              }}
              slotProps={{
                textField: {
                  required: required,
                  size: size,
                  fullWidth: fullWidth,
                  margin: margin,
                  variant: "outlined",
                  sx: { ...sx, width: fullWidth ? "100%" : undefined },
                  // Optional: Add placeholder to indicate no date selected
                  placeholder: "Select expiration date",
                },
              }}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
};

export default FormDatePicker;
