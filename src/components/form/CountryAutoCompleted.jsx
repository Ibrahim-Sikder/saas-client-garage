/* eslint-disable react/prop-types */
// components/form/CountryCodeAutocomplete.jsx
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const CountryCodeAutocomplete = ({
    name,
    label,
    options,
    defaultValue,
    ...props
}) => {
    const { setValue } = useFormContext();
    const [value, setValueState] = useState(defaultValue);

    useEffect(() => {
        setValue(name, value?.code);
    }, [value, name, setValue]);

    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Select
                value={value?.code || ""}
                onChange={(e) =>
                    setValueState(options.find((o) => o.code === e.target.value))
                }
                label={label}
                {...props}
            >
                {options.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                        {option.code} ({option.label})
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CountryCodeAutocomplete;