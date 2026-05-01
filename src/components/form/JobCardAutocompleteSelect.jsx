/* eslint-disable react/prop-types */
import { Autocomplete, TextField } from "@mui/material";

const JobCardAutocompleteSelect = ({
  label,
  options,
  value,
  onChange,
  register,
  registerName,
  error,
  helperText,
}) => {
  return (
    <Autocomplete
      fullWidth
      freeSolo
      value={value}
      options={options}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          {...register(registerName)}
          error={!!error}
          helperText={helperText}
        />
      )}
    />
  );
};

export default JobCardAutocompleteSelect;