/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";

const TASTimePicker = ({
  name,
  label,
  required,
  fullWidth = true,
  margin = "normal",
  sx,
  disableFuture = true,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={dayjs().format("HH:mm")} // stored in HH:mm format
      render={({ field: { onChange, value } }) => {
        // Always convert stored value (string) to dayjs object for picker
        const pickerValue = value ? dayjs(value, "HH:mm") : null;

        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label={label}
              value={pickerValue}
              onChange={(time) => {
                if (time && time.isValid()) {
                  onChange(time.format("HH:mm")); // store as HH:mm string
                } else {
                  onChange(""); // clear value
                }
              }}
              slotProps={{
                textField: {
                  required,
                  sx: { ...sx },
                  fullWidth,
                  margin,
                },
              }}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
};

export default TASTimePicker;
