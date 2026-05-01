/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import { TextareaAutosize } from "@mui/base"; // Corrected import
import styled from "styled-components";

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  padding: "12px",
  border: "1px solid #ddd",
  width: "100%",
  borderRadius: "8px",
  fontFamily: "inherit",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  "&:focus": {
    borderColor: "#42A1DA",
    outline: "none",
    boxShadow: "0 0 0 2px rgba(66, 161, 218, 0.2)",
  },
}));

const FormTextArea = ({ name, label, placeholder, required, minRows = 4, maxRows = 6, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <>
          {label && <label htmlFor={name}>{label}</label>}
          <StyledTextarea
            {...field}
            minRows={minRows}
            maxRows={maxRows}
            placeholder={placeholder}
            {...props}
          />
        </>
      )}
    />
  );
};

export default FormTextArea;
