/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import { Rating } from "@mui/material";

const FormRating = ({ name, precision = 0.5, size = "large" }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={0}
      render={({ field }) => (
        <Rating
          {...field}
          value={field.value || 0}
          onChange={(event, newValue) => field.onChange(newValue)}
          precision={precision}
          size={size}
        />
      )}
    />
  );
};

export default FormRating;
