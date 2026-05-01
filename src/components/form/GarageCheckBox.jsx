"use client"

/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"

const GarageCheckbox = ({
    name,
    label,
    color = "primary",
    size = "medium",
    sx,
    disabled = false,
    onChange,
    hideLabel = false,
}) => {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={false}
            render={({ field }) => {
                if (hideLabel) {
                    return (
                        <Checkbox
                            {...field}
                            checked={!!field.value}
                            onChange={(e) => {
                                field.onChange(e.target.checked)
                                if (onChange) onChange(e)
                            }}
                            color={color}
                            size={size}
                            disabled={disabled}
                            sx={sx}
                        />
                    )
                }

                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...field}
                                checked={!!field.value}
                                onChange={(e) => {
                                    field.onChange(e.target.checked)
                                    if (onChange) onChange(e)
                                }}
                                color={color}
                                size={size}
                                disabled={disabled}
                                sx={sx}
                            />
                        }
                        label={label}
                    />
                )
            }}
        />
    )
}

export default GarageCheckbox
