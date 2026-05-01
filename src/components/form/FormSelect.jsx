/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import styled from "styled-components";

const StyledFormControl = styled(FormControl)({
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
});

const FormSelect = ({
  name,
  label,
  options,
  icon: Icon,
  margin = "normal",
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <StyledFormControl fullWidth margin={margin} error={!!error}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            {...field}
            labelId={`${name}-label`}
            label={label}
            startAdornment={
              Icon ? (
                <InputAdornment position="start">
                  <Icon />
                </InputAdornment>
              ) : null
            }
            
          >
            {options?.map((option, index) => (
              <MenuItem
                key={index}
                value={option?.toLowerCase().replace(/\s/g, "")}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      )}
    />
  );
};

export default FormSelect;
